import { useEffect, useMemo, useRef, useState } from 'react';
import {
  addTemplate, bindings, diffProjects, findModule, functionList, modules, nameOf, openCmodel, setBinding,
  type CatalogEntry, type Change, type Level, type Project,
} from '@amr/core';
import { idOf, useStore } from '../store';

/* ───────── Functions ───────── */

export function FunctionsTab() {
  const { project, rev, edit, select, notify } = useStore();
  const data = useMemo(() => {
    if (!project) return null;
    const names = modules(project).map((m) => nameOf(m.comp));
    const groups = new Map<string, ReturnType<typeof bindings>>();
    for (const b of bindings(project)) {
      const k = `${b.func} / ${b.childDesc || b.child}`;
      (groups.get(k) ?? groups.set(k, []).get(k)!).push(b);
    }
    return { names, groups: [...groups], fns: functionList(project) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, rev]);
  if (!project || !data) return null;
  const known = new Set(data.names);
  return (
    <div className="functions">
      <p className="muted">Which module serves which function. These bindings are stored in the function description file.</p>
      {data.groups.length === 0 && <p className="empty">This model has no function bindings.</p>}
      {data.groups.map(([title, list]) => (
        <section key={title} className="bus">
          <h3>{title}</h3>
          <table>
            <thead><tr><th>Binding</th><th>Group</th><th>Module</th><th /></tr></thead>
            <tbody>
              {list.map((b, i) => {
                const missing = !!b.module && b.module !== 'NONE' && !known.has(b.module);
                return (
                  <tr key={i} className={missing ? 'bad' : ''}>
                    <td>{b.key}</td>
                    <td className="muted">{b.groupName}</td>
                    <td>
                      <select value={b.module} aria-label={`${title} ${b.key}`} onChange={(e) => { const err = edit((p) => setBinding(p, b, e.target.value)); if (err) notify('error', err); }}>
                        {missing && <option value={b.module}>{b.module} (missing)</option>}
                        <option value="NONE">NONE</option>
                        {b.module === '' && <option value="">(not set)</option>}
                        {data.names.map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </td>
                    <td className="right">{known.has(b.module) && <button className="link" onClick={() => select(idOf(findModule(project, b.module)!), 'properties')}>Open</button>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      ))}
      <section className="bus">
        <h3>Configured functions</h3>
        <p className="chips">{data.fns.map((f, i) => <span key={i} className="tag" title={f.desc}>{f.func}/{f.child}</span>)}</p>
      </section>
    </div>
  );
}

/* ───────── Validate ───────── */

export function ValidateTab() {
  const { project, report, select } = useStore();
  const [levels, setLevels] = useState<Record<Level, boolean>>({ error: true, warning: true, info: false });
  if (!project || !report) return null;
  const shown = report.findings.filter((f) => levels[f.level]);
  const count: Record<Level, number> = { error: report.errors, warning: report.warnings, info: report.infos };
  return (
    <div className="validate">
      <div className="filters">
        {(['error', 'warning', 'info'] as Level[]).map((l) => (
          <label key={l} className={`chip ${l}`}><input type="checkbox" checked={levels[l]} onChange={(e) => setLevels({ ...levels, [l]: e.target.checked })} /> {count[l]} {l === 'info' ? (count[l] === 1 ? 'note' : 'notes') : count[l] === 1 ? l : `${l}s`}</label>
        ))}
      </div>
      {report.errors + report.warnings === 0 && <p className="okline">No errors or warnings.</p>}
      <ul className="findings">
        {shown.map((f, i) => {
          const m = f.module ? findModule(project, f.module) : undefined;
          return (
            <li key={i} className={f.level}>
              <b>{f.level}</b>
              <span className="msg">{f.message}</span>
              <span className="where">
                {m ? <button className="link" onClick={() => select(idOf(m), 'properties')}>{f.module}</button> : f.module}
                {f.path && <code>{f.path}</code>}
                <code className="rule">{f.rule}</code>
              </span>
            </li>
          );
        })}
      </ul>
      {shown.length === 0 && report.findings.length > 0 && <p className="muted">Nothing at the selected levels.</p>}
    </div>
  );
}

/* ───────── Compare ───────── */

const val = (v: unknown) => (v === undefined ? <span className="muted">—</span> : String(v));
function Changes({ list }: { list: Change[] }) {
  const [all, setAll] = useState(false);
  const shown = all ? list : list.slice(0, 60);
  return (
    <>
      <table className="diff">
        <tbody>{shown.map((c) => <tr key={c.path}><td className="path">{c.path}</td><td className="a">{val(c.a)}</td><td className="b">{val(c.b)}</td></tr>)}</tbody>
      </table>
      {list.length > shown.length && <button className="link" onClick={() => setAll(true)}>Show all {list.length}</button>}
    </>
  );
}

export function CompareTab() {
  const { project, rev, compare, setCompare, notify } = useStore();
  const input = useRef<HTMLInputElement>(null);
  const diff = useMemo(() => (project && compare ? diffProjects(project, compare) : null), [project, compare, rev]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!project) return null;
  const onFile = async (file: File) => {
    try {
      setCompare(openCmodel(new Uint8Array(await file.arrayBuffer()), file.name));
    } catch (err) {
      notify('error', `${file.name}: ${(err as Error).message}`);
    }
  };
  return (
    <div className="compare">
      <div className="connect">
        <b>Compare with</b>
        <span>{compare ? compare.name : <span className="muted">no file chosen</span>}</span>
        <button className="primary" onClick={() => input.current?.click()}>{compare ? 'Choose another…' : 'Choose .cmodel…'}</button>
        {compare && <button className="ghost" onClick={() => setCompare(null)}>Clear</button>}
        <input ref={input} type="file" accept=".cmodel,.zip" hidden data-testid="compare-input" onChange={(e) => { const f = e.target.files?.[0]; if (f) void onFile(f); e.target.value = ''; }} />
      </div>
      {!diff && <p className="empty">Choose a second .cmodel to see what differs from <b>{project.name}</b>. Modules are matched by name; UUIDs and version stamps are ignored.</p>}
      {diff && (
        <>
          <p className="summary"><b>{diff.total}</b> difference{diff.total === 1 ? '' : 's'} · A = {project.name} · B = {(compare as Project).name}</p>
          {diff.total === 0 && <p className="okline">The two models are equivalent.</p>}
          {diff.removed.length > 0 && <p><b>Only in A:</b> {diff.removed.map((n) => <span key={n} className="tag a">{n}</span>)}</p>}
          {diff.added.length > 0 && <p><b>Only in B:</b> {diff.added.map((n) => <span key={n} className="tag b">{n}</span>)}</p>}
          {diff.modules.map((m) => (
            <details key={m.module} className="section" open={diff.modules.length <= 8}>
              <summary>{m.module} <span className="muted">{m.changes.length}</span></summary>
              <Changes list={m.changes} />
            </details>
          ))}
          {([['Functions', diff.functions], ['Capability library', diff.abilities], ['Other files', diff.files]] as const).map(([title, list]) => list.length > 0 && (
            <details key={title} className="section" open={list.length <= 40}>
              <summary>{title} <span className="muted">{list.length}</span></summary>
              <Changes list={list} />
            </details>
          ))}
        </>
      )}
    </div>
  );
}

/* ───────── Catalog ───────── */

export function CatalogTab() {
  const { project, catalog, ensureCatalog, edit, select, notify } = useStore();
  const [q, setQ] = useState('');
  const [failed, setFailed] = useState<string | null>(null);
  useEffect(() => { ensureCatalog().catch((e: Error) => setFailed(e.message)); }, [ensureCatalog]);
  const groups = useMemo(() => {
    if (!catalog) return [];
    const by = new Map<string, CatalogEntry[]>();
    for (const e of catalog.search(q)) (by.get(e.mainType || 'other') ?? by.set(e.mainType || 'other', []).get(e.mainType || 'other')!).push(e);
    return [...by].sort(([a], [b]) => a.localeCompare(b));
  }, [catalog, q]);
  if (!project) return null;
  if (failed) return <p className="empty">The catalog could not be loaded: {failed}</p>;
  if (!catalog) return <p className="empty">Loading catalog…</p>;

  const add = (e: CatalogEntry) => {
    let first: string | null = null, count = 0;
    const err = edit((p) => {
      const added = addTemplate(p, catalog.template(e.id));
      first = idOf(added[0]);
      count = added.length;
    });
    if (err) return notify('error', err);
    notify('ok', count > 1 ? `Added ${count} modules from ${e.id}` : `Added ${e.name || e.id}`);
    select(first, 'properties');
  };
  return (
    <div className="catalog">
      <input className="search" placeholder={`Search ${catalog.entries.length} templates by name, type, vendor, model…`} value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search catalog" />
      {groups.length === 0 && <p className="empty">No template matches "{q}".</p>}
      {groups.map(([main, list]) => (
        <section key={main} className="bus">
          <h3>{main} <span className="muted">{list.length}</span></h3>
          <table>
            <thead><tr><th>Template</th><th>Sub type</th><th>Vendor / model</th><th>Interfaces</th><th /></tr></thead>
            <tbody>
              {list.map((e) => (
                <tr key={e.id}>
                  <td><b>{e.id}</b>{e.desc && <div className="muted">{e.desc}</div>}</td>
                  <td>{e.subType}{e.components > 1 && <div className="muted">assembly of {e.components}</div>}</td>
                  <td>{[e.vendor, e.product].filter(Boolean).join(' / ') || <span className="muted">—</span>}</td>
                  <td className="muted small">{e.interfaces || '—'}</td>
                  <td className="right"><button className="primary" onClick={() => add(e)}>Add</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}
