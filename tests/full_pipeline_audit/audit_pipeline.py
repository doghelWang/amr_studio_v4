import os
import sys
import json
import shutil
from pathlib import Path

# Add src/backend to path
sys.path.append(str(Path(__file__).resolve().parent.parent.parent / "src" / "backend"))

from app.application.cmodel_export import frontend_to_comp_desc, export_abilities
from app.infrastructure.protobuf import encode_cmodel, split_comp_desc

def run_audit(project_id, input_json_path):
    audit_dir = Path(__file__).resolve().parent
    output_base = audit_dir / f"audit_results_{project_id}"
    if output_base.exists():
        shutil.rmtree(output_base)
    output_base.mkdir(parents=True)

    # 1. Step A: Raw Frontend Data
    print(f"--- [Step A] Reading Raw Frontend Data from {input_json_path} ---")
    with open(input_json_path, 'r', encoding='utf-8') as f:
        frontend_config = json.load(f)
    
    with open(output_base / "01_frontend_raw.json", 'w', encoding='utf-8') as f:
        json.dump(frontend_config, f, indent=2, ensure_ascii=False)

    # 2. Step B: Backend Transformation (Resource Adapter)
    print("--- [Step B] Backend Transformation (Enrichment) ---")
    full_comp_desc = frontend_to_comp_desc(frontend_config)
    with open(output_base / "02_backend_enriched_CompDesc.json", 'w', encoding='utf-8') as f:
        json.dump(full_comp_desc, f, indent=2, ensure_ascii=False)
    
    abi_json = export_abilities(frontend_config.get("abilities", {}))
    with open(output_base / "02_backend_enriched_AbiSet.json", 'w', encoding='utf-8') as f:
        json.dump(abi_json, f, indent=2, ensure_ascii=False)

    # 3. Step C: Model Splitting
    print("--- [Step C] Model Splitting ---")
    temp_work_dir = output_base / "temp_work"
    temp_work_dir.mkdir()
    
    comp_desc_path = temp_work_dir / "CompDesc.json"
    with open(comp_desc_path, 'w', encoding='utf-8') as f:
        json.dump(full_comp_desc, f, indent=2, ensure_ascii=False)
    
    with open(temp_work_dir / "AbiSet.json", 'w', encoding='utf-8') as f:
        json.dump(abi_json, f, indent=2, ensure_ascii=False)

    split_comp_desc(str(comp_desc_path), str(temp_work_dir))
    
    # Save blueprint for review
    shutil.copy(temp_work_dir / "blueprint_CompDesc.json", output_base / "03_blueprint_CompDesc.json")

    # 4. Step D: Binary Encoding & Packaging
    print("--- [Step D] Binary Encoding & Packaging ---")
    final_cmodel_path = output_base / f"{project_id}_audit.cmodel"
    audit_log = encode_cmodel(str(temp_work_dir), str(final_cmodel_path))
    
    with open(output_base / "04_encoding_audit_log.txt", 'w', encoding='utf-8') as f:
        for line in audit_log:
            f.write(line + "\n")

    # 5. Integrity Verification (Unzip and check)
    print("--- [Step E] Verifying final .cmodel ---")
    verify_dir = output_base / "05_final_cmodel_contents"
    verify_dir.mkdir()
    
    import zipfile
    with zipfile.ZipFile(final_cmodel_path, 'r') as z:
        z.extractall(verify_dir)
    
    print(f"\n✅ Audit complete. All intermediate files are in: {output_base}")
    print(f"Final .cmodel size: {os.path.getsize(final_cmodel_path)} bytes")

if __name__ == "__main__":
    project_id = "12345"
    input_json = Path(__file__).resolve().parent.parent.parent / "src" / "backend" / "user_saves" / "12345.json"
    run_audit(project_id, input_json)
