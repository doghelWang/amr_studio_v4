import { unzipSync, zipSync } from "fflate";
import { md5 } from "js-md5";
import { AMR_MODEL_NSP, MODEL_ABI, MODEL_DES } from "./generated/protobuf_models.js";

type Env = {
  ASSETS: Fetcher;
  AMR_PROJECTS: KVNamespace;
};

const SERVICE_START_TIME = "2026-07-11T00:00:00.000+08:00";

const MIGRATED_ENDPOINTS = [
  "GET /api/v1/system/version",
  "GET /api/v1/schemas",
  "GET /api/v1/resources/boards",
  "GET /api/v1/projects/saved-list",
  "GET /api/v1/projects/load/{name}",
  "POST /api/v1/projects/save",
  "POST /api/v1/models/init-sandbox",
  "GET /api/v1/models/{project_id}/components/{module_uuid}",
  "PATCH /api/v1/models/{project_id}/components/{module_uuid}",
  "GET /api/v1/models/{project_id}/abilities",
  "PATCH /api/v1/models/{project_id}/abilities",
  "GET /api/v1/models/{project_id}/functions",
  "POST /api/v1/models/upload",
  "POST /api/v1/models/{project_id}/compile",
  "GET /api/v1/models/{project_id}/artifacts/{artifact}",
  "GET /downloads/{project_id}/{artifact}",
];

type SavedProjectIndexItem = {
  name: string;
  mtime: number;
  robotName?: string;
  source?: "kv" | "snapshot";
};

type SaveProjectPayload = {
  name?: unknown;
  config?: unknown;
};

type SandboxRecord = {
  projectId: string;
  sourceKind?: "frontend" | "imported";
  config: Record<string, unknown>;
  components: Record<string, unknown>[];
  abilities: unknown;
  functions: unknown;
  rawFuncDesc?: unknown;
  rawModelFileDesc?: unknown;
  fullJson?: unknown;
  importAudit?: string[];
  createdAt: string;
  updatedAt: string;
};

function jsonResponse(payload: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type,Authorization");
  return new Response(JSON.stringify(payload), { ...init, headers });
}

function optionsResponse(): Response {
  return jsonResponse({ status: "ok" }, { status: 204 });
}

function notMigratedResponse(endpoint: string): Response {
  return jsonResponse(
    {
      error: "NOT_MIGRATED_TO_WORKER_TS",
      endpoint,
      message:
        "This API depends on protobuf/cmodel parsing, sandbox filesystem state, or cmodel export artifacts and has not been migrated to Cloudflare Worker TypeScript yet.",
      migratedEndpoints: MIGRATED_ENDPOINTS,
    },
    { status: 501 },
  );
}

function notFoundResponse(pathname: string): Response {
  return jsonResponse({ error: "NOT_FOUND", pathname }, { status: 404 });
}

async function fetchAssetJson(env: Env, request: Request, assetPath: string): Promise<Response> {
  const assetUrl = new URL(request.url);
  assetUrl.pathname = assetPath;
  assetUrl.search = "";
  const assetResponse = await env.ASSETS.fetch(new Request(assetUrl, { method: "GET" }));

  if (!assetResponse.ok) {
    return jsonResponse(
      {
        error: "WORKER_DATA_ASSET_NOT_FOUND",
        assetPath,
        status: assetResponse.status,
      },
      { status: 500 },
    );
  }

  const headers = new Headers(assetResponse.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Access-Control-Allow-Origin", "*");
  return new Response(assetResponse.body, {
    status: assetResponse.status,
    statusText: assetResponse.statusText,
    headers,
  });
}

async function readAssetJson<T>(env: Env, request: Request, assetPath: string, fallback: T): Promise<T> {
  const assetUrl = new URL(request.url);
  assetUrl.pathname = assetPath;
  assetUrl.search = "";
  const assetResponse = await env.ASSETS.fetch(new Request(assetUrl, { method: "GET" }));
  if (!assetResponse.ok) {
    return fallback;
  }
  return (await assetResponse.json()) as T;
}

function getSavedProjectName(pathname: string): string | null {
  const prefix = "/api/v1/projects/load/";
  if (!pathname.startsWith(prefix)) {
    return null;
  }
  const rawName = pathname.slice(prefix.length);
  if (!rawName || rawName.includes("/") || rawName.includes("..")) {
    return null;
  }
  return decodeURIComponent(rawName);
}

function projectKey(name: string): string {
  return `project:${name}`;
}

function sandboxKey(projectId: string): string {
  return `sandbox:${projectId}`;
}

function artifactKey(projectId: string, artifactName: string): string {
  return `artifact:${projectId}:${artifactName}`;
}

function safeProjectName(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const name = value.trim();
  if (!name || name.includes("/") || name.includes("..")) {
    return null;
  }
  return name;
}

function safePathId(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }
  const decoded = decodeURIComponent(value);
  if (!decoded || decoded.includes("/") || decoded.includes("..")) {
    return null;
  }
  return decoded;
}

function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function getNumber(record: Record<string, unknown>, key: string, fallback = 0): number {
  const value = record[key];
  const numberValue = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function getString(record: Record<string, unknown>, key: string, fallback = ""): string {
  const value = record[key];
  return typeof value === "string" ? value : fallback;
}

function getComponentId(component: Record<string, unknown>): string | null {
  for (const key of ["id", "uuid", "moduleUuid", "module_uuid"]) {
    const value = component[key];
    if (typeof value === "string" && value) {
      return value;
    }
  }
  return null;
}

function deepMerge(base: unknown, patch: unknown): unknown {
  if (Array.isArray(base) || Array.isArray(patch)) {
    return patch;
  }
  if (typeof base !== "object" || base === null || typeof patch !== "object" || patch === null) {
    return patch;
  }

  const merged: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [key, value] of Object.entries(patch as Record<string, unknown>)) {
    if (value === undefined) {
      continue;
    }
    merged[key] = key in merged ? deepMerge(merged[key], value) : value;
  }
  return merged;
}

const SNAKE_TO_CAMEL_KEYS: Record<string, string> = {
  general_attr: "generalAttr",
  module_name: "moduleName",
  module_desc: "moduleDesc",
  module_uuid: "moduleUuid",
  module_shape: "moduleShape",
  shape_type: "shapeType",
  size_len: "sizeLen",
  size_width: "sizeWidth",
  size_height: "sizeHeight",
  struct_param: "structParam",
  extend_params: "extendParams",
  double_value: "doubleValue",
  string_value: "stringValue",
  uint32_value: "uint32Value",
  int32_value: "int32Value",
  bool_value: "boolValue",
  combo_type: "comboType",
  type_key: "typeKey",
  type_desc: "typeDesc",
  private_attr: "privateAttr",
  private_attrs: "privateAttrs",
  array_base_ele: "arrayBaseEle",
  interface_params: "interfaceParams",
  interface_group: "interfaceGroup",
  interface_Group: "interfaceGroup",
  interface_uuid: "interfaceUuid",
  linked_interface_uuid: "linkedInterfaceUuid",
};

function normalizeProtoPatch(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeProtoPatch(item));
  }
  if (typeof value !== "object" || value === null) {
    return value;
  }
  const normalized: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
    normalized[SNAKE_TO_CAMEL_KEYS[key] || key] = normalizeProtoPatch(item);
  }
  return normalized;
}

function getNestedRecord(record: Record<string, unknown>, ...keys: string[]): Record<string, unknown> {
  let current: Record<string, unknown> = record;
  for (const key of keys) {
    current = asRecord(current[key]);
  }
  return current;
}

function getProtoString(record: Record<string, unknown>, ...keys: string[]): string {
  const leaf = getNestedRecord(record, ...keys);
  return getString(leaf, "stringValue", getString(leaf, "string_value"));
}

function getProtoComponentId(component: Record<string, unknown>): string | null {
  const generalAttr = asRecord(component.generalAttr ?? component.general_attr);
  const moduleUuid = asRecord(generalAttr.moduleUuid ?? generalAttr.module_uuid);
  const value = getString(moduleUuid, "stringValue", getString(moduleUuid, "string_value"));
  return value || null;
}

