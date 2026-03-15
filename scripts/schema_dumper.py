import sys
import os
import json
import zipfile
import tempfile
import base64

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))
import blackboxprotobuf

def dump_protobuf_with_schema(template_path, target_path, out_file):
    print("Loading schema from template...")
    with open(template_path, 'rb') as f:
        _, msg_type = blackboxprotobuf.decode_message(f.read())
        
    print("Extracting target...")
    with tempfile.TemporaryDirectory() as tmpdir:
        with zipfile.ZipFile(target_path, 'r') as zf:
            zf.extractall(tmpdir)
        
        comp_path = os.path.join(tmpdir, 'CompDesc.model')
        with open(comp_path, 'rb') as f:
            data = f.read()

    print("Decoding target with schema...")
    msg, _ = blackboxprotobuf.decode_message(data, msg_type)
    
    def decode_val(obj):
        if isinstance(obj, bytes):
            try: return obj.decode('utf-8')
            except: 
                try: return obj.decode('gbk')
                except: return f"<b64: {base64.b64encode(obj).decode()}>"
        elif isinstance(obj, dict): return {k: decode_val(v) for k, v in obj.items()}
        elif isinstance(obj, list): return [decode_val(v) for v in obj]
        else: return obj

    cleaned = decode_val(msg)
    
    # Save the output
    print(f"Saving to {out_file}...")
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(cleaned, f, indent=2, ensure_ascii=False)
    
    print("Done!")

if __name__ == '__main__':
    dump_protobuf_with_schema(
        "../backend/templates/CompDesc.model", 
        "../docs/ModelSet312.cmodel", 
        "../docs/dump_312_schema.json"
    )
