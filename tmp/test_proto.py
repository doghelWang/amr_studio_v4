import os
import zipfile
import blackboxprotobuf
import time
import signal

def handler(signum, frame):
    raise Exception("Timeout reached!")

def test():
    cmodel_path = r"D:\code\amr_studio_v4\docs\reference\ModuleLibrary\AmrModelTem\MQ-Q3-600LE-D(T)\MQ-Q3-600LE-D(T).cmodel"
    with zipfile.ZipFile(cmodel_path, 'r') as zf:
        data = zf.read('CompDesc.model')
    
    print(f"File size: {len(data)} bytes")
    print("Decoding with partial schema for tag 5...")
    message_type = {
        "5": {
            "type": "message",
            "message_typedef": {} # Let it guess inside
        }
    }
    start = time.time()
    try:
        msg, schema = blackboxprotobuf.decode_message(data, message_type)
        print(f"Success! Time: {time.time() - start:.2f}s")
        print(f"Nodes found: {len(msg.get('5', []))}")
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    test()