function getProtoComponentArrays(group: Record<string, unknown>): Record<string, unknown>[][] {
  const arrays: Record<string, unknown>[][] = [];
  const camel = group.moduleComponets;
  const snake = group.module_componets;
  if (Array.isArray(camel)) {
    arrays.push(camel as Record<string, unknown>[][][number]);
  }
  if (Array.isArray(snake) && snake !== camel) {
    arrays.push(snake as Record<string, unknown>[][][number]);
  }
  return arrays;
}

function getProtoChildGroups(group: Record<string, unknown>): Record<string, unknown>[] {
  const children = group.moreModuleInfo ?? group.more_module_info;
  return Array.isArray(children) ? (children.map(asRecord) as Record<string, unknown>[]) : [];
}

function findProtoComponentSlot(
  root: unknown,
  moduleUuid: string,
): { component: Record<string, unknown>; parentArray: Record<string, unknown>[]; index: number } | null {
  const visit = (group: Record<string, unknown>): { component: Record<string, unknown>; parentArray: Record<string, unknown>[]; index: number } | null => {
    for (const componentArray of getProtoComponentArrays(group)) {
      for (let index = 0; index < componentArray.length; index += 1) {
        const component = asRecord(componentArray[index]);
        if (getProtoComponentId(component) === moduleUuid) {
          return { component, parentArray: componentArray, index };
        }
      }
    }
    for (const child of getProtoChildGroups(group)) {
      const found = visit(child);
      if (found) {
        return found;
      }
    }
    return null;
  };
  return visit(asRecord(root));
}

const EXTEND_PARAM_TO_COMPONENT_FIELD: Record<string, string> = {
  locCoordX: "mountX",
  locCoordY: "mountY",
  locCoordZ: "mountZ",
  locCoordROLL: "mountRoll",
  locCoordPITCH: "mountPitch",
  locCoordYAW: "mountYaw",
};

function applyProtoPatchToFrontendComponent(
  component: Record<string, unknown>,
  normalizedPatch: Record<string, unknown>,
): Record<string, unknown> {
  const merged = deepMerge(component, normalizedPatch) as Record<string, unknown>;
  const generalAttr = asRecord(normalizedPatch.generalAttr);
  const moduleName = getProtoString(generalAttr, "moduleName");
  if (moduleName) {
    merged.name = moduleName;
  }

  const moduleShape = asRecord(generalAttr.moduleShape);
  const box = asRecord(moduleShape.box);
  const length = getNumber(box, "sizeLen", NaN);
  const width = getNumber(box, "sizeWidth", NaN);
  const height = getNumber(box, "sizeHeight", NaN);
  if ([length, width, height].some(Number.isFinite)) {
    merged.shape = {
      ...asRecord(merged.shape),
      ...(Number.isFinite(length) ? { length } : {}),
      ...(Number.isFinite(width) ? { width } : {}),
      ...(Number.isFinite(height) ? { height } : {}),
    };
  }

  const structParam = asRecord(normalizedPatch.structParam);
  const extendParams = structParam.extendParams;
  if (Array.isArray(extendParams)) {
    for (const paramInput of extendParams) {
      const param = asRecord(paramInput);
      const field = EXTEND_PARAM_TO_COMPONENT_FIELD[getString(param, "key")];
      const value = getNumber(param, "doubleValue", NaN);
      if (field && Number.isFinite(value)) {
        merged[field] = value;
      }
    }
  }

  return merged;
}

function extractFunctions(config: Record<string, unknown>): unknown {
  if (config.rawFuncDesc !== undefined) {
    return config.rawFuncDesc;
  }
  if (config.functionProcesses !== undefined) {
    return { functionProcesses: config.functionProcesses };
  }
  return {};
}

const ABI_ATTRIBUTE_TYPE_MAP: Record<string, string> = {
  DATA_BYTES: "BYTES_E",
  DATA_STRING: "STRING_E",
  DATA_IP: "IP_E",
  DATA_BOOL: "BOOL_E",
  DATA_INT32: "INT32_E",
  DATA_UINT32: "UINT32_E",
  DATA_INT64: "INT64_E",
  DATA_UINT64: "UINT64_E",
  DATA_FLOAT: "FLOAT_E",
  DATA_DOUBLE: "DOUBLE_E",
  DATA_FIXED_E: "FIXED_E",
  DATA_COMBOX: "DATA_COMBOX_E",
};

function mapAbilityArrayParam(arrayInput: unknown): Record<string, unknown> | undefined {
  const arrayParam = asRecord(arrayInput);
  if (!Object.keys(arrayParam).length) return undefined;
  return {
    groupKey: getString(arrayParam, "groupKey"),
    groupName: getString(arrayParam, "groupName"),
    attrParams: (Array.isArray(arrayParam.attrParams) ? arrayParam.attrParams : []).map((item) => mapAttributeToCmodel(item, true)),
  };
}

function mapAbilityComboParam(attribute: Record<string, unknown>): Record<string, unknown> | undefined {
  const combo = asRecord(attribute.comboxParam ?? attribute.combox_param);
  if (!Object.keys(combo).length) return undefined;
  const options = Array.isArray(combo.options) ? combo.options : [];
  return {
    key: getString(combo, "key"),
    desc: getString(combo, "desc"),
    tips: getString(combo, "tips"),
    comboxSource: getString(combo, "comboxSource", "CUSTOM_E"),
    customCombox: {
      element: options.map((optionInput) => {
        const option = asRecord(optionInput);
        const attrs = Array.isArray(option.arrayAttr) ? option.arrayAttr : [];
        return {
          key: getString(option, "key"),
          desc: getString(option, "desc"),
          arrayAttr: attrs.length ? [{
            groupKey: getString(attribute, "key"),
            groupName: getString(combo, "desc"),
            attrParams: attrs.map((item) => mapAttributeToCmodel(item, true)),
          }] : [],
          comboxAttr: [],
        };
      }),
      defaultSelect: getString(combo, "value"),
    },
  };
}

function mapAttributeToCmodel(attributeInput: unknown, isAbility = false): Record<string, unknown> {
  const attribute = asRecord(attributeInput);
  const rawType = getString(attribute, "type");
  let attrType = rawType;
  if (isAbility) {
    if (rawType === "ARRAY" || rawType === "ARRAY_E") attrType = "ARRAY_E";
    else if (rawType === "COMBOX" || rawType === "COMBOX_E") attrType = "COMBOX_E";
    else attrType = ABI_ATTRIBUTE_TYPE_MAP[rawType] || rawType;
  }

  const base: Record<string, unknown> = {};
  if (attribute.key !== undefined) base.key = attribute.key;
  if (attrType) base.type = attrType;
  if (attribute.desc !== undefined) base.desc = attribute.desc;
  else if (attribute.describer !== undefined) base.desc = attribute.describer;
  for (const field of ["unit", "boolParse", "boolHide", "boolBasic", "boolMustfill", "boolNoeditable"] as const) {
    if (attribute[field] !== undefined) base[field] = attribute[field];
  }
  if (attribute.fixedSource !== undefined) base.fixedSource = attribute.fixedSource;

  if (isAbility && (rawType === "ARRAY" || rawType === "ARRAY_E")) {
    const arrayParam = mapAbilityArrayParam(attribute.arrayParam ?? attribute.array_param);
    if (arrayParam) base.arrayParam = arrayParam;
    return base;
  }
  if (isAbility && (rawType === "COMBOX" || rawType === "COMBOX_E")) {
    const comboParam = mapAbilityComboParam(attribute);
    if (comboParam) base.comboxParam = comboParam;
    return base;
  }

  const value = attribute.value;
  if (value !== undefined && value !== null) {
    if (rawType === "DATA_DOUBLE") base.doubleValue = Number(value);
    else if (rawType === "DATA_FLOAT") base.floatValue = Number(value);
    else if (rawType === "DATA_INT32") base.int32Value = Math.trunc(Number(value));
    else if (rawType === "DATA_UINT32") base.uint32Value = Math.trunc(Number(value));
    else if (rawType === "DATA_INT64") base.int64Value = String(value);
    else if (rawType === "DATA_UINT64") base.uint64Value = String(value);
    else if (rawType === "DATA_BOOL") base.boolValue = Boolean(value);
    else if (rawType === "DATA_STRING") base.stringValue = String(value);
    else if (rawType === "DATA_FIXED_E") base.stringFix = String(value);
    else if (rawType === "DATA_IP") base.ipValue = String(value);
    else if (rawType === "DATA_BYTES") base.bytesValue = value;
  }

  const combo = asRecord(attribute.comboType ?? attribute.combo_type);
  if ((attrType === "DATA_COMBOX" || attrType === "DATA_COMBOX_E") && Object.keys(combo).length > 0) {
    base.comboType = {
      typeKey: getString(combo, "typeKey", getString(combo, "type_key")),
      typeDesc: getString(combo, "typeDesc", getString(combo, "type_desc")),
      typeGroups: (Array.isArray(combo.typeGroups) ? combo.typeGroups : Array.isArray(combo.type_groups) ? combo.type_groups : []).map(
        (groupInput) => {
          const group = asRecord(groupInput);
          const mappedGroup: Record<string, unknown> = {
            key: getString(group, "key"),
            desc: getString(group, "desc"),
          };
          const source = isAbility && Array.isArray(group.arrayAttr)
            ? group.arrayAttr
            : group.arrayCmobEle ?? group.array_cmob_ele;
          if (Array.isArray(source)) {
            mappedGroup[isAbility ? "arrayAttr" : "arrayCmobEle"] = source.map((item) => mapAttributeToCmodel(item, isAbility));
          }
          return mappedGroup;
        },
      ),
    };
  }

  return base;
}

