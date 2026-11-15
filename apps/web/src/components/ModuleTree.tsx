import { useMemo, useState } from 'react';
import { mainTypeOf, modules, nameOf, productOf, subTypeOf, type Level } from '@amr/core';
import { idOf, useStore } from '../store';

/** Left pane: every module, grouped by main type, with its worst finding as a marker. */
export function ModuleTree() {
  const { project, rev, report, selected, select } = useStore();
  const [q, setQ] = useState('');

  const groups = useMemo(() => {
    if (!project) return [];
    const worst = new Map<string, Level>();
    const rank: Record<Level, number> = { error: 0, warning: 1, info: 2 };
    for (const f of report?.findings ?? []) {
      if (!f.module || f.level === 'info') continue;
      const cur = worst.get(f.module);
      if (!cur || rank[f.level] < rank[cur]) worst.set(f.module, f.level);
    }
    const s = q.trim().toLowerCase();
    const by = new Map<string, { id: string; name: string; sub: string; product: string; disabled: boolean; level?: Level }[]>();
    for (const m of modules(project)) {
      const name = nameOf(m.comp), sub = subTypeOf(m.comp), product = productOf(m.comp);
      if (s && ![name, sub, product, mainTypeOf(m.comp)].some((x) => x.toLowerCase().includes(s))) continue;
      const main = mainTypeOf(m.comp) || 'other';
      (by.get(main) ?? by.set(main, []).get(main)!).push({ id: idOf(m), name, sub, product, disabled: m.comp.bool_disable, level: worst.get(name) });
    }
    return [...by].sort(([a], [b]) => a.localeCompare(b));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, rev, report, q]);

  return (
    <aside className="tree">
      <input className="search" placeholder="Search modules…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search modules" />
      <div className="tree-list">
        {groups.length === 0 && <p className="muted pad">{project && modules(project).length === 0 ? 'This model has no modules yet. Add some from the Catalog tab.' : 'No module matches.'}</p>}
        {groups.map(([main, items]) => (
          <div key={main}>
            <h4>{main} <span className="muted">{items.length}</span></h4>
            {items.map((m) => (
              <button
                key={m.id}
                className={`item${selected === m.id ? ' on' : ''}${m.disabled ? ' off' : ''}`}
                onClick={() => select(m.id, 'properties')}
                title={`${m.name} · ${m.sub}${m.product ? ' · ' + m.product : ''}`}
              >
                <span className={`mark ${m.level ?? ''}`} />
                <span className="name">{m.name}</span>
                <span className="sub">{m.sub}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
}
