import sys
import json
import xml.etree.ElementTree as ET
import subprocess
import os

def try_read_json(content):
    try:
        data = json.loads(content.decode('utf-8', errors='strict'))
        return "JSON", json.dumps(data, indent=2, ensure_ascii=False)
    except Exception:
        return None, None

def try_read_xml(content):
    try:
        text = content.decode('utf-8', errors='strict')
        root = ET.fromstring(text)
        return "XML", text
    except Exception:
        return None, None

def try_read_protobuf(file_path):
    try:
        # Require protoc to be installed
        result = subprocess.run(
            ['protoc', '--decode_raw'],
            stdin=open(file_path, 'rb'),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=5
        )
        if result.returncode == 0 and len(result.stdout) > 0:
            return "Protobuf (raw)", result.stdout.decode('utf-8', errors='replace')
    except Exception:
        pass
    return None, None

def try_strings(file_path):
    try:
        result = subprocess.run(
            ['strings', file_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=5
        )
        if result.returncode == 0 and len(result.stdout) > 0:
            return "Strings output (fallback)", result.stdout.decode('utf-8', errors='replace')
    except Exception:
        pass
    return None, None

def test_sqlite(file_path):
    try:
        with open(file_path, 'rb') as f:
            header = f.read(16)
            if header.startswith(b'SQLite format 3\0'):
                return "SQLite3 Database", "Detected SQLite3 Magic Number"
    except Exception:
        pass
    return None, None

def analyze_file(file_path):
    if not os.path.exists(file_path):
        print(f"Error: File not found {file_path}")
        return

    try:
        with open(file_path, 'rb') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return

    print(f"========== Analyzing file: {file_path} ({len(content)} bytes) ==========")
    
    # Try SQLite
    fmt, parsed = test_sqlite(file_path)
    if fmt:
        print(f"Detected Format: {fmt}\n{parsed}")
        return

    # Try JSON
    fmt, parsed = try_read_json(content)
    if fmt:
        print(f"Detected Format: {fmt}")
        print(parsed[:3000] + ("\n...[TRUNCATED]" if len(parsed) > 3000 else ""))
        return

    # Try XML
    fmt, parsed = try_read_xml(content)
    if fmt:
        print(f"Detected Format: {fmt}")
        print(parsed[:3000] + ("\n...[TRUNCATED]" if len(parsed) > 3000 else ""))
        return

    # Try Protobuf
    fmt, parsed = try_read_protobuf(file_path)
    if fmt:
        print(f"Detected Format: {fmt}")
        print(parsed[:3000] + ("\n...[TRUNCATED]" if len(parsed) > 3000 else ""))
        return

    # Try strings
    fmt, parsed = try_strings(file_path)
    if fmt:
        print(f"Fallback Format: {fmt}")
        lines = parsed.split('\n')
        print('\n'.join(lines[:150]) + ("\n...[TRUNCATED]" if len(lines) > 150 else ""))
        return
        
    print("Could not identify format or extract text.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python parser.py <file1> [<file2> ...]")
        sys.exit(1)
    for arg in sys.argv[1:]:
        analyze_file(arg)
        print("\n" + "-" * 80 + "\n")
