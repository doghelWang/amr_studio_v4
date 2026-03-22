import React, { useState, useEffect } from 'react';
import { Spin, Empty, InputNumber, Switch, Select, message, Input, Card, Divider } from 'antd';
import { apiFetchComponentDetails, apiUpdateComponent } from '../../services/api_v2';
import { useProjectStore } from '../../store/useProjectStore';

interface Props {
  projectId: string | null;
  selectedUuid: string;
}

export const ComponentPropertyPanel: React.FC<Props> = ({ projectId, selectedUuid }) => {
  const [compData, setCompData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { config } = useProjectStore();

  useEffect(() => {
    if (projectId && selectedUuid) {
      setLoading(true);
      apiFetchComponentDetails(projectId, selectedUuid)
        .then(data => {
            console.log('DEBUG [PropertyPanel]: Loaded raw component data:', data);
            setCompData(data);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setCompData(null);
            setLoading(false);
        });
    }
  }, [projectId, selectedUuid]);

  const handleAttrChange = async (groupIndex: number, elementIndex: number, newValue: any, typeKey: string) => {
     if (!projectId) return;
     
     const updatedData = { ...compData };
     const groups = updatedData.private_attr?.private_attrs || updatedData.private_attrs || [];
     const group = groups[groupIndex];
     const elements = group?.array_base_ele || group?.elements || [];
     
     if (elements[elementIndex]) {
         elements[elementIndex][typeKey] = newValue;
         setCompData({ ...updatedData });
         
         const deltaPayload = {
             private_attr: {
                private_attrs: [
                     {
                         key: group.key,
                         array_base_ele: [ { key: elements[elementIndex].key, [typeKey]: newValue } ]
                     }
                ]
             }
         };
         
         try {
             await apiUpdateComponent(projectId, selectedUuid, deltaPayload);
             message.success('属性已增量更新至后端');
         } catch (err) {
             message.error('增量提交失败');
         }
     }
  };

  if (loading) return <div style={{textAlign: 'center', padding: 40}}><Spin tip="从后端独立节点拉取 JSON..." /></div>;
  
  // Normalize groups
  const groups = compData?.private_attr?.private_attrs || compData?.private_attrs || [];

  if (groups.length === 0) {
      return <Empty description="该模块在模型中没有任何私有属性 (private_attr)" style={{marginTop: 40}}/>;
  }

  return (
    <div className="property-panel-container">
      {groups.map((group: any, grpIdx: number) => {
        const elements = group.array_base_ele || group.elements || [];
        if (elements.length === 0) return null;

        return (
          <Card 
            key={group.key} 
            title={group.desc || group.key} 
            size="small" 
            style={{ marginBottom: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 8 }}
            styles={{ body: { padding: '12px 16px' } }}
          >
            {elements.map((ele: any, eleIdx: number) => {
               // Supports all Protobuf types
               const numericValue = ele.double_value !== undefined ? ele.double_value : ele.float_value;
               const typeKey = ele.double_value !== undefined ? 'double_value' : 'float_value';
               
               const intValue = ele.int32_value !== undefined ? ele.int32_value : (ele.uint32_value !== undefined ? ele.uint32_value : ele.int64_value);
               const intKey = ele.int32_value !== undefined ? 'int32_value' : (ele.uint32_value !== undefined ? 'uint32_value' : 'int64_value');

               if (numericValue !== undefined) {
                  return (
                    <div key={ele.key} style={{ marginBottom: 12 }}>
                       <div style={{fontSize: 12, marginBottom: 4, display: 'flex', justifyContent: 'space-between'}}>
                           <span style={{ fontWeight: 500 }}>{ele.desc || ele.key}</span>
                           <span style={{color: 'var(--text-muted)'}}>{ele.unit}</span>
                       </div>
                       <InputNumber 
                          style={{width: '100%'}}
                          value={numericValue}
                          onChange={(v) => handleAttrChange(grpIdx, eleIdx, parseFloat(v as any), typeKey)}
                       />
                    </div>
                  )
               }
               
               if (intValue !== undefined) {
                   return (
                    <div key={ele.key} style={{ marginBottom: 12 }}>
                       <div style={{fontSize: 12, marginBottom: 4, fontWeight: 500}}>{ele.desc || ele.key}</div>
                       <InputNumber style={{width: '100%'}} value={intValue} 
                          onChange={(v) => handleAttrChange(grpIdx, eleIdx, parseInt(v as any), intKey)} />
                    </div>
                   )
               }

               if (ele.bool_value !== undefined) {
                   return (
                    <div key={ele.key} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                       <div style={{fontSize: 12, fontWeight: 500}}>{ele.desc || ele.key}</div>
                       <Switch checked={ele.bool_value} onChange={(v) => handleAttrChange(grpIdx, eleIdx, v, 'bool_value')} />
                    </div>
                   )
               }

               if (ele.string_value !== undefined) {
                   return (
                    <div key={ele.key} style={{ marginBottom: 12 }}>
                       <div style={{fontSize: 12, marginBottom: 4, fontWeight: 500}}>{ele.desc || ele.key}</div>
                       <Input value={ele.string_value} style={{width: '100%'}} 
                          onChange={(e) => handleAttrChange(grpIdx, eleIdx, e.target.value, 'string_value')} />
                    </div>
                   )
               }

               if (ele.combo_type) {
                   return (
                    <div key={ele.key} style={{ marginBottom: 12 }}>
                       <div style={{fontSize: 12, marginBottom: 4, fontWeight: 500}}>{ele.desc || ele.key}</div>
                       <Select 
                          value={ele.combo_type.type_key} 
                          style={{width: '100%'}} 
                          options={[{label: ele.combo_type.type_key, value: ele.combo_type.type_key}]}
                          disabled
                       />
                    </div>
                   )
               }
               
               return (
                 <div key={ele.key} style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>
                   {ele.key}: (未知数据类型或空值)
                 </div>
               );
            })}
          </Card>
        );
      })}
    </div>
  );
};
export default ComponentPropertyPanel;