const ATTRIBUTE_VALUE_FIELDS: Record<string, string> = {
  DATA_DOUBLE: "doubleValue",
  DATA_FLOAT: "floatValue",
  DATA_INT32: "int32Value",
  DATA_UINT32: "uint32Value",
  DATA_INT64: "int64Value",
  DATA_UINT64: "uint64Value",
  DATA_BOOL: "boolValue",
  DATA_STRING: "stringValue",
  FIXED_E: "stringValue",
  DATA_FIXED_E: "stringFix",
  DATA_IP: "ipValue",
  DATA_BYTES: "bytesValue",
};

const ATTRIBUTE_META_FIELDS = [
  "key",
  "desc",
  "unit",
  "boolParse",
  "boolHide",
  "boolBasic",
  "boolMustfill",
  "boolNoeditable",
  "fixedSource",
] as const;

function jsonEqual(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function getAttributeLimitField(rawAttribute: Record<string, unknown>, type: string, suffix: "Maxvalue" | "Minvalue"): string {
  const existing = Object.keys(rawAttribute).find((key) => key.endsWith(suffix));
  if (existing) return existing;
  const prefix: Record<string, string> = {
    DATA_DOUBLE: "double",
    DATA_FLOAT: "float",
    DATA_INT32: "int32",
    DATA_UINT32: "uint32",
    DATA_INT64: "int64",
    DATA_UINT64: "uint64",
  };
  return `${prefix[type] || "double"}${suffix}`;
}

function patchRawAttribute(rawInput: unknown, frontendInput: unknown): Record<string, unknown> {
  const raw = asRecord(rawInput);
  const frontend = asRecord(frontendInput);
  if (Object.keys(raw).length === 0) {
    return mapAttributeToCmodel(frontend, false);
  }

  const next = cloneJson(raw);
  const type = getString(frontend, "type", getString(raw, "type"));
  for (const field of ATTRIBUTE_META_FIELDS) {
    if (frontend[field] !== undefined && !jsonEqual(frontend[field], raw[field])) {
      next[field] = cloneJson(frontend[field]);
    }
  }

  const valueField = ATTRIBUTE_VALUE_FIELDS[type];
  if (valueField && frontend.value !== undefined && !jsonEqual(frontend.value, raw[valueField])) {
    next[valueField] = cloneJson(frontend.value);
  }

  for (const [frontendField, suffix] of [["maxValue", "Maxvalue"], ["minValue", "Minvalue"]] as const) {
    if (frontend[frontendField] === undefined) continue;
    const rawField = getAttributeLimitField(raw, type, suffix);
    if (!jsonEqual(frontend[frontendField], raw[rawField])) {
      next[rawField] = frontend[frontendField];
    }
  }

  if (type === "DATA_COMBOX" || type === "DATA_COMBOX_E") {
    const frontendCombo = asRecord(frontend.comboType ?? frontend.combo_type);
    const rawCombo = asRecord(raw.comboType ?? raw.combo_type);
    const nextCombo = cloneJson(rawCombo);
    for (const field of ["typeKey", "typeDesc"] as const) {
      if (frontendCombo[field] !== undefined && !jsonEqual(frontendCombo[field], rawCombo[field])) {
        nextCombo[field] = frontendCombo[field];
      }
    }
    const frontendGroups = Array.isArray(frontendCombo.typeGroups) ? (frontendCombo.typeGroups as Record<string, unknown>[]) : [];
    const rawGroups = Array.isArray(rawCombo.typeGroups) ? (rawCombo.typeGroups as Record<string, unknown>[]) : [];
    if (frontendGroups.length > 0) {
      nextCombo.typeGroups = frontendGroups.map((groupInput) => {
        const group = asRecord(groupInput);
        const rawGroup = rawGroups.find((candidate) => getString(candidate, "key") === getString(group, "key")) || {};
        const nextGroup = cloneJson(rawGroup);
        for (const field of ["key", "desc"] as const) {
          if (group[field] !== undefined && !jsonEqual(group[field], rawGroup[field])) nextGroup[field] = group[field];
        }
        const frontendElements = Array.isArray(group.arrayCmobEle) ? (group.arrayCmobEle as Record<string, unknown>[]) : [];
        const rawElements = Array.isArray(rawGroup.arrayCmobEle) ? (rawGroup.arrayCmobEle as Record<string, unknown>[]) : [];
        if (frontendElements.length > 0) {
          nextGroup.arrayCmobEle = frontendElements.map((element) => {
            const rawElement = rawElements.find((candidate) => getString(candidate, "key") === getString(element, "key")) || {};
            return patchRawAttribute(rawElement, element);
          });
        }
        return nextGroup;
      });
    }
    next.comboType = nextCombo;
  }

  return next;
}

function buildComponentExtendParams(component: Record<string, unknown>): Record<string, unknown>[] {
  const params: Record<string, unknown>[] = [];
  if (typeof component.parentNodeUuid === "string" && component.parentNodeUuid) {
    params.push({
      key: "parentNodeUuid",
      type: "DATA_COMBOX",
      comboType: { typeKey: component.parentNodeUuid },
    });
  }
  const poseFields: Array<[string, string]> = [
    ["locCoordX", "mountX"],
    ["locCoordY", "mountY"],
    ["locCoordZ", "mountZ"],
    ["locCoordROLL", "mountRoll"],
    ["locCoordPITCH", "mountPitch"],
    ["locCoordYAW", "mountYaw"],
  ];
  for (const [key, field] of poseFields) {
    if (component[field] === undefined) continue;
    const value = Number(component[field]);
    if (Number.isFinite(value)) params.push({ key, type: "DATA_DOUBLE", doubleValue: value });
  }
  return params;
}

function buildComponentGeneralAttr(component: Record<string, unknown>): Record<string, unknown> {
  const compName = getString(component, "name").trim();
  const compId = getString(component, "id");
  const rawGeneral = asRecord(component.generalAttr ?? component.general_attr);
  const generalAttr = Object.keys(rawGeneral).length > 0 ? cloneJson(rawGeneral) : {};
  if (compName && generalAttr.moduleName === undefined) {
    generalAttr.moduleName = { key: "module_name", type: "DATA_STRING", stringValue: compName };
  }
  if (compId && generalAttr.moduleUuid === undefined) {
    generalAttr.moduleUuid = { key: "module_uuid", type: "DATA_STRING", stringValue: compId };
  }
  const alias = getString(component, "alias");
  if (alias && generalAttr.moduleDesc === undefined) {
    generalAttr.moduleDesc = { key: "module_desc", type: "DATA_STRING", stringValue: alias };
  }
  const mainType = getString(component, "mainModuleTypeKey");
  if (mainType && generalAttr.mainModuleType === undefined) {
    generalAttr.mainModuleType = { key: "main_module_type", type: "DATA_COMBOX", comboType: { typeKey: mainType } };
  }
  const subType = getString(component, "subModuleTypeKey", getString(component, "type"));
  if (subType && generalAttr.subModuleType === undefined) {
    generalAttr.subModuleType = { key: "sub_module_type", type: "DATA_COMBOX", comboType: { typeKey: subType } };
  }
  mergeRawShape(generalAttr, component);
  return generalAttr;
}

function buildComponentPrivateAttrs(component: Record<string, unknown>): Record<string, unknown> {
  const existing = component.privateAttr ?? component.private_attr;
  if (existing && Object.keys(asRecord(existing)).length > 0) {
    return cloneJson(asRecord(existing));
  }
  const groups = Array.isArray(component.privateAttrs) ? component.privateAttrs : [];
  return {
    privateAttrs: groups.map((groupInput) => {
      const group = asRecord(groupInput);
      const elements = Array.isArray(group.elements) ? group.elements : [];
      return {
        key: getString(group, "key"),
        desc: getString(group, "desc"),
        arrayBaseEle: elements.map((element) => mapAttributeToCmodel(element, false)),
      };
    }),
  };
}

function buildComponentInterfaceGroups(component: Record<string, unknown>): Record<string, unknown>[] {
  const groups = Array.isArray(component.interfaces) ? component.interfaces : [];
  return groups.map((interfaceInput) => {
    const item = asRecord(interfaceInput);
    return {
      key: getString(item, "key"),
      type: getString(item, "type"),
      path: getString(item, "path"),
      desc: getString(item, "desc"),
      interfaceUuid: getString(item, "interfaceUuid"),
      linkedInterfaceUuid: Array.isArray(item.linkedInterfaceUuid) ? item.linkedInterfaceUuid : [],
      ...(item.linkAttrs ? { linkAttrs: item.linkAttrs } : {}),
      ...(item.interfaceAttrs ? { interfaceAttrs: item.interfaceAttrs } : {}),
      ...(item.interfaceParams ? { interfaceParams: item.interfaceParams } : {}),
    };
  });
}

function setProtoStringAttr(container: Record<string, unknown>, key: string, value: string): void {
  const current = asRecord(container[key]);
  container[key] = {
    ...current,
    key: getString(current, "key", key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)),
    type: getString(current, "type", "DATA_STRING"),
    stringValue: value,
  };
}

