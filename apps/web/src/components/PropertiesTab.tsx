import { useEffect, useMemo, useState } from 'react';
import {
  interfacesOf, mainTypeOf, modules, nameOf, portIndex, portLabel, productOf, removeModule, rows, setAttr, setDisabled, subTypeOf, uuidOf,
  vendorOf, type AttrRow, type Finding, type Scalar,
} from '@amr/core';
import { selectedModule, useStore } from '../store';

/** One parameter. Commits on blur / Enter / change; a rejected value is shown next to the field and nothing is saved. */
function Field({ row, moduleNames, onCommit, finding }: { row: AttrRow; moduleNames?: Map<string, string>; onCommit: (v: Scalar) => string | null; finding?: Finding }) {
  const [draft, setDraft] = useState(String(row.value));
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { setDraft(String(row.value)); setError(null); }, [row.value]);

  const commit = (v: Scalar) => {
    if (String(v) === String(row.value)) { setError(null); return; }
    const err = onCommit(v);
    setError(err);
    if (err) setDraft(String(row.value));
  };
  const outOfRange = typeof row.value === 'number' && row.min !== undefined && row.max !== undefined && row.max > row.min && (row.value < row.min || row.value > row.max);
  const label = row.desc && row.desc !== row.key ? row.desc : row.key;
  const disabled = row.readonly || row.path === 'general/module_uuid';

  let editor: JSX.Element;
  if (row.key === 'parentNodeUuid' && moduleNames) {
    editor = (
      <select value={String(row.value)} disabled={disabled} onChange={(e) => commit(e.target.value)} aria-label={label}>
        {!moduleNames.has(String(row.value)) && <option value={String(row.value)}>{row.value ? `missing (${String(row.value).slice(0, 8)}…)` : '(none)'}</option>}
        {[...moduleNames].map(([id, name]) => <option key={id} value={id}>{name}</option>)}
      </select>
    );
  } else if (row.type === 'bool') {
    editor = <input type="checkbox" checked={row.value === true} disabled={disabled} onChange={(e) => commit(e.target.checked)} aria-label={label} />;
  } else if (row.options?.length) {
    editor = (
      <select value={String(row.value)} disabled={disabled} onChange={(e) => commit(e.target.value)} aria-label={label}>
        {!row.options.some((o) => o.key === row.value) && <option value={String(row.value)}>{String(row.value) || '(not set)'}</option>}
        {row.options.map((o) => <option key={o.key} value={o.key}>{o.desc && o.desc !== o.key && o.desc.trim().length > 1 ? `${o.key} — ${o.desc}` : o.key}</option>)}
      </select>
    );
  } else {
    const numeric = ['int32', 'uint32', 'int64', 'uint64', 'float', 'double'].includes(row.type);
    editor = (
      <input
        type="text" inputMode={numeric ? 'decimal' : 'text'} value={draft} disabled={disabled} aria-label={label}
        className={numeric ? 'num' : ''}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => commit(draft)}
        onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); if (e.key === 'Escape') { setDraft(String(row.value)); setError(null); } }}
      />
    );
  }
  const hint = row.min !== undefined && row.max !== undefined && row.max > row.min ? `${row.min} … ${row.max}` : '';
  return (
    <div className={`field${error || outOfRange || finding ? ' bad' : ''}${row.hidden ? ' hidden-attr' : ''}`} style={{ paddingLeft: 12 + row.depth * 18 }} data-path={row.path}>
      <label title={row.path}>{label}{row.required && <i className="req" title="Required">*</i>}<small>{row.key !== label ? row.key : ''}</small></label>
      <div className="control">{editor}{row.unit && <span className="unit">{row.unit}</span>}</div>
      <div className="note">{error ?? finding?.message ?? (outOfRange ? `Outside ${hint}` : hint)}</div>
    </div>
  );
}

function Section({ title, count, children, open = true }: { title: string; count?: number; children: React.ReactNode; open?: boolean }) {
  return (
    <details className="section" open={open}>
      <summary>{title}{count !== undefined && <span className="muted"> {count}</span>}</summary>
      {children}
    </details>
  );
}

