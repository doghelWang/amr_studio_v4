import React, { useMemo } from 'react';
import { 
    ThunderboltOutlined, LinkOutlined, 
    InteractionOutlined, DeploymentUnitOutlined,
    SettingOutlined, ControlOutlined,
    EyeOutlined, UserOutlined
} from '@ant-design/icons';
import { useProjectStore } from '../../store/useProjectStore';
import { 
    Collapse, Card, Select, Radio, Input, 
    InputNumber, Space, Tag, Empty, Typography, 
    Divider, Row, Col, Alert 
} from 'antd';
import { AbilityAttribute, AbilityCommonAttr, ChildAbility, FunctionAbility, SmartAttribute } from '../../store/types';

const { Panel } = Collapse;
const { Option } = Select;
const { Title, Text } = Typography;

/** 
 * 🛠️ 硬件映射约束字典
 * 确保算法能力只能绑定到正确的物理硬件上
 */
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

/**
 * 🧱 递归属性编辑器 (支持 DATA_COMBOX 嵌套)
 */
const RecursiveAttributeEditor: React.FC<{
    attr: SmartAttribute;
    // 签名调整：支持直接更新子属性的值
    onUpdate: (value: any, subKey?: string, subValue?: any) => void;
    components: any[];
}> = ({ attr, onUpdate, components }) => {
    const isHardwareMapping = attr.key.startsWith('related') || attr.type === 'DATA_FIXED_E' || attr.boolParse;

    const filteredComponents = useMemo(() => {
        if (!isHardwareMapping) return [];
        const allowedCategories = CAPABILITY_MAPPING[attr.key];
        if (!allowedCategories) return components;
        return components.filter(c => allowedCategories.includes(c.category));
    }, [attr.key, components, isHardwareMapping]);

    const label = (
        <div style={{ marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Text strong style={{ fontSize: 12 }}>{attr.desc || attr.key}</Text>
            {attr.unit && <Tag style={{ fontSize: 9, opacity: 0.6 }}>{attr.unit}</Tag>}
        </div>
    );

    if (isHardwareMapping) {
        return (
            <div className="ability-field-item">
                {label}
                <Select
                    style={{ width: '100%' }}
                    placeholder={`请绑定 ${attr.desc || '硬件'}`}
                    value={attr.value || undefined}
                    onChange={(val) => onUpdate(val)}
                    allowClear
                    size="small"
                    className="mapping-select-v4"
                    suffixIcon={<LinkOutlined />}
                >
                    {filteredComponents.map(c => (
                        <Option key={c.id} value={c.id}>
                            <Space>
                                <Tag color="orange" style={{ fontSize: 9 }}>{c.category}</Tag>
                                <span style={{ fontSize: 12 }}>{c.alias || c.name}</span>
                            </Space>
                        </Option>
                    ))}
                </Select>
            </div>
        );
    }

    if (attr.type === 'DATA_COMBOX') {
        const combo = attr.comboType || (attr as any).combo_type;
        const currentGroup = combo?.typeGroups?.find((g: any) => g.key === attr.value);
        const subElements = currentGroup?.arrayCmobEle || currentGroup?.array_cmob_ele || [];

        return (
            <div className="ability-field-item combox-group">
                {label}
                <Select
                    style={{ width: '100%' }}
                    value={attr.value}
                    size="small"
                    onChange={(val) => onUpdate(val)}
                >
                    {combo?.typeGroups?.map((g: any) => (
                        <Option key={g.key} value={g.key}>{g.desc}</Option>
                    ))}
                </Select>
                {subElements.length > 0 && (
                    <div className="ability-nested-container">
                        <Row gutter={[16, 12]}>
                            {subElements.map((sub: any) => (
                                <Col span={12} key={sub.key}>
                                    <RecursiveAttributeEditor 
                                        attr={sub} 
                                        // 【关键修复】将子属性的 Key 和新 Value 向上冒泡
                                        onUpdate={(v) => onUpdate(attr.value, sub.key, v)} 
                                        components={components}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </div>
                )}
            </div>
        );
    }

    const commonProps = {
        style: { width: '100%' },
        size: "small" as const,
        value: attr.value,
        // 【关键修复】识别叶子节点的本地更新
        onChange: (e: any) => {
            const val = attr.type === 'DATA_BOOL' ? e : (e.target ? e.target.value : e);
            onUpdate(val); 
        }
    };

    return (
        <div className="ability-field-item">
            {label}
            {attr.type === 'DATA_BOOL' ? (
                <Radio.Group {...commonProps}>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                </Radio.Group>
            ) : attr.type === 'DATA_DOUBLE' || attr.type === 'DATA_FLOAT' || attr.type === 'DATA_INT32' ? (
                <InputNumber {...commonProps} />
            ) : (
                <Input {...commonProps} />
            )}
        </div>
    );
};
export const AbilityStep: React.FC<{ onExport?: () => void }> = () => {
    const { config, updateAbilityAttribute } = useProjectStore();
    const { functionAbility } = config.abilities;
    const components = config.components;

    // 【架构增强】支持三级参数传递，彻底解决 funName 无法填写的问题
    const handleAttributeUpdate = (
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
    };

    if (!functionAbility || functionAbility.length === 0) {
        return <Empty description="未定义功能列表" />;
    }

    return (
        <div className="ability-step-container" style={{ padding: '0 8px' }}>
            <div className="section-header" style={{ marginBottom: 24 }}>
...
                <div className="section-icon" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                    <InteractionOutlined />
                </div>
                <div>
                    <h2 className="section-title" style={{ margin: 0, fontSize: 18 }}>6. 算法能力 & 功能映射</h2>
                    <div className="section-subtitle" style={{ opacity: 0.6 }}>将物理传感器关联到 SLAM、避障、码识别等核心算法能力上</div>
                </div>
            </div>

            <Alert 
                message="能力配置说明" 
                description="在这里，您需要为机器人指定‘谁负责导航’、‘谁负责避障’。只有建立了硬件与算法的映射，机器人才能获得生命力。"
                type="info" showIcon style={{ marginBottom: 24, borderRadius: 8 }}
            />

            <div className="ability-cards-grid">
                {functionAbility.map((func) => (
                    <Card 
                        key={func.type} 
                        size="small"
                        title={<Space><ThunderboltOutlined style={{ color: 'var(--accent)' }} />{func.desc}</Space>}
                        className="ability-main-card"
                        style={{ marginBottom: 20, background: 'rgba(255,255,255,0.02)', borderRadius: 12 }}
                    >
                        <Collapse ghost defaultActiveKey={func.childFunction.map(c => c.key)}>
                            {func.childFunction.map((child) => (
                                <Panel 
                                    header={<Text strong style={{ color: 'var(--text-bright)' }}>{child.desc}</Text>}
                                    key={child.key}
                                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                                >
                                    <div className="ability-child-fields" style={{ padding: '8px 0' }}>
                                        {child.attr.map((common) => (
                                            <div key={common.key} className="ability-common-attr-block">
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
                                                                        attr={ap}
                                                                        onUpdate={(val, sub, subVal) => handleAttributeUpdate(func.type, child.key, common.key, ap.key, val, sub, subVal)}
                                                                        components={components}
                                                                    />
                                                                </Col>
                                                            ))}
                                                        </Row>
                                                    </div>
                                                )}
                                                {common.type === 'COMBOX' && common.comboxParam && (
                                                    <div className="ability-combox-section" style={{ marginTop: 12 }}>
                                                        <RecursiveAttributeEditor
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
                                                            onUpdate={(val, sub, subVal) => handleAttributeUpdate(func.type, child.key, common.key, common.key, val, sub, subVal)}
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
                    background: rgba(0,0,0,0.2); 
                    border-radius: 8px; 
                    border: 1px dashed rgba(255,255,255,0.1); 
                }
                .mapping-select-v4 .ant-select-selection-item { font-weight: 600; color: var(--accent) !important; }
                .ability-main-card { border: 1px solid rgba(255,255,255,0.05) !important; }
                .ability-main-card:hover { border-color: var(--accent) !important; }
            `}</style>
        </div>
    );
};
