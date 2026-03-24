import React, { useMemo } from 'react';
import { ThunderboltOutlined, LinkOutlined, InteractionOutlined, DeploymentUnitOutlined } from '@ant-design/icons';
import { useProjectStore } from '../../store/useProjectStore';
import { Collapse, Card, Select, Radio, Input, InputNumber, Space, Tag, Empty, Typography, Divider } from 'antd';
import { AbilityAttribute, AbilityCommonAttr, ChildAbility, FunctionAbility } from '../../store/types';

const { Panel } = Collapse;
const { Option } = Select;
const { Title, Text } = Typography;

// Mapping of ability keys to allowed component categories
const CAPABILITY_MAPPING: Record<string, string[]> = {
    'relatedLaser': ['SENSOR'],
    'relatedCodeReader': ['SENSOR'],
    'relatedDriver': ['DRIVER'],
    'relatedControlBoard': ['MAINCPU', 'INTERGRATEDCONTROLLER'],
    'relatedBattery': ['BATTERY'],
    'relatedChassis': ['CHASSIS'],
    'relatedWheel': ['DRIVEWHEEL', 'DRIVE_WHEEL'],
    'relatedBumper': ['SENSOR'],
    'relatedEmergencyStop': ['BUTTON'],
    'relatedScreen': ['SCREEN']
};