function setExtendDoubleParam(component: Record<string, unknown>, key: string, value: number): void {
  if (!Number.isFinite(value)) {
    return;
  }
  const structParam = asRecord(component.structParam);
  const existingParams = Array.isArray(structParam.extendParams) ? (structParam.extendParams as Record<string, unknown>[]) : [];
  const existingParam = existingParams.find((paramInput) => getString(asRecord(paramInput), "key") === key);
  if (!existingParam) {
    return;
  }
  const currentValue = getNumber(asRecord(existingParam), "doubleValue", NaN);
  if (Number.isFinite(currentValue) && currentValue === value) {
    return;
  }
  const nextParams = existingParams.map((paramInput) => {
    const param = asRecord(paramInput);
    if (getString(param, "key") !== key) {
      return paramInput;
    }
    return { ...param, doubleValue: value };
  });
  component.structParam = { ...structParam, extendParams: nextParams };
}

function setExtendComboParam(component: Record<string, unknown>, key: string, value: string): void {
  const structParam = asRecord(component.structParam);
  const existingParams = Array.isArray(structParam.extendParams) ? (structParam.extendParams as Record<string, unknown>[]) : [];
  const existingParam = existingParams.find((paramInput) => getString(asRecord(paramInput), "key") === key);
  if (!existingParam) {
    return;
  }
  const comboType = asRecord(existingParam.comboType);
  if (getString(comboType, "typeKey") === value) {
    return;
  }
  const nextParams = existingParams.map((paramInput) => {
    const param = asRecord(paramInput);
    if (getString(param, "key") !== key) {
      return paramInput;
    }
    return { ...param, comboType: { ...comboType, typeKey: value } };
  });
  component.structParam = { ...structParam, extendParams: nextParams };
}

function mergeRawPrivateAttrs(rawComponent: Record<string, unknown>, component: Record<string, unknown>): void {
  const groups = Array.isArray(component.privateAttrs) ? (component.privateAttrs as Record<string, unknown>[]) : [];
  if (groups.length === 0) {
    const patchedPrivateAttr = component.privateAttr ?? component.private_attr;
    if (patchedPrivateAttr) {
      rawComponent.privateAttr = deepMerge(asRecord(rawComponent.privateAttr), patchedPrivateAttr);
    }
    return;
  }

  const rawPrivateAttr = asRecord(rawComponent.privateAttr);
  const rawGroups = Array.isArray(rawPrivateAttr.privateAttrs) ? (rawPrivateAttr.privateAttrs as Record<string, unknown>[]) : [];
  const nextGroups = groups.map((groupInput) => {
    const group = asRecord(groupInput);
    const rawGroup = rawGroups.find((item) => getString(item, "key") === getString(group, "key")) || {};
    const rawElements = Array.isArray(rawGroup.arrayBaseEle) ? (rawGroup.arrayBaseEle as Record<string, unknown>[]) : [];
    const elements = Array.isArray(group.elements) ? (group.elements as Record<string, unknown>[]) : [];
    const nextElements = elements.map((elementInput) => {
      const element = asRecord(elementInput);
      const rawElement = rawElements.find((item) => getString(item, "key") === getString(element, "key")) || {};
      return patchRawAttribute(rawElement, element);
    });
    return deepMerge(rawGroup, {
      key: getString(group, "key"),
      desc: getString(group, "desc"),
      arrayBaseEle: nextElements,
    }) as Record<string, unknown>;
  });
  rawComponent.privateAttr = deepMerge(rawPrivateAttr, { privateAttrs: nextGroups });
}

function mergeRawInterfaces(rawComponent: Record<string, unknown>, component: Record<string, unknown>): void {
  const interfaceParams = asRecord(component.interfaceParams ?? component.interface_params);
  const interfaces = Array.isArray(component.interfaces)
    ? (component.interfaces as Record<string, unknown>[])
    : Array.isArray(interfaceParams.interfaceGroup)
      ? (interfaceParams.interfaceGroup as Record<string, unknown>[])
      : [];
  if (interfaces.length === 0) {
    return;
  }

  const rawInterfaceParams = asRecord(rawComponent.interfaceParams);
  const rawInterfaceKey = Array.isArray(rawInterfaceParams.interface_Group) ? "interface_Group" : "interfaceGroup";
  const rawGroups = Array.isArray(rawInterfaceParams[rawInterfaceKey])
    ? (rawInterfaceParams[rawInterfaceKey] as Record<string, unknown>[])
    : [];
  const nextGroups = interfaces.map((interfaceInput) => {
    const item = asRecord(interfaceInput);
    const uuid = getString(item, "interfaceUuid");
    const rawInterface = rawGroups.find((candidate) => getString(candidate, "interfaceUuid") === uuid) || {};
    const modeled: Record<string, unknown> = {
      key: getString(item, "key"),
      type: getString(item, "type"),
      path: getString(item, "path"),
      desc: getString(item, "desc"),
      interfaceUuid: uuid,
      linkedInterfaceUuid: Array.isArray(item.linkedInterfaceUuid) ? item.linkedInterfaceUuid : [],
    };
    for (const key of ["linkAttrs", "interfaceAttrs", "interfaceParams"]) {
      if (item[key] !== undefined) {
        modeled[key] = item[key];
      }
    }
    return deepMerge(rawInterface, modeled) as Record<string, unknown>;
  });
  rawComponent.interfaceParams = deepMerge(rawInterfaceParams, { [rawInterfaceKey]: nextGroups });
}

