import React, { useState, useEffect } from 'react';
import { Spin, Empty, InputNumber, Switch, Select, message, Input, Card, Tag } from 'antd';
import { apiFetchComponentDetails, apiUpdateComponent } from '../../services/api_v2';
import { useProjectStore } from '../../store/useProjectStore';

interface Props {
  projectId: string | null;
  selectedUuid: string;
}

export const ComponentPropertyPanel: React.FC<Props> = ({ projectId, selectedUuid }) => {
  const [compData, setCompData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { updateAttribute } = useProjectStore();
  const [messageApi, contextHolder] = message.useMessage();

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

  const syncPrivateAttrs = async (newFullData: any) => {
      if (!projectId || !selectedUuid) return;
      try {
          messageApi.loading({ content: '保存修改...', key: 'sync', duration: 0 });
          await apiUpdateComponent(projectId, selectedUuid, { 
              private_attr: newFullData.private_attr, 
              privateAttr: newFullData.privateAttr 
          });
          messageApi.success({ content: '已保存', key: 'sync' });
      } catch (err) {
          messageApi.error({ content: '同步失败', key: 'sync' });
      }
  };

  const handleValueUpdate = (groupKey: string, eleKey: string, newValue: any, typeKey: string) => {
      console.log(`%c ✏️ UI MODIFY: [${eleKey}] -> ${newValue} (Type: ${typeKey})`, 'color: #eb2f96; font-weight: bold;');
      
      const newData = JSON.parse(JSON.stringify(compData));
      
      const updateInTree = (nodes: any[]) => {
          for (let node of nodes) {
              if (node.key === eleKey) {
                  // Double-write for protocol robustness
                  if (typeKey === 'combo_type' || typeKey === 'comboType') {
                      if (!node.combo_type) node.combo_type = {};
                      if (!node.comboType) node.comboType = {};
                      node.combo_type.type_key = newValue;
                      node.comboType.typeKey = newValue;
                  } else {
                      node[typeKey] = newValue;
                  }
                  return true;
              }
              
              // Recurse into COMBOX groups
              const combo = node.comboType || node.combo_type;
              if (combo) {
                  const groups = combo.typeGroups || combo.type_groups || [];
                  for (let group of groups) {
                      const subs = group.arrayCmobEle || group.array_cmob_ele || [];
                      if (updateInTree(subs)) return true;
                  }
              }
          }
          return false;
      };

      const privateAttrBranch = newData.privateAttr || newData.private_attr || {};
      const groups = privateAttrBranch.privateAttrs || privateAttrBranch.private_attrs || [];
      const targetGroup = groups.find((g: any) => g.key === groupKey);
      
      if (targetGroup) {
          updateInTree(targetGroup.arrayBaseEle || targetGroup.array_base_ele || []);
      }

      setCompData(newData);
      syncPrivateAttrs(newData);
      updateAttribute(selectedUuid, groupKey, eleKey, newValue);
  };

  const renderAttribute = (ele: any, groupKey: string, depth = 0) => {
    const combo = ele.comboType || ele.combo_type;
    const typeKey = combo?.typeKey || combo?.type_key;
    const groups = combo?.typeGroups || combo?.type_groups || [];

    const numericValue = ele.doubleValue ?? ele.double_value ?? ele.floatValue ?? ele.float_value;
    const numType = (ele.doubleValue !== undefined || ele.double_value !== undefined) ? 'doubleValue' : 'floatValue';
    
    const intValue = ele.int32Value ?? ele.int32_value ?? ele.uint32Value ?? ele.uint32_value ?? ele.int64Value ?? ele.int64_value;
    const intType = (ele.int32Value !== undefined || ele.int32_value !== undefined) ? 'int32Value' : 'int64Value';

    let inputNode = null;

    if (numericValue !== undefined) {
        inputNode = <InputNumber style={{ width: '100%' }} value={numericValue} onChange={(v) => handleValueUpdate(groupKey, ele.key, v, numType)} />;
    } else if (intValue !== undefined) {
        inputNode = <InputNumber style={{ width: '100%' }} value={intValue} onChange={(v) => handleValueUpdate(groupKey, ele.key, v, intType)} />;
    } else if (ele.boolValue !== undefined || ele.bool_value !== undefined) {
        inputNode = <Switch checked={ele.boolValue ?? ele.bool_value} onChange={(v) => handleValueUpdate(groupKey, ele.key, v, 'boolValue')} />;
    } else if (ele.stringValue !== undefined || ele.string_value !== undefined) {
        inputNode = <Input value={ele.stringValue ?? ele.string_value} onChange={(e) => handleValueUpdate(groupKey, ele.key, e.target.value, 'stringValue')} />;
    } else if (combo) {
        inputNode = (
            <Select 
                value={typeKey} 
                style={{ width: '100%' }}
                options={groups.map((g: any) => ({ label: g.desc || g.key, value: g.key }))}
                onChange={(v) => handleValueUpdate(groupKey, ele.key, v, 'comboType')}
            />
        );
    }

    return (
        <div key={ele.key} style={{ marginBottom: 12, marginLeft: depth * 16 }}>
            <div style={{ fontSize: 12, marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: depth > 0 ? 400 : 600 }}>{ele.desc || ele.key}</span>
                {ele.unit && <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{ele.unit}</span>}
            </div>
            {inputNode}

            {combo && groups && (
                <div style={{ marginTop: 8, borderLeft: '2px solid var(--accent-soft)', paddingLeft: 12, marginBottom: 16 }}>
                    {groups
                        .filter((g: any) => g.key === typeKey)
                        .flatMap((g: any) => g.arrayCmobEle || g.array_cmob_ele || [])
                        .map((sub: any) => renderAttribute(sub, groupKey, depth + 1))
                    }
                </div>
            )}
        </div>
    );
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>;
  if (!compData) return <Empty description="选择一个组件进行编辑" />;

  const privateAttr = compData.privateAttr || compData.private_attr || {};
  const groups = privateAttr.privateAttrs || privateAttr.private_attrs || [];
  const gen = compData.generalAttr || compData.general_attr || {};
  const moduleName = gen.moduleName?.stringValue || gen.module_name?.string_value || 'Unknown';

  return (
    <div className="property-panel-container">
      {contextHolder}
      <div style={{ marginBottom: 16, padding: '0 4px' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>模型节点标识</div>
          <Tag color="blue" style={{ fontFamily: 'var(--font-mono)' }}>{moduleName}</Tag>
      </div>
      {groups.map((group: any) => (
        <Card key={group.key} title={group.desc || group.key} size="small" style={{ marginBottom: 16, borderRadius: 8, background: 'rgba(255,255,255,0.01)' }}>
          {(group.arrayBaseEle || group.array_base_ele || []).map((ele: any) => renderAttribute(ele, group.key))}
        </Card>
      ))}
    </div>
  );
};
export default ComponentPropertyPanel;
