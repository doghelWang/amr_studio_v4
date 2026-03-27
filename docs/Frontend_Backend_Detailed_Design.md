# AMR Studio V4 前后端详细设计及伪代码实现 (Detailed Design & Pseudo-Code)

## 一、 后端详细实现流程设计 (Backend Implementation)

后端基于 Python FastAPI 框架进行微服务化构建。将前面我们验证过功能的纯脚本 `decoder`, `splitter`, `encoder` 通过类的方式封装（Class Encapsulation），构建于核心的服务层 (Service Layer) 中。

### 核心数据载体模型 (Data Model - SQLAlchemy / Pydantic)
在数据库层面，为响应微服务级别的速度流转，我们设计表结构如下：
1. `Project`表: `project_id`, `blueprint_json`(存长文本), `status`
2. `Component`原子表: `project_id`, `uuid`作为复合主键, `group_type`, `component_json`(JSONB 类型以供高阶检索)。

### 【伪代码实现：后端的单组件获取与修改】
```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

router = APIRouter()

@router.get("/api/v1/models/{project_id}/components/{module_uuid}")
def get_component(project_id: str, module_uuid: str, db: Session = Depends(get_db)):
    """获取打散后的独立原子模块详细 JSON 数据"""
    comp = db.query(Component).filter_by(project_id=project_id, uuid=module_uuid).first()
    if not comp:
        raise HTTPException(status_code=404, detail="Component not found")
    return comp.component_json

@router.patch("/api/v1/models/{project_id}/components/{module_uuid}")
def update_component(project_id: str, module_uuid: str, payload: dict, db: Session = Depends(get_db)):
    """对独立的原子模块进行差异化属性覆写"""
    comp = db.query(Component).filter_by(project_id=project_id, uuid=module_uuid).first()
    if not comp:
         raise HTTPException(status_code=404, detail="Component not found")
         
    # 采用 Deep Update 合并前台修改的 JSON
    merged_json = deep_update(comp.component_json, payload)
    comp.component_json = merged_json
    db.commit()
    return {"status": "success", "updated_keys": list(payload.keys())}
```

### 【伪代码实现：组装封包 Compile】
```python
# 核心 Service Logic
def compile_project_to_cmodel(project_id: str, db: Session):
    proj = db.query(Project).filter_by(project_id=project_id).first()
    blueprint = json.loads(proj.blueprint_json)
    
    # 动态树搜索，将 $ref 替换为数据库里实时提取的最新 component_json
    def auto_assemble(node):
        if isinstance(node, dict) and "$ref" in node:
            ref_path = node["$ref"]
            # 解析模块 uuid (e.g., ref_path 提取 uuid)
            target_uuid = extract_uuid_from_ref(ref_path)
            target_comp = db.query(Component).filter_by(uuid=target_uuid).first()
            return target_comp.component_json
        
        # ... 字典和列表的递归遍历逻辑 (雷同实装的 encoder.py) ...
        return node
        
    full_json = auto_assemble(blueprint)
    
    # 调用底层固化技能 Skill 03
    from backend.skills_v2.03_cmodel_encoder.encoder import validate_and_serialize
    output_cmodel_path = f"/tmp/exports/{project_id}.cmodel"
    validate_and_serialize(full_json, output_cmodel_path) # 包含 ParseDict 以及 .cmodel ZIP封装流程
    
    return output_cmodel_path
```

---

## 二、 前端详细实现流程设计 (Frontend Implementation)

前端作为工作台的入口，采用 React 生态联合状态机（如 Redux Toolkit 或 Jotai）建立组件流。前端不仅是“渲染器”，也是拓扑图的“指挥中心”。

### 前端逻辑边界与工作流流转 (Workflow)
1. **沙盘初始化 (Canvas Initialization)**：
   客户端请求 `GET /upload` 返回的蓝图架构，利用 `react-flow-renderer` 等流程图可视化库将架构在二维沙盘上渲染出车轮、底盘、主控制器的坐标框。
