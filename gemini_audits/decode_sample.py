import blackboxprotobuf
import json
import os

def decode_to_json(bin_path, json_path):
    if not os.path.exists(bin_path):
        print(f"Skipping {bin_path}, not found.")
        return
    try:
        with open(bin_path, 'rb') as f:
            msg, _ = blackboxprotobuf.decode_message(f.read())
        
        class BytesEncoder(json.JSONEncoder):
            def default(self, obj):
                if isinstance(obj, bytes):
                    try:
                        return obj.decode('utf-8')
                    except:
                        return obj.hex()
                return str(obj)

        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(msg, f, indent=2, ensure_ascii=False, cls=BytesEncoder)
        print(f"Decoded {bin_path} to {json_path}")
    except Exception as e:
        print(f"Error decoding {bin_path}: {e}")

if __name__ == "__main__":
    base = "/Users/wangfeifei/code/amr_studio_v4/gemini_audits/new_sample_check"
    decode_to_json(os.path.join(base, "CompDesc.model"), os.path.join(base, "CompDesc_new.json"))
    decode_to_json(os.path.join(base, "FuncDesc.model"), os.path.join(base, "FuncDesc_new.json"))
