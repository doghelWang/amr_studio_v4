import { unzipSync, zipSync } from 'fflate';
import SparkMD5 from 'spark-md5';
import { decode, encode, type FileKind, type ModuleInfo, type RobotDescription } from '../proto/index';

export const DESC_FILE = 'ModelFileDesc.json';
const KIND_OF: Record<string, FileKind> = { MODEL_COMP: 'comp', MODEL_FUNC: 'func', CAPABILITY: 'abi' };
const DEFAULT_FILE: Record<FileKind, string> = { comp: 'CompDesc.model', func: 'FuncDesc.model', abi: 'AbiSet.model' };
const TYPE_OF: Record<FileKind, string> = { comp: 'MODEL_COMP', func: 'MODEL_FUNC', abi: 'CAPABILITY' };

export interface FileDescEntry { md5: string; name: string; type: string; version?: string; [k: string]: unknown }

export interface Project {
  name: string;
  /** Every zip entry with its current bytes, in original order. Unknown files are carried through untouched. */
  entries: Map<string, Uint8Array>;
  desc: FileDescEntry[];
  files: Partial<Record<FileKind, string>>;
  comp: ModuleInfo;
  func: RobotDescription;
  abi: Record<string, unknown>;
  /** Kinds whose decoded message was edited since load / last commit. */
  dirty: Set<FileKind>;
  /** Problems found while opening (MD5 mismatch, missing file). */
  loadIssues: string[];
}

export class CmodelError extends Error {}

export function md5Hex(bytes: Uint8Array): string {
  const buf = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  return SparkMD5.ArrayBuffer.hash(buf);
}

export function openCmodel(bytes: Uint8Array, name = 'model'): Project {
  let zip: Record<string, Uint8Array>;
  try {
    zip = unzipSync(bytes);
  } catch {
    throw new CmodelError('Not a .cmodel file (a zip archive is expected)');
  }
  const descBytes = zip[DESC_FILE];
  if (!descBytes) throw new CmodelError(`${DESC_FILE} is missing from the archive`);
  let desc: FileDescEntry[];
  try {
    desc = JSON.parse(new TextDecoder().decode(descBytes)).ModelFileDesc;
  } catch {
    throw new CmodelError(`${DESC_FILE} is not valid JSON`);
  }
  if (!Array.isArray(desc)) throw new CmodelError(`${DESC_FILE} has no ModelFileDesc list`);

  const entries = new Map(Object.entries(zip));
  const files: Project['files'] = {};
  const loadIssues: string[] = [];
  for (const e of desc) {
    const data = zip[e.name];
    if (!data) {
      loadIssues.push(`${e.name} is listed in ${DESC_FILE} but missing from the archive`);
      continue;
    }
    if (e.md5 && md5Hex(data) !== e.md5) loadIssues.push(`${e.name}: MD5 does not match ${DESC_FILE}`);
    const kind = KIND_OF[e.type];
    if (kind && !files[kind]) files[kind] = e.name;
  }
  const load = (k: FileKind): unknown => {
    const file = files[k];
    const data = (file && zip[file]) || new Uint8Array();
    try {
      return decode(k, data);
    } catch (err) {
      throw new CmodelError(`${file} could not be decoded: ${(err as Error).message}`);
    }
  };
  return {
    name: name.replace(/\.cmodel$/i, ''),
    entries,
    desc,
    files,
    comp: load('comp') as ModuleInfo,
    func: load('func') as RobotDescription,
    abi: load('abi') as Record<string, unknown>,
    dirty: new Set(),
    loadIssues,
  };
}

/** Re-encode edited files into `entries` and refresh their MD5s. Untouched files keep their original bytes. */
export function commit(p: Project): void {
  if (p.dirty.size === 0) return;
  for (const kind of p.dirty) {
    let file = p.files[kind];
    if (!file) {
      file = DEFAULT_FILE[kind];
      p.files[kind] = file;
      p.desc.push({ md5: '', name: file, type: TYPE_OF[kind], version: '' });
    }
    const bytes = encode(kind, p[kind]);
    p.entries.set(file, bytes);
    const d = p.desc.find((e) => e.name === file);
    if (d) d.md5 = md5Hex(bytes);
  }
  p.entries.set(DESC_FILE, new TextEncoder().encode(JSON.stringify({ ModelFileDesc: p.desc }, null, 4) + '\n'));
  p.dirty.clear();
}

export function saveCmodel(p: Project): Uint8Array {
  commit(p);
  const out: Record<string, Uint8Array> = {};
  for (const [k, v] of p.entries) out[k] = v;
  return zipSync(out, { level: 6 });
}

/** Mark a decoded file as edited. Every edit operation calls this. */
export function touch(p: Project, kind: FileKind): void {
  p.dirty.add(kind);
}

/** Snapshot / restore of the decoded messages, used for undo. */
export interface Snapshot { comp: Uint8Array; func: Uint8Array; dirty: FileKind[] }
export function snapshot(p: Project): Snapshot {
  return { comp: encode('comp', p.comp), func: encode('func', p.func), dirty: [...p.dirty] };
}
export function restore(p: Project, s: Snapshot): void {
  p.comp = decode('comp', s.comp);
  p.func = decode('func', s.func);
  p.dirty = new Set(s.dirty);
}
