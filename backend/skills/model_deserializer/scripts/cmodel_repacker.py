import sys, json, os, hashlib, zipfile

def compute_md5(path):
    with open(path, 'rb') as f:
        return hashlib.md5(f.read()).hexdigest()

def repack(source_dir, output_path):
    desc_path = os.path.join(source_dir, 'ModelFileDesc.json')
    if not os.path.exists(desc_path):
        print(f"Error: {desc_path} not found")
        return

    with open(desc_path, 'r', encoding='utf-8') as f:
        desc = json.load(f)

    # 1. Update MD5s
    files_to_pack = ['ModelFileDesc.json']
    for item in desc.get('ModelFileDesc', []):
        name = item['name']
        f_path = os.path.join(source_dir, name)
        if os.path.exists(f_path):
            item['md5'] = compute_md5(f_path)
            files_to_pack.append(name)
        else:
            print(f"Warning: {name} listed in desc but not found in {source_dir}")

    # 2. Write updated desc
    with open(desc_path, 'w', encoding='utf-8') as f:
        json.dump(desc, f, indent=4, ensure_ascii=False)

    # 3. Zip
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as z:
        for f in files_to_pack:
            z.write(os.path.join(source_dir, f), f)
    
    print(f"Successfully created {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python cmodel_repacker.py <source_dir> <output_cmodel>")
        sys.exit(1)
    repack(sys.argv[1], sys.argv[2])
