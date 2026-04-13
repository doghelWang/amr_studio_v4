/**
 * §P3-EXTENSION: AttributeDataType 扩展
 *
 * §PROTO_FIRST-NOTE:
 * Proto 定义中 MESSAGE_BASE_DATA_TYPE 包含 DATA_COMBOX = 11。
 * 前端代码中 AbilityCommonAttr.type 使用简化名称 'COMBOX'（来自 backend JSON）。
 * 两者在本本质上是等同的，但类型系统需要显式声明兼容性。
 *
 * §NO_HARDCODE: 此文件作为 Proto/代码类型映射的显式文档。
 */

import type { AttributeDataType as BaseAttributeDataType } from './types';

/**
 * §EXTENDED: AttributeDataType 包含运行时变体
 * 'COMBOX' 是 'DATA_COMBOX' 的别名，用于 AbilityCommonAttr.type
 */
export type ExtendedAttributeDataType =
  | BaseAttributeDataType
  | 'COMBOX'; // §P3: Frontend alias for 'DATA_COMBOX' (Matches AbilityCommonAttr)

/**
 * §TYPE_GUARD: 检查是否为 COMBOX 类型（包括变体）
 */
export function isComboxType(type: string): boolean {
  return type === 'DATA_COMBOX' || type === 'COMBOX';
}

/**
 * §NORMALIZE: 将运行时类型规范化为标准类型
 */
export function normalizeAttributeDataType(type: string): BaseAttributeDataType {
  if (type === 'COMBOX') return 'DATA_COMBOX';
  return type as BaseAttributeDataType;
}