2. **渐进式懒加载 (Lazy Loading Data)**：
   初始化时节点数据只有名字和形状（来自于 Blueprint 中记录的冗余显示信息）。当用户鼠标 **单击选中 (Click/Focus)** 某个组件节点时，触发向后端的单组件抓取 `GET /api/v1/models/../components/{uuid}` 请求。
3. **基于规则的动态表单驱动 (Rule-Based Form Generator)**：
   单组件 JSON 抵达后，前端依据数据的 `private_attrs` 和 `interface_params` 利用动态受控表单系统 (例如 `Formik` 结合 `UI 组件库`) 进行自动铺排渲染：
   - 识别出 `float_value` 与 `float_maxvalue` 时，渲染为一个带有上下限界线校验的数字步进器 (Number Input) 或滑块 (Slider)。
   - 识别出 `combo_type` 时，自动映射请求下拉数据字典转换为 Selector UI。
4. **连线操作处理 (Edge Connecting)**：
   用户在连线端点拖拽连接，触发 `onConnect`，前端在 Redux 本地变更源/目的端点关联状态，并即时提交 `POST /topology/connect` 到后端，形成前后端拓扑链路严格同步。

### 【伪代码实现：前端动态属性面板组件】
```javascript
import React, { useState, useEffect } from 'react';
import { apiFetchComponentDetails, apiUpdateComponent } from '../services/api';

const ComponentPropertyPanel = ({ projectId, selectedUuid }) => {
  const [compData, setCompData] = useState(null);

  // 1. 独立单体获取机制
  useEffect(() => {
    if (selectedUuid) {
      apiFetchComponentDetails(projectId, selectedUuid).then(data => setCompData(data));
    }
  }, [selectedUuid, projectId]);

  // 2. 差异化修改并推送至后端
  const handleAttrChange = (groupIndex, elementIndex, newValue, typeKey) => {
     // 更新深拷贝对象的单一字段 (仅限本地状态)
     const updatedData = { ...compData };
     updatedData.private_attr.private_attrs[groupIndex].array_base_ele[elementIndex][typeKey] = newValue;
     setCompData(updatedData);
     
     // 提取构建增量 Payload 并发起无刷新更新
     const deltaPayload = {
         private_attr: {
            private_attrs: [
                 {
                     key: updatedData.private_attr.private_attrs[groupIndex].key,
                     array_base_ele: [ {
                         key: updatedData.private_attr.private_attrs[groupIndex].array_base_ele[elementIndex].key,
                         [typeKey]: newValue
                     } ]
                 }
            ]
         }
     }
     
     apiUpdateComponent(projectId, selectedUuid, deltaPayload);
  };

  if (!compData) return <div>正在加载模块极其庞杂的引脚和配置参数...</div>;

  // 3. 动态表单生成器挂载点
  return (
    <div className="property-panel-container">
      <h3>模块属性: {compData.general_attr.module_name.string_value}</h3>
      {compData.private_attr.private_attrs.map((group, grpIdx) => (
        <fieldset key={group.key}>
          <legend>{group.desc}</legend>
          {group.array_base_ele.map((ele, eleIdx) => {
             // 逻辑分路呈现
             if (ele.float_value !== undefined) {
                return (
                  <div key={ele.key} className="form-item">
                     <label title={ele.desc}>{ele.key} (单位: {ele.unit})</label>
                     <input type="number" 
                        max={ele.float_maxvalue} min={ele.float_minvalue}
                        value={ele.float_value}
                        onChange={(e) => handleAttrChange(grpIdx, eleIdx, parseFloat(e.target.value), 'float_value')}
                     />
                  </div>
                )
             }
             // 其他基于 combo_type, bool_value 等映射渲染规则省略...
          })}
        </fieldset>
      ))}
    </div>
  );
};

export default ComponentPropertyPanel;
```
