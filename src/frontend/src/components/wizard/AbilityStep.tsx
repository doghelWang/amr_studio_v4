/**
 * §AbilityStep V2 — 重构后的能力映射编辑器
 *
 * 变更:
 * 1. §EXTRACT: RecursiveAttributeEditor 移至独立组件
 * 2. §NO_HARDCODE: 使用 abilityGuards 替代 (attr as any)
 * 3. §SIMPLIFY: 简化 Render 逻辑，提取转换函数
 */

import React, { useCallback } from 'react';
import {
  ThunderboltOutlined,
  InteractionOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useProjectStore } from '../../store/useProjectStore';
import {
  Collapse, Card, Select, Space, Tag, Empty, Typography,
  Divider, Row, Col, Alert
} from 'antd';
import type { AbilityCommonAttr, AbilityAttribute } from '../../store/types';
import { normalizeToSmartAttribute, extractSubElements } from '../../store/abilityGuards';
import { RecursiveAttributeEditor } from './RecursiveAttributeEditor';

const { Panel } = Collapse;
const { Text, Title } = Typography;

/**
 * §TRANSFORM: 将 AbilityCommonAttr 转换为 SmartAttribute 兼容格式
 */
function transformAbilityAttr(common: AbilityCommonAttr): AbilityAttribute {
  return {
    ...normalizeToSmartAttribute(common),
    // AbilityAttribute 特有字段
    tips: (common as any).tips,
    maxCount: (common as any).maxCount,
    copyEnable: (common as any).copyEnable
  };
}

/**
 * §TRANSFORM: 将 AbilityCommonAttr 转换为 COMBOX 编辑器可用的 SmartAttribute
 */
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

/**
 * §Helper: 三级参数包装器
 * 将 handleAttributeUpdate 包装为 RecursiveAttributeEditor 期望的签名
 */
function createAttributeUpdater(
  funcType: string,
  childKey: string,
  commonKey: string,
  attrKey: string,
  updateFn: (funcType: string, childKey: string, commonKey: string, attrKey: string, value: any, subKey?: string, subValue?: any) => void
) {
  return (value: any, subKey?: string, subValue?: any) => {
    if (subKey !== undefined) {
      // 嵌套属性更新: value=父值, subKey=子key, subValue=子值
      updateFn(funcType, childKey, commonKey, attrKey, value, subKey, subValue);
    } else {
      // 顶层属性更新
      updateFn(funcType, childKey, commonKey, attrKey, value);
    }
  };
}

/**
 * §COMPONENT: AbilityStep 主组件
 */
export const AbilityStep: React.FC<{ onExport?: () => void }> = ({ onExport }) => {
  const { config, updateAbilityAttribute } = useProjectStore();
  const { functionAbility } = config.abilities;
  const components = config.components;

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

  // §SIMPLIFY: 空状态处理移到顶层
  if (!functionAbility?.length) {
    return <Empty description="未定义功能列表" />;
  }

  return (
    <div className="ability-step-container" style={{ padding: '0 8px' }}>
      {/* Header */}
      <div className="section-header" style={{ marginBottom: 24 }}>
        ...
        <Title level={2} style={{ margin: 0, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
          <InteractionOutlined /> 6. 算法能力 & 功能映射
        </Title>
        <Text type="secondary" style={{ opacity: 0.6 }}>
          将物理传感器关联到 SLAM、避障、码识别等核心算法能力上
        </Text>
      </div>

      <Alert
        message="能力配置说明"
        description="在这里，您需要为机器人指定‘谁负责导航’、‘谁负责避障’。只有建立了硬件与算法的映射，机器人才能获得生命力。"
        type="info"
        showIcon
        style={{ marginBottom: 24, borderRadius: 8 }}
      />

      {/* Cards Grid */}
      <div className="ability-cards-grid">
        {functionAbility.map((func) => (
          <Card
            key={func.type}
            size="small"
            title={<Space><ThunderboltOutlined style={{ color: 'var(--accent)' }} />{func.desc}</Space>}
            className="ability-main-card"
            style={{ marginBottom: 20, background: 'var(--bg-hover)', borderRadius: 12 }}
          >
            <Collapse ghost defaultActiveKey={func.childFunction.map(c => c.key)}>
              {func.childFunction.map((child) => (
                <Panel
                  header={<Text strong style={{ color: 'var(--text-bright)' }}>{child.desc}</Text>}
                  key={child.key}
                  style={{ borderBottom: '1px solid var(--border-default)' }}
                >
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
                </Panel>
              ))}
            </Collapse>
          </Card>
        ))}
      </div>

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
        .ability-main-card { border: 1px solid var(--border-default) !important; }
        .ability-main-card:hover { border-color: var(--accent) !important; }
      `}</style>
    </div>
  );
};

export default AbilityStep;