function mergeRawShape(generalAttr: Record<string, unknown>, component: Record<string, unknown>): void {
  const shape = asRecord(component.shape);
  const shapeType = getString(shape, "type");
  if (!shapeType) {
    return;
  }
  const currentShape = asRecord(generalAttr.moduleShape);
  const modeledShape: Record<string, unknown> = {
    ...currentShape,
    shapeType: shapeType === "CYLINDER" ? "ENUM_CYLINDER" : shapeType === "SPHERE" ? "ENUM_SPHERE" : "ENUM_BOX",
  };
  if (shapeType === "CYLINDER") {
    const cylinder = asRecord(currentShape.cylinder);
    const nextCylinder: Record<string, unknown> = { ...cylinder };
    const diameter = shape.diameter;
    const height = shape.height;
    if (diameter !== undefined && diameter !== null) nextCylinder.diameter = diameter;
    if (height !== undefined && height !== null) nextCylinder.height = height;
    modeledShape.cylinder = nextCylinder;
  } else if (shapeType === "SPHERE") {
    const sphere = asRecord(currentShape.sphere);
    const nextSphere: Record<string, unknown> = { ...sphere };
    if (shape.diameter !== undefined && shape.diameter !== null) nextSphere.diameter = shape.diameter;
    modeledShape.sphere = nextSphere;
  } else {
    const box = asRecord(currentShape.box);
    const nextBox: Record<string, unknown> = { ...box };
    if (shape.length !== undefined && shape.length !== null) nextBox.sizeLen = shape.length;
    if (shape.width !== undefined && shape.width !== null) nextBox.sizeWidth = shape.width;
    if (shape.height !== undefined && shape.height !== null) nextBox.sizeHeight = shape.height;
    modeledShape.box = nextBox;
  }
  generalAttr.moduleShape = modeledShape;
}

function mapRawComponentToCmodel(component: Record<string, unknown>): Record<string, unknown> {
  const rawComponent = cloneJson(asRecord(component.rawCmodelComponent));
  const generalAttr = asRecord(rawComponent.generalAttr ?? rawComponent.general_attr);
  const currentName = getProtoString(generalAttr, "moduleName");
  const currentAlias = getProtoString(generalAttr, "moduleDesc");
  const nextName = getString(component, "name");
  const nextAlias = getString(component, "alias");

  if (nextName && nextName !== currentName) {
    setProtoStringAttr(generalAttr, "moduleName", nextName);
  }
  const projectedAlias = currentAlias || currentName;
  if (nextAlias && nextAlias !== projectedAlias) {
    setProtoStringAttr(generalAttr, "moduleDesc", nextAlias);
  }
  mergeRawShape(generalAttr, component);
  rawComponent.generalAttr = generalAttr;

  const poseKeys: Array<[string, string]> = [
    ["locCoordX", "mountX"],
    ["locCoordY", "mountY"],
    ["locCoordZ", "mountZ"],
    ["locCoordROLL", "mountRoll"],
    ["locCoordPITCH", "mountPitch"],
    ["locCoordYAW", "mountYaw"],
  ];
  for (const [paramKey, componentKey] of poseKeys) {
    const value = getNumber(component, componentKey, NaN);
    setExtendDoubleParam(rawComponent, paramKey, value);
  }
  if (component.parentNodeUuid !== undefined) {
    setExtendComboParam(rawComponent, "parentNodeUuid", getString(component, "parentNodeUuid"));
  }

  mergeRawPrivateAttrs(rawComponent, component);
  mergeRawInterfaces(rawComponent, component);
  if (component.interfaceAbility !== undefined) {
    rawComponent.interfaceAbility = cloneJson(component.interfaceAbility);
  }
  if (typeof component.disabled === "boolean") {
    rawComponent.boolDisable = component.disabled;
  }
  if (typeof component.deprecated === "boolean") {
    rawComponent.boolDeprecated = component.deprecated;
  }

  return rawComponent;
}

function mapComponentToCmodel(component: Record<string, unknown>): Record<string, unknown> {
  if (Object.keys(asRecord(component.rawCmodelComponent)).length > 0) {
    return mapRawComponentToCmodel(component);
  }
  return {
    generalAttr: buildComponentGeneralAttr(component),
    privateAttr: buildComponentPrivateAttrs(component),
    interfaceAbility: component.interfaceAbility ?? { busInterfaceAbility: [] },
    interfaceParams: { interfaceGroup: buildComponentInterfaceGroups(component) },
    structParam: { extendParams: buildComponentExtendParams(component) },
  };
}

function buildRawModuleGroup(groupComponents: Record<string, unknown>[]): Record<string, unknown> {
  const first = groupComponents[0] || {};
  const rawGroup = asRecord(first.rawModuleGroup);
  return {
    moduleGroupName: getString(rawGroup, "moduleGroupName", getString(first, "moduleGroupName", getString(first, "name"))),
    moduleGroupUuid: getString(rawGroup, "moduleGroupUuid", getString(first, "moduleGroupUuid")),
    moduleSys: getString(rawGroup, "moduleSys"),
    modelVersion: getString(rawGroup, "modelVersion"),
    moduleComponets: groupComponents
      .slice()
      .sort((a, b) => getNumber(a, "rawComponentIndex") - getNumber(b, "rawComponentIndex"))
      .map((component) => mapComponentToCmodel(component)),
    moreModuleInfo: [],
  };
}

function canBuildFromRawModuleGroups(components: Record<string, unknown>[]): boolean {
  return components.length > 0 && components.every((component) => Object.keys(asRecord(component.rawCmodelComponent)).length > 0);
}

function buildModuleGroup(
  component: Record<string, unknown>,
  allComponents: Record<string, unknown>[],
): Record<string, unknown> {
  const componentId = getString(component, "id");
  const children = allComponents.filter((item) => item.parentNodeUuid === componentId);
  const groupName = getString(component, "moduleGroupName", getString(component, "name"));
  return {
    moduleGroupName: groupName,
    moduleGroupUuid: componentId,
    moduleComponets: [mapComponentToCmodel(component)],
    moreModuleInfo: children.map((child) => buildModuleGroup(child, allComponents)),
  };
}

function buildFrontendCompDesc(config: Record<string, unknown>): Record<string, unknown> {
  const identity = asRecord(config.identity);
  const components = Array.isArray(config.components) ? (config.components.map(asRecord) as Record<string, unknown>[]) : [];
  if (canBuildFromRawModuleGroups(components)) {
    const rawMeta = asRecord(config.rawCompDescMeta);
    const groups = new Map<number, Record<string, unknown>[]>();
    for (const component of components) {
      const index = getNumber(component, "rawModuleGroupIndex");
      groups.set(index, [...(groups.get(index) || []), component]);
    }
    return {
      moduleGroupName: getString(rawMeta, "moduleGroupName"),
      moduleGroupUuid: getString(rawMeta, "moduleGroupUuid"),
      moduleSys: getString(rawMeta, "moduleSys"),
      modelVersion: getString(rawMeta, "modelVersion"),
      moduleComponets: [],
      moreModuleInfo: [...groups.entries()]
        .sort(([left], [right]) => left - right)
        .map(([, groupComponents]) => buildRawModuleGroup(groupComponents)),
    };
  }
  const rootComponents = components.filter((component) => !component.parentNodeUuid);
  return {
    moduleGroupName: getString(identity, "robotName"),
    modelVersion: "",
    moreModuleInfo: rootComponents.map((component) => buildModuleGroup(component, components)),
  };
}

function buildExportedAbilities(abilitiesInput: unknown): Record<string, unknown> {
  const abilities = asRecord(abilitiesInput);
  const componentAbility = Array.isArray(abilities.componentAbility) ? abilities.componentAbility : [];
  const functionAbility = Array.isArray(abilities.functionAbility) ? abilities.functionAbility : [];
  if (!componentAbility.length && !functionAbility.length) {
    return { version: getString(abilities, "version"), componentAbility: [], functionAbility: [] };
  }
  return {
    version: getString(abilities, "version"),
    componentAbility,
    functionAbility: functionAbility.map((functionInput) => {
      const fn = asRecord(functionInput);
      const children = Array.isArray(fn.childFunction) ? fn.childFunction : [];
      return {
        type: getString(fn, "type"),
        desc: getString(fn, "desc"),
        tips: getString(fn, "tips"),
        childFunction: children.map((childInput) => {
          const child = asRecord(childInput);
          const attrs = Array.isArray(child.attr) ? child.attr : [];
          return {
            type: getString(child, "type", getString(child, "key")),
            desc: getString(child, "desc"),
            tips: getString(child, "tips"),
            key: getString(child, "key"),
            attr: attrs.map((attribute) => mapAttributeToCmodel(attribute, true)),
            cloneEnable: child.cloneEnable ?? false,
          };
        }),
      };
    }),
  };
}

function makeImportedProjectId(fileName: string): string {
  const stem = fileName.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_]+/g, "_").slice(0, 24) || "cmodel";
  return `import_${stem}_${crypto.randomUUID().slice(0, 8)}`;
}

