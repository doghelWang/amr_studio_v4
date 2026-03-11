import sys
import os
import json
import zipfile

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from core.model_parser import ModelParser

def run_template_parity_test():
    # Direct binary file test
    # Create a dummy zip since parse_modelset expects it
    dummy_zip = "/Users/wangfeifei/code/amr_studio_v4/gemini_audits/template_test.zip"
    with zipfile.ZipFile(dummy_zip, 'w') as zf:
        zf.write('/Users/wangfeifei/code/amr_studio_v4/backend/templates/CompDesc.model', 'CompDesc.model')
    
    print(f"Parsing Template for Interface Data...")
    project = ModelParser.parse_modelset(dummy_zip)
    
    config = project["config"]
    mcu = config["mcu"]
    
    print("\n--- [MCU] Main Controller Interfaces ---")
    print(f"Model: {mcu['model']}")
    print(f"CAN Buses: {mcu['canBuses']}")
    print(f"ETH Ports: {mcu['ethPorts']}")
    
    print("\n--- [IO] Dynamic Channel Counting ---")
    for b in config["ioBoards"]:
        print(f"IO Board: {b['model']}")
        print(f"  DI: {b.get('diCount')}, DO: {b.get('doCount')}, Total: {b.get('channels')}")
        print(f"  CAN ID: {b.get('canNodeId')}")

    print("\n--- [Sensor] Connectivity Alignment ---")
    for s in config["sensors"]:
        if s['ip']:
            print(f"Sensor: {s['label']}")
            print(f"  Type: {s['connType']}, IP: {s['ip']}, Port: {s['port']}")

if __name__ == "__main__":
    run_template_parity_test()
