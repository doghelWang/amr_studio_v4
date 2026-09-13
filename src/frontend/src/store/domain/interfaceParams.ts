const LEGACY_KEY_MAP: Record<string, string> = {
  canId: 'nodeId',
  baudRate: 'baudrate',
  ipAddress: 'ip',
};

function canonicalKey(key: string): string {
  return LEGACY_KEY_MAP[key] || key;
}

function readElementValue(element: any): any {
  if (element?.comboType?.typeKey !== undefined) return element.comboType.typeKey;
  for (const key of ['stringValue', 'ipValue', 'int32Value', 'uint32Value', 'int64Value', 'uint64Value', 'floatValue', 'doubleValue', 'boolValue']) {
    if (element?.[key] !== undefined) return element[key];
  }
  return undefined;
}

export function readInterfaceParams(raw: any): Record<string, any> {
  const array = raw?.interfaceParamsArray || raw?.interface_params_array;
  if (!Array.isArray(array)) {
    return Object.fromEntries(Object.entries(raw || {}).map(([key, value]) => [canonicalKey(key), value]));
  }
  return Object.fromEntries(array.map((element: any) => [canonicalKey(element.key), readElementValue(element)]));
}

function writeElementValue(element: any, value: any): any {
  const next = { ...element };
  if (next.comboType || next.combo_type) {
    const comboKey = next.comboType ? 'comboType' : 'combo_type';
    next[comboKey] = { ...(next[comboKey] || {}), typeKey: String(value), typeDesc: String(value) };
    return next;
  }

  const type = String(next.type || '').toUpperCase();
  const valueKey = type.includes('IP') ? 'ipValue'
    : type.includes('STRING') ? 'stringValue'
      : type.includes('BOOL') ? 'boolValue'
        : type.includes('UINT32') ? 'uint32Value'
          : type.includes('INT32') ? 'int32Value'
            : type.includes('UINT64') ? 'uint64Value'
              : type.includes('INT64') ? 'int64Value'
                : type.includes('FLOAT') ? 'floatValue'
                  : 'doubleValue';
  next[valueKey] = value;
  return next;
}

/** Update official interfaceParamsArray while preserving schema and unknown fields. */
export function updateInterfaceParams(raw: any, params: Record<string, any>): any {
  const canonicalParams = Object.fromEntries(Object.entries(params).map(([key, value]) => [canonicalKey(key), value]));
  const array = raw?.interfaceParamsArray || raw?.interface_params_array;
  if (!Array.isArray(array)) return { ...(raw || {}), ...canonicalParams };

  const keyName = raw.interfaceParamsArray ? 'interfaceParamsArray' : 'interface_params_array';
  const known = new Set(array.map((element: any) => canonicalKey(element.key)));
  const nextArray = array.map((element: any) => {
    const key = canonicalKey(element.key);
    return Object.prototype.hasOwnProperty.call(canonicalParams, key)
      ? writeElementValue(element, canonicalParams[key])
      : element;
  });
  const unresolved = Object.entries(canonicalParams).filter(([key]) => !known.has(key));
  if (unresolved.length > 0) {
    // Do not invent Proto fields. Keep unresolved values in a sidecar only for
    // flat legacy payloads; official interfaceParamsArray remains schema-bound.
    return { ...(raw || {}), [keyName]: nextArray };
  }
  return { ...(raw || {}), [keyName]: nextArray };
}
