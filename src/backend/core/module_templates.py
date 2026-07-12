"""Helpers for loading module template files from backend resources."""

import json
from pathlib import Path


def load_module_template(component_type: str):
    """Load a module template from the local resources directory."""
    try:
        base = Path(__file__).parent.parent / "resources" / "modules"
        template_path = base / f"{component_type}.json"
        if template_path.exists():
            with open(template_path, "r", encoding="utf-8") as file_obj:
                return json.load(file_obj)
    except Exception:
        pass
    return None
