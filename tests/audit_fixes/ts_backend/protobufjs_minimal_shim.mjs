// Minimal load-time-only shim for "protobufjs/minimal.js".
//
// WHY THIS EXISTS: this environment's network egress policy blocks
// registry.npmjs.org (confirmed via `curl https://registry.npmjs.org/protobufjs`
// -> 403 "Host not in allowlist: registry.npmjs.org"), and `protobufjs` is not
// vendored anywhere in this checkout, so it cannot be installed to run the
// real generated encoder end-to-end (encode()/decode() wire format). Per the
// sandbox's own operating rules, a blocked host is reported, not routed
// around — so this shim does NOT attempt to reimplement protobufjs; it only
// supplies the handful of `$util` helpers that cloudflare/generated/protobuf_models.js
// touches at *module-load time* and inside `fromObject()`/`toObject()`
// (confirmed exhaustively by grepping every `$util.*` call site in that file),
// so that file's own real, unmodified fromObject()/toObject() logic can run.
//
// Deliberately NOT implemented with real wire-format logic: Reader/Writer
// (i.e. encode()/decode() will throw if called). This is fine for what this
// harness verifies: whether a given JS object key is recognized as the
// `interface_Group` proto field by fromObject() — that is a pure in-memory
// object-shape question, fully observable without ever touching wire bytes.
// (verify_interface_group_fix.mjs documents why this is sufficient rigor for
// this specific bug.)

function isObject(value) {
  return value !== null && typeof value === "object";
}
function isString(value) {
  return typeof value === "string" || value instanceof String;
}

export const util = {
  global: globalThis,
  isObject,
  isString,
  isInteger: (v) => typeof v === "number" && Number.isInteger(v),
  emptyArray: Object.freeze([]),
  emptyObject: Object.freeze({}),
  Long: undefined,
  LongBits: undefined,
  base64: {
    length: () => 0,
    encode: () => "",
    decode: () => 0,
  },
  newBuffer: (size) => new Uint8Array(size),
  recursionLimit: 100,
  oneOfGetter: (fieldNames) => {
    return function () {
      for (let i = fieldNames.length - 1; i > -1; --i) {
        if (this[fieldNames[i]] !== undefined && this[fieldNames[i]] !== null) return fieldNames[i];
      }
      return undefined;
    };
  },
  oneOfSetter: (fieldNames) => {
    return function (name) {
      for (const field of fieldNames) {
        if (field !== name) delete this[field];
      }
    };
  },
  makeProp: (target, fieldName) => {
    if (!(fieldName in target)) target[fieldName] = undefined;
  },
};

class Reader {
  static create() {
    throw new Error("Reader.create() not implemented in shim — this harness never calls decode().");
  }
}
class Writer {
  static create() {
    throw new Error("Writer.create() not implemented in shim — this harness never calls encode().");
  }
}

const roots = {};
const rpc = {};
function configure() {}

export default { Reader, Writer, util, roots, rpc, configure };
