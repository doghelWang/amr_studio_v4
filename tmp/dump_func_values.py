import sys
import os
import blackboxprotobuf
import json

project_root = r"D:\code\amr_studio_v4"
cmodel_path = os.path.join(project_root, "docs", "ModelSet312.cmodel")

import zipfile
with zipfile.ZipFile(cmodel_path, 'r') as zf:
    with zf.open('FuncDesc.model') as f:
        data = f.read()
        msg, _ = blackboxprotobuf.decode_message(data)

def dump_struct(d, path=""):
    if isinstance(d, dict):
        for k, v in d.items():
            dump_struct(v, f"{path}.{k}" if path else k)
    elif isinstance(d, list):
        for i, v in enumerate(d):
            dump_struct(v, f"{path}[{i}]")
    else:
        # Check if it looks like bytes
        if isinstance(d, (bytes, bytearray)):
            try: print(f"{path}: {d.decode('utf-8')}")
            except: print(f"{path}: {d.hex()}")
        else:
            print(f"{path}: {d}")

dump_struct(msg)
