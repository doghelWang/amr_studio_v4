import sys
import zipfile
import tempfile
import json
import os
import struct
import blackboxprotobuf

def uint64_to_float(u):
    try:
        if isinstance(u, int):
            return struct.unpack('<d', struct.pack('<Q', u))[0]
    except Exception:
        pass
    return u

def get_schema_from_template():
    # Parse template to get the exact protobuf schema type dict
    template_path = r'd:\code\amr_studio_v4\backend\templates\CompDesc.model'
    with open(template_path, 'rb') as f:
        msg, typ = blackboxprotobuf.decode_message(f.read())
    return typ

def convert_bytes(obj):
    if isinstance(obj, bytes):
        try:
            return obj.decode('utf-8')
        except UnicodeDecodeError:
            return f"hex:{obj.hex()}"
    if isinstance(obj, dict):
        return {str(k): convert_bytes(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [convert_bytes(i) for i in obj]
    return obj

def extract_cmodel(zip_path, output_dir):
    schema_typ = get_schema_from_template()
    
    with tempfile.TemporaryDirectory() as tmp_dir:
        with zipfile.ZipFile(zip_path, 'r') as zf:
            zf.extractall(tmp_dir)
        
        comp_path = os.path.join(tmp_dir, 'CompDesc.model')
        if not os.path.exists(comp_path):
            print(f"Error: CompDesc.model not found in {zip_path}")
            return
            
        with open(comp_path, 'rb') as f:
            data = f.read()
            # Decode using the predefined schema to prevent infinite guessing!
            try:
                msg, _ = blackboxprotobuf.decode_message(data, schema_typ)
            except Exception as e:
                print(f"Schema mismatch or parsing error: {e}. Falling back to raw guessing (may be SLOW)...")
                msg, _ = blackboxprotobuf.decode_message(data)
                
        clean_msg = convert_bytes(msg)
        
        os.makedirs(output_dir, exist_ok=True)
        dumpjson_path = os.path.join(output_dir, 'CompDesc_recovered.json')
        with open(dumpjson_path, 'w', encoding='utf-8') as f:
            json.dump(clean_msg, f, indent=2, ensure_ascii=False)
            
        print(f"Successfully recovered model to JSON: {dumpjson_path}")
        
        # 提取"模块类型、模块名称、模块基础信息、模块私有信息、模块接口信息、模块关联关系、模块安装位置信息、模块连接关系、电气参数信息"
        modules = clean_msg.get('5', [])
        if isinstance(modules, dict):
            modules = [modules]
            
        extraction_results = []
        
        for mod in modules:
            m_id = mod.get('1', 'Unknown')
            m_data = mod.get('4', {})
            
            # 1: Base Info
            # 2: Private/Electrical/Position
            # 5: Relationships
            base = m_data.get('1', {})
            private_attrs = m_data.get('2', {}).get('1', [])
            rels = m_data.get('5', {}).get('1', [])
            
            m_name = base.get('1', {}).get('10', 'None')
            m_type = base.get('8', {}).get('21', {}).get('1', 'None')
            
            # Post-process properties properly parsing floats
            clean_private = []
            if isinstance(private_attrs, dict):
                private_attrs = [private_attrs]
            for pattr in private_attrs:
                group_name = pattr.get('2', '')
                props = pattr.get('3', [])
                if isinstance(props, dict): props = [props]
                clean_props = []
                for p in props:
                    k = p.get('1', '')
                    v_raw = p.get('17') or p.get('35') or p.get('45') or p.get('12') or p.get('2')
                    v_float = uint64_to_float(p.get('17')) if p.get('17') else None
                    unit = p.get('50', '')
                    desc = p.get('51', '')
                    
                    val_str = f"{v_float:.4f}" if isinstance(v_float, float) else str(v_raw)
                    clean_props.append(f"{k} ({desc}): {val_str} {unit}".strip())
                    
                clean_private.append({"Group": group_name, "Properties": clean_props})
                
            extraction_results.append({
                "ModuleID": m_id,
                "ModuleName": m_name,
                "ModuleType": m_type,
                "BaseInfo": base.get('1', {}),
                "PrivateAndElectricalParams": clean_private,
                "Relationships": rels
            })

        report_path = os.path.join(output_dir, 'extracted_report.md')
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(f"# CModel Extraction Report\n\n")
            for ex in extraction_results:
                f.write(f"## Module: {ex['ModuleName']} (Type: {ex['ModuleType']})\n")
                f.write(f"- **Module ID / 模块别称**: {ex['ModuleID']}\n")
                f.write(f"- **Base Info / 基础信息**: {json.dumps(ex['BaseInfo'], ensure_ascii=False)}\n")
                f.write(f"- **Relationships / 关联与连接关系**: {json.dumps(ex['Relationships'], ensure_ascii=False)}\n")
                f.write(f"- **Private Info & Electrical Params / 私有信息与电气参数**:\n")
                for grp in ex['PrivateAndElectricalParams']:
                    f.write(f"  - **{grp['Group']}**\n")
                    for p in grp['Properties']:
                        f.write(f"    - {p}\n")
                f.write("\n---\n")
                
        print(f"Successfully generated extraction report: {report_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python amr_cmodel_parser.py <input.cmodel> <output_directory>")
        sys.exit(1)
    extract_cmodel(sys.argv[1], sys.argv[2])
