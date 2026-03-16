import sys
import os
import json
import blackboxprotobuf

project_root = r"D:\code\amr_studio_v4"
cmodel_path = os.path.join(project_root, "docs", "ModelSet312.cmodel")

import zipfile
with zipfile.ZipFile(cmodel_path, 'r') as zf:
    with zf.open('FuncDesc.model') as f:
        data = f.read()
        msg, _ = blackboxprotobuf.decode_message(data)
        
def print_keys(d, indent=0):
    if isinstance(d, dict):
        for k, v in d.items():
            print("  " * indent + str(k))
            print_keys(v, indent + 1)
    elif isinstance(d, list):
        for i, item in enumerate(d):
            print("  " * indent + f"[{i}]")
            print_keys(item, indent + 1)

print("FuncDesc RAW Message Keys:")
print_keys(msg)
