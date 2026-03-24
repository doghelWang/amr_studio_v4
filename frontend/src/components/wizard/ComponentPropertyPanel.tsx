import React, { useState, useEffect } from 'react';
import { 
    Spin, Empty, InputNumber, Switch, Select, message, 
    Input, Card, Tag, Tabs, Divider, List, Space, Typography, Button, Collapse, Alert
} from 'antd';
import { 
    EnvironmentOutlined, 
    IdcardOutlined, 
    SettingOutlined, 
    DeploymentUnitOutlined,
    InfoCircleOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
} from '@ant-design/icons';
import { apiFetchComponentDetails, apiUpdateComponent } from '../../services/api_v2';
import { useProjectStore } from '../../store/useProjectStore';

const { Text } = Typography;
const { Panel } = Collapse;

interface Props {
  projectId: string | null;
  selectedUuid: string;
}

export const ComponentPropertyPanel: React.FC<Props> = ({ projectId, selectedUuid }) => {
  const [compData, setCompData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { config, updateAttribute, updateStructuralParam } = useProjectStore();
  const [messageApi, contextHolder] = message.useMessage();

  const selectedStoreComponent = config.components.find(c => c.id === selectedUuid);
  const isFixedHardware = selectedStoreComponent?.category === 'MAINCPU' || 
                         selectedStoreComponent?.category === 'CONTROL' || 
                         selectedStoreComponent?.category === 'IO_BOARD';

  // ━━━ Try to fetch from backend if projectId is available ━━━
  useEffect(() => {
    if (projectId && selectedUuid) {
      setLoading(true);
      apiFetchComponentDetails(projectId, selectedUuid)
        .then(data => {
            setCompData(data);
            setLoading(false);
        })
        .catch(err => {
            console.warn('[ComponentPropertyPanel] Backend fetch failed, using store data:', err);
            setCompData(null);
            setLoading(false);
        });
    } else {
      // No project loaded → clear any stale backend data, use store data
      setCompData(null);
    }
  }, [projectId, selectedUuid]);

  const syncPrivateAttrs = async (newFullData: any) => {
      if (!projectId || !selectedUuid) return;
      try {
          messageApi.loading({ content: '保存参数...', key: 'sync', duration: 0 });
          await apiUpdateComponent(projectId, selectedUuid, { 
              private_attr: newFullData.private_attr, 
              privateAttr: newFullData.privateAttr 
          });
          messageApi.success({ content: '配置已同步', key: 'sync' });
      } catch (err) {
          messageApi.error({ content: '同步失败', key: 'sync' });
      }
  };

  const handleValueUpdate = (groupKey: string, eleKey: string, newValue: any, typeKey: string) => {
      if (compData) {
          // ── Backend-loaded mode ──
          const newData = JSON.parse(JSON.stringify(compData));
          
          const updateInTree = (nodes: any[]) => {
              for (let node of nodes) {
                  if (node.key === eleKey) {
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
      }

      // Always update the Zustand store for consistency
      updateAttribute(selectedUuid, groupKey, eleKey, newValue);
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // renderAttribute: renders an individual attribute element
  // Supports boolHide via showAdvanced toggle
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const renderAttribute = (ele: any, groupKey: string, depth = 0) => {
    // Hide motionCenterAttr for CHASSIS (extracted to ChassisStep)
    if (selectedStoreComponent?.category === 'CHASSIS' && groupKey === 'motionCenterAttr') {
        return null;
    }

    // Respect boolHide unless user toggled advanced view
    const isHidden = ele.boolHide === true;
    if (isHidden && !showAdvanced) return null;

    const combo = ele.comboType || ele.combo_type;
    const typeKey = combo?.typeKey || combo?.type_key;
    const groups = combo?.typeGroups || combo?.type_groups || [];

    const numericValue = ele.doubleValue ?? ele.double_value ?? ele.floatValue ?? ele.float_value;
    const numType = (ele.doubleValue !== undefined || ele.double_value !== undefined) ? 'doubleValue' : 'floatValue';
    const intValue = ele.int32Value ?? ele.int32_value ?? ele.uint32Value ?? ele.uint32_value ?? ele.int64Value ?? ele.int64_value;
    const intType = (ele.int32Value !== undefined || ele.int32_value !== undefined) ? 'int32Value' : 'int64Value';
    
    // Handle SmartAttribute from store (value field)
    const storeValue = ele.value;

    let inputNode = null;
    if (numericValue !== undefined) {
        inputNode = <InputNumber disabled={isFixedHardware || ele.boolNoeditable} style={{ width: '100%' }} value={numericValue} onChange={(v) => handleValueUpdate(groupKey, ele.key, v, numType)} />;
    } else if (intValue !== undefined) {
        inputNode = <InputNumber disabled={isFixedHardware || ele.boolNoeditable} style={{ width: '100%' }} value={intValue} onChange={(v) => handleValueUpdate(groupKey, ele.key, v, intType)} />;
    } else if (ele.boolValue !== undefined || ele.bool_value !== undefined) {
        inputNode = <Switch disabled={isFixedHardware || ele.boolNoeditable} checked={ele.boolValue ?? ele.bool_value} onChange={(v) => handleValueUpdate(groupKey, ele.key, v, 'boolValue')} />;
    } else if (ele.stringValue !== undefined || ele.string_value !== undefined) {
        inputNode = <Input disabled={isFixedHardware || ele.boolNoeditable} value={ele.stringValue ?? ele.string_value} onChange={(e) => handleValueUpdate(groupKey, ele.key, e.target.value, 'stringValue')} />;
    } else if (combo) {
        inputNode = (
            <Select 
                disabled={isFixedHardware || ele.boolNoeditable}
                value={typeKey} 
                style={{ width: '100%' }}
                options={groups.map((g: any) => ({ label: g.desc || g.key, value: g.key }))}
                onChange={(v) => handleValueUpdate(groupKey, ele.key, v, 'comboType')}
            />
        );
    } else if (storeValue !== undefined && storeValue !== null) {
        // Fallback: store SmartAttribute with .value field
        if (typeof storeValue === 'number') {
            inputNode = <InputNumber disabled={isFixedHardware || ele.boolNoeditable} style={{ width: '100%' }} value={storeValue} onChange={(v) => handleValueUpdate(groupKey, ele.key, v, 'doubleValue')} />;
        } else if (typeof storeValue === 'boolean') {
            inputNode = <Switch disabled={isFixedHardware || ele.boolNoeditable} checked={storeValue} onChange={(v) => handleValueUpdate(groupKey, ele.key, v, 'boolValue')} />;
        } else {
            inputNode = <Input disabled={isFixedHardware || ele.boolNoeditable} value={String(storeValue)} onChange={(e) => handleValueUpdate(groupKey, ele.key, e.target.value, 'stringValue')} />;
        }
    }

    return (
        <div key={ele.key} style={{ marginBottom: 12, marginLeft: depth * 16, opacity: isHidden ? 0.65 : 1 }}>
            <div style={{ fontSize: 12, marginBottom: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: depth > 0 ? 400 : 600 }}>
                    {ele.desc || ele.key}
                    {ele.boolMustfill && <Tag color="error" style={{ marginLeft: 6, fontSize: 9, padding: '0 4px' }}>必填</Tag>}
                    {isHidden && <Tag color="default" style={{ marginLeft: 6, fontSize: 9, padding: '0 4px', opacity: 0.6 }}>高级</Tag>}
                </span>
                {ele.unit && <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{ele.unit}</span>}
            </div>
            {inputNode || <Text type="secondary" style={{ fontSize: 11 }}>-</Text>}
            {combo && groups && (
                <div style={{ marginTop: 8, borderLeft: '2px solid var(--accent-soft)', paddingLeft: 12, marginBottom: 16 }}>
                    {groups
                        .filter((g: any) => g.key === typeKey)
                        .flatMap((g: any) => g.arrayCmobEle || g.array_cmob_ele || g.arrayAttr || [])
                        .map((sub: any) => renderAttribute(sub, groupKey, depth + 1))
                    }
                </div>
            )}
        </div>
    );
  };

  // ━━━ Render a group of attributes (from either backend or store format) ━━━
  const renderGroup = (group: any) => {
      // group might be from backend (arrayBaseEle) or from store (elements)
      const elems = group.arrayBaseEle || group.array_base_ele || group.elements || [];
      const rendered = elems.map((ele: any) => renderAttribute(ele, group.key)).filter(Boolean);
      if (rendered.length === 0) return null;
      return (
          <Card key={group.key} title={group.desc || group.key} size="small" 
                style={{ marginBottom: 12, borderRadius: 8, background: 'rgba(255,255,255,0.01)' }}>
              {rendered}
          </Card>
      );
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>;
  if (!selectedStoreComponent) return <Empty description="选择一个组件进行查看" />;

  // ━━━ CRITICAL FIX: Use backend data when available, otherwise fall back to Zustand store ━━━
  // Backend data format: compData.privateAttr.privateAttrs[].arrayBaseEle[]
  // Store data format: selectedStoreComponent.privateAttrs[].elements[]
  const backendPrivateAttr = compData?.privateAttr || compData?.private_attr || {};
  const backendGroups = backendPrivateAttr.privateAttrs || backendPrivateAttr.private_attrs || [];
  
  // Use store as primary when no backend data (no projectId / fresh component)
  const storeGroups = selectedStoreComponent.privateAttrs || [];
  
  const activeGroups = backendGroups.length > 0 ? backendGroups : storeGroups;
  const hasAttributes = activeGroups.length > 0;

  const gen = compData?.generalAttr || compData?.general_attr || selectedStoreComponent.generalAttr || {};
  const moduleName = (gen.moduleName?.stringValue || gen.module_name?.string_value || selectedStoreComponent.name) ?? selectedStoreComponent.name;

  // Interfaces: prefer store interfaces array
  const activeInterfaces = selectedStoreComponent.interfaces || [];

  const tabItems = [
      {
          key: 'mounting',
          label: <Space><EnvironmentOutlined />安装标定</Space>,
          children: (
              <div style={{ padding: '4px 0' }}>
                  <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 16 }}>
                      设置组件在机器人坐标系（以底盘中心为原点）中的安装位置与姿态。
                  </Text>
                  <Card size="small" title="三维坐标 (mm)" style={{ marginBottom: 16, borderRadius: 8 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                          <div><div style={{ fontSize: 11, marginBottom: 4 }}>X (前进)</div><InputNumber style={{ width: '100%' }} value={selectedStoreComponent.mountX} onChange={v => updateStructuralParam(selectedUuid, { mountX: v || 0 })} /></div>
                          <div><div style={{ fontSize: 11, marginBottom: 4 }}>Y (左方)</div><InputNumber style={{ width: '100%' }} value={selectedStoreComponent.mountY} onChange={v => updateStructuralParam(selectedUuid, { mountY: v || 0 })} /></div>
                          <div><div style={{ fontSize: 11, marginBottom: 4 }}>Z (高度)</div><InputNumber style={{ width: '100%' }} value={selectedStoreComponent.mountZ} onChange={v => updateStructuralParam(selectedUuid, { mountZ: v || 0 })} /></div>
                      </div>
                  </Card>
                   <Card size="small" title="姿态角度 (°)" style={{ borderRadius: 8 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                          <div><div style={{ fontSize: 11, marginBottom: 4 }}>Roll (翻滚)</div><InputNumber style={{ width: '100%' }} value={selectedStoreComponent.mountRoll} onChange={v => updateStructuralParam(selectedUuid, { mountRoll: v || 0 })} /></div>
                          <div><div style={{ fontSize: 11, marginBottom: 4 }}>Pitch (俯仰)</div><InputNumber style={{ width: '100%' }} value={selectedStoreComponent.mountPitch} onChange={v => updateStructuralParam(selectedUuid, { mountPitch: v || 0 })} /></div>
                          <div><div style={{ fontSize: 11, marginBottom: 4 }}>Yaw (航向)</div><InputNumber style={{ width: '100%' }} value={selectedStoreComponent.mountYaw} onChange={v => updateStructuralParam(selectedUuid, { mountYaw: v || 0 })} /></div>
                      </div>
                  </Card>
              </div>
          )
      },
      {
          key: 'identity',
          label: <Space><IdcardOutlined />标识属性</Space>,
          children: (
              <List size="small" bordered={false}>
                  <List.Item style={{ flexDirection: 'column', alignItems: 'flex-start', border: 'none' }}>
                      <Text type="secondary" style={{ fontSize: 11 }}>组件别名 (Alias)</Text>
                      <Input value={selectedStoreComponent.alias} onChange={e => useProjectStore.getState().updateComponent(selectedUuid, { alias: e.target.value })} />
                  </List.Item>
                  <List.Item style={{ flexDirection: 'column', alignItems: 'flex-start', border: 'none' }}>
                      <Text type="secondary" style={{ fontSize: 11 }}>全局标识符 (UUID)</Text>
                      <Text code style={{ fontSize: 11, color: '#58a6ff' }}>{selectedStoreComponent.id}</Text>
                  </List.Item>
                  <List.Item style={{ flexDirection: 'column', alignItems: 'flex-start', border: 'none' }}>
                      <Text type="secondary" style={{ fontSize: 11 }}>模型名称 (Model Key)</Text>
                      <Tag color="blue">{selectedStoreComponent.name}</Tag>
                  </List.Item>
                  <List.Item style={{ flexDirection: 'column', alignItems: 'flex-start', border: 'none' }}>
                      <Text type="secondary" style={{ fontSize: 11 }}>分类 (Category)</Text>
                      <Tag color="cyan">{selectedStoreComponent.category}</Tag>
                  </List.Item>
                  {selectedStoreComponent.moduleGroupName && (
                      <List.Item style={{ flexDirection: 'column', alignItems: 'flex-start', border: 'none' }}>
                          <Text type="secondary" style={{ fontSize: 11 }}>模块组 (Group)</Text>
                          <Tag color="geekblue">{selectedStoreComponent.moduleGroupName}</Tag>
                      </List.Item>
                  )}
              </List>
          )
      },
      {
          key: 'private',
          label: <Space><SettingOutlined />配置参数</Space>,
          children: (
              <div>
                  {isFixedHardware && (
                      <div style={{ marginBottom: 12 }}>
                          <Tag color="orange" icon={<InfoCircleOutlined />} bordered={false}>固化硬件资源不可修改</Tag>
                      </div>
                  )}
                  {/* Advanced Toggle */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                      <Button 
                          size="small" 
                          type="text" 
                          icon={showAdvanced ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                          onClick={() => setShowAdvanced(v => !v)}
                          style={{ color: 'var(--text-muted)', fontSize: 11 }}
                      >
                          {showAdvanced ? '隐藏高级属性' : '展开高级属性'}
                      </Button>
                  </div>
                  {!hasAttributes ? (
                      <Alert 
                          message="该模块暂无私有属性数据"
                          description="模块数据来自资源库，若库中无该模块的私有属性定义，则此处为空。您仍可编辑安装标定及标识属性。"
                          type="info"
                          showIcon
                          style={{ marginBottom: 16 }}
                      />
                  ) : (
                      activeGroups.map((group: any) => renderGroup(group)).filter(Boolean)
                  )}
              </div>
          )
      },
      {
          key: 'interfaces',
          label: <Space><DeploymentUnitOutlined />接口资源</Space>,
          children: (
              activeInterfaces.length === 0 ? (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="该模块无已声明接口" />
              ) : (
                  <List
                      size="small"
                      dataSource={activeInterfaces}
                      renderItem={item => (
                          <List.Item style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                              <Space direction="vertical" size={0} style={{ width: '100%' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <Text strong style={{ color: 'var(--accent)' }}>{item.key}</Text>
                                      <Tag color="default" style={{ margin: 0 }}>{item.type}</Tag>
                                  </div>
                                  {item.desc && item.desc !== item.key && (
                                      <Text type="secondary" style={{ fontSize: 10 }}>{item.desc}</Text>
                                  )}
                                  <Text type="secondary" style={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}>UUID: {item.interfaceUuid}</Text>
                              </Space>
                          </List.Item>
                      )}
                  />
              )
          )
      }
  ];

  let visibleTabs = tabItems;
  if (selectedStoreComponent.category === 'CHASSIS') {
      visibleTabs = tabItems.filter(t => t.key !== 'mounting' && t.key !== 'interfaces');
  }

  return (
    <div className="property-panel-container" style={{ padding: '0 8px' }}>
      {contextHolder}
      {!projectId && hasAttributes && (
          <Alert 
              message="实时模式 (本地)" 
              description="当前未加载项目文件，属性数据来自组件库定义，修改将实时保存在内存中。"
              type="info" 
              showIcon 
              closable 
              style={{ marginBottom: 12, fontSize: 11 }}
          />
      )}
      <Tabs 
        defaultActiveKey={selectedStoreComponent.category === 'CHASSIS' ? 'identity' : 'private'}
        items={visibleTabs} 
        size="small"
        className="custom-property-tabs"
      />
      <style>{`
          .custom-property-tabs .ant-tabs-nav { margin-bottom: 20px !important; }
          .custom-property-tabs .ant-tabs-tab { padding: 8px 4px !important; }
          .custom-property-tabs .ant-tabs-ink-bar { height: 2px !important; }
      `}</style>
    </div>
  );
};
export default ComponentPropertyPanel;
