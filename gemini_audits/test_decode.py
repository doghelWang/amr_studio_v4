import blackboxprotobuf
import os
import signal

def handler(signum, frame):
    raise Exception("Timeout reached!")

signal.signal(signal.SIGALRM, handler)
signal.alarm(5) # 5 seconds

path = "/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-03/ModelSet312.cmodel"
temp_dir = "/tmp/extract_test"
os.makedirs(temp_dir, exist_ok=True)

import zipfile
with zipfile.ZipFile(path, 'r') as zf:
    zf.extractall(temp_dir)

comp_path = os.path.join(temp_dir, 'CompDesc.model')
print(f"File size: {os.path.getsize(comp_path)} bytes")

with open(comp_path, 'rb') as f:
    data = f.read()
    print("Starting decode...")
    try:
        msg, typ = blackboxprotobuf.decode_message(data)
        print("Decode success!")
        print(f"Message keys: {msg.keys()}")
    except Exception as e:
        print(f"Decode failed: {e}")