function buildSandboxRecord(projectId: string, configInput: unknown, previous?: SandboxRecord): SandboxRecord {
  const config = asRecord(configInput);
  const components = Array.isArray(config.components) ? (config.components as Record<string, unknown>[]) : [];
  const now = new Date().toISOString();
  const sourceKind = previous?.sourceKind === "imported" || config.rawCompDescMeta ? "imported" : "frontend";
  const fullJson = buildFrontendCompDesc(config);
  const abilities = config.rawAbiSet !== undefined
    ? config.rawAbiSet
    : previous?.sourceKind === "imported"
      ? previous.abilities
      : config.abilities !== undefined
        ? buildExportedAbilities(config.abilities)
        : previous?.abilities ?? {};
  const hasExplicitFunctions = config.rawFuncDesc !== undefined || config.functionProcesses !== undefined;
  const functions = hasExplicitFunctions ? extractFunctions(config) : previous?.functions ?? {};

  return {
    projectId,
    sourceKind,
    config,
    components,
    abilities,
    functions,
    rawFuncDesc: config.rawFuncDesc !== undefined ? config.rawFuncDesc : previous?.rawFuncDesc,
    rawModelFileDesc: config.rawModelFileDesc !== undefined ? config.rawModelFileDesc : previous?.rawModelFileDesc,
    fullJson,
    createdAt: previous?.createdAt || now,
    updatedAt: now,
  };
}

async function readSandbox(env: Env, projectId: string): Promise<SandboxRecord | null> {
  return env.AMR_PROJECTS.get<SandboxRecord>(sandboxKey(projectId), "json");
}

const PROTO_TO_OBJECT_OPTIONS = {
    defaults: true,
    enums: String,
    longs: String,
    bytes: String,
    oneofs: true,
  };

function decodeCompDesc(bytes: Uint8Array): unknown {
  const decoded = AMR_MODEL_NSP.Message_Module_Info.decode(bytes);
  return AMR_MODEL_NSP.Message_Module_Info.toObject(decoded, PROTO_TO_OBJECT_OPTIONS);
}

function decodeAbiSet(bytes: Uint8Array): unknown {
  const decoded = MODEL_ABI.Controller_Ability.decode(bytes);
  return MODEL_ABI.Controller_Ability.toObject(decoded, PROTO_TO_OBJECT_OPTIONS);
}

function decodeFuncDesc(bytes: Uint8Array): unknown {
  const decoded = MODEL_DES.Robot_Description.decode(bytes);
  return MODEL_DES.Robot_Description.toObject(decoded, PROTO_TO_OBJECT_OPTIONS);
}

function encodeCompDesc(payload: unknown): Uint8Array {
  return AMR_MODEL_NSP.Message_Module_Info.encode(
    AMR_MODEL_NSP.Message_Module_Info.fromObject(asRecord(payload)),
  ).finish();
}

function encodeAbiSet(payload: unknown): Uint8Array {
  return MODEL_ABI.Controller_Ability.encode(MODEL_ABI.Controller_Ability.fromObject(asRecord(payload))).finish();
}

function encodeFuncDesc(payload: unknown): Uint8Array {
  return MODEL_DES.Robot_Description.encode(MODEL_DES.Robot_Description.fromObject(asRecord(payload))).finish();
}

function md5Hex(bytes: Uint8Array): string {
  return md5(bytes);
}

function buildModelFileDesc(
  rawInput: unknown,
  generatedFiles: Array<Record<string, unknown>>,
): Record<string, unknown> {
  const raw = cloneJson(asRecord(rawInput));
  const rawEntries = Array.isArray(raw.ModelFileDesc) ? (raw.ModelFileDesc as Record<string, unknown>[]) : [];
  if (rawEntries.length === 0) {
    return { ...raw, ModelFileDesc: generatedFiles };
  }

  const generatedByName = new Map(generatedFiles.map((entry) => [getString(entry, "name"), entry]));
  const used = new Set<string>();
  const merged: Record<string, unknown>[] = rawEntries.map((rawEntryInput) => {
    const rawEntry = asRecord(rawEntryInput);
    const name = getString(rawEntry, "name");
    const generated = generatedByName.get(name);
    if (!generated) {
      throw new Error(`UNPRESERVED_MANIFEST_ENTRY: ${name || "<empty-name>"}`);
    }
    used.add(name);
    return { ...cloneJson(rawEntry), md5: generated.md5 };
  });
  for (const generated of generatedFiles) {
    const name = getString(generated, "name");
    if (!used.has(name)) merged.push(generated);
  }
  return { ...raw, ModelFileDesc: merged };
}

function getZipEntry(entries: Record<string, Uint8Array>, name: string): Uint8Array | null {
  return entries[name] || entries[`./${name}`] || null;
}

async function writeSandbox(env: Env, sandbox: SandboxRecord): Promise<void> {
  sandbox.updatedAt = new Date().toISOString();
  await env.AMR_PROJECTS.put(sandboxKey(sandbox.projectId), JSON.stringify(sandbox), {
    metadata: {
      projectId: sandbox.projectId,
      updatedAt: sandbox.updatedAt,
      componentCount: sandbox.components.length,
    },
  });
}

function matchComponentPath(pathname: string): { projectId: string; moduleUuid: string } | null {
  const match = pathname.match(/^\/api\/v1\/models\/([^/]+)\/components\/([^/]+)$/);
  if (!match) {
    return null;
  }
  const projectId = safePathId(match[1]);
  const moduleUuid = safePathId(match[2]);
  if (!projectId || !moduleUuid) {
    return null;
  }
  return { projectId, moduleUuid };
}

function matchProjectSubresource(pathname: string, subresource: string): string | null {
  const match = pathname.match(new RegExp(`^/api/v1/models/([^/]+)/${subresource}$`));
  return safePathId(match?.[1]);
}

async function listKvSavedProjects(env: Env): Promise<SavedProjectIndexItem[]> {
  const listed = await env.AMR_PROJECTS.list({ prefix: "project:" });
  return listed.keys.map((key) => {
    const metadata = (key.metadata || {}) as Record<string, unknown>;
    return {
      name: key.name.slice("project:".length),
      mtime: typeof metadata.mtime === "number" ? metadata.mtime : 0,
      robotName: typeof metadata.robotName === "string" ? metadata.robotName : undefined,
      source: "kv",
    };
  });
}

async function listSavedProjects(env: Env, request: Request): Promise<Response> {
  const snapshots = await readAssetJson<SavedProjectIndexItem[]>(
    env,
    request,
    "/worker-data/user-saves-index.json",
    [],
  );
  const merged = new Map<string, SavedProjectIndexItem>();

  for (const item of snapshots) {
    merged.set(item.name, { ...item, source: "snapshot" });
  }

  for (const item of await listKvSavedProjects(env)) {
    merged.set(item.name, item);
  }

  const projects = [...merged.values()].sort((a, b) => (b.mtime || 0) - (a.mtime || 0));
  return jsonResponse(projects);
}

async function loadSavedProject(env: Env, request: Request, name: string): Promise<Response> {
  const stored = await env.AMR_PROJECTS.get(projectKey(name), "json");
  if (stored !== null) {
    return jsonResponse(stored);
  }
  return fetchAssetJson(env, request, `/worker-data/user-saves/${name}.json`);
}

async function saveProject(request: Request, env: Env): Promise<Response> {
  let payload: SaveProjectPayload;
  try {
    payload = (await request.json()) as SaveProjectPayload;
  } catch {
    return jsonResponse({ error: "INVALID_JSON" }, { status: 400 });
  }

  const name = safeProjectName(payload.name);
  if (!name || payload.config === undefined || payload.config === null) {
    return jsonResponse({ error: "MISSING_NAME_OR_CONFIG" }, { status: 400 });
  }

  const config = payload.config as Record<string, unknown>;
  const robotName =
    typeof config.identity === "object" &&
    config.identity !== null &&
    typeof (config.identity as Record<string, unknown>).robotName === "string"
      ? ((config.identity as Record<string, unknown>).robotName as string)
      : undefined;
  const mtime = Date.now() / 1000;

  await env.AMR_PROJECTS.put(projectKey(name), JSON.stringify(config), {
    metadata: {
      mtime,
      robotName,
    },
  });

  return jsonResponse({ status: "success", name, mtime, source: "kv" });
}

