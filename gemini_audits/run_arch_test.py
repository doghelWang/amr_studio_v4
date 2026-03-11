import json
import os
import zipfile
import subprocess
import urllib.request
import urllib.error

payload = {
    "robotName": "Architecture_Test_Robot",
    "version": "1.0",
    "driveType": "QUAD_STEER",
    "navigationMethod": "LIDAR_SLAM",
    "wheels": [
        {
            "id": "w1", "label": "W1", "mountX": 400.0, "mountY": 300.0, "mountYaw": 0,
            "orientation": "FL", "driverModel": "ELMO", "canBus": "CAN0", "canNodeId": 2,
            "motorPolarity": "NORMAL", "zeroPos": 0, "leftLimit": -90, "rightLimit": 90,
            "headOffsetIdle": 10, "tailOffsetIdle": 10, "leftOffsetIdle": 10, "rightOffsetIdle": 10,
            "maxVelocityIdle": 100, "maxAccIdle": 100, "maxDecIdle": 100,
            "headOffsetFull": 20, "tailOffsetFull": 20, "leftOffsetFull": 20, "rightOffsetFull": 20,
            "maxVelocityFull": 100, "maxAccFull": 100, "maxDecFull": 100
        }
    ],
    "sensors": [
        {
            "id": "s1", "type": "LASER", "model": "SICK", "usageNavi": True, "usageObs": True,
            "offsetX": 500.0, "offsetY": 0.0, "offsetZ": 200.0, "yaw": 0.0, "pitch": 0.0, "roll": 0.0,
            "ip": "192.168.1.88", "port": 2112
        }
    ],
    "ioBoards": [
        {
            "id": "board1", "model": "IO_EXT", "canNodeId": 110, "channels": 16
        }
    ],
    "ioPorts": [
        {
            "id": "port1", "port": "DI01", "logicBind": "SAFETY_IO_EMC_STOP", "originModel": "board1"
        }
    ]
}

try:
    print("Testing Generation...")
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request("http://127.0.0.1:8000/api/v1/generate", data=data, headers={'Content-Type': 'application/json'})
    
    with urllib.request.urlopen(req) as response:
        if response.status == 200:
            zip_path = "/Users/wangfeifei/code/amr_studio_v4/gemini_audits/test_arch.zip"
            with open(zip_path, "wb") as f:
                f.write(response.read())
            
            # Unzip and dump for verification
            out_dir = "/Users/wangfeifei/code/amr_studio_v4/gemini_audits/test_arch_out"
            os.makedirs(out_dir, exist_ok=True)
            with zipfile.ZipFile(zip_path, 'r') as zf:
                zf.extractall(out_dir)
                
            print("Success! Artifacts written.")
            # Trigger dump script
            subprocess.run(["/Users/wangfeifei/code/amr_studio_v4/backend/venv/bin/python3", "/Users/wangfeifei/code/amr_studio_v4/backend/dump_templates.py"])
        else:
            print(f"Error: {response.status}")
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    print(f"Response Body: {e.read().decode('utf-8')}")
except Exception as e:
    print(f"Exception: {e}")
