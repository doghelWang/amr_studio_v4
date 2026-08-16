import type { Diagnostic, FunctionProcess } from '../types';

export function parseFunctionProcesses(rawFuncDesc: any): FunctionProcess[] {
  const functions = rawFuncDesc?.function || rawFuncDesc?.functions || [];
  if (!Array.isArray(functions)) return [];

  return functions.map((item: any, index: number) => ({
    id: item.id || item.key || item.type || `func_${index}`,
    type: item.type || item.key || `function_${index}`,
    desc: item.desc || item.name || item.type || `功能 ${index + 1}`,
    trigger: item.trigger,
    inputs: [],
    outputs: [],
    relatedAbilities: [],
    relatedComponents: [],
    relatedConnections: [],
    source: 'imported_func_desc',
    raw: item,
    editableLevel: 'readonly',
    diagnostics: [
      {
        severity: 'info',
        code: 'FUNC_PROCESS_RAW_ONLY',
        message: '该功能过程已从 FuncDesc 导入并保留；当前前端仅提供只读摘要。',
        functionId: item.id || item.key || item.type || `func_${index}`,
        source: 'FuncDesc.json',
      },
      {
        severity: 'warning',
        code: 'FUNC_RELATIONS_UNRESOLVED',
        message: 'FuncDesc 原始过程未提供可解析的组件/连接/能力引用，关系保持 unresolved。',
        functionId: item.id || item.key || item.type || `func_${index}`,
        source: 'FuncDesc.json',
      },
    ],
  }));
}

export function summarizeFunctionProcesses(processes: FunctionProcess[] | undefined, rawFuncDesc?: any) {
  const rawFunctions = rawFuncDesc?.function || rawFuncDesc?.functions || [];
  const rawFunctionCount = Array.isArray(rawFunctions) ? rawFunctions.length : 0;
  const diagnostics: Diagnostic[] = [];

  if (!processes?.length && rawFunctionCount === 0) {
    diagnostics.push({
      severity: 'warning',
      code: 'FUNC_PROCESS_EMPTY',
      message: '前端未加载 FuncDesc 功能过程；新建项目需要用户或后端模板显式提供。',
      source: 'frontend',
    });
  }

  return {
    processCount: processes?.length || 0,
    rawFunctionCount,
    readonlyCount: (processes || []).filter(item => item.editableLevel === 'readonly').length,
    diagnostics,
  };
}
