import React, { useState, useEffect } from 'react';
import { 
    Spin, Empty, InputNumber, Switch, Select, message, 
    Input, Card, Tag, Tabs, Divider, List, Space, Typography, Button, Collapse, Alert, Row, Col, Tooltip, AutoComplete
} from 'antd';
import { 
    EnvironmentOutlined, 
    IdcardOutlined, 
    SettingOutlined, 
    DeploymentUnitOutlined,
    InfoCircleOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    QuestionCircleOutlined,
    LinkOutlined,
} from '@ant-design/icons';
import { apiFetchComponentDetails, apiUpdateComponent } from '../../services/api_v2';
import { useProjectStore } from '../../store/useProjectStore';
import { SmartAttribute, AttributeGroup } from '../../store/types';
import { buildAttributesFromSchema, getEngineeringConstraints, getPresetOptions, getTooltip, parseFixedSource } from '../../store/SchemaEngine';

const { Text } = Typography;
const { Panel } = Collapse;

interface Props {
  projectId: string | null;
  selectedUuid: string;
  excludeGroupKeys?: string[];
  onlyGroupKeys?: string[];
  excludeElementKeys?: string[];
  onlyElementKeys?: string[];
  hideTabs?: boolean;
  /** Callback invoked after an attribute is updated, for cross-component sync */
  onAttributeChange?: (sourceId: string, groupKey: string, attrKey: string, value: any, subKey?: string) => void;
}

