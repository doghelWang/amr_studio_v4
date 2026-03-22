import React, { useState, useEffect } from 'react';
import { Spin, Empty, InputNumber, Switch, Select, message, Input, Card, Tag } from 'antd';
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

  const handleAttrChange = async (groupKey: string, eleKey: string, newValue: any, typeKey: string) => {
     if (!projectId) return;
     
     // Build delta payload
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
         // Refresh local state to show change (Simulated for speed)
         message.success(`属性 ${eleKey} 已更新`);
     } catch (err) {
         message.error('增量提交失败');
     }
  };

  const renderAttribute = (ele: any, groupKey: string, depth = 0) => {
    // Determine value and keys
    const numericValue = ele.double_value !== undefined ? ele.double_value : ele.float_value;
    const numKey = ele.double_value !== undefined ? 'double_value' : 'float_value';
    const intValue = ele.int32_value !== undefined ? ele.int32_value : (ele.uint32_value !== undefined ? ele.uint32_value : ele.int64_value);
    const intKey = ele.int32_value !== undefined ? 'int32_value' : (ele.uint32_value !== undefined ? ele.uint32_value : ele.int64_value);

    let inputNode = null;

    if (numericValue !== undefined) {
        inputNode = (
            <InputNumber 
                style={{ width: '100%' }} 
                value={numericValue} 
                onChange={(v) => handleAttrChange(groupKey, ele.key, parseFloat(v as any), numKey)} 
            />
        );
    } else if (intValue !== undefined) {
        inputNode = (
            <InputNumber 
                style={{ width: '100%' }} 
                value={intValue} 
                onChange={(v) => handleAttrChange(groupKey, ele.key, parseInt(v as any), intKey)} 
            />
        );
    } else if (ele.bool_value !== undefined) {
        inputNode = <Switch checked={ele.bool_value} onChange={(v) => handleAttrChange(groupKey, ele.key, v, 'bool_value')} />;
    } else if (ele.string_value !== undefined) {
        inputNode = <Input value={ele.string_value} onChange={(e) => handleAttrChange(groupKey, ele.key, e.target.value, 'string_value')} />;
    } else if (ele.combo_type) {
        inputNode = (
            <Select 
                value={ele.combo_type.type_key} 
                style={{ width: '100%' }}
                options={[{ label: ele.combo_type.type_key, value: ele.combo_type.type_key }]}
                disabled
            />
        );
    }

    return (
        <div key={ele.key} style={{ marginBottom: 12, marginLeft: depth * 16 }}>
            <div style={{ fontSize: 12, marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: depth > 0 ? 400 : 600, color: depth > 0 ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                    {ele.desc || ele.key}
                </span>
                {ele.unit && <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{ele.unit}</span>}
            </div>
            {inputNode}

            {/* ━━━ RECURSIVE RENDERING FOR NESTED COMBOX ATTRIBUTES ━━━ */}
            {ele.combo_type && ele.combo_type.type_groups && (
                <div style={{ marginTop: 8, borderLeft: '2px solid var(--accent-soft)', paddingLeft: 12 }}>
                    {ele.combo_type.type_groups
                        .filter((g: any) => g.key === ele.combo_type.type_key)
                        .flatMap((g: any) => g.array_cmob_ele || [])
                        .map((sub: any) => renderAttribute(sub, groupKey, depth + 1))
                    }
                </div>
            )}
        </div>
    );
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 40 }}><Spin tip="加载组件私有参数..." /></div>;
  if (!compData) return <Empty description="无法获取组件详情" />;

  const groups = compData.private_attr?.private_attrs || compData.private_attrs || [];
  const moduleName = compData.general_attr?.module_name?.string_value || 'Unknown';

  return (
    <div className="property-panel-container">
      <div style={{ marginBottom: 16, padding: '0 4px' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>模型原名 (module_name)</div>
          <Tag color="cyan" style={{ fontFamily: 'var(--font-mono)' }}>{moduleName}</Tag>
      </div>

      {groups.map((group: any) => (
        <Card 
            key={group.key} 
            title={group.desc || group.key} 
            size="small" 
            style={{ marginBottom: 16, borderRadius: 8, background: 'rgba(255,255,255,0.01)' }}
        >
          {(group.array_base_ele || group.elements || []).map((ele: any) => renderAttribute(ele, group.key))}
        </Card>
      ))}
    </div>
  );
};
export default ComponentPropertyPanel;