export function PropertiesTab() {
  const { project, rev, selected, edit, select, report, notify, setTab } = useStore();
  const [showHidden, setShowHidden] = useState(false);
  const m = selectedModule({ project, selected });

  const data = useMemo(() => {
    if (!project || !m) return null;
    const all = rows(m.comp);
    const idx = portIndex(project);
    const names = new Map(modules(project).filter((x) => x.comp !== m.comp).map((x) => [uuidOf(x.comp), nameOf(x.comp)]));
    return { all, idx, names };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, m, rev]);

  if (!project) return null;
  if (!m || !data) return <p className="empty">Select a module on the left to see and edit its parameters.</p>;

  const name = nameOf(m.comp);
  const findings = (report?.findings ?? []).filter((f) => f.module === name);
  const byPath = new Map(findings.filter((f) => f.path && f.level !== 'info').map((f) => [f.path!, f]));
  const visible = data.all.filter((r) => showHidden || !r.hidden);
  const commit = (path: string) => (v: Scalar) => edit((p) => setAttr(p, m, path, v));
  const field = (r: AttrRow) => <Field key={r.path} row={r} moduleNames={data.names} onCommit={commit(r.path)} finding={byPath.get(r.path)} />;

  const general = visible.filter((r) => r.section === 'general');
  const mounting = visible.filter((r) => r.section === 'struct');
  const privGroups = [...new Set(visible.filter((r) => r.section === 'private').map((r) => r.group))];
  const hiddenCount = data.all.length - data.all.filter((r) => !r.hidden).length;

  const onDelete = () => {
    if (!confirm(`Remove "${name}" and all its connections?`)) return;
    let dangling = 0;
    const err = edit((p) => { dangling = removeModule(p, m).length; });
    if (err) return notify('error', err);
    select(null);
    if (dangling) { notify('error', `${dangling} function binding(s) still refer to "${name}". See Validate.`); setTab('validate'); }
  };

  return (
    <div className="props">
      <div className="props-head">
        <div>
          <h2>{name}</h2>
          <p className="muted">{mainTypeOf(m.comp)} / {subTypeOf(m.comp)}{vendorOf(m.comp) && ` · ${vendorOf(m.comp)}`}{productOf(m.comp) && ` · ${productOf(m.comp)}`}</p>
        </div>
        <span className="grow" />
        <label className="check"><input type="checkbox" checked={!m.comp.bool_disable} onChange={(e) => edit((p) => setDisabled(p, m, !e.target.checked))} /> Enabled</label>
        {hiddenCount > 0 && <label className="check"><input type="checkbox" checked={showHidden} onChange={(e) => setShowHidden(e.target.checked)} /> Show {hiddenCount} hidden</label>}
        <button className="ghost danger" onClick={onDelete}>Remove module</button>
      </div>

      {findings.length > 0 && (
        <ul className="findings inline">
          {findings.map((f, i) => <li key={i} className={f.level}><b>{f.level}</b> {f.message}</li>)}
        </ul>
      )}

      <Section title="General" count={general.length}>{general.map(field)}</Section>
      {privGroups.map((g) => {
        const rs = visible.filter((r) => r.section === 'private' && r.group === g);
        return <Section key={g} title={g} count={rs.length}>{rs.map(field)}</Section>;
      })}
      {mounting.length > 0 && <Section title="Mounting" count={mounting.length}>{mounting.map(field)}</Section>}
      <Section title="Interfaces" count={interfacesOf(m.comp).length}>
        {interfacesOf(m.comp).map((iface) => {
          const rs = visible.filter((r) => r.section === 'interface' && r.group === iface.key);
          const peers = [...new Set(iface.linked_interface_uuid)].map((u) => data.idx.get(u)).filter((x) => x && x.iface !== iface).map((x) => portLabel(x!));
          return (
            <details key={iface.interface_uuid || iface.key} className="iface" open={peers.length > 0}>
              <summary><b>{iface.key}</b> <span className="tag">{iface.type}</span> {peers.length ? <span className="peers">↔ {peers.join(', ')}</span> : <span className="muted">not connected</span>}</summary>
              {rs.length ? rs.map(field) : <p className="muted pad">No parameters.</p>}
            </details>
          );
        })}
      </Section>
    </div>
  );
}
