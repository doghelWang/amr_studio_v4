import os
import json

def patch_json_files(directory):
    for filename in os.listdir(directory):
        if filename.endswith(".json"):
            path = os.path.join(directory, filename)
            try:
                with open(path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                
                changed = False
                if "moduleComponets" in data:
                    for component in data["moduleComponets"]:
                        gen = component.get("generalAttr", {})
                        main_type = (gen.get("mainModuleType", {}).get("comboType", {}).get("typeKey") or 
                                     gen.get("main_module_type", {}).get("combo_type", {}).get("type_key") or "").lower()
                        
                        if main_type in ["maincpu", "integratedcontroller", "control"]:
                            iface_params = component.get("interfaceParams", {})
                            if "interfaceGroup" not in iface_params:
                                iface_params["interfaceGroup"] = []
                                component["interfaceParams"] = iface_params
                            
                            eth_instances = [i for i in iface_params["interfaceGroup"] if i.get("type") == "ETH"]
                            if len(eth_instances) < 4:
                                import uuid
                                for i in range(len(eth_instances) + 1, 5):
                                    iface_params["interfaceGroup"].append({
                                        "key": f"ETH_{i}",
                                        "type": "ETH",
                                        "desc": f"以太网口 {i}",
                                        "interfaceUuid": str(uuid.uuid4()),
                                        "interfaceParams": {}
                                    })
                                changed = True
                
                if changed:
                    print(f"Patched {filename}")
                    with open(path, "w", encoding="utf-8") as f:
                        json.dump(data, f, indent=4, ensure_ascii=False)
            except Exception as e:
                print(f"Error processing {filename}: {e}")

if __name__ == "__main__":
    patch_json_files("backend/resources/modules")
