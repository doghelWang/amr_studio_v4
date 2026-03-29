import os

def hex_dump_file(path, label, offset=0, length=256):
    if not os.path.exists(path): return
    with open(path, 'rb') as f:
        f.seek(offset)
        data = f.read(length)
    print(f"\n--- {label} ({path}) ---")
    print(data.hex(' '))

# 挖掘两个 CompDesc.model 的前 256 字节
hex_dump_file('audit_deep/std/CompDesc.model', 'STANDARD RAW HEX')
hex_dump_file('audit_deep/gen/CompDesc.model', 'GENERATED RAW HEX')
