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
  Divider, Row, Col, Alert, Statistic
} from 'antd';
import type { AbilityCommonAttr, AbilityAttribute } from '../../store/types';
import { normalizeToSmartAttribute, extractSubElements } from '../../store/abilityGuards';
import { RecursiveAttributeEditor } from './RecursiveAttributeEditor';
import { summarizeFunctionProcesses } from '../../store/domain/functions';

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
  const { functionAbility, componentAbility } = config.abilities;
  const components = config.components;
  const functionSummary = summarizeFunctionProcesses(config.functionProcesses, config.rawFuncDesc);

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

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card size="small" style={{ background: 'var(--bg-hover)', borderRadius: 12 }}>
            <Statistic title="组件能力 componentAbility" value={componentAbility?.length || 0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ background: 'var(--bg-hover)', borderRadius: 12 }}>
            <Statistic title="功能能力 functionAbility" value={functionAbility?.length || 0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ background: 'var(--bg-hover)', borderRadius: 12 }}>
            <Statistic title="功能过程 FuncDesc" value={functionSummary.processCount || functionSummary.rawFunctionCount} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ background: 'var(--bg-hover)', borderRadius: 12 }}>
            <Statistic title="只读过程" value={functionSummary.readonlyCount} />
          </Card>
        </Col>
      </Row>

      <Alert
        message="功能过程状态"
        description={
          functionSummary.processCount > 0
            ? `已从 FuncDesc 加载 ${functionSummary.processCount} 个功能过程；当前前端提供只读摘要，暂不自动生成或改写功能过程。`
            : '当前前端未加载 FuncDesc 功能过程。新建项目或缺少 FuncDesc 时，需要用户或后端模板显式提供，前端不会猜测生成。'
        }
        type={functionSummary.processCount > 0 ? 'success' : 'warning'}
        showIcon
        style={{ marginBottom: 24, borderRadius: 8 }}
      />

      {componentAbility?.length > 0 && (
        <Card
          size="small"
          title="组件能力 componentAbility 摘要"
          style={{ marginBottom: 20, background: 'var(--bg-hover)', borderRadius: 12 }}
        >
          <Space wrap>
            {componentAbility.map((ability: any, index: number) => (
              <Tag key={`${ability.type || 'componentAbility'}-${index}`} color="geekblue">
                {ability.desc || ability.type || `componentAbility_${index + 1}`}
              </Tag>
            ))}
          </Space>
        </Card>
      )}

      {config.functionProcesses?.length ? (
        <Card
          size="small"
          title="FuncDesc 功能过程只读摘要"
          style={{ marginBottom: 20, background: 'var(--bg-hover)', borderRadius: 12 }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            {config.functionProcesses.map((process) => (
              <div
                key={process.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  border: '1px solid var(--border-default)',
                  borderRadius: 8
                }}
              >
                <Space>
                  <Tag color="purple">{process.type}</Tag>
                  <Text>{process.desc}</Text>
                </Space>
                <Tag>{process.editableLevel}</Tag>
              </div>
            ))}
          </Space>
        </Card>
      ) : null}

      {!functionAbility?.length && (
        <Empty description="未定义 functionAbility 功能能力列表；前端不会自动创造能力模板。" />
      )}

      {/* Cards Grid */}
      <div className="ability-cards-grid">
        {(functionAbility || []).map((func) => (
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
