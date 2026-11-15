/** Client for the Worker storage API. Every failure becomes an Error with the server's own explanation. */
export interface SavedProject { name: string; modules?: number; bytes?: number; savedAt?: string }

async function fail(r: Response): Promise<never> {
  let detail = `${r.status} ${r.statusText}`;
  try {
    const j = (await r.json()) as { detail?: string; error?: string };
    detail = j.detail ?? j.error ?? detail;
  } catch { /* not JSON: keep the status text */ }
  throw new Error(detail);
}

export async function listProjects(): Promise<SavedProject[]> {
  const r = await fetch('/api/v1/projects');
  if (!r.ok) return fail(r);
  return ((await r.json()) as { projects: SavedProject[] }).projects;
}
export async function loadProject(name: string): Promise<Uint8Array> {
  const r = await fetch(`/api/v1/projects/${encodeURIComponent(name)}`);
  if (!r.ok) return fail(r);
  return new Uint8Array(await r.arrayBuffer());
}
export async function saveProject(name: string, bytes: Uint8Array): Promise<void> {
  const r = await fetch(`/api/v1/projects/${encodeURIComponent(name)}`, { method: 'PUT', body: bytes as unknown as BodyInit });
  if (!r.ok) return fail(r);
}
export async function deleteProject(name: string): Promise<void> {
  const r = await fetch(`/api/v1/projects/${encodeURIComponent(name)}`, { method: 'DELETE' });
  if (!r.ok) return fail(r);
}
