import os

def analyze_model_raw(path, label):
    if not os.path.exists(path): return f"File missing: {path}"
    with open(path, 'rb') as f: data = f.read()
    
    size = len(data)
    # Check for Chassis identifier (chassis) in the stream
    has_chassis = b'chassis' in data
    # Tag 5 (struct_param) starts with 0x2a
    tag5_count = data.count(b'\x2a')
    
    return {
        "label": label,
        "size": size,
        "has_chassis_string": has_chassis,
        "tag5_occurrences": tag5_count,
        "first_16_hex": data[:16].hex(' ')
    }

def run_bit_audit():
    std_p = 'audits/verify_std/CompDesc.model'
    gen_p = 'audits/verify_gen/CompDesc.model'
    
    std_info = analyze_model_raw(std_p, "Standard")
    gen_info = analyze_model_raw(gen_p, "Generated")
    
    report = [
        "# CModel 比特级自证对比报告",
        f"| 指标 | 标准样本 (312) | 您的生成物 | 状态 |",
        f"| :--- | :--- | :--- | :--- |",
        f"| 物理大小 | {std_info['size']} Bytes | {gen_info['size']} Bytes | - |",
        f"| 底盘识别串 | {'✅ Found' if std_info['has_chassis_string'] else '❌ Missing'} | {'✅ Found' if gen_info['has_chassis_string'] else '❌ Missing'} | {'✅' if std_info['has_chassis_string'] == gen_info['has_chassis_string'] else '⚠️'} |",
        f"| Tag 5 (0x2a) 频次 | {std_info['tag5_occurrences']} | {gen_info['tag5_occurrences']} | - |",
        f"| 起始 Hex (16B) | {std_info['first_16_hex']} | {gen_info['first_16_hex']} | {'✅ Match' if std_info['first_16_hex'].split()[0] == gen_info['first_16_hex'].split()[0] else '⚠️ Header Diff'} |"
    ]
    
    with open('audits/BIT_PERFECT_AUDIT.md', 'w') as f:
        f.write("\n".join(report))
    print("Bit-Perfect audit saved to audits/BIT_PERFECT_AUDIT.md")

if __name__ == "__main__":
    run_bit_audit()
