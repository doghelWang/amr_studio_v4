import sys
import os
import json
import zipfile
import tempfile
import base64

# Add backend to path so we can use blackboxprotobuf if installed there, or just import it
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))
import blackboxprotobuf

def dump_protobuf(path, out_file):
    with tempfile.TemporaryDirectory() as tmpdir:
        with zipfile.ZipFile(path, 'r') as zf:
            zf.extractall(tmpdir)
        
        comp_path = os.path.join(tmpdir, 'CompDesc.model')
        with open(comp_path, 'rb') as f:
            data = f.read()

    msg, typ = blackboxprotobuf.decode_message(data)
    
    # helper to decode bytes to string where possible
    def decode_bytes(obj):
        if isinstance(obj, bytes):
            try:
                return obj.decode('utf-8')
            except:
                try:
                    return obj.decode('gbk')
                except:
                    return f"<binary base64: {base64.b64encode(obj).decode()}>"
        elif isinstance(obj, dict):
            return {k: decode_bytes(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [decode_bytes(v) for v in obj]
        else:
            return obj

    cleaned = decode_bytes(msg)
    
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(cleaned, f, indent=2, ensure_ascii=False)
    
    print(f"Dumped to {out_file}")

if __name__ == '__main__':
    dump_protobuf("../docs/ModelSet312.cmodel", "../docs/dump_312.json")
