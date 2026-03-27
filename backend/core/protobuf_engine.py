import os
import json
import zipfile
import tempfile
import hashlib
from schemas.api import GeneratePayload
from core.schema_builder import CustomCompDescBuilder

def generate_industrial_modelset(payload: GeneratePayload, base_modelset_zip: str = None) -> str:
    """
    Main entry point for generating industrial grade .cmodel ModelSets.
    Uses the v4.5 Deep Alignment Engine (schema_builder.py).
    """
    base_dir = os.path.dirname(os.path.abspath(__file__))
    templates_dir = os.path.join(os.path.dirname(base_dir), "templates")
    
    comp_base = os.path.join(templates_dir, 'CompDesc.model')
    
    # Initialize the high-precision builder
    builder = CustomCompDescBuilder(comp_base)
    
    # 1. Build the main CompDesc archive using template injection
    # This handled everything: chassis, wheels, sensors, mcu, and wiring.
    zip_path = builder.build_from_payload(payload)
    
    # 2. Post-process to inject boilerplate FuncDesc.model and AbiSet.model if needed
    # (The builder already creates a basic .cmodel zip, we can augment it if necessary)
    
    # For now, we will use the zip produced by the builder as the final output.
    # We should ensure AbiSet and FuncDesc are included in the final zip if they represent global robot state.
    
    # Re-package to include extra files from templates
    final_out_dir = tempfile.mkdtemp()
    final_zip_path = os.path.join(final_out_dir, os.path.basename(zip_path))
    
    with zipfile.ZipFile(zip_path, 'r') as zin:
        with zipfile.ZipFile(final_zip_path, 'w', zipfile.ZIP_DEFLATED) as zout:
            # Copy CompDesc and Manifest from builder
            for item in zin.infolist():
                zout.writestr(item.filename, zin.read(item.filename))
            
            # Augment with AbiSet and FuncDesc boilerplate from templates
            for extra in ['AbiSet.model', 'FuncDesc.model']:
                extra_path = os.path.join(templates_dir, extra)
                if os.path.exists(extra_path):
                    with open(extra_path, 'rb') as f:
                        zout.writestr(extra, f.read())
            
            # Update manifest to include all 3 models if they are present
            manifest_data = json.loads(zin.read('ModelFileDesc.json'))
            for extra in ['AbiSet.model', 'FuncDesc.model']:
                extra_path = os.path.join(templates_dir, extra)
                if os.path.exists(extra_path):
                    with open(extra_path, 'rb') as f:
                        data = f.read()
                        m_type = "MODEL_ABI" if "Abi" in extra else "MODEL_FUNC"
                        manifest_data["ModelFileDesc"].append({
                            "md5": hashlib.md5(data).hexdigest(),
                            "name": extra,
                            "type": m_type,
                            "version": "1.0"
                        })
            
            zout.writestr('ModelFileDesc.json', json.dumps(manifest_data, indent=4))
            
    return final_zip_path
