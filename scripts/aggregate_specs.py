import json
import os
import xml.etree.ElementTree as ET
from xml.dom import minidom
import re

# Regex for invalid XML 1.0 characters
_ILLEGAL_XML_CHARS_RE = re.compile(
    u'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x84\x86-\x9f\ud800-\udfff\ufdd0-\ufdef\ufffe\uffff]')

def sanitize_xml(text):
    if text is None: return ""
    if not isinstance(text, str): text = str(text)
    return _ILLEGAL_XML_CHARS_RE.sub('', text)

def is_valid_xml_tag(tag):
    """Check if a string is a valid XML tag name."""
    if not tag or not (tag[0].isalpha() or tag[0] == '_'):
        return False
    # Simplified regex for valid chars in rest of tag
    return bool(re.match(r'^[a-zA-Z_][a-zA-Z0-9._-]*$', tag))

def safe_tag(tag):
    """Return a safe tag name and flag if it was modified."""
    if is_valid_xml_tag(tag):
        return tag, False
    return "Entry", True

def prettify(elem):
    rough_string = ET.tostring(elem, 'utf-8')
    try:
        reparsed = minidom.parseString(rough_string)
        return reparsed.toprettyxml(indent="  ")
    except Exception as e:
        print(f"Warning: Could not prettify XML: {e}")
        return rough_string.decode('utf-8')

def dict_to_xml(tag, d):
    """Recursively convert a dictionary to an XML element, handling invalid tags."""
    tag_name, modified = safe_tag(tag)
    elem = ET.Element(tag_name)
    if modified:
        elem.set("_original_key", tag)
        
    if isinstance(d, dict):
        for key, val in d.items():
            if isinstance(val, (dict, list)):
                child = dict_to_xml(key, val)
                elem.append(child)
            else:
                s_val = sanitize_xml(val)
                # If key is valid attribute name, use it; else use Entry
                if is_valid_xml_tag(key):
                    elem.set(key, s_val)
                else:
                    child = ET.SubElement(elem, "Entry")
                    child.set("key", key)
                    child.text = s_val
    elif isinstance(d, list):
        for item in d:
            if isinstance(item, (dict, list)):
                child = dict_to_xml("Item", item)
                elem.append(child)
            else:
                child = ET.SubElement(elem, "Value")
                child.text = sanitize_xml(item)
    return elem

def aggregate_private_attributes(base_path, output_xml):
    print(f"Aggregating Private Attributes...")
    root = ET.Element("PrivateAttributes")
    pri_attr_dir = os.path.join(base_path, "ModuleAttrTem", "Pri_Attr")
    for module_type in sorted(os.listdir(pri_attr_dir)):
        module_path = os.path.join(pri_attr_dir, module_type)
        if not os.path.isdir(module_path): continue
        json_file = os.path.join(module_path, "PrivateAttribute.json")
        if os.path.exists(json_file):
            print(f"  Processing {module_type}")
            with open(json_file, 'r', encoding='utf-8') as f:
                try:
                    data = json.load(f)
                    module_node = ET.SubElement(root, "Module")
                    module_node.set("type", module_type)
                    for grp in data.get("privateAttrs", []):
                        grp_node = ET.SubElement(module_node, "Group")
                        for k, v in grp.items():
                            if k == "arrayBaseEle":
                                for attr in v:
                                    attr_node = ET.SubElement(grp_node, "Attribute")
                                    for ak, av in attr.items():
                                        if isinstance(av, (dict, list)):
                                            attr_node.append(dict_to_xml(ak, av))
                                        else:
                                            attr_node.set(ak, sanitize_xml(av))
                            else:
                                if is_valid_xml_tag(k): grp_node.set(k, sanitize_xml(v))
                                else:
                                    child = ET.SubElement(grp_node, "Entry")
                                    child.set("key", k)
                                    child.text = sanitize_xml(v)
                except Exception as e:
                    print(f"Error in {module_type}: {e}")
    with open(output_xml, 'w', encoding='utf-8') as f:
        f.write(prettify(root))

