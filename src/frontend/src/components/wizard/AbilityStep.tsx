/**
 * §AbilityStep V3 — Ability and Process Wizard Step
 *
 * Implements a tabbed interface separating static component-to-ability mapping
 * and the visual PLC-style function block diagrams parsed from FuncDesc.json.
 */

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
  ThunderboltOutlined,
  InteractionOutlined,
  SettingOutlined,
  NodeIndexOutlined,
  LinkOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  ControlOutlined
} from '@ant-design/icons';
import { useProjectStore } from '../../store/useProjectStore';
import {
  Collapse, Card, Select, Space, Tag, Empty, Typography,
  Divider, Row, Col, Alert, Tabs
} from 'antd';
import type { AbilityCommonAttr, AbilityAttribute, ComponentConfig } from '../../store/types';
import { normalizeToSmartAttribute, extractSubElements } from '../../store/abilityGuards';
import { RecursiveAttributeEditor } from './RecursiveAttributeEditor';

const { Panel } = Collapse;
const { Text, Title } = Typography;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Part 1: Ability Mapping Transforms & Helpers
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function transformAbilityAttr(common: AbilityCommonAttr): AbilityAttribute {
  return {
    ...normalizeToSmartAttribute(common),
    tips: (common as any).tips,
    maxCount: (common as any).maxCount,
    copyEnable: (common as any).copyEnable
  };
}

function transformComboxAttr(common: AbilityCommonAttr): AbilityAttribute {
  return {
    key: common.key,
    desc: common.comboxParam?.desc || common.key,
    type: 'DATA_COMBOX',
    value: common.comboxParam?.value,
    comboType: common.comboxParam?.options ? {
      typeKey: common.key,
      typeDesc: common.comboxParam?.desc || '',
      typeGroups: common.comboxParam.options.map((opt: any) => ({
        key: opt.key,
        desc: opt.desc,
        arrayCmobEle: extractSubElements(opt).map((a: any) => ({
          key: a.key,
          desc: a.desc,
          type: a.type || 'DATA_STRING',
          value: a.value
        })) || []
      }))
    } : undefined
  } as AbilityAttribute;
}

