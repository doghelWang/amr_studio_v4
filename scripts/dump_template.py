import sys
import json
import blackboxprotobuf

def dump_template():
    with open(r'd:\code\amr_studio_v4\backend\templates\CompDesc.model', 'rb') as f:
        msg, typ = blackboxprotobuf.decode_message(f.read())
        
    def convert_bytes(obj):
        if isinstance(obj, bytes):
            try:
                return obj.decode('utf-8')
            except UnicodeDecodeError:
                return f"hex:{obj.hex()}"
        if isinstance(obj, dict):
            return {str(k): convert_bytes(v) for k, v in obj.items()}
        if isinstance(obj, list):
            return [convert_bytes(i) for i in list(obj)]
        return obj

    with open('template_dump.json', 'w', encoding='utf-8') as f:
        json.dump(convert_bytes(msg), f, indent=2, ensure_ascii=False)
    print("Dumped template_dump.json")

if __name__ == '__main__':
    dump_template()
