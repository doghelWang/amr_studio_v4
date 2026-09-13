import * as path from 'path';

export const BACKEND_TS_DIR = path.resolve(__dirname, '../..');
export const REPO_ROOT = path.resolve(BACKEND_TS_DIR, '../..');
export const PY_BACKEND_DIR = path.join(REPO_ROOT, 'src', 'backend');
export const MODULE_LIBRARY_ROOT = path.join(REPO_ROOT, 'specifications', 'ModuleLibrary');
export const PROTOCOLS_DIR = path.join(REPO_ROOT, 'specifications', 'protocols');
export const RESOURCE_DIR = path.join(PY_BACKEND_DIR, 'resources');
export const MODULE_RESOURCES_DIR = path.join(RESOURCE_DIR, 'modules');
export const BOARD_DESC_DIR = path.join(MODULE_LIBRARY_ROOT, 'board_desc');
export const SAVED_PROJECTS_DIR = path.join(PY_BACKEND_DIR, 'saved_projects');
export const USER_SAVES_DIR = path.join(PY_BACKEND_DIR, 'user_saves');
