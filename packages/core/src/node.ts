/** Node-only helpers (CLI, tests). */
import { readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';
import { openCmodel, saveCmodel, type Project } from './codec/cmodel';

export const readCmodel = (path: string): Project => openCmodel(new Uint8Array(readFileSync(path)), basename(path));
export const writeCmodel = (path: string, p: Project): void => writeFileSync(path, saveCmodel(p));
