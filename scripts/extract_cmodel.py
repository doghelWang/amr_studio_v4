import sys
import zipfile
import tempfile
import json
import blackboxprotobuf
import os

def extract_cmodel_to_json(zip_path, output_json):
    with tempfile.TemporaryDirectory() as tmp_dir:
        with zipfile.ZipFile(zip_path, 'r') as zf:
            zf.extractall(tmp_dir)
        
        comp_path = os.path.join(tmp_dir, 'CompDesc.model')
        if not os.path.exists(comp_path):
            print(f"Error: CompDesc.model not found in {zip_path}")
            return
            
        with open(comp_path, 'rb') as f:
            msg, typ = blackboxprotobuf.decode_message(f.read())
            
        def convert_bytes_and_format(obj):
            if isinstance(obj, bytes):
                try:
                    return obj.decode('utf-8')
                except UnicodeDecodeError:
                    return f"hex:{obj.hex()}"
            if isinstance(obj, dict):
                return {str(k): convert_bytes_and_format(v) for k, v in obj.items()}
            if isinstance(obj, list):
                return [convert_bytes_and_format(i) for i in list(obj)]
            return obj
            
        clean_msg = convert_bytes_and_format(msg)
        with open(output_json, 'w', encoding='utf-8') as f:
            json.dump(clean_msg, f, indent=2, ensure_ascii=False)
        print(f"Successfully extracted {zip_path} to {output_json}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python extract_cmodel.py <input.cmodel> <output.json>")
        sys.exit(1)
    extract_cmodel_to_json(sys.argv[1], sys.argv[2])
