import protobuf from 'protobufjs/light.js';
import Long from 'long';
import schema from './schema.json';
import type { ModuleInfo, RobotDescription } from './types';

// 64-bit fields must survive a round trip exactly, in the browser as well as in Node.
protobuf.util.Long = Long as never;
protobuf.configure();

const root = (j: unknown) => protobuf.Root.fromJSON(j as protobuf.INamespace);
export const CompType = root(schema.comp).lookupType('AMR_MODEL_NSP.Message_Module_Info');
export const ComponentType = root(schema.comp).lookupType('AMR_MODEL_NSP.Message_Module_Componets');
export const FuncType = root(schema.func).lookupType('MODEL_DES.Robot_Description');
export const AbiType = root(schema.abi).lookupType('MODEL_ABI.Controller_Ability');

export type FileKind = 'comp' | 'func' | 'abi';
const TYPES: Record<FileKind, protobuf.Type> = { comp: CompType, func: FuncType, abi: AbiType };

export function decode(kind: 'comp', bytes: Uint8Array): ModuleInfo;
export function decode(kind: 'func', bytes: Uint8Array): RobotDescription;
export function decode(kind: 'abi', bytes: Uint8Array): Record<string, unknown>;
export function decode(kind: FileKind, bytes: Uint8Array): unknown;
export function decode(kind: FileKind, bytes: Uint8Array): unknown {
  return TYPES[kind].decode(bytes);
}
export function encode(kind: FileKind, message: unknown): Uint8Array {
  return TYPES[kind].encode(message as protobuf.Message).finish();
}
/** Plain-object form (enums as names, 64-bit as strings) for display, diff and JSON export. */
export function toPlain(kind: FileKind, message: unknown): Record<string, unknown> {
  return TYPES[kind].toObject(message as protobuf.Message, { enums: String, longs: String, bytes: String, defaults: false, oneofs: false });
}
export * from './types';
