"""
AMR Studio Pro V4 — Package Factory Templates to ZIP
=====================================================
Run this script once to create 'factory_template.zip' from the templates/ directory.
This ZIP can then be imported via the frontend's local file import feature.
"""
import zipfile
import hashlib
import json
import os
from pathlib import Path

TEMPLATES_DIR = Path(__file__).parent / "templates"
OUTPUT_PATH = Path(__file__).parent / "factory_template.zip"

files_to_include = ["AbiSet.model", "CompDesc.model", "FuncDesc.model", "ModelFileDesc.json"]

manifest = []
with zipfile.ZipFile(OUTPUT_PATH, 'w', compression=zipfile.ZIP_DEFLATED) as zf:
    for fname in files_to_include:
        fpath = TEMPLATES_DIR / fname
        if fpath.exists():
            data = fpath.read_bytes()
            zf.writestr(fname, data)
            manifest.append({
                "name": fname,
                "size": len(data),
                "md5": hashlib.md5(data).hexdigest()
            })
            print(f"  Added: {fname} ({len(data):,} bytes)")
        else:
            print(f"  MISSING: {fname}")

print(f"\nCreated: {OUTPUT_PATH}")
print(f"Total size: {OUTPUT_PATH.stat().st_size:,} bytes")
print(f"\nManifest:")
for item in manifest:
    print(f"  {item['name']}: md5={item['md5'][:8]}...")
