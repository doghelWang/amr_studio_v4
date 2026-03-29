import os
import json
import xml.etree.ElementTree as ET
from xml.dom import minidom

# Definitions
BOARD_DIR = os.path.join(os.path.dirname(__file__), '../docs/reference/ModuleLibrary/board_desc/')
OUT_FILE = os.path.join(os.path.dirname(__file__), '../frontend/public/models/v4/BoardDescriptions.xml')

# Interface Whitelist per user requirements
WHITELIST = {'can', 'uart', 'rs485', 'usb', 'ethernet', 'di', 'do', 'ai', 'ao'}

def parse_board_json(filepath):
    """ Parses a single JSON file and extracts whitelisted interfaces. """
    with open(filepath, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            print(f"Warning: Failed to decode {filepath}")
            return None
        
    for board_type, content in data.items():
        board_data = {
            'typeKey': board_type,
            'interfaces': []
        }
        
        # The sections that might contain interfaces
        for section in ['通信接口', '功能接口', 'io接口', '基本信息']:
            if section not in content:
                continue
            
            section_data = content[section]
            if not isinstance(section_data, dict):
                continue
                
            for port_protocol, port_list in section_data.items():
                protocol_unified = str(port_protocol).lower()
                
                # Normalize common discrepancies for UI recognition
                if protocol_unified == 'eth':
                    protocol_unified = 'ethernet'
                elif protocol_unified == '485':
                    protocol_unified = 'rs485'
                
                # Check whitelist (allowing for arrays or dicts)
                if protocol_unified not in WHITELIST:
                    continue
                    
                if isinstance(port_list, list):
                    for port_item in port_list:
                        board_data['interfaces'].append({
                            'protocol': protocol_unified.upper(),
                            'name': port_item.get('name', f"{protocol_unified.upper()}_Unknown")
                        })
                elif isinstance(port_list, dict):
                     board_data['interfaces'].append({
                         'protocol': protocol_unified.upper(),
                         'name': port_list.get('name', f"{protocol_unified.upper()}_Unknown")
                     })
                     
        # Inject 4 Ethernet ports for Main Controllers missing them natively
        # Identify main controller by typeKey or board_type
        # Usually typeKey starts with RA-MC- means main controller.
        b_types = content.get('基本信息', {}).get('board_type', [])
        is_main = any('CTRL_MASTER' in bt for bt in b_types) or board_type.startswith('RA-MC-')
        if is_main:
            for i in range(1, 5):
                board_data['interfaces'].append({
                    'protocol': 'ETHERNET',
                    'name': f'ETH_{i}'
                })
        
        return board_data # Usually 1 board per file
    return None

def build_xml():
    root = ET.Element("BoardDescriptions")
    
    # Recursively find all JSON files
    for root_dir, dirs, files in os.walk(BOARD_DIR):
        for file in files:
            if file.endswith('.json'):
                full_path = os.path.join(root_dir, file)
                board_data = parse_board_json(full_path)
                
                if board_data and len(board_data['interfaces']) > 0:
                    board_tag = ET.SubElement(root, "Board", typeKey=board_data['typeKey'])
                    for port in board_data['interfaces']:
                        ET.SubElement(board_tag, "Interface", protocol=port['protocol'], name=port['name'])

    # Format XML
    xml_str = ET.tostring(root, encoding='utf-8')
    parsed = minidom.parseString(xml_str)
    pretty_xml = parsed.toprettyxml(indent="  ")
    
    # Ensure public dir exists
    os.makedirs(os.path.dirname(OUT_FILE), exist_ok=True)
    
    with open(OUT_FILE, "w", encoding='utf-8') as f:
        f.write(pretty_xml)
        
    print(f"Successfully generated {OUT_FILE} with Board Models.")

if __name__ == "__main__":
    print("Starting BoardDescription XML compilation...")
    build_xml()
