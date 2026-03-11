import sys
import os
import json

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from core.model_parser import ModelParser

def run_import_verification():
    zip_path = sys.argv[1] if len(sys.argv) > 1 else "/Users/wangfeifei/code/amr_studio_v4/gemini_audits/test_arch.zip"
    
    if not os.path.exists(zip_path):
        print(f"Error: {zip_path} not found. Run direct_engine_test.py first.")
        return

    print(f"Importing and Parsing {zip_path}...")
    project = ModelParser.parse_modelset(zip_path)
    
    config = project["config"]
    print("\n--- Verification Results ---")
    print(f"Robot Name: {config['identity']['robotName']}")
    
    # Verify Sensors
    for s in config["sensors"]:
        print(f"\nSensor: {s['label']}")
        print(f"  Pose: X={s['mountX']}, Y={s['mountY']}, Z={s['mountZ']}")
        print(f"  Network: IP={s.get('ip')}, Port={s.get('port')}")
        
    # Verify IO Boards
    for b in config["ioBoards"]:
        print(f"\nIO Board: {b['model']}")
        print(f"  CAN ID: {b.get('canNodeId')}")
        print(f"  Channels: {b.get('channels')}")

    print("\n---------------------------")

if __name__ == "__main__":
    run_import_verification()
