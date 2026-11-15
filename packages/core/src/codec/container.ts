/**
 * The `.cmodel` container (zip + ModelFileDesc.json), without any protobuf decoding.
 * Kept separate so that the Cloudflare Worker can check uploads: the Workers runtime forbids
 * run-time code generation, which protobufjs needs for decoding.
 */
import { unzipSync } from 'fflate';
import SparkMD5 from 'spark-md5';

export const DESC_FILE = 'ModelFileDesc.json';
export interface FileDescEntry { md5: string; name: string; type: string; version?: string; [k: string]: unknown }
export class CmodelError extends Error {}

export function md5Hex(bytes: Uint8Array): string {
  const buf = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  return SparkMD5.ArrayBuffer.hash(buf);
}

export interface Container { zip: Record<string, Uint8Array>; desc: FileDescEntry[]; issues: string[] }

/** Unzip and read the file description. Throws CmodelError when the bytes are not a cmodel. */
export function readContainer(bytes: Uint8Array): Container {
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
  const issues: string[] = [];
  for (const e of desc) {
    const data = zip[e.name];
    if (!data) issues.push(`${e.name} is listed in ${DESC_FILE} but missing from the archive`);
    else if (e.md5 && md5Hex(data) !== e.md5) issues.push(`${e.name}: MD5 does not match ${DESC_FILE}`);
  }
  return { zip, desc, issues };
}