export const ComponentPropertyPanel: React.FC<Props> = ({ 
    projectId, 
    selectedUuid,
    excludeGroupKeys,
    onlyGroupKeys,
    excludeElementKeys,
    onlyElementKeys,
    hideTabs = false,
    onAttributeChange
}) => {
  const [compData, setCompData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { config, updateAttribute, updateStructuralParam, linkInterface } = useProjectStore();
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

  /**
   * 属性值更新处理核心函数
   * 当用户改变输入框/下拉菜单/开关的值时触发。
   * 
   * 处理逻辑：
   * 1. 递归查找当前组件内部 JSON 结构 (privateAttrBranch) 中的匹配项，并更新 local state (compData) 以立即刷新 UI。
   * 2. 调用 Zustand 核心 `updateAttribute`，同步到底层全局模型数据 config.components 中。
   * 3. (核心) 若存在 `onAttributeChange` 回调（如通过 PowerSystemStep 传入的 syncAttributeToSiblings），
   *    抛出事件以触发多设备的底层参数联动同步。
   */
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

      // Notify parent for cross-component sync (e.g., wheel parameter sync)
      if (onAttributeChange) {
          onAttributeChange(selectedUuid, groupKey, eleKey, newValue);
      }
  };

  // Helper to check visibility before rendering structures
  const isElementVisible = (ele: any) => {
      const rawKey = (ele.key || ele.id || '').toString();
      const matchKey = rawKey.toLowerCase();
      if (excludeElementKeys?.some(k => k.toLowerCase() === matchKey)) return false;
      if (onlyElementKeys && !onlyElementKeys.some(k => k.toLowerCase() === matchKey)) return false;

      const isAdvanced = ele.boolBasic === false;
      const isAdvancedHidden = isAdvanced && !showAdvanced;
      const isExplicitlyHidden = ele.boolHide === true;
      if ((isAdvancedHidden || isExplicitlyHidden) && !showAdvanced) return false;
      return true;
  };

  // ━━━ Attribute Rendering (Recursive) ━━━
  const renderAttribute = (ele: any, groupKey: string, depth = 0, siblingContext?: any[]) => {
    // ── Conditional visibility check (e.g., softwareSpec depends on type) ──
    const subType = selectedStoreComponent?.type || selectedStoreComponent?.subModuleTypeKey;
    const constraints = subType ? getEngineeringConstraints(subType) : null;
    if (constraints?.conditionalVisibility?.[ele.key]) {
        const rule = constraints.conditionalVisibility[ele.key];
        // Find the dependent attribute's current value in siblings
        const allSiblings = siblingContext || [];
        const dependentAttr = allSiblings.find((s: any) => s.key === rule.dependsOn);
        const depValue = dependentAttr?.value ?? dependentAttr?.comboType?.typeKey ?? dependentAttr?.combo_type?.type_key;
        const showConditions = Array.isArray(rule.showWhen) ? rule.showWhen : [rule.showWhen];
        if (!showConditions.includes(depValue)) {
            return null; // Hidden by conditional rule
        }
    }

    if (!isElementVisible(ele)) return null;

    const isAdvanced = ele.boolBasic === false;
    const isExplicitlyHidden = ele.boolHide === true;
    const isVisibleDimmed = isExplicitlyHidden || (isAdvanced && !showAdvanced);

    // ━━━ State Extraction ━━━
    const isReadOnly = isFixedHardware || ele.boolNoeditable;
    const isRequired = ele.boolMustfill === true;
    
    const combo = ele.comboType || ele.combo_type;
    const typeKey = combo?.typeKey || combo?.type_key;
    const groups = combo?.typeGroups || combo?.type_groups || [];

    const currentVal = ele.value !== undefined ? ele.value : (
        ele.doubleValue ?? ele.double_value ?? ele.intValue ?? ele.int32Value ?? ele.int32_value ?? 
        ele.boolValue ?? ele.bool_value ?? ele.stringValue ?? ele.string_value
    );

    // Physical meaning tooltip
    const tooltip = getTooltip(ele.key);
    // Preset options (e.g., encoderLine: [2500, 3000, 4000])
    const presets = getPresetOptions(ele.key);

    let inputNode = null;

    // ━━━ Render Control based on Type ━━━
    if (ele.type === 'DATA_FIXED_E') {
        // Component reference selector
        const fixedSources: string[] = ele.fixedSource || [];
        const allComponents = config.components;
        
        // Filter components matching any fixedSource path
        const matchingComponents = allComponents.filter((c: any) => {
            if (c.id === selectedUuid) return false; // Exclude self
            return fixedSources.some((src: string) => {
                const filter = parseFixedSource(src);
                const catMatch = c.category === filter.category || 
                                 c.category?.toLowerCase() === filter.category?.toLowerCase();
                const subMatch = !filter.subType || c.type === filter.subType || c.subModuleTypeKey === filter.subType;
                return catMatch && subMatch;
            });
        });
        
        inputNode = (
            <Select
                disabled={isReadOnly}
                value={currentVal || undefined}
                placeholder={<span style={{ fontSize: 11 }}><LinkOutlined /> 选择关联组件</span>}
                style={{ width: '100%' }}
                allowClear
                options={matchingComponents.map((c: any) => ({
                    label: <span>{c.alias} <Tag style={{ fontSize: 9, marginLeft: 4 }} bordered={false} color="blue">{c.type}</Tag></span>,
                    value: c.id
                }))}
                onChange={(v) => handleValueUpdate(groupKey, ele.key, v || null, 'value')}
                notFoundContent={<span style={{ fontSize: 11, color: '#666' }}>暂无可选组件（请先添加对应类型的模块）</span>}
            />
        );
    } else if (ele.type === 'DATA_BOOL' || typeof currentVal === 'boolean') {
        inputNode = <Switch disabled={isReadOnly} checked={!!currentVal} onChange={(v) => handleValueUpdate(groupKey, ele.key, v, ele.value !== undefined ? 'value' : 'boolValue')} />;
    } else if (presets && (ele.type === 'DATA_INT32' || ele.type === 'DATA_DOUBLE')) {
        // Preset quick-select + manual input combo
        inputNode = (
            <Space.Compact style={{ width: '100%' }}>
                <Select
                    disabled={isReadOnly}
                    value={presets.includes(currentVal) ? currentVal : undefined}
                    style={{ width: '55%' }}
                    placeholder="快选"
                    allowClear
                    options={presets.map(p => ({ label: String(p), value: p }))}
                    onChange={(v) => { if (v !== undefined) handleValueUpdate(groupKey, ele.key, v, ele.value !== undefined ? 'value' : (ele.type === 'DATA_DOUBLE' ? 'doubleValue' : 'int32Value')); }}
                />
                <InputNumber
                    disabled={isReadOnly}
                    style={{ width: '45%' }}
                    value={currentVal}
                    min={ele.minValue}
                    max={ele.maxValue}
                    placeholder="手动"
                    onChange={(v) => handleValueUpdate(groupKey, ele.key, v, ele.value !== undefined ? 'value' : (ele.type === 'DATA_DOUBLE' ? 'doubleValue' : 'int32Value'))}
                />
            </Space.Compact>
        );
    } else if (ele.type === 'DATA_DOUBLE' || ele.type === 'DATA_INT32' || typeof currentVal === 'number') {
        const valType = ele.value !== undefined ? 'value' : (ele.type === 'DATA_DOUBLE' ? 'doubleValue' : 'int32Value');
        inputNode = <InputNumber disabled={isReadOnly} style={{ width: '100%' }} value={currentVal} min={ele.minValue} max={ele.maxValue} onChange={(v) => handleValueUpdate(groupKey, ele.key, v, valType)} />;
    } else if (combo || ele.type === 'DATA_COMBOX') {
        inputNode = (
            <Select 
                disabled={isReadOnly}
                value={typeKey} 
                style={{ width: '100%' }}
                options={groups.map((g: any) => ({ label: g.desc || g.key, value: g.key }))}
                onChange={(v) => handleValueUpdate(groupKey, ele.key, v, 'comboType')}
            />
        );
    } else {
        const valType = ele.value !== undefined ? 'value' : 'stringValue';
        inputNode = <Input disabled={isReadOnly} value={currentVal ?? ''} placeholder={isReadOnly ? '由系统自动计算' : '请输入值'} onChange={(e) => handleValueUpdate(groupKey, ele.key, e.target.value, valType)} />;
    }

    return (
        <div key={ele.key} style={{ marginBottom: 16, marginLeft: depth * 16, opacity: isVisibleDimmed ? 0.6 : 1 }}>
            <div style={{ fontSize: 12, marginBottom: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 500, color: isRequired ? '#ff7875' : 'inherit' }}>
                    {ele.desc || ele.key}
                    {isRequired && <span style={{ marginLeft: 4, color: '#ff4d4f' }}>*</span>}
                    {ele.boolNoeditable && <Tag color="default" style={{ marginLeft: 6, fontSize: 9, padding: '0 4px', background: 'rgba(255,255,255,0.05)' }}>锁定</Tag>}
                    {isExplicitlyHidden && <Tag color="default" style={{ marginLeft: 6, fontSize: 9, padding: '0 4px', opacity: 0.6 }}>隐藏属性</Tag>}
                    {ele.type === 'DATA_FIXED_E' && <LinkOutlined style={{ marginLeft: 6, fontSize: 10, color: '#58a6ff' }} />}
                    {tooltip && (
                        <Tooltip title={tooltip} placement="topLeft">
                            <QuestionCircleOutlined style={{ marginLeft: 6, fontSize: 10, color: '#8b949e', cursor: 'help' }} />
                        </Tooltip>
                    )}
                </span>
                {ele.unit && <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{ele.unit}</span>}
            </div>
            {inputNode}
            {combo && typeKey && (
                <div style={{ marginTop: 8, borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: 12, marginBottom: 16 }}>
                    {groups
                        .filter((g: any) => g.key === typeKey)
                        .flatMap((g: any) => g.arrayCmobEle || g.array_cmob_ele || g.arrayAttr || [])
                        .filter(isElementVisible)
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
      const rawElems = group.arrayBaseEle || group.array_base_ele || group.elements || [];
      const elems = rawElems.filter(isElementVisible);
      if (elems.length === 0) return null;
      
      // Secondary Grouping: Group elements by their 'group' metadata property
      const subGroups: Record<string, any[]> = {};
      elems.forEach((ele: any) => {
          const g = ele.group || '基本参数';
          if (!subGroups[g]) subGroups[g] = [];
          subGroups[g].push(ele);
      });
      
      return (
          <Card 
            key={group.key} 
            title={<span style={{ fontSize: 13, fontWeight: 600, color: '#f0f6fc' }}>{group.desc || group.key}</span>} 
            size="small" 
            style={{ 
                marginBottom: 20, 
                borderRadius: 8, 
                background: 'rgba(255,255,255,0.01)', 
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            headStyle={{ borderBottom: '1px solid rgba(255,255,255,0.05)', minHeight: 40 }}
          >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {Object.entries(subGroups).map(([subGroupTitle, subElems]) => (
                      <div key={subGroupTitle}>
                          {Object.keys(subGroups).length > 1 && (
                              <div style={{ marginBottom: 12, paddingBottom: 4, borderBottom: '1px dashed rgba(255,255,255,0.1)' }}>
                                  <Text style={{ fontSize: 12, fontWeight: 500, color: 'var(--accent)' }}>{subGroupTitle}</Text>
                              </div>
                          )}
                          <Row gutter={[24, 0]}>
                              {subElems.map((ele: any) => (
                                  <Col span={12} key={ele.key}>
                                      <div style={{ padding: '4px 0' }}>
                                          {renderAttribute(ele, group.key, 0, rawElems)}
                                      </div>
                                  </Col>
                              ))}
                          </Row>
                      </div>
                  ))}
              </div>
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
  
  let activeGroups = backendGroups.length > 0 ? backendGroups : storeGroups;
  
  // ━━━ Filter Groups (NEW) ━━━
  activeGroups = activeGroups.filter(g => {
    if (excludeGroupKeys?.includes(g.key)) return false;
    if (onlyGroupKeys && !onlyGroupKeys.includes(g.key)) return false;
    return true;
  });

  // Fallback to Category Template if both are empty (Audit-0327-2-1)
  if (activeGroups.length === 0 && !excludeGroupKeys && !onlyGroupKeys) {
      if (['CHASSIS', 'DRIVEWHEEL', 'DRIVER', 'MOTOR'].includes(selectedStoreComponent.category)) {
          let subType = 'GENERIC';
          if (selectedStoreComponent.category === 'CHASSIS') subType = 'diffChassis';
          else if (selectedStoreComponent.category === 'DRIVEWHEEL') subType = 'horizontalSteerWheel';
          else if (selectedStoreComponent.category === 'DRIVER') subType = 'subDriver';
          else if (selectedStoreComponent.category === 'MOTOR') subType = 'PMSMMotor';
          
          activeGroups = buildAttributesFromSchema(subType);
      }
  }

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
                      <Text type="secondary" style={{ fontSize: 11 }}>模型/实例名称 (Name)</Text>
                      <Input value={selectedStoreComponent.name} onChange={e => useProjectStore.getState().updateComponent(selectedUuid, { name: e.target.value })} />
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
                      renderItem={item => {
                          const linkedUuid = (item.linkedInterfaceUuid || [])[0];
                          
                          // Find all OTHER compatible interfaces in the project
                          const availableTargets = config.components
                            .filter(c => c.id !== selectedUuid)
                            .flatMap(c => (c.interfaces || []).map(iface => ({
                                componentAlias: c.alias,
                                interface: iface
                            })))
                            .filter(t => t.interface.type === item.type);

                          return (
                            <List.Item style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'block' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <Space direction="vertical" size={0}>
                                        <Text strong style={{ color: 'var(--accent)' }}>{item.key}</Text>
                                        <Text type="secondary" style={{ fontSize: 10 }}>{item.desc || '模块接口'}</Text>
                                    </Space>
                                    <Tag color="blue" style={{ margin: 0 }}>{item.type}</Tag>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 6 }}>电气连接 / 总线 Host (Network Bus)</div>
                                    <Select 
                                        placeholder="未连接 (点击选择总线节点)"
                                        allowClear
                                        style={{ width: '100%' }}
                                        size="small"
                                        value={linkedUuid}
                                        onChange={val => linkInterface(selectedUuid, item.interfaceUuid, val)}
                                        options={availableTargets.map(t => ({
                                            label: `${t.componentAlias} - ${t.interface.key}`,
                                            value: t.interface.interfaceUuid
                                        }))}
                                    />
                                </div>
                            </List.Item>
                          );
                      }}
                  />
              )
          )
      }
  ];

  let visibleTabs = tabItems;
  if (selectedStoreComponent.category === 'CHASSIS') {
      visibleTabs = tabItems.filter(t => t.key !== 'mounting' && t.key !== 'interfaces');
  } else if (selectedStoreComponent.parentNodeUuid) {
      // Sub-components (Motors/Drivers) implicitly follow parent coords and handle interfaces differently
      visibleTabs = tabItems.filter(t => t.key !== 'mounting' && t.key !== 'interfaces');
  }

  if (hideTabs) {
    return (
      <div className="property-panel-container no-tabs" style={{ padding: '0 8px' }}>
        {contextHolder}
        {!hasAttributes ? (
            <Alert 
                message="该模块暂无私有属性数据"
                type="info"
                showIcon
            />
        ) : (
            activeGroups.map((group: any) => renderGroup(group)).filter(Boolean)
        )}
      </div>
    );
  }

  return (
    <div className="property-panel-container" style={{ padding: '0 8px' }}>
      {contextHolder}
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
          .property-panel-container.no-tabs .ant-card { border: none !important; background: transparent !important; padding: 0 !important; }
          .property-panel-container.no-tabs .ant-card-head { border: none !important; padding: 0 !important; min-height: 0 !important; margin-bottom: 16px !important; }
          .property-panel-container.no-tabs .ant-card-body { padding: 0 !important; }
      `}</style>
    </div>
  );
};
export default ComponentPropertyPanel;
