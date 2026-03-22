import requests
import os
import json

BASE_URL = "http://localhost:8002/api/v1"
CMODEL_PATH = "docs/ModelSet39.cmodel"

def test_fix_01():
    print("--- Starting Test Fix-01 ---")
    
    # 1. Test Upload
    print("1. Testing Upload...")
    with open(CMODEL_PATH, "rb") as f:
        files = {"file": f}
        response = requests.post(f"{BASE_URL}/models/upload", files=files)
    
    if response.status_code != 200:
        print(f"FAILED: Upload failed with {response.status_code}")
        print(response.text)
        return
    
    data = response.json()
    project_id = data["project_id"]
    full_json = data["full_json"]
    print(f"SUCCESS: Project created: {project_id}")
    
    # 2. Verify Key Convention (Snake Case)
    print("2. Verifying Snake Case...")
    # Check a known key that used to be camelCased
    # In CompDesc.proto: module_uuid, module_name
    found_snake = False
    if "more_module_info" in full_json:
        found_snake = True
        print("SUCCESS: Found 'more_module_info' (snake_case)")
    else:
        print("FAILED: 'more_module_info' not found in root")

    # 3. Verify Persistence (Component Retrieval)
    print("3. Testing Persistence...")
    # Get a UUID from full_json
    try:
        sample_uuid = full_json["more_module_info"][0]["module_componets"][0]["general_attr"]["module_uuid"]["string_value"]
        print(f"Sample UUID: {sample_uuid}")
        
        comp_resp = requests.get(f"{BASE_URL}/models/{project_id}/components/{sample_uuid}")
        if comp_resp.status_code == 200:
            print("SUCCESS: Component retrieved from persistent storage")
        else:
            print(f"FAILED: Component retrieval failed with {comp_resp.status_code}")
    except Exception as e:
        print(f"FAILED: Parsing full_json for UUID: {e}")

    # 4. Verify Ability API
    print("4. Testing Ability API...")
    abi_resp = requests.get(f"{BASE_URL}/models/{project_id}/abilities")
    if abi_resp.status_code == 200:
        print("SUCCESS: AbilitySet retrieved")
        # print(json.dumps(abi_resp.json(), indent=2)[:200])
    else:
        print(f"FAILED: AbilitySet retrieval failed with {abi_resp.status_code}")

    print("--- Test Fix-01 Complete ---")

if __name__ == "__main__":
    # Make sure server is running
    try:
        test_fix_01()
    except requests.exceptions.ConnectionError:
        print("ERROR: Server is not running on port 8002. Please start backend first.")
