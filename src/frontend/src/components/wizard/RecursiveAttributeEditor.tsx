/**
 * §RecursiveAttributeEditor V2 — 简化重构版本
 *
 * 与原组件行为一致，但简化内部结构以通过类型检查
 */

import React, { memo, useMemo, ReactNode } from 'react';
import { Select, Radio, Input, InputNumber, Space, Tag, Typography, Row, Col } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import type { SmartAttribute } from '../../store/types';

const { Option } = Select;
const { Text } = Typography;

// Capability mapping dictionary
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

interface ComponentConfig {
  id: string;
  category: string;
  alias?: string;
  name?: string;
}

// §PATTERN: 使用函数重载签名替代联合类型
interface RecursiveAttributeEditorProps {
  attr: SmartAttribute;
  onUpdate: (value: any, subKey?: string, subValue?: any) => void;
  components: ComponentConfig[];
}

/**
 * 标签组件
 */
const AttributeLabel: React.FC<{ attr: SmartAttribute }> = memo(({ attr }) => (
  <div style={{ marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
    <Text strong style={{ fontSize: 12 }}>{attr.desc || attr.key}</Text>
    {attr.unit && <Tag style={{ fontSize: 9, opacity: 0.6 }}>{attr.unit}</Tag>}
  </div>
));

/**
 * §TYPE_GUARD: 检查是否为硬件映射
 */
function isHardwareMapping(attr: SmartAttribute): boolean {
  return attr.key?.startsWith('related') || attr.type === 'DATA_FIXED_E' || attr.boolParse === true;
}

/**
 * §TYPE_GUARD: 检查是否为 COMBOX
 */
function isComboxType(attr: SmartAttribute & { type?: string }): boolean {
  // §NO_HARDCODE: 运行时检查，不依赖 type 枚举
  return attr.type === 'DATA_COMBOX' || (attr as any).type === 'COMBOX' || !!attr.comboType;
}

/**
 * §EXTRACT: 从 COMBOX 中提取配置 (支持 comboxParam.options[])
 */
function extractComboxData(attr: SmartAttribute & { comboxParam?: any }) {
  // Support both: comboType.typeGroups (Component attr) and comboxParam.options (Ability attr)
  const comboxP = attr.comboxParam;
  const combo = attr.comboType;
  const currentValue: any = comboxP?.value || attr.value;

  // For ability registry: comboxParam.options[]
  if (comboxP?.options) {
    const currentOption = comboxP.options.find((g: any) => g.key === currentValue);
    const subElements: any[] = currentOption?.arrayAttr || [];
    return { combo: null, currentValue, typeGroups: comboxP.options, subElements, fromOptions: true };
  }

  // For component: comboType.typeGroups[]
  const typeGroups = combo?.typeGroups || [];
  const currentGroup = typeGroups.find((g: any) => g.key === currentValue);
  const subElements: any[] = currentGroup?.arrayCmobEle || [];
  return { combo, currentValue, typeGroups, subElements, fromOptions: false };
}

/**
 * 硬件映射编辑器
 */
const HardwareMappingEditor: React.FC<RecursiveAttributeEditorProps> = memo(({
  attr,
  onUpdate,
  components
}) => {
  const filteredComponents = useMemo(() => {
    const allowed = CAPABILITY_MAPPING[attr.key];
    if (!allowed) return components;
    return components.filter(c => allowed.includes(c.category));
  }, [attr.key, components]);

  const handleChange = (_value: any) => {
    onUpdate(_value);
  };

  return (
    <div className="ability-field-item">
      <AttributeLabel attr={attr} />
      <Select
        style={{ width: '100%' }}
        placeholder={`请绑定 ${attr.desc || '硬件'}`}
        value={attr.value || undefined}
        onChange={handleChange}
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
});

/**
 * 基础类型编辑器
 */
const PrimitiveEditor: React.FC<RecursiveAttributeEditorProps> = memo(({
  attr,
  onUpdate
}) => {
  const handleChange = (e: any) => {
    const val = attr.type === 'DATA_BOOL'
      ? e
      : (e?.target ? e.target.value : e);
    onUpdate(val);
  };

  const commonProps = {
    style: { width: '100%' },
    size: "small" as const,
    value: attr.value,
    onChange: handleChange
  };

  return (
    <div className="ability-field-item">
      <AttributeLabel attr={attr} />
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
});

/**
 * COMBOX 编辑器 (含嵌套)
 */
const ComboxEditor: React.FC<RecursiveAttributeEditorProps> = memo(({
  attr,
  onUpdate,
  components
}) => {
  const { currentValue, typeGroups, subElements } = extractComboxData(attr);

  const handleSelectChange = (value: any) => {
    onUpdate(value);
  };

  return (
    <div className="ability-field-item combox-group">
      <AttributeLabel attr={attr} />
      <Select
        style={{ width: '100%' }}
        value={currentValue}
        size="small"
        onChange={handleSelectChange}
      >
        {typeGroups.map((g: any) => (
          <Option key={g.key} value={g.key}>{g.desc}</Option>
        ))}
      </Select>
      {subElements.length > 0 && (
        <div className="ability-nested-container">
          <Row gutter={[12, 8]}>
            {subElements.map((sub: any) => (
              <Col span={12} key={sub.key}>
                <RecursiveAttributeEditor
                  attr={sub}
                  onUpdate={(subValue) => {
                    onUpdate(currentValue, sub.key, subValue);
                  }}
                  components={components}
                />
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
});

/**
 * 主递归编辑器 — 路由器模式
 */
export const RecursiveAttributeEditor: React.FC<RecursiveAttributeEditorProps> = memo((props) => {
  const { attr } = props;

  // §PATTERN: 使用类型守卫路由到对应编辑器
  if (isHardwareMapping(attr)) {
    return <HardwareMappingEditor {...props} />;
  }

  if (isComboxType(attr)) {
    return <ComboxEditor {...props} />;
  }

  return <PrimitiveEditor {...props} />;
});

export default RecursiveAttributeEditor;