async function initSandbox(request: Request, env: Env): Promise<Response> {
  let payload: Record<string, unknown>;
  try {
    payload = asRecord(await request.json());
  } catch {
    return jsonResponse({ error: "INVALID_JSON" }, { status: 400 });
  }

  const projectId = safePathId(typeof payload.projectId === "string" ? payload.projectId : null);
  if (!projectId || payload.config === undefined || payload.config === null) {
    return jsonResponse({ error: "MISSING_PROJECT_ID_OR_CONFIG" }, { status: 400 });
  }

  const previous = await readSandbox(env, projectId);
  const sandbox = buildSandboxRecord(projectId, payload.config, previous || undefined);
  await writeSandbox(env, sandbox);

  return jsonResponse({
    status: "success",
    project_id: projectId,
    runtime: "cloudflare-worker-typescript",
    componentCount: sandbox.components.length,
    diagnostics: [
      {
        code: "WORKER_SANDBOX_STORED",
        level: "info",
        message:
          "Frontend configuration was stored in Cloudflare KV. Imported protobuf JSON is preserved when the sandbox originated from a cmodel upload.",
      },
    ],
  });
}

async function getComponent(env: Env, projectId: string, moduleUuid: string): Promise<Response> {
  const sandbox = await readSandbox(env, projectId);
  if (!sandbox) {
    return jsonResponse({ error: "PROJECT_SANDBOX_NOT_FOUND", projectId }, { status: 404 });
  }
  const component = sandbox.components.find((item) => getComponentId(asRecord(item)) === moduleUuid);
  if (component) {
    return jsonResponse(component);
  }

  const protoSlot = findProtoComponentSlot(sandbox.fullJson, moduleUuid);
  if (!protoSlot) {
    return jsonResponse({ error: "COMPONENT_NOT_FOUND", projectId, moduleUuid }, { status: 404 });
  }
  return jsonResponse(protoSlot.component);
}

async function updateComponent(
  request: Request,
  env: Env,
  projectId: string,
  moduleUuid: string,
): Promise<Response> {
  const sandbox = await readSandbox(env, projectId);
  if (!sandbox) {
    return jsonResponse({ status: "error", error: "PROJECT_SANDBOX_NOT_FOUND", projectId }, { status: 404 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ status: "error", error: "INVALID_JSON" }, { status: 400 });
  }
  const normalizedPayload = asRecord(normalizeProtoPatch(payload));

  let updated = false;
  sandbox.components = sandbox.components.map((item) => {
    const component = asRecord(item);
    if (getComponentId(component) !== moduleUuid) {
      return item;
    }
    updated = true;
    return applyProtoPatchToFrontendComponent(component, normalizedPayload);
  });

  const protoSlot = findProtoComponentSlot(sandbox.fullJson, moduleUuid);
  if (protoSlot) {
    protoSlot.parentArray[protoSlot.index] = deepMerge(protoSlot.component, normalizedPayload) as Record<string, unknown>;
    updated = true;
  }

  if (!updated) {
    return jsonResponse({ status: "error", error: "COMPONENT_NOT_FOUND", projectId, moduleUuid }, { status: 404 });
  }

  sandbox.config = { ...sandbox.config, components: sandbox.components };
  if (sandbox.components.length > 0) {
    sandbox.fullJson = buildFrontendCompDesc(sandbox.config);
  }
  await writeSandbox(env, sandbox);
  return jsonResponse({ status: "success", project_id: projectId, module_uuid: moduleUuid });
}

async function getAbilities(env: Env, projectId: string): Promise<Response> {
  const sandbox = await readSandbox(env, projectId);
  if (!sandbox) {
    return jsonResponse({ error: "PROJECT_SANDBOX_NOT_FOUND", projectId }, { status: 404 });
  }
  return jsonResponse(sandbox.abilities ?? {});
}

async function updateAbilities(request: Request, env: Env, projectId: string): Promise<Response> {
  const sandbox = await readSandbox(env, projectId);
  if (!sandbox) {
    return jsonResponse({ status: "error", error: "PROJECT_SANDBOX_NOT_FOUND", projectId }, { status: 404 });
  }
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ status: "error", error: "INVALID_JSON" }, { status: 400 });
  }
  sandbox.abilities = Array.isArray(payload) ? { functionAbility: payload, version: "1.0" } : payload;
  sandbox.config = { ...sandbox.config, abilities: sandbox.abilities };
  await writeSandbox(env, sandbox);
  return jsonResponse({ status: "success", project_id: projectId });
}

async function getFunctions(env: Env, projectId: string): Promise<Response> {
  const sandbox = await readSandbox(env, projectId);
  if (!sandbox) {
    return jsonResponse({ error: "PROJECT_SANDBOX_NOT_FOUND", projectId }, { status: 404 });
  }
  return jsonResponse(sandbox.functions ?? {});
}

