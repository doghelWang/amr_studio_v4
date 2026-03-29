import os
import xml.etree.ElementTree as ET

def patch_xml_files(directory):
    for filename in os.listdir(directory):
        if filename.endswith(".xml"):
            path = os.path.join(directory, filename)
            try:
                tree = ET.parse(path)
                root = tree.getroot()
                
                changed = False
                for component in root.findall(".//Component"):
                    category = component.get("category", "").lower()
                    if category in ["maincpu", "integratedcontroller", "control"]:
                        interfaces = component.find("Interfaces")
                        if interfaces is None:
                            interfaces = ET.SubElement(component, "Interfaces")
                            changed = True
                        
                        # Count existing ETH instances
                        eth_instances = [i for i in interfaces.findall("Instance") if i.get("type") == "ETH"]
                        if len(eth_instances) < 4:
                            # Add Ability if missing
                            ability_eth = next((a for a in interfaces.findall("Ability") if a.get("type") == "ETH"), None)
                            if ability_eth is None:
                                ability_eth = ET.Element("Ability", {"type": "ETH", "nums": "4"})
                                # Insert at the beginning of Interfaces
                                interfaces.insert(0, ability_eth)
                            else:
                                ability_eth.set("nums", "4")
                            
                            # Add missing Instances
                            for i in range(len(eth_instances) + 1, 5):
                                ET.SubElement(interfaces, "Instance", {"key": f"ETH_{i}", "type": "ETH"})
                            
                            changed = True
                
                if changed:
                    print(f"Patched {filename}")
                    # Use a custom writer to keep formatting somewhat sane
                    tree.write(path, encoding="utf-8", xml_declaration=True)
            except Exception as e:
                print(f"Error processing {filename}: {e}")

if __name__ == "__main__":
    patch_xml_files("backend/resources/modules")
