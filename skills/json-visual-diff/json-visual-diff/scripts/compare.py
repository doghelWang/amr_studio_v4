import sys
import json
import difflib

def load_json(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return json.dumps(data, indent=2, sort_keys=True, ensure_ascii=False).splitlines()

def main():
    if len(sys.argv) != 3:
        print("Usage: python3 compare.py <file1.json> <file2.json>")
        sys.exit(1)
        
    file1, file2 = sys.argv[1], sys.argv[2]
    
    try:
        lines1 = load_json(file1)
        lines2 = load_json(file2)
    except Exception as e:
        print(f"Error reading JSON files: {e}")
        sys.exit(1)
        
    diff = list(difflib.unified_diff(lines1, lines2, fromfile=file1, tofile=file2, lineterm=""))
    
    if not diff:
        print("✅ Files are identical.")
        return
        
    print("🔍 Visual JSON Diff:")
    print("-" * 50)
    for line in diff:
        if line.startswith("+") and not line.startswith("+++"):
            print(f"\033[92m{line}\033[0m") # Green
        elif line.startswith("-") and not line.startswith("---"):
            print(f"\033[91m{line}\033[0m") # Red
        elif line.startswith("@"):
            print(f"\033[96m{line}\033[0m") # Cyan
        else:
            print(line)
    print("-" * 50)
    print(f"Total differences found: {len([l for l in diff if (l.startswith("+") and not l.startswith("+++")) or (l.startswith("-") and not l.startswith("---"))])}")

if __name__ == "__main__":
    main()
