import sys
import os
from pathlib import Path

# Set up paths
backend_path = os.path.abspath("backend")
sys.path.insert(0, backend_path)

from core import data_manager

def test_init():
    project_id = "test_manual"
    blueprint = {"test": 1}
    
    # Create dummy artifacts
    temp_dir = Path("tmp/dummy_artifacts")
    temp_dir.mkdir(parents=True, exist_ok=True)
    (temp_dir / "AbiSet.json").write_text("{}")
    (temp_dir / "CompDesc.json").write_text("{}")
    (temp_dir / "some.model").write_text("binary")
    
    dummy_modules = temp_dir / "modules"
    dummy_modules.mkdir(exist_ok=True)
    (dummy_modules / "m1.json").write_text("{}")
    
    print(f"Calling init_project with {temp_dir}")
    data_manager.init_project(project_id, blueprint, str(dummy_modules), temp_dir)
    
    # Verify
    p_dir = data_manager.get_project_dir(project_id)
    print(f"Project dir: {p_dir}")
    if (p_dir / "AbiSet.json").exists():
        print("SUCCESS: AbiSet.json exists")
    else:
        print("FAILED: AbiSet.json missing")
        
    if (p_dir / "modules/m1.json").exists():
        print("SUCCESS: Module exists")
    else:
        print("FAILED: Module missing")

if __name__ == "__main__":
    test_init()
