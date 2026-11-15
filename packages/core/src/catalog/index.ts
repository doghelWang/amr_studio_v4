/**
 * The module catalog: one registry of product templates, organised main type → sub type → product.
 * Built by scripts/gen-catalog.mjs from catalog/modules and catalog/boards.
 */
import { decode, type ModuleInfo } from '../proto/index';

export interface CatalogEntry {
  id: string; name: string; desc: string; sys: string; subSys: string;
  mainType: string; subType: string; vendor: string; product: string;
  /** Number of modules the template adds (more than one for assemblies such as wheel sets). */
  components: number;
  interfaces: string;
  /** base64 of the template in wire form (Message_Module_Info). */
  data: string;
}
export interface CatalogData { modules: CatalogEntry[]; boards: Record<string, unknown> }

const fromBase64 = (s: string): Uint8Array => {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
};

export class Catalog {
  constructor(private readonly data: CatalogData) {}
  get entries(): CatalogEntry[] { return this.data.modules; }
  get boards(): Record<string, unknown> { return this.data.boards; }
  byId(id: string): CatalogEntry | undefined { return this.data.modules.find((m) => m.id === id); }
  /** main type → sub type → entries */
  tree(): Map<string, Map<string, CatalogEntry[]>> {
    const t = new Map<string, Map<string, CatalogEntry[]>>();
    for (const e of this.data.modules) {
      const main = t.get(e.mainType) ?? t.set(e.mainType, new Map()).get(e.mainType)!;
      (main.get(e.subType) ?? main.set(e.subType, []).get(e.subType)!).push(e);
    }
    return t;
  }
  search(q: string): CatalogEntry[] {
    const s = q.trim().toLowerCase();
    if (!s) return this.data.modules;
    return this.data.modules.filter((e) => [e.id, e.name, e.desc, e.mainType, e.subType, e.vendor, e.product].some((f) => f.toLowerCase().includes(s)));
  }
  /** Decode a template, ready for `addTemplate`. */
  template(id: string): ModuleInfo {
    const e = this.byId(id);
    if (!e) throw new Error(`Unknown catalog entry "${id}"`);
    return decode('comp', fromBase64(e.data));
  }
}

/** Load the generated catalog (a separate chunk in the browser). */
export async function loadCatalog(): Promise<Catalog> {
  const mod = await import('../../generated/catalog.json');
  return new Catalog((mod.default ?? mod) as unknown as CatalogData);
}
