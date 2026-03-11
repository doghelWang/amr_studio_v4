import blackboxprotobuf
import json
import sys

def dump_model(path, out_path):
    with open(path, 'rb') as f:
        msg, typ = blackboxprotobuf.decode_message(f.read())
    
    class BytesEncoder(json.JSONEncoder):
        def default(self, obj):
            if isinstance(obj, bytes):
                try: return obj.decode('utf-8')
                except UnicodeDecodeError: return obj.hex()
            return json.JSONEncoder.default(self, obj)

    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(msg, f, ensure_ascii=False, indent=2, cls=BytesEncoder)

if __name__ == '__main__':
    dump_model('/Users/wangfeifei/code/amr_studio_v4/gemini_audits/test_arch_out/CompDesc.model', '/Users/wangfeifei/code/amr_studio_v4/gemini_audits/test_arch_out/CompDesc_dump.json')
    dump_model('/Users/wangfeifei/code/amr_studio_v4/gemini_audits/test_arch_out/FuncDesc.model', '/Users/wangfeifei/code/amr_studio_v4/gemini_audits/test_arch_out/FuncDesc_dump.json')
    print("Generated Artifact Dump complete.")