function createAttributeUpdater(
  funcType: string,
  childKey: string,
  commonKey: string,
  attrKey: string,
  updateFn: (funcType: string, childKey: string, commonKey: string, attrKey: string, value: any, subKey?: string, subValue?: any) => void
) {
  return (value: any, subKey?: string, subValue?: any) => {
    if (subKey !== undefined) {
      updateFn(funcType, childKey, commonKey, attrKey, value, subKey, subValue);
    } else {
      updateFn(funcType, childKey, commonKey, attrKey, value);
    }
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Part 2: FuncDesc Parser & FBD Visualizer
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const ensureArray = (val: any): any[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return [val];
};

interface ParsedParam {
  key: string;
  type?: number;
  value?: any;
  linkedComponent?: string;
  linkedPorts?: string[];
}

interface ParsedInstance {
  uniqueKey: string;
  typeValue: string;
  typeDesc: string;
  status: number;
  params: ParsedParam[];
}

interface ParsedChildFunction {
  key: string;
  desc: string;
  instances: ParsedInstance[];
}

interface ParsedAbilityGroup {
  key: string;
  desc: string;
  childFunctions: ParsedChildFunction[];
}

const parseParams = (paramsContainer: any): ParsedParam[] => {
  if (!paramsContainer) return [];
  const list = ensureArray(paramsContainer["11"] || paramsContainer["param"] || []);
  return list.map(p => {
    const key = p["1"] || p["key"] || "";
    const type = p["10"] || p["type"];
    const value = p["11"] || p["13"] || p["value"];
    const linkedComponent = p["20"] || p["linkedComponent"];
    const linkedPorts = ensureArray(p["21"] || p["linkedPorts"] || []);
    return {
      key,
      type,
      value,
      linkedComponent,
      linkedPorts
    };
  }).filter(p => p.key);
};

const parseInstances = (rawInstances: any): ParsedInstance[] => {
  const list = ensureArray(rawInstances);
  return list.map(inst => {
    const uniqueKey = inst["1"] || inst["uniqueKey"] || "";
    const status = inst["32"] !== undefined ? Number(inst["32"]) : 1;
    const details = inst["11"] || inst["details"] || {};

    const typeValue = details["2"] || details["typeValue"] || "";
    const typeDesc = details["3"] || details["typeDesc"] || "";

    const paramsContainer = details["10"] || details["params"] || {};
    const params = parseParams(paramsContainer);

    return {
      uniqueKey,
      typeValue,
      typeDesc,
      status,
      params
    };
  });
};

const parseFuncDesc = (data: any): ParsedAbilityGroup[] => {
  if (!data) return [];
  const abilities = ensureArray(
    data["12"] ||
    data["abilities"] ||
    data["functionAbility"] ||
    data["function"] ||
    []
  );
  return abilities.map(item => {
    const key = item["1"] || item["key"] || "";
    const desc = item["2"] || item["desc"] || "";

    const childFuncsRaw = ensureArray(item["11"] || item["childFunction"] || []);
    const childFunctions = childFuncsRaw.map(child => {
      const cKey = child["1"] || child["key"] || "";
      const cDesc = child["2"] || child["desc"] || "";
      const instances = parseInstances(child["10"] || child["instances"] || []);

      return {
        key: cKey,
        desc: cDesc,
        instances: instances.filter(inst => inst.uniqueKey)
      };
    });

    return {
      key,
      desc,
      childFunctions
    };
  });
};

const FuncDescPanel: React.FC<{ functions: any }> = ({ functions }) => {
  const parsedGroups = useMemo(() => parseFuncDesc(functions), [functions]);
  const [activeGroupKey, setActiveGroupKey] = useState<string | undefined>();

  useEffect(() => {
    if (parsedGroups.length > 0 && !activeGroupKey) {
      setActiveGroupKey(parsedGroups[0].key);
    }
  }, [parsedGroups, activeGroupKey]);

  const activeGroup = parsedGroups.find(g => g.key === activeGroupKey);

  // Determine if there are actual active processes to display
  const hasActiveProcesses = useMemo(() => {
    return parsedGroups.some(g => g.childFunctions.some(cf => cf.instances.length > 0));
  }, [parsedGroups]);

  if (!functions || !hasActiveProcesses) {
    return (
      <Card style={{ borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border-default)', padding: 48, textAlign: 'center' }}>
        <Empty
          image={<InfoCircleOutlined style={{ fontSize: 48, color: 'var(--accent)' }} />}
          description={
            <div style={{ marginTop: 16 }}>
              <Title level={4} style={{ color: 'var(--text-bright)', margin: 0 }}>暂无运行态控制过程 (FuncDesc)</Title>
              <Text type="secondary" style={{ display: 'block', marginTop: 8, maxWidth: 500, margin: '8px auto 0' }}>
                当前尚未解析到业务逻辑过程。请您在前面各步骤中完成底盘、装配和连线配置，并进行“编译导出”或重新导入包含过程说明的成果物 `.cmodel`。
              </Text>
            </div>
          }
        />
      </Card>
    );
  }

  return (
    <Row gutter={[20, 20]}>
      {/* Left Menu for Group Selection */}
      <Col xs={24} md={6}>
        <Card
          title={<Space><NodeIndexOutlined /><span>过程分类</span></Space>}
          styles={{ body: { padding: 12 } }}
          style={{ borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
        >
          <div style={{ display: 'grid', gap: 4 }}>
            {parsedGroups.map(group => {
              const active = group.key === activeGroupKey;
              const activeCount = group.childFunctions.reduce((acc, cf) => acc + cf.instances.length, 0);
              return (
                <div
                  key={group.key}
                  onClick={() => setActiveGroupKey(group.key)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 10,
                    cursor: 'pointer',
                    background: active ? 'var(--accent-soft)' : 'transparent',
                    color: active ? 'var(--accent)' : 'var(--text-primary)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <Text strong={active} style={{ color: active ? 'var(--accent)' : 'inherit', fontSize: 13 }}>
                    {group.desc}
                  </Text>
                  {activeCount > 0 && (
                    <Tag color={active ? 'blue' : 'default'} style={{ margin: 0, borderRadius: 10, fontSize: 10 }}>
                      {activeCount}
                    </Tag>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </Col>

      {/* Right Column: Process PLC Block Views */}
      <Col xs={24} md={18}>
        {activeGroup ? (
          <div style={{ display: 'grid', gap: 20 }}>
            {activeGroup.childFunctions.map(child => {
              if (child.instances.length === 0) return null;
              return (
                <div key={child.key}>
                  <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 4, height: 16, background: 'var(--accent)', borderRadius: 2 }} />
                    <Text strong style={{ fontSize: 14, color: 'var(--text-bright)' }}>{child.desc}</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>({child.key})</Text>
                  </div>

                  <div style={{ display: 'grid', gap: 16 }}>
                    {child.instances.map(inst => (
                      <div
                        key={inst.uniqueKey}
                        className="plc-fbd-block"
                        style={{
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border-default)',
                          borderRadius: 16,
                          overflow: 'hidden',
                          boxShadow: 'var(--shadow-sm)',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        {/* Header of Block */}
                        <div style={{
                          background: 'rgba(255,255,255,0.02)',
                          borderBottom: '1px solid var(--border-default)',
                          padding: '10px 16px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <Space>
                            <Tag color="cyan" style={{ fontSize: 10 }}>FBD Block</Tag>
                            <Text strong style={{ color: 'var(--text-bright)' }}>{inst.uniqueKey}</Text>
                          </Space>
                          <Tag color="success" icon={<CheckCircleOutlined />}>Active</Tag>
                        </div>

                        {/* FBD Main Row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', padding: 16, gap: 12, alignItems: 'center' }}>
                          {/* 1. Inputs (Left) */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderRight: '1px dashed var(--border-default)', paddingRight: 16 }}>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>输入依赖 (Inputs)</div>
                            {inst.params.some(p => p.linkedComponent) ? (
                              inst.params.map(p => {
                                if (!p.linkedComponent) return null;
                                return (
                                  <div key={p.key} style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-default)', borderRadius: 8, padding: 8 }}>
                                    <div style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 600 }}>{p.key}</div>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-bright)', marginTop: 2 }}>{p.linkedComponent}</div>
                                    {p.linkedPorts.length > 0 && (
                                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                                        接口: {p.linkedPorts.join(', ')}
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            ) : (
                              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>无硬件输入</div>
                            )}
                          </div>

                          {/* 2. Logic Execution Block (Center) */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12px 16px' }}>
                            <div style={{
                              width: '100%',
                              padding: '16px 20px',
                              borderRadius: 14,
                              background: 'var(--accent-soft)',
                              border: '1.5px solid var(--accent)',
                              boxShadow: '0 0 12px rgba(24, 144, 255, 0.1)',
                              textAlign: 'center'
                            }}>
                              <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                                {inst.typeValue}
                              </div>
                              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-bright)', marginTop: 6 }}>
                                {inst.typeDesc}
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
                              <LinkOutlined style={{ fontSize: 10, color: 'var(--accent)' }} />
                              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>软硬逻辑双向绑定</span>
                            </div>
                          </div>

                          {/* 3. Output Parameters (Right) */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderLeft: '1px dashed var(--border-default)', paddingLeft: 16 }}>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>功能参数 (Outputs)</div>
                            {inst.params.some(p => !p.linkedComponent) ? (
                              inst.params.map(p => {
                                if (p.linkedComponent) return null;
                                return (
                                  <div key={p.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '6px 10px' }}>
                                    <Text style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{p.key}</Text>
                                    <Tag style={{ margin: 0, fontSize: 11, background: 'var(--bg-hover)' }}>{String(p.value)}</Tag>
                                  </div>
                                );
                              })
                            ) : (
                              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>无常量参数</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Empty description="选择一个分类以查看运行态控制过程" />
        )}
      </Col>
    </Row>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Part 3: Main AbilityStep Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const AbilityStep: React.FC<{ onExport?: () => void }> = ({ onExport }) => {
  const { config, updateAbilityAttribute } = useProjectStore();
  const { functionAbility } = config.abilities;
  const components = config.components as ComponentConfig[];
  const functions = config.functions;

  const handleAttributeUpdate = useCallback((
    funcType: string,
    childKey: string,
    commonKey: string,
    attrKey: string,
    value: any,
    subKey?: string,
    subValue?: any
  ) => {
    if (subKey !== undefined) {
      updateAbilityAttribute(funcType, childKey, commonKey, attrKey, value, subKey, subValue);
    } else {
      updateAbilityAttribute(funcType, childKey, commonKey, attrKey, value);
    }
  }, [updateAbilityAttribute]);

  if (!functionAbility?.length) {
    return <Empty description="未定义功能列表" />;
  }

  return (
    <div className="ability-step-container" style={{ padding: '0 8px' }}>
      {/* Header */}
      <div className="section-header" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, display: 'grid', placeItems: 'center', background: 'var(--accent-soft)', color: 'var(--accent)' }}>
            <ControlOutlined style={{ fontSize: 18 }} />
          </div>
          <div>
            <Title level={2} style={{ margin: 0, fontSize: 20, fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 8 }}>
              7. 能力与过程映射
            </Title>
            <Text type="secondary">
              将物理传感器映射至高阶导航/避障等算法能力，并可视化解析运行态业务功能控制流程图。
            </Text>
          </div>
        </div>
      </div>

      <Tabs
        defaultActiveKey="mapping"
        style={{ marginTop: 8 }}
        items={[
          {
            key: 'mapping',
            label: (
              <span>
                <ThunderboltOutlined />
                算法能力配置
              </span>
            ),
            children: (
              <div style={{ marginTop: 12 }}>
                <Alert
                  message="能力配置说明"
                  description="在这里，您需要为机器人指定“哪个硬件传感器负责定位导航”、“哪个负责安全避障”。建立硬件和算法库的映射后，机器人才能在运行态正确订阅信号。"
                  type="info"
                  showIcon
                  style={{ marginBottom: 20, borderRadius: 12 }}
                />

                <div className="ability-cards-grid">
                  {functionAbility.map((func) => (
                    <Card
                      key={func.type}
                      size="small"
                      title={<Space><ThunderboltOutlined style={{ color: 'var(--accent)' }} />{func.desc}</Space>}
                      className="ability-main-card"
                      style={{ marginBottom: 20, background: 'var(--bg-hover)', borderRadius: 16, border: '1px solid var(--border-default)' }}
                    >
                      <Collapse
                        ghost
                        defaultActiveKey={func.childFunction.map(c => c.key)}
                        items={func.childFunction.map((child) => ({
                          key: child.key,
                          label: <Text strong style={{ color: 'var(--text-bright)' }}>{child.desc}</Text>,
                          style: { borderBottom: '1px solid var(--border-default)' },
                          children: (
                            <div className="ability-child-fields" style={{ padding: '8px 0' }}>
                              {child.attr.map((common) => (
                                <div key={common.key} className="ability-common-attr-block">
                                  {/* ARRAY Type */}
                                  {common.type === 'ARRAY' && common.arrayParam && (
                                    <div className="ability-array-section">
                                      <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <SettingOutlined style={{ opacity: 0.5 }} />
                                        <Text type="secondary" style={{ fontSize: 12 }}>{common.arrayParam.groupName}</Text>
                                      </div>
                                      <Row gutter={[24, 16]}>
                                        {common.arrayParam.attrParams.map((ap) => (
                                          <Col span={12} key={ap.key}>
                                            <RecursiveAttributeEditor
                                              attr={transformAbilityAttr(ap as any)}
                                              onUpdate={createAttributeUpdater(
                                                func.type,
                                                child.key,
                                                common.key,
                                                ap.key,
                                                handleAttributeUpdate
                                              )}
                                              components={components}
                                            />
                                          </Col>
                                        ))}
                                      </Row>
                                    </div>
                                  )}

                                  {/* COMBOX Type */}
                                  {(common.type === 'COMBOX' || (common as any).type === 'DATA_COMBOX') && common.comboxParam && (
                                    <div className="ability-combox-section" style={{ marginTop: 12 }}>
                                      <RecursiveAttributeEditor
                                        attr={transformComboxAttr(common)}
                                        onUpdate={createAttributeUpdater(
                                          func.type,
                                          child.key,
                                          common.key,
                                          common.key,
                                          handleAttributeUpdate
                                        )}
                                        components={components}
                                      />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )
                        }))}
                      />
                    </Card>
                  ))}
                </div>
              </div>
            )
          },
          {
            key: 'processes',
            label: (
              <span>
                <InteractionOutlined />
                控制过程监控 (FuncDesc)
              </span>
            ),
            children: (
              <div style={{ marginTop: 12 }}>
                <FuncDescPanel functions={functions} />
              </div>
            )
          }
        ]}
      />

      <style>{`
        .ability-field-item { margin-bottom: 8px; }
        .ability-nested-container {
          margin-top: 12px;
          padding: 12px;
          background: var(--bg-hover);
          border-radius: 8px;
          border: 1px dashed var(--border-default);
        }
        .mapping-select-v4 .ant-select-selection-item { font-weight: 600; color: var(--accent) !important; }
        .ability-main-card:hover { border-color: var(--accent) !important; }
        .plc-fbd-block:hover {
          border-color: var(--accent) !important;
          box-shadow: var(--shadow-md);
        }
      `}</style>
    </div>
  );
};

export default AbilityStep;
