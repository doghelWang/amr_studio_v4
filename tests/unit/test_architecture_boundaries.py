import ast
import sys
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_DIR = REPO_ROOT / "src" / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))


def imported_modules(path: Path) -> set[str]:
    tree = ast.parse(path.read_text(encoding="utf-8"), filename=str(path))
    modules = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            modules.update(alias.name for alias in node.names)
        elif isinstance(node, ast.ImportFrom) and node.module:
            modules.add(node.module)
    return modules


class ArchitectureBoundaryTests(unittest.TestCase):
    def test_deprecated_backend_packages_are_removed(self):
        deprecated_paths = (
            BACKEND_DIR / "core",
            BACKEND_DIR / "skills_v2",
            BACKEND_DIR / "app" / "services",
            BACKEND_DIR / "app" / "legacy",
        )
        self.assertEqual([str(path) for path in deprecated_paths if path.exists()], [])

    def test_domain_and_infrastructure_do_not_depend_on_http_adapter(self):
        violations = []
        for layer in ("domain", "infrastructure"):
            for path in (BACKEND_DIR / "app" / layer).rglob("*.py"):
                for module in imported_modules(path):
                    if module == "fastapi" or module.startswith("app.api"):
                        violations.append(f"{path.relative_to(BACKEND_DIR)} -> {module}")
        self.assertEqual(violations, [])

    def test_application_does_not_depend_on_fastapi(self):
        violations = []
        for path in (BACKEND_DIR / "app" / "application").rglob("*.py"):
            for module in imported_modules(path):
                if module == "fastapi" or module.startswith("fastapi."):
                    violations.append(f"{path.relative_to(BACKEND_DIR)} -> {module}")
        self.assertEqual(violations, [])

    def test_active_app_does_not_import_compatibility_packages(self):
        violations = []
        app_root = BACKEND_DIR / "app"
        for path in app_root.rglob("*.py"):
            if "legacy" in path.relative_to(app_root).parts:
                continue
            for module in imported_modules(path):
                if module == "core" or module.startswith("core.") or module.startswith("skills_v2"):
                    violations.append(f"{path.relative_to(BACKEND_DIR)} -> {module}")
        self.assertEqual(violations, [])


if __name__ == "__main__":
    unittest.main()
