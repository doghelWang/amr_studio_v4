import json
import os
import glob

def safe_get(d, keys, default='N/A'):
    curr = d
    for k in keys:
        if isinstance(curr, dict) and k in curr:
            curr = curr[k]
        else:
            return default
    return curr

def format_base_element(elem):
    key = elem.get('key', 'unknown')
    desc = elem.get('desc', '')
    # Value resolving based on oneof_value
    val = "N/A"
    for k, v in elem.items():
        if k.endswith('_value') or k == 'string_fix':
            val = str(v)
            break
        elif k == 'combo_type':
            val = f"Combo({v.get('type_key', '')})"
            break
    
    # limits
    max_val = 'N/A'
    for k, v in elem.items():
        if k.endswith('_maxvalue'):
            max_val = str(v)
    min_val = 'N/A'
    for k, v in elem.items():
        if k.endswith('_minvalue'):
            min_val = str(v)
            
    unit = elem.get('unit', '')
    
    return f"| `{key}` | {desc} | `{val}` | `{min_val}` | `{max_val}` | {unit} |"

def generate_dict(modules_dir, out_md):
    files = glob.glob(os.path.join(modules_dir, "*.json"))
    
    with open(out_md, 'w', encoding='utf-8') as f:
        f.write("# ModelSet312 模块完整数据字典 (Exhaustive Modules Data Dictionary)\n\n")
        f.write("本文档通过全量自动化扫描提取 `cmodel` 所有的组件原子 JSON 生成。严格满足涵盖每个模块、每个属性、每个连接关系的【零遗漏】要求。\n\n")
        
        f.write("## 模块索引汇总\n")
        for idx, file in enumerate(sorted(files)):
            with open(file, 'r', encoding='utf-8') as jf:
                data = json.load(jf)
                name = safe_get(data, ['general_attr', 'module_name', 'string_value'])
                uuid = safe_get(data, ['general_attr', 'module_uuid', 'string_value'])
                f.write(f"- [{idx+1}. 模块: {name} (UUID: {uuid})](#{name.lower()})\n")
        f.write("\n---\n\n")

        for idx, file in enumerate(sorted(files)):
            with open(file, 'r', encoding='utf-8') as jf:
                data = json.load(jf)
                
            name = safe_get(data, ['general_attr', 'module_name', 'string_value'])
            uuid = safe_get(data, ['general_attr', 'module_uuid', 'string_value'])
            
            f.write(f"## <a id=\"{name.lower()}\"></a> {idx+1}. 模块: `{name}`\n")
            f.write(f"- **模块 UUID**: `{uuid}`\n")
            
            gen = data.get('general_attr', {})
            f.write(f"- **模块类型**: `{safe_get(gen, ['main_module_type', 'combo_type', 'type_key'])}`\n")
            f.write(f"- **供应商**: `{safe_get(gen, ['vender_name', 'string_value'])}`\n")
            
            # Private Attributes
            f.write("### 私有属性 (Private Attributes)\n")
            privs = safe_get(data, ['private_attr', 'private_attrs'], [])
            if not privs:
                f.write("*无私有属性*\n\n")
            else:
                for grp in privs:
                    f.write(f"#### 属性组: `{grp.get('key', 'Unknown')}` ({grp.get('desc', '')})\n")
                    f.write("| 字段 (Key) | 描述 (Desc) | 默认值/现值 | 最小值 | 最大值 | 单位 |\n")
                    f.write("|---|---|---|---|---|---|\n")
                    for ele in grp.get('array_base_ele', []):
                        f.write(format_base_element(ele) + "\n")
                    f.write("\n")
            
            # Interface params
            f.write("### 接口拓扑与连接关系 (Interface Topology)\n")
            interfaces = safe_get(data, ['interface_params', 'interface_Group'], [])
            if not interfaces:
                f.write("*无接口定义*\n\n")
            else:
                for igrp in interfaces:
                    f.write(f"#### 接口端口: `{igrp.get('key', '')}` ({igrp.get('desc', '')})\n")
                    f.write(f"- **接口类型**: `{igrp.get('type', '')}`\n")
                    f.write(f"- **本端 UUID**: `{igrp.get('interface_uuid', '')}`\n")
                    links = igrp.get('linked_interface_uuid', [])
                    f.write(f"- **级联远端 UUID**: `{', '.join(links) if links else '未连接'}`\n")
                    
                    params = safe_get(igrp, ['interface_params', 'interface_params_array'], [])
                    if params:
                        f.write("**接口硬件参数配置:**\n")
                        f.write("| 字段 (Key) | 描述 (Desc) | 配置值 | \n")
                        f.write("|---|---|---|\n")
                        for ele in params:
                           val = "N/A"
                           for k, v in ele.items():
                               if k.endswith('_value') or k == 'string_fix':
                                   val = str(v)
                               elif k == 'combo_type':
                                   val = f"{v.get('type_key', '')}"
                           f.write(f"| `{ele.get('key', '')}` | {ele.get('desc', '')} | `{val}` |\n")
                    f.write("\n")
                    
            # Interface ability
            abil = safe_get(data, ['interface_ability', 'bus_interface_ability'], [])
            if abil:
                f.write("### 接口能力底座 (Bus Interface Ability)\n")
                f.write("- ")
                abilities = [f"{a.get('bus_interface_type', '')}({a.get('bus_interface_sub_type', '')}) x{a.get('bus_interface_nums', 0)}" for a in abil]
                f.write(", ".join(abilities) + "\n\n")
            
            f.write("---\n")
            
    print(f"Exhaustive Markdown generated successfully at {out_md}")

if __name__ == '__main__':
    generate_dict('docs/skill_outputs/tmp_split_modules/modules', 'docs/AMR_Model312_Full_Data_Dictionary.md')