async function uploadCmodel(request: Request, env: Env): Promise<Response> {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonResponse({ error: "INVALID_MULTIPART_FORM" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return jsonResponse({ error: "MISSING_FILE" }, { status: 400 });
  }

  const audit: string[] = [`IMPORT_START: ${file.name} (${file.size} bytes)`];
  let entries: Record<string, Uint8Array>;
  try {
    entries = unzipSync(new Uint8Array(await file.arrayBuffer()));
  } catch (error) {
    return jsonResponse(
      {
        status: "error",
        error: "INVALID_CMODEL_ZIP",
        detail: error instanceof Error ? error.message : String(error),
        audit,
      },
      { status: 400 },
    );
  }

  const compBytes = getZipEntry(entries, "CompDesc.model");
  if (!compBytes) {
    return jsonResponse(
      {
        status: "error",
        error: "MISSING_COMP_DESC_MODEL",
        audit,
        entries: Object.keys(entries),
      },
      { status: 400 },
    );
  }

  let fullJson: unknown;
  let abilities: unknown = {};
  let functions: unknown = {};

  try {
    fullJson = decodeCompDesc(compBytes);
    audit.push(`  - Generated CompDesc.json via Worker TS: ${JSON.stringify(fullJson).length} chars`);
  } catch (error) {
    return jsonResponse(
      {
        status: "error",
        error: "COMP_DESC_PROTOBUF_PARSE_FAILED",
        detail: error instanceof Error ? error.message : String(error),
        audit,
      },
      { status: 400 },
    );
  }

  const abiBytes = getZipEntry(entries, "AbiSet.model");
  if (abiBytes) {
    try {
      abilities = decodeAbiSet(abiBytes);
      audit.push(`  - Generated AbiSet.json via Worker TS: ${JSON.stringify(abilities).length} chars`);
    } catch (error) {
      audit.push(`WARN: AbiSet.model parse failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  } else {
    audit.push("WARN: AbiSet.model not found");
  }

  const funcBytes = getZipEntry(entries, "FuncDesc.model");
  if (funcBytes) {
    try {
      functions = decodeFuncDesc(funcBytes);
      audit.push(`  - Generated FuncDesc.json via Worker TS: ${JSON.stringify(functions).length} chars`);
    } catch (error) {
      audit.push(`WARN: FuncDesc.model parse failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  } else {
    audit.push("WARN: FuncDesc.model not found");
  }

  let rawModelFileDesc: unknown = {};
  const modelFileDescBytes = getZipEntry(entries, "ModelFileDesc.json");
  if (modelFileDescBytes) {
    try {
      rawModelFileDesc = JSON.parse(new TextDecoder().decode(modelFileDescBytes));
      audit.push("  - Preserved ModelFileDesc.json metadata");
    } catch (error) {
      return jsonResponse(
        {
          status: "error",
          error: "MODEL_FILE_DESC_PARSE_FAILED",
          detail: error instanceof Error ? error.message : String(error),
          audit,
        },
        { status: 400 },
      );
    }
  }

  const projectId = makeImportedProjectId(file.name);
  const now = new Date().toISOString();
  const sandbox: SandboxRecord = {
    projectId,
    sourceKind: "imported",
    config: {},
    components: [],
    abilities,
    functions,
    rawFuncDesc: functions,
    rawModelFileDesc,
    fullJson,
    importAudit: audit,
    createdAt: now,
    updatedAt: now,
  };
  await writeSandbox(env, sandbox);

  return jsonResponse({
    status: "success",
    project_id: projectId,
    runtime: "cloudflare-worker-typescript",
    full_json: fullJson,
    audit,
    parsed_models: {
      compDesc: true,
      abiSet: Boolean(abiBytes),
      funcDesc: Boolean(funcBytes),
    },
  });
}

async function compileCmodel(env: Env, projectId: string): Promise<Response> {
  const sandbox = await readSandbox(env, projectId);
  if (!sandbox) {
    return jsonResponse({ status: "error", error: "PROJECT_SANDBOX_NOT_FOUND", projectId }, { status: 404 });
  }
  if (!sandbox.fullJson) {
    return jsonResponse(
      {
        error: "COMPILE_REQUIRES_PROTOBUF_JSON",
        message:
          "Worker compile currently requires an imported/decoded CompDesc JSON. Frontend-only config to CompDesc protobuf generation is not migrated yet.",
        migratedEndpoints: MIGRATED_ENDPOINTS,
      },
      { status: 501 },
    );
  }

  const audit: string[] = [];
  if (sandbox.components.length > 0) {
    sandbox.fullJson = buildFrontendCompDesc({ ...sandbox.config, components: sandbox.components });
  }

  let compModel: Uint8Array;
  try {
    compModel = encodeCompDesc(sandbox.fullJson);
  } catch (error) {
    return jsonResponse(
      {
        status: "error",
        error: "COMP_DESC_PROTOBUF_ENCODE_FAILED",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
  const files: Record<string, Uint8Array> = {
    "CompDesc.model": compModel,
  };
  const manifestFiles = [
    {
      md5: md5Hex(compModel),
      name: "CompDesc.model",
      type: "MODEL_COMP",
      version: "1.0",
    },
  ];
  audit.push(`CompDesc.model built by Worker TS: ${compModel.byteLength} bytes`);

  const abilities = asRecord(sandbox.abilities);
  if (Object.keys(abilities).length > 0) {
    let abiModel: Uint8Array;
    try {
      abiModel = encodeAbiSet(abilities);
    } catch (error) {
      return jsonResponse(
        {
          status: "error",
          error: "ABI_SET_PROTOBUF_ENCODE_FAILED",
          detail: error instanceof Error ? error.message : String(error),
        },
        { status: 500 },
      );
    }
    files["AbiSet.model"] = abiModel;
    manifestFiles.push({
      md5: md5Hex(abiModel),
      name: "AbiSet.model",
      type: "MODEL_ABI",
      version: "1.0",
    });
    audit.push(`AbiSet.model built by Worker TS: ${abiModel.byteLength} bytes`);
  }

  const functions = asRecord(sandbox.functions);
  if (Object.keys(functions).length > 0) {
    let funcModel: Uint8Array;
    try {
      funcModel = encodeFuncDesc(functions);
    } catch (error) {
      return jsonResponse(
        {
          status: "error",
          error: "FUNC_DESC_PROTOBUF_ENCODE_FAILED",
          detail: error instanceof Error ? error.message : String(error),
        },
        { status: 500 },
      );
    }
    files["FuncDesc.model"] = funcModel;
    manifestFiles.push({
      md5: md5Hex(funcModel),
      name: "FuncDesc.model",
      type: "MODEL_FUNC",
      version: "1.0",
    });
    audit.push(`FuncDesc.model built by Worker TS: ${funcModel.byteLength} bytes`);
  }

  let manifestPayload: Record<string, unknown>;
  try {
    manifestPayload = buildModelFileDesc(sandbox.rawModelFileDesc, manifestFiles);
  } catch (error) {
    return jsonResponse(
      {
        status: "error",
        error: "MODEL_FILE_DESC_PRESERVATION_FAILED",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 422 },
    );
  }
  const manifest = new TextEncoder().encode(JSON.stringify(manifestPayload, null, 2));
  files["ModelFileDesc.json"] = manifest;

  const archive = zipSync(files, { level: 6 });
  const artifactName = `${projectId}_packed.cmodel`;
  await env.AMR_PROJECTS.put(artifactKey(projectId, artifactName), archive.buffer as ArrayBuffer, {
    metadata: {
      projectId,
      artifactName,
      byteLength: archive.byteLength,
      createdAt: new Date().toISOString(),
    },
  });

  return jsonResponse({
    status: "success",
    project_id: projectId,
    runtime: "cloudflare-worker-typescript",
    // Keep the artifact under /api/v1 so the AMR-specific route wins over
    // the shared /downloads/* route owned by another Worker.
    download_url: `/api/v1/models/${projectId}/artifacts/${artifactName}`,
    audit,
  });
}

async function downloadArtifact(env: Env, pathname: string): Promise<Response | null> {
  const match = pathname.match(/^\/downloads\/([^/]+)\/([^/]+)$/)
    || pathname.match(/^\/api\/v1\/models\/([^/]+)\/artifacts\/([^/]+)$/);
  if (!match) {
    return null;
  }
  const projectId = safePathId(match[1]);
  const artifactName = safePathId(match[2]);
  if (!projectId || !artifactName) {
    return jsonResponse({ error: "INVALID_DOWNLOAD_PATH" }, { status: 400 });
  }
  const artifact = await env.AMR_PROJECTS.get(artifactKey(projectId, artifactName), "arrayBuffer");
  if (!artifact) {
    return jsonResponse({ error: "ARTIFACT_NOT_FOUND", projectId, artifactName }, { status: 404 });
  }
  return new Response(artifact, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${artifactName}"`,
      "Access-Control-Allow-Origin": "*",
    },
  });
}

async function handleApi(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const { pathname } = url;
  const method = request.method.toUpperCase();

  if (method === "OPTIONS") {
    return optionsResponse();
  }

  const apiArtifactResponse = await downloadArtifact(env, pathname);
  if (apiArtifactResponse) {
    return apiArtifactResponse;
  }

  if (method === "GET" && pathname === "/api/v1/system/version") {
    return jsonResponse({
      backendVersion: "1.0.1-worker-ts",
      buildDate: "2026-07-11",
      commitHash: "worker-ts-edge",
      serviceStartTime: SERVICE_START_TIME,
      runtime: "cloudflare-worker-typescript",
      migratedEndpoints: MIGRATED_ENDPOINTS,
    });
  }

  if (method === "GET" && pathname === "/api/v1/schemas") {
    return fetchAssetJson(env, request, "/worker-data/schemas.json");
  }

  if (method === "GET" && pathname === "/api/v1/resources/boards") {
    return fetchAssetJson(env, request, "/worker-data/boards.json");
  }

  if (method === "GET" && pathname === "/api/v1/projects/saved-list") {
    return listSavedProjects(env, request);
  }

  const savedProjectName = getSavedProjectName(pathname);
  if (method === "GET" && savedProjectName) {
    return loadSavedProject(env, request, savedProjectName);
  }

  if (method === "POST" && pathname === "/api/v1/projects/save") {
    return saveProject(request, env);
  }

  if (method === "POST" && pathname === "/api/v1/models/init-sandbox") {
    return initSandbox(request, env);
  }

  const componentPath = matchComponentPath(pathname);
  if (componentPath && method === "GET") {
    return getComponent(env, componentPath.projectId, componentPath.moduleUuid);
  }
  if (componentPath && method === "PATCH") {
    return updateComponent(request, env, componentPath.projectId, componentPath.moduleUuid);
  }

  const abilitiesProjectId = matchProjectSubresource(pathname, "abilities");
  if (abilitiesProjectId && method === "GET") {
    return getAbilities(env, abilitiesProjectId);
  }
  if (abilitiesProjectId && method === "PATCH") {
    return updateAbilities(request, env, abilitiesProjectId);
  }

  const functionsProjectId = matchProjectSubresource(pathname, "functions");
  if (functionsProjectId && method === "GET") {
    return getFunctions(env, functionsProjectId);
  }

  if (method === "POST" && pathname === "/api/v1/models/upload") {
    return uploadCmodel(request, env);
  }

  const compileProjectId = matchProjectSubresource(pathname, "compile");
  if (compileProjectId && method === "POST") {
    return compileCmodel(env, compileProjectId);
  }

  if (compileProjectId) {
    return notMigratedResponse(`${method} ${pathname}`);
  }

  return notFoundResponse(pathname);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      return handleApi(request, env);
    }

    const artifactResponse = await downloadArtifact(env, url.pathname);
    if (artifactResponse) {
      return artifactResponse;
    }

    return env.ASSETS.fetch(request);
  },
};
