import os
import json
import logging
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

class SchemaManager:
    """
    [AMR Studio V4 - 组件元数据核心管理器]
    
    设计目标:
    1. 配置化开发: 通过 XML 定义组件属性与接口，避免前后端硬编码。
    2. 资源动态加载: 支持在不重启服务的情况下，通过扫描 resources/definitions/*.xml 实时更新组件库。
    3. 别名兼容逻辑: 利用 <aliases> 标签，让旧版 cmodel 中的非标准类型（如 extendedInterface）自动匹配到标准分类（如 IO_BOARD）。
    
    数据流向:
    XML 定义 -> SchemaManager 解析 -> get_registry() -> /api/v1/schemas -> 前端 Zustand Store (schemaRegistry)
    """
    
    def __init__(self, definitions_path: str, modules_path: Optional[str] = None):
        self.definitions_path = Path(definitions_path)
        # REQ-CL-01: 品牌产品目录第②数据源 (resources/modules/*.json)，用于将"类型级"Schema
        # 与真实可采购品牌型号关联，收敛《总体设计》§5 所述的三套并行数据源。
        self.modules_path = Path(modules_path) if modules_path else (self.definitions_path.parent / "modules")
        self.schemas: Dict[str, Any] = {}
        self.load_all()

    def load_all(self):
        """遍历目录并加载所有 XML 定义"""
        if not self.definitions_path.exists():
            print(f"WARNING: Definitions path {self.definitions_path} does not exist.")
            return

        new_schemas = {}
        for xml_file in self.definitions_path.glob("*.xml"):
            try:
                schema = self._parse_xml(xml_file)
                if schema and "key" in schema:
                    # REQ-CL-01: 为该 category 附加品牌型号清单，使前端"组件库"能展示具体可采购产品
                    # 而不只是通用占位类型（见《后端设计》§4.1）。
                    # 注意：经对 resources/modules/*.json 实测结构核实，品牌产品文件中标识所属大类的字段是
                    # generalAttr.mainModuleType.comboType.typeKey，其取值与 moduleType 的 key（如 "mainCPU"）
                    # 而非大写 category（如 "MAINCPU"）一致；因此匹配依据用 schema["key"]，不用 category。
                    schema["brandedProducts"] = self._scan_branded_products(schema["key"])
                    new_schemas[schema["key"]] = schema
                    # print(f"Loaded schema: {schema['key']} from {xml_file.name}")
            except Exception as e:
                print(f"ERROR: Failed to parse {xml_file.name}: {e}")
        self.schemas = new_schemas

    def _parse_xml(self, file_path: Path) -> Optional[Dict[str, Any]]:
        try:
            tree = ET.parse(file_path)
            root = tree.getroot()
        except ET.ParseError as e:
            print(f"XML Parse Error in {file_path}: {e}")
            return None
        
        if root.tag != "moduleType":
            return None

        schema: Dict[str, Any] = {
            "key": root.attrib.get("key"),
            "category": root.attrib.get("category"),
            "label": root.attrib.get("label", root.attrib.get("key")),
            "aliases": [],
            "subTypes": [],
            "defaultSubType": "",
            "privateAttributes": [],
            "interfaces": []
        }

        # 0. 解析别名 (用于兼容旧版 cmodel)
        aliases_node = root.find("aliases")
        if aliases_node is not None:
            for alias in aliases_node.findall("alias"):
                schema["aliases"].append(alias.attrib.get("key"))

        # 1. 解析子类型 (SubTypes)
        # 子类型定义了该类组件的具体型号/变体，例如激光雷达下的 "1D/2D/3D" 变体。
        subtypes_node = root.find("subTypes")
        if subtypes_node is not None:
            schema["defaultSubType"] = subtypes_node.attrib.get("default", "")
            for st in subtypes_node.findall("subType"):
                schema["subTypes"].append({
                    "key": st.attrib.get("key"),
                    "label": st.attrib.get("label", st.attrib.get("key"))
                })

        # 2. 解析私有属性 (Private Attributes)
        # 属性按 Group 聚合，对应前端属性面板的卡片渲染。
        # 每个属性包含 key, label, type (DATA_DOUBLE/INT32/BOOL/STRING) 和默认值。
        attrs_node = root.find("privateAttributes")
        if attrs_node is not None:
            for group in attrs_node.findall("group"):
                group_data: Dict[str, Any] = {
                    "key": group.attrib.get("key"),
                    "label": group.attrib.get("label", group.attrib.get("key")),
                    "elements": []
                }
                for attr in group.findall("attribute"):
                    attr_type = attr.attrib.get("type", "DATA_DOUBLE")
                    group_data["elements"].append({
                        "key": attr.attrib.get("key"),
                        "label": attr.attrib.get("label", attr.attrib.get("key")),
                        "type": attr_type,
                        "unit": attr.attrib.get("unit", ""),
                        "value": self._cast_value(attr.attrib.get("value", ""), attr_type)
                    })
                schema["privateAttributes"].append(group_data)

        # 3. 解析接口 (Interfaces)
        # 定义该组件具备的物理/逻辑接口，用于 3D 连线与拓扑生成。
        ifaces_node = root.find("interfaces")
        if ifaces_node is not None:
            for iface in ifaces_node.findall("interface"):
                schema["interfaces"].append({
                    "key": iface.attrib.get("key"),
                    "type": iface.attrib.get("type"),
                    "label": iface.attrib.get("label", iface.attrib.get("key"))
                })

        return schema

    def _scan_branded_products(self, type_key: str) -> List[Dict[str, Any]]:
        """REQ-CL-01: 扫描 resources/modules/*.json，返回与该 moduleType key 匹配的品牌产品清单。

        匹配依据：模块 JSON 内 generalAttr.mainModuleType.comboType.typeKey == type_key
        （不使用文件名子串猜测归属，遵循 ENGINEERING_CONSTRAINTS §13"名称启发式禁令"；
        经实测核实该字段取值为 moduleType 的 key 原始大小写形式，如 "mainCPU"，而非大写 category 枚举 "MAINCPU"）。
        对结构不符合预期或损坏的文件采用 try/except + 日志兜底，不让单个坏文件影响整批加载
        （沿用 §4 后端设计所建议的、与 list_boards_api() 一致的容错模式）。
        """
        products: List[Dict[str, Any]] = []
        if not type_key or not self.modules_path.exists():
            return products

        for f in sorted(self.modules_path.glob("*.json")):
            try:
                data = json.loads(f.read_text(encoding="utf-8"))
                comps = data.get("moduleComponets") or data.get("module_componets") or \
                    data.get("moduleComponents") or data.get("module_components") or []
                comp = comps[0] if comps else data
                gen = comp.get("generalAttr") or comp.get("general_attr") or {}
                main_type = gen.get("mainModuleType") or gen.get("main_module_type") or {}
                combo = main_type.get("comboType") or main_type.get("combo_type") or {}
                file_type_key = combo.get("typeKey") or combo.get("type_key")
                if file_type_key != type_key:
                    continue

                desc_attr = gen.get("moduleDesc") or gen.get("module_desc") or {}
                name = desc_attr.get("stringValue") or desc_attr.get("string_value") or \
                    data.get("moduleGroupName") or f.stem
                products.append({
                    "productId": f.stem,
                    "name": name,
                    "sourceFile": f.name,
                })
            except Exception as e:
                logger.warning("Skipping unreadable module template %s: %s", f, e)
        return products

    def _cast_value(self, val_str: str, val_type: str) -> Any:
        if not val_str: 
            if "INT" in val_type or "DOUBLE" in val_type or "FLOAT" in val_type:
                return 0.0
            if "BOOL" in val_type:
                return False
            return ""
            
        try:
            if val_type in ["DATA_DOUBLE", "DATA_FLOAT"]:
                return float(val_str)
            if val_type in ["DATA_INT32", "DATA_UINT32", "DATA_INT64", "DATA_UINT64"]:
                return int(val_str)
            if val_type == "DATA_BOOL":
                return val_str.lower() in ["true", "1", "yes"]
            return val_str
        except:
            return val_str

    def get_registry(self) -> Dict[str, Any]:
        """返回全量注册表数据"""
        return self.schemas

# 全局单例初始化
schema_manager = SchemaManager(
    os.path.join(os.path.dirname(__file__), "..", "resources", "definitions"),
    os.path.join(os.path.dirname(__file__), "..", "resources", "modules"),
)