def aggregate_interface_specs(base_path, output_xml):
    print(f"Aggregating Interface Specs...")
    root = ET.Element("InterfaceSpecs")
    fix_attr_dir = os.path.join(base_path, "ModuleAttrTem", "Interface_Attr")
    fix_node = ET.SubElement(root, "InterfaceFixAttrs")
    for intf_type in sorted(os.listdir(fix_attr_dir)):
        it_path = os.path.join(fix_attr_dir, intf_type)
        if os.path.isdir(it_path):
            for root_dir, dirs, files in os.walk(it_path):
                if "InterfaceFixAttr.json" in files:
                    rel_type = os.path.relpath(root_dir, fix_attr_dir)
                    print(f"  FixAttr: {rel_type}")
                    with open(os.path.join(root_dir, "InterfaceFixAttr.json"), 'r', encoding='utf-8') as f:
                        node = dict_to_xml("Interface", json.load(f))
                        node.set("type", rel_type)
                        fix_node.append(node)
    param_dir = os.path.join(base_path, "ModuleAttrTem", "Interface_Prarm")
    param_node = ET.SubElement(root, "InterfaceParams")
    for intf_type in sorted(os.listdir(param_dir)):
        it_path = os.path.join(param_dir, intf_type)
        if os.path.isdir(it_path):
            for root_dir, dirs, files in os.walk(it_path):
                if "InterfaceParam.json" in files:
                    rel_type = os.path.relpath(root_dir, param_dir)
                    print(f"  Param: {rel_type}")
                    with open(os.path.join(root_dir, "InterfaceParam.json"), 'r', encoding='utf-8') as f:
                        node = dict_to_xml("Interface", json.load(f))
                        node.set("type", rel_type)
                        param_node.append(node)
    with open(output_xml, 'w', encoding='utf-8') as f:
        f.write(prettify(root))

def aggregate_module_config(base_path, output_xml):
    print(f"Aggregating Module Configs...")
    root = ET.Element("ModuleConfigs")
    config_dir = os.path.join(base_path, "ModuleConfig")
    for filename in sorted(os.listdir(config_dir)):
        if filename.endswith(".json"):
            print(f"  Config: {filename}")
            with open(os.path.join(config_dir, filename), 'r', encoding='utf-8') as f:
                try:
                    node = dict_to_xml("Config", json.load(f))
                    node.set("file", filename)
                    root.append(node)
                except Exception as e: print(f"Error parsing {filename}: {e}")
        elif filename.endswith(".lua"):
            print(f"  Lua Script: {filename}")
            with open(os.path.join(config_dir, filename), 'r', encoding='utf-8') as f:
                node = ET.SubElement(root, "Script")
                node.set("file", filename)
                node.text = sanitize_xml(f.read())
    with open(output_xml, 'w', encoding='utf-8') as f:
        f.write(prettify(root))

def aggregate_board_desc(base_path, output_xml):
    print(f"Aggregating Board Descriptions...")
    root = ET.Element("BoardDescriptions")
    board_dir = os.path.join(base_path, "board_desc")
    for sub in ["host", "expansion"]:
        sub_dir = os.path.join(board_dir, sub)
        sub_node = ET.SubElement(root, "Category")
        sub_node.set("name", sub)
        for root_dir, dirs, files in os.walk(sub_dir):
            for f in sorted(files):
                if f.endswith(".json") and f != "NONE.json":
                    m_name = f.replace(".json", "")
                    print(f"  Board [{sub}]: {m_name}")
                    with open(os.path.join(root_dir, f), 'r', encoding='utf-8') as fh:
                        try:
                            node = dict_to_xml("Board", json.load(fh))
                            node.set("model", m_name)
                            sub_node.append(node)
                        except Exception as e: print(f"Error parsing {f}: {e}")
    with open(output_xml, 'w', encoding='utf-8') as f:
        f.write(prettify(root))

if __name__ == "__main__":
    BASE = "/Users/wangfeifei/code/amr_studio_v4/specifications/ModuleLibrary"
    OUT_DIR = os.path.join(BASE, "Aggregated")
    os.makedirs(OUT_DIR, exist_ok=True)
    aggregate_private_attributes(BASE, os.path.join(OUT_DIR, "PrivateAttributes.xml"))
    aggregate_interface_specs(BASE, os.path.join(OUT_DIR, "InterfaceSpecs.xml"))
    aggregate_module_config(BASE, os.path.join(OUT_DIR, "ModuleConfigs.xml"))
    aggregate_board_desc(BASE, os.path.join(OUT_DIR, "BoardDescriptions.xml"))
