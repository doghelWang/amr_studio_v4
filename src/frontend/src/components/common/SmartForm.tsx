import React from 'react';
import { Form, Input, InputNumber, Switch, Select, Space, Typography, Tooltip, Collapse } from 'antd';
import { InfoCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { SmartAttribute, AttributeGroup } from '../../store/types';

const { Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

// ━━━ Props for rendering a flat list of attributes ━━━
interface SmartFormProps {
    attributes: SmartAttribute[];
    onChange: (key: string, value: any, subKey?: string) => void;
    layout?: 'horizontal' | 'vertical';
    readOnly?: boolean;
}

// ━━━ Props for rendering grouped attributes (AttributeGroup[]) ━━━
interface SmartFormGroupedProps {
    groups: AttributeGroup[];
    onGroupChange: (groupKey: string, attrKey: string, value: any, subKey?: string) => void;
    layout?: 'horizontal' | 'vertical';
    readOnly?: boolean;
}

/**
 * Renders a single SmartAttribute field, respecting proto UI flags:
 *   - boolHide → skip render
 *   - boolNoeditable → render as read-only
 */
const SmartField: React.FC<{
    attr: SmartAttribute;
    onChange: (key: string, value: any, subKey?: string) => void;
    readOnly?: boolean;
}> = ({ attr, onChange, readOnly }) => {
    if (attr.boolHide) return null;

    const isReadOnly = readOnly || attr.boolNoeditable;
    const handleChange = (val: any, subKey?: string) => {
        if (isReadOnly) return;
        onChange(attr.key, val?.target ? val.target.value : val, subKey);
    };

    const renderField = () => {
        switch (attr.type) {
            case 'DATA_BOOL':
                return <Switch checked={attr.value} onChange={(checked) => handleChange(checked)} disabled={isReadOnly} />;

            case 'DATA_DOUBLE':
            case 'DATA_FLOAT':
                return (
                    <InputNumber
                        value={attr.value}
                        min={attr.minValue}
                        max={attr.maxValue}
                        addonAfter={attr.unit}
                        precision={3}
                        onChange={(val) => handleChange(val)}
                        disabled={isReadOnly}
                        style={{ width: '100%' }}
                    />
                );

            case 'DATA_INT32':
            case 'DATA_UINT32':
            case 'DATA_INT64':
            case 'DATA_UINT64':
                return (
                    <InputNumber
                        value={attr.value}
                        min={attr.minValue}
                        max={attr.maxValue}
                        addonAfter={attr.unit}
                        precision={0}
                        onChange={(val) => handleChange(val)}
                        disabled={isReadOnly}
                        style={{ width: '100%' }}
                    />
                );

            case 'DATA_COMBOX':
                const currentGroup = attr.comboType?.typeGroups?.find((g: any) => g.key === attr.value);
                return (
                    <div style={{ width: '100%' }}>
                        <Select value={attr.value} onChange={(val) => handleChange(val)} disabled={isReadOnly} style={{ width: '100%' }}>
                            {attr.comboType?.typeGroups?.map((g: any) => (
                                <Option key={g.key} value={g.key}>{g.desc || g.key}</Option>
                            ))}
                        </Select>
                        {/* Recursive rendering for nested attributes in selected combo option */}
                        {currentGroup?.arrayCmobEle && currentGroup.arrayCmobEle.length > 0 && (
                            <div className="nested-attr-form" style={{ marginTop: 8, paddingLeft: 16, borderLeft: '2px dashed var(--border-subtle)' }}>
                                {currentGroup.arrayCmobEle.map((sub: SmartAttribute) => (
                                    <SmartField
                                        key={sub.key}
                                        attr={sub}
                                        onChange={(nestedAttrKey, nestedValue) => onChange(attr.key, nestedValue, nestedAttrKey)}
                                        readOnly={readOnly}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                );

            case 'DATA_IP':
                return (
                    <Input
                        value={attr.value}
                        onChange={(e) => handleChange(e.target.value)}
                        disabled={isReadOnly}
                        placeholder="e.g. 192.168.1.100"
                        style={{ width: '100%' }}
                    />
                );

            case 'DATA_FIXED_E':
                return (
                    <Input
                        value={attr.value}
                        disabled={true}
                        style={{ width: '100%', background: 'var(--bg-muted)', opacity: 0.6 }}
                    />
                );

            default:
                return (
                    <Input
                        value={attr.value}
                        onChange={(e) => handleChange(e.target.value)}
                        disabled={isReadOnly}
                        style={{ width: '100%' }}
                    />
                );
        }
    };

    return (
        <Form.Item
            key={attr.key}
            label={
                <Space size={4}>
                    <Text strong>{attr.desc || attr.key}</Text>
                    {attr.boolMustfill && <Text type="danger">*</Text>}
                    <Tooltip title={`key: ${attr.key}${attr.unit ? ` | unit: ${attr.unit}` : ''}`}>
                        <InfoCircleOutlined style={{ fontSize: 12, color: '#999' }} />
                    </Tooltip>
                </Space>
            }
            extra={
                attr.boolBasic
                    ? null
                    : <Text type="secondary" style={{ fontSize: 11 }}>{attr.key}</Text>
            }
        >
            {renderField()}
        </Form.Item>
    );
};

/**
 * SmartForm — renders a flat list of SmartAttribute[].
 * Use for simple attribute editing (e.g. identity fields).
 */
export const SmartForm: React.FC<SmartFormProps> = ({ attributes, onChange, layout = 'vertical', readOnly }) => {
    return (
        <Form layout={layout}>
            {attributes.map(attr => (
                <SmartField key={attr.key} attr={attr} onChange={(key, val, subKey) => onChange(key, val, subKey)} readOnly={readOnly} />
            ))}
        </Form>
    );
};

/**
 * SmartFormGrouped — renders AttributeGroup[] as collapsible sections.
 * Each group becomes a Collapse Panel with its attributes rendered inside.
 * This is the primary form for editing component privateAttrs.
 */
export const SmartFormGrouped: React.FC<SmartFormGroupedProps> = ({
    groups,
    onGroupChange,
    layout = 'vertical',
    readOnly
}) => {
    // Filter out deprecated groups
    const activeGroups = groups.filter(g => !g.boolDeprecated);

    if (activeGroups.length === 0) {
        return <Text type="secondary" style={{ padding: 16 }}>No editable attribute groups.</Text>;
    }

    const collapseItems = activeGroups.map(group => {
        const visibleAttrs = group.elements.filter(a => !a.boolHide);
        if (visibleAttrs.length === 0) return null;

        return {
            key: group.key,
            label: (
                <Space>
                    <SettingOutlined />
                    <Text strong>{group.desc || group.key}</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>({visibleAttrs.length})</Text>
                </Space>
            ),
            children: (
                <Form layout={layout}>
                    {group.elements.map(attr => (
                        <SmartField
                            key={attr.key}
                            attr={attr}
                            onChange={(attrKey, value, subKey) => onGroupChange(group.key, attrKey, value, subKey)}
                            readOnly={readOnly}
                        />
                    ))}
                </Form>
            )
        };
    }).filter(Boolean) as any[];

    return (
        <Collapse
            defaultActiveKey={activeGroups.map(g => g.key)}
            expandIconPosition="start"
            style={{ background: 'transparent' }}
            items={collapseItems}
        />
    );
};

export default SmartFormGrouped;