// Component to render a single AbilityAttribute
const AbilityAttributeEditor: React.FC<{
    attr: AbilityAttribute;
    onChange: (val: any, subKey?: string) => void;
    components: any[];
}> = ({ attr, onChange, components }) => {
    // Check if it's a "Mapping" attribute
    const isMapping = attr.key.startsWith('related') || attr.boolParse;

    // Filter components based on capability mapping if it's a "related" field
    const filteredComponents = useMemo(() => {
        if (!attr.key.startsWith('related')) return components;
        const allowedCategories = CAPABILITY_MAPPING[attr.key];
        if (!allowedCategories) return components;
        return components.filter(c => allowedCategories.includes(c.category));
    }, [attr.key, components]);

    if (isMapping) {
        return (
            <div className="form-item-v4">
                <label>{attr.desc || attr.key} <small className="unit">{attr.unit}</small></label>
                <Select
                    style={{ width: '100%' }}
                    placeholder={`选择关联 ${attr.desc || '组件'}`}
                    value={attr.value || undefined}
                    onChange={(val) => onChange(val)}
                    allowClear
                    suffixIcon={<LinkOutlined />}
                    className="mapping-select"
                >
                    {filteredComponents.length === 0 ? (
                        <Option disabled value="none">
                            <Text type="secondary" style={{ fontSize: 12 }}>未找到匹配此功能的硬件 ({CAPABILITY_MAPPING[attr.key]?.join('/')})</Text>
                        </Option>
                    ) : filteredComponents.map(c => (
                        <Option key={c.id} value={c.id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <Space>
                                    <Tag color="blue" bordered={false} style={{ fontSize: 10 }}>{c.category}</Tag>
                                    <span>{c.alias || c.name}</span>
                                </Space>
                                <DeploymentUnitOutlined style={{ opacity: 0.3, fontSize: 12 }} />
                            </div>
                        </Option>
                    ))}
                </Select>
            </div>
        );
    }

    if (attr.type === 'DATA_COMBOX') {
        const currentGroup = attr.comboType?.typeGroups?.find(g => g.key === attr.value);

        return (
            <div className="form-item-v4">
                <label>{attr.desc || attr.key}</label>
                <Select
                    style={{ width: '100%' }}
                    value={attr.value}
                    onChange={(val) => onChange(val)}
                >
                    {attr.comboType?.typeGroups?.map(g => (
                        <Option key={g.key} value={g.key}>{g.desc}</Option>
                    ))}
                </Select>
                {/* Render nested elements if the selected option has them */}
                {currentGroup?.arrayCmobEle && currentGroup.arrayCmobEle.length > 0 && (
                    <div className="nested-attr-group">
                        {currentGroup.arrayCmobEle.map(subAttr => (
                            <AbilityAttributeEditor
                                key={subAttr.key}
                                attr={subAttr}
                                onChange={(val) => onChange(attr.value, subAttr.key)}
                                components={components}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    const commonProps = {
        style: { width: '100%' },
        value: attr.value,
        onChange: (e: any) => onChange(attr.type === 'DATA_BOOL' ? e : (e.target ? e.target.value : e))
    };

    return (
        <div className="form-item-v4">
            <label>{attr.desc || attr.key} <small className="unit">{attr.unit}</small></label>
            {attr.type === 'DATA_BOOL' ? (
                <Radio.Group {...commonProps}>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                </Radio.Group>
            ) : attr.type === 'DATA_DOUBLE' || attr.type === 'DATA_FLOAT' || attr.type === 'DATA_INT32' ? (
                <InputNumber {...commonProps} min={attr.minValue} max={attr.maxValue} />
            ) : (
                <Input {...commonProps} />
            )}
        </div>
    );
};

export const AbilityStep: React.FC = () => {
    const { config, updateAbilityAttribute } = useProjectStore();
    const { functionAbility } = config.abilities;
    const components = config.components;

    if (!functionAbility || functionAbility.length === 0) {
        return <Empty description="未定义功能列表" />;
    }

    return (
        <div className="ability-step-container">
            <div className="section-header">
                <div className="section-icon"><InteractionOutlined /></div>
                <div>
                    <h2 className="section-title">功能能力映射</h2>
                    <div className="section-subtitle">将物理组件的信号与逻辑接口关联到机器人的高层功能模块</div>
                </div>
            </div>

            <div className="ability-hierarchical-tree">
                {functionAbility.map((func) => (
                    <Card 
                        key={func.type} 
                        title={<Space><ThunderboltOutlined style={{ color: 'var(--accent-color)' }} />{func.desc} <small style={{ fontWeight: 400, opacity: 0.6 }}>({func.type})</small></Space>}
                        variant="borderless"
                        className="glass-card mb-lg"
                        styles={{ body: { padding: '12px' } }}
                    >
                        <Collapse ghost expandIconPosition="end" defaultActiveKey={func.childFunction.map(c => c.key)}>
                            {func.childFunction.map((child) => (
                                <Panel 
                                    header={
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{ width: 4, height: 16, background: 'var(--accent-color)', borderRadius: 2 }} />
                                            <span style={{ fontWeight: 600 }}>{child.desc}</span>
                                            {child.tips && <Text type="secondary" style={{ fontSize: 12 }}> - {child.tips}</Text>}
                                        </div>
                                    } 
                                    key={child.key}
                                >
                                    <div className="ability-child-editor">
                                        {child.attr.map((common) => (
                                            <div key={common.key} className="ability-common-attr-block">
                                                {common.type === 'ARRAY' && common.arrayParam && (
                                                    <div className="ability-array-param">
                                                        <div className="array-header">
                                                            <Text strong style={{ fontSize: 13 }}>{common.arrayParam.groupName}</Text>
                                                        </div>
                                                        <div className="form-grid-2">
                                                            {common.arrayParam.attrParams.map((ap) => (
                                                                <AbilityAttributeEditor
                                                                    key={ap.key}
                                                                    attr={ap}
                                                                    onChange={(val, subKey) => updateAbilityAttribute(func.type, child.key, common.key, ap.key, val, subKey)}
                                                                    components={components}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {common.type === 'COMBOX' && common.comboxParam && (
                                                    <div className="ability-combox-param">
                                                        <AbilityAttributeEditor
                                                            attr={{
                                                                key: common.key,
                                                                desc: common.comboxParam.desc,
                                                                type: 'DATA_COMBOX',
                                                                value: common.comboxParam.value,
                                                                comboType: {
                                                                    typeKey: common.key,
                                                                    typeGroups: common.comboxParam.options as any
                                                                }
                                                            }}
                                                            onChange={(val) => updateAbilityAttribute(func.type, child.key, common.key, common.key, val)}
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

            <Divider dashed />
            
            <div className="audit-footer-hint" style={{ textAlign: 'center', opacity: 0.6 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                    提示：在此映射后，Audit 步骤将自动检查组件能力是否满足功能要求的完整性与冗余性。
                </Text>
            </div>
        </div>
    );
};
