import sys
import os
import json
from pathlib import Path

# Add src/backend to sys.path
sys.path.append(os.path.join(os.getcwd(), 'src/backend'))

from skills_v2.cmodel_encoder.encoder import enrich_from_templates, get_registry, resolve_with_fidelity

def test_encode_proj_1234():
    proj_dir = "src/backend/saved_projects/proj_1234"
    blueprint_path = os.path.join(proj_dir, "blueprint_CompDesc.json")
    
    if not os.path.exists(blueprint_path):
        print(f"Error: {blueprint_path} not found.")
        return

    with open(blueprint_path, "r", encoding="utf-8") as f:
        blueprint = json.load(f)

    print("Step 1: Resolving References...")
    blueprint = resolve_with_fidelity(blueprint, proj_dir)

    print("Step 2: Encoder Enrichment (Spec-Driven)...")
    enriched_data = enrich_from_templates(blueprint)
    
    def verify_recursive(data):
        # 1. Check components in current level
        if "moduleComponets" in data:
            for comp in data["moduleComponets"]:
                ga = comp.get("generalAttr", {})
                m_type = ga.get("mainModuleType", {}).get("comboType", {}).get("typeKey", "")
                sub_type = ga.get("subModuleType", {}).get("comboType", {}).get("typeKey", "")
                display_type = sub_type or m_type
                
                if m_type == "chassis":
                    nonlocal found_chassis
                    found_chassis = True
                    pa = comp.get("privateAttr", {}).get("privateAttrs", [])
                    print(f"  [FOUND] Chassis groups: {[g.get('groupKey') for g in pa]}")
                    if "chassisAttr" in [g.get("groupKey") for g in pa]:
                        print("  ✅ chassisAttr group successfully enriched.")
                    else:
                        print("  ❌ chassisAttr group MISSING.")

                # Check Interfaces
                iface_groups = comp.get("interfaceParams", {}).get("interfaceGroup", [])
                if iface_groups:
                    print(f"  [CHECK] Module {display_type} interfaces: {[i.get('type') for i in iface_groups]}")
                    for iface in iface_groups:
                        has_attrs = bool(iface.get("interfaceAttrs"))
                        has_params = bool(iface.get("interfaceParams"))
                        status = "✅" if (has_attrs or has_params) else "❌"
                        detail = f"attrs={'✓' if has_attrs else '✗'} params={'✓' if has_params else '✗'}"
                        print(f"    {status} {iface.get('type')} [{detail}]")

        # 2. Recurse into sub-groups
        for sub in data.get("moreModuleInfo", []):
            verify_recursive(sub)

    found_chassis = False
    verify_recursive(enriched_data)

    if not found_chassis:
        print("Warning: No chassis found in proj_1234 blueprint.")

if __name__ == "__main__":
    test_encode_proj_1234()
