import React, { useState, useEffect } from 'react';
import { Spin, Empty, InputNumber, Switch, Select, message } from 'antd';
import { apiFetchComponentDetails, apiUpdateComponent } from '../../services/api_v2';

interface Props {
  projectId: string | null;
  selectedUuid: string;
}

export const ComponentPropertyPanel: React.FC<Props> = ({ projectId, selectedUuid }) => {
  const [compData, setCompData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (projectId && selectedUuid) {
      setLoading(true);
      apiFetchComponentDetails(projectId, selectedUuid)
        .then(data => {
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
     
     // Update UI optimistically
     const updatedData = { ...compData };
     updatedData.private_attr.private_attrs[groupIndex].array_base_ele[elementIndex][typeKey] = newValue;
     setCompData(updatedData);
     
     // Build delta payload
     const groupKey = updatedData.private_attr.private_attrs[groupIndex].key;
     const eleKey = updatedData.private_attr.private_attrs[groupIndex].array_base_ele[elementIndex].key;
     
     const deltaPayload = {
         private_attr: {
            private_attrs: [
                 {
                     key: groupKey,
                     array_base_ele: [ { key: eleKey, [typeKey]: newValue } ]
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
  };

  if (loading) return <div style={{textAlign: 'center', padding: 40}}><Spin tip="从后端独立节点拉取 JSON..." /></div>;
  if (!compData || !compData.private_attr || !compData.private_attr.private_attrs) {
      return <Empty description="未能加载后端持久化组件参数，请检查 ProjectId 与连接" style={{marginTop: 40}}/>;
  }

  return (
    <div className="property-panel-container">
      {compData.private_attr.private_attrs.map((group: any, grpIdx: number) => (
        <fieldset key={group.key} style={{ marginTop: 12, border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 16 }}>
          <legend style={{ padding: '0 8px', color: 'var(--text-primary)', fontWeight: 600 }}>{group.desc || group.key}</legend>
          {group.array_base_ele.map((ele: any, eleIdx: number) => {
              
             if (ele.float_value !== undefined) {
                return (
                  <div key={ele.key} style={{ marginBottom: 12 }}>
                     <div style={{fontSize: 12, marginBottom: 4, display: 'flex', justifyContent: 'space-between'}}>
                         <span>{ele.desc || ele.key}</span>
                         <span style={{color: 'var(--text-muted)'}}>{ele.unit}</span>
                     </div>
                     <InputNumber 
                        style={{width: '100%'}}
                        max={ele.float_maxvalue} min={ele.float_minvalue}
                        value={ele.float_value}
                        onChange={(v) => handleAttrChange(grpIdx, eleIdx, parseFloat(v as any), 'float_value')}
                     />
                  </div>
                )
             }
             if (ele.int32_value !== undefined) {
                 return (
                  <div key={ele.key} style={{ marginBottom: 12 }}>
                     <div style={{fontSize: 12, marginBottom: 4}}>{ele.desc || ele.key}</div>
                     <InputNumber style={{width: '100%'}} value={ele.int32_value} 
                        onChange={(v) => handleAttrChange(grpIdx, eleIdx, parseInt(v as any), 'int32_value')} />
                  </div>
                 )
             }
             if (ele.bool_value !== undefined) {
                 return (
                  <div key={ele.key} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                     <div style={{fontSize: 12}}>{ele.desc || ele.key}</div>
                     <Switch checked={ele.bool_value} onChange={(v) => handleAttrChange(grpIdx, eleIdx, v, 'bool_value')} />
                  </div>
                 )
             }
             if (ele.combo_type) {
                 return (
                  <div key={ele.key} style={{ marginBottom: 12 }}>
                     <div style={{fontSize: 12, marginBottom: 4}}>{ele.desc || ele.key}</div>
                     <Select value={ele.string_fix || ele.key} style={{width: '100%'}} 
                         onClick={() => message.info('ComboBox 编辑暂设为只读')}
                         options={[{label: ele.combo_type.type_key, value: ele.string_fix || ele.key}]} 
                     />
                  </div>
                 )
             }
             return null;
          })}
        </fieldset>
      ))}
    </div>
  );
};
export default ComponentPropertyPanel;
