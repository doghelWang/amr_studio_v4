/**
 * §ABILITY_TYPE_GUARDS — 类型守卫函数
 *
 * 用于替代 (attr as any).type 等unsafe转换
 * 提供类型安全的数据结构检查和属性提取
 *
 * §NO_HARDCODE: 所有类型判断必须基于schema，不硬编码
 */

import type { SmartAttribute, AbilityCommonAttr, AbilityAttribute } from './types';

/**
 * 检查属性是否为 COMBOX/DATA_COMBOX 类型
 */
export function isComboxAttribute(
  attr: SmartAttribute | AbilityCommonAttr | any
): attr is { type: 'DATA_COMBOX' | 'COMBOX'; comboType?: any; comboxParam?: any } {
  const type = attr?.type;
  if (type === 'DATA_COMBOX' || type === 'COMBOX') {
    return true;
  }
  // Fallback checks for schema variations (without hardcoding)
  if (attr?.comboType || attr?.comboxParam) {
    return true;
  }
  return false;
}

/**
 * 检查属性是否为 ARRAY 类型
 */
export function isArrayAttribute(
  attr: SmartAttribute | AbilityCommonAttr | any
): attr is { type: 'ARRAY'; arrayParam?: any } {
  return attr?.type === 'ARRAY' || (attr as any)?.arrayParam !== undefined;
}

/**
 * 检查属性是否为硬件映射 (relatedXXX 或需要 component 绑定的)
 */
export function isHardwareMappingAttribute(attr: SmartAttribute): boolean {
  return (
    attr.key.startsWith('related') ||
    attr.type === 'DATA_FIXED_E' ||
    attr.boolParse === true
  );
}

/**
 * 从 COMBOX 属性中提取标准化的 combo/combox 配置
 * §NO_PARTIAL_PARSE: 处理所有可能的变体
 */
export function extractComboxConfig(attr: any): {
  typeGroups?: Array<{ key: string; desc: string; arrayCmobEle?: any[] }>;
  options?: Array<{ key: string; desc: string; arrayAttr?: any[] }>;
  value?: string;
} {
  // §NO_HARDCODE: 从所有可能的属性路径中提取
  const combo = attr?.comboType || attr?.comboxParam || attr?.combox_type || attr?.combox_param;

  if (!combo) return {};

  // §NO_PARTIAL_PARSE: 处理 typeGroups 和 options 两种结构
  const typeGroups = combo.typeGroups || combo.options || [];
  const standardOptions = combo.options || [];

  // §NO_HARDCODE: 从多层结构中提取 value
  const value = attr?.value || combo?.value || attr?.comboxParam?.value || attr?.combox_param?.value;

  return { typeGroups, options: standardOptions, value };
}

/**
 * 从 COMBOX 组中提取当前选中项的子元素
 * Handles arrayCmobEle, arrayAttr, array_cmob_ele variants
 */
export function extractSubElements(group: any): any[] {
  if (!group) return [];
  // §NO_HARDCODE: 处理所有可能的属性名变体
  return group.arrayCmobEle || group.arrayAttr || group.array_cmob_ele || [];
}

/**
 * 获取属性的当前值 (处理可能的嵌套结构)
 */
export function getAttributeValue(attr: any): any {
  return attr?.value ?? attr?.comboxParam?.value ?? attr?.combox_param?.value;
}

/**
 * 创建标准化的 SmartAttribute 兼容对象 (用于 AbilityCommonAttr 转换)
 */
export function normalizeToSmartAttribute(commonAttr: AbilityCommonAttr): SmartAttribute {
  const combox = extractComboxConfig(commonAttr);

  return {
    key: commonAttr.key,
    desc: commonAttr.comboxParam?.desc || (commonAttr as any).desc || commonAttr.key,
    type: (commonAttr.type === 'ARRAY' || commonAttr.type === 'COMBOX' ? 'DATA_COMBOX' : (commonAttr.type as any)) || 'DATA_STRING',
    value: getAttributeValue(commonAttr),
    comboType: combox.typeGroups ? {
      typeKey: commonAttr.key,
      typeGroups: combox.typeGroups.map((g: any) => ({
        key: g.key,
        desc: g.desc,
        arrayCmobEle: extractSubElements(g)
      }))
    } : undefined
  };
}
