import { useCallback, useEffect, useRef, useState } from 'react';
import { modules } from '@amr/core';
import { deleteProject, listProjects, loadProject, saveProject, type SavedProject } from './api';
import { CatalogTab } from './components/CatalogTab';
import { CompareTab } from './components/CompareTab';
import { FunctionsTab } from './components/FunctionsTab';
import { ModuleTree } from './components/ModuleTree';
import { PropertiesTab } from './components/PropertiesTab';
import { ValidateTab } from './components/ValidateTab';
import { WiringTab } from './components/WiringTab';
import { download, useStore, type Tab } from './store';

const TABS: { id: Tab; label: string }[] = [
  { id: 'properties', label: 'Properties' },
  { id: 'wiring', label: 'Wiring' },
  { id: 'functions', label: 'Functions' },
  { id: 'validate', label: 'Validate' },
  { id: 'compare', label: 'Compare' },
  { id: 'catalog', label: 'Catalog' },
];

export function useOpenFile(): (file: File) => Promise<void> {
  const open = useStore((s) => s.open);
  const notify = useStore((s) => s.notify);
  return useCallback(async (file: File) => {
    try {
      open(new Uint8Array(await file.arrayBuffer()), file.name);
    } catch (err) {
      notify('error', `${file.name}: ${(err as Error).message}`);
    }
  }, [open, notify]);
}

function Welcome() {
  const openFile = useOpenFile();
  const { open, notify } = useStore();
  const input = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState<SavedProject[] | null>(null);
  const [over, setOver] = useState(false);
  const refresh = useCallback(() => listProjects().then(setSaved).catch(() => setSaved(null)), []);
  useEffect(() => void refresh(), [refresh]);

  return (
    <main className="welcome">
      <h1>AMR Studio</h1>
      <p className="muted">Open a .cmodel to inspect, edit, validate and compare it. Files are processed in your browser.</p>
      <div
        className={`drop${over ? ' over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); const f = e.dataTransfer.files[0]; if (f) void openFile(f); }}
      >
        <p>Drop a .cmodel file here</p>
        <button className="primary" onClick={() => input.current?.click()}>Choose file…</button>
        <input ref={input} type="file" accept=".cmodel,.zip" hidden data-testid="file-input" onChange={(e) => { const f = e.target.files?.[0]; if (f) void openFile(f); e.target.value = ''; }} />
      </div>
      {saved && saved.length > 0 && (
        <section className="saved">
          <h2>Saved on the server</h2>
          <ul>
            {saved.map((p) => (
              <li key={p.name}>
                <button className="link" onClick={() => loadProject(p.name).then((b) => open(b, p.name)).catch((e: Error) => notify('error', e.message))}>{p.name}</button>
                <span className="muted">{p.modules ?? '?'} modules · {p.savedAt ? new Date(p.savedAt).toLocaleString() : ''}</span>
                <button className="ghost danger" title="Delete from server" onClick={() => { if (confirm(`Delete "${p.name}" from the server?`)) void deleteProject(p.name).then(refresh).catch((e: Error) => notify('error', e.message)); }}>Delete</button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

function Header() {
  const { project, report, unsaved, undo, redo, undoOnce, redoOnce, exportBytes, markSaved, close, notify, select } = useStore();
  if (!project) return null;
  const onExport = () => {
    download(exportBytes(), `${project.name}.cmodel`);
    markSaved();
  };
  const onSave = async () => {
    try {
      await saveProject(project.name, exportBytes(), modules(project).length);
      markSaved();
      notify('ok', `Saved "${project.name}" on the server`);
    } catch (err) {
      notify('error', `Could not save: ${(err as Error).message}`);
    }
  };
  const onClose = () => {
    if (!unsaved || confirm('Close without exporting your changes?')) close();
  };
  return (
    <header className="bar">
      <strong className="brand">AMR Studio</strong>
      <span className="project" title={project.name}>{project.name}{unsaved && <em> · edited</em>}</span>
      <span className="muted">{modules(project).length} modules</span>
      {report && (
        <button className="counts" onClick={() => select(null, 'validate')} title="Open validation">
          <span className={`dot error${report.errors ? '' : ' zero'}`}>{report.errors} {report.errors === 1 ? 'error' : 'errors'}</span>
          <span className={`dot warning${report.warnings ? '' : ' zero'}`}>{report.warnings} {report.warnings === 1 ? 'warning' : 'warnings'}</span>
        </button>
      )}
      <span className="grow" />
      <button className="ghost" disabled={!undo.length} onClick={undoOnce} title="Undo (Ctrl+Z)">Undo</button>
      <button className="ghost" disabled={!redo.length} onClick={redoOnce} title="Redo (Ctrl+Shift+Z)">Redo</button>
      <button className="ghost" onClick={onSave}>Save to server</button>
      <button className="primary" onClick={onExport}>Export .cmodel</button>
      <button className="ghost" onClick={onClose}>Close</button>
    </header>
  );
}

export function App() {
  const { project, tab, setTab, toast, undoOnce, redoOnce, unsaved } = useStore();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA') return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) redoOnce(); else undoOnce();
      }
    };
    const onLeave = (e: BeforeUnloadEvent) => { if (unsaved) e.preventDefault(); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('beforeunload', onLeave);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('beforeunload', onLeave); };
  }, [undoOnce, redoOnce, unsaved]);

  return (
    <div className="app">
      {project ? (
        <>
          <Header />
          <div className="workspace">
            <ModuleTree />
            <section className="main">
              <nav className="tabs" role="tablist">
                {TABS.map((t) => (
                  <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>{t.label}</button>
                ))}
              </nav>
              <div className="panel">
                {tab === 'properties' && <PropertiesTab />}
                {tab === 'wiring' && <WiringTab />}
                {tab === 'functions' && <FunctionsTab />}
                {tab === 'validate' && <ValidateTab />}
                {tab === 'compare' && <CompareTab />}
                {tab === 'catalog' && <CatalogTab />}
              </div>
            </section>
          </div>
        </>
      ) : (
        <Welcome />
      )}
      {toast && <div className={`toast ${toast.kind}`} role="status" title="Click to dismiss" onClick={() => useStore.setState({ toast: null })}>{toast.text}</div>}
    </div>
  );
}
