import os
import sys
import json
import argparse
import blackboxprotobuf

def json_serializable(obj):
    """Recursively convert bytes to strings or hex for JSON serialization."""
    if isinstance(obj, dict):
        return {k: json_serializable(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [json_serializable(x) for x in obj]
    elif isinstance(obj, bytes):
        try:
            return obj.decode('utf-8')
        except:
            return obj.hex()
    return obj

def deserialize_model(input_file, output_file):
    """
    Deserializes a binary .model file into a JSON file.
    """
    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found")
        sys.exit(1)
        
    try:
        with open(input_file, "rb") as f:
            data = f.read()
            
        decoded, typedef = blackboxprotobuf.decode_message(data)
        serializable = json_serializable(decoded)
        
        if not output_file:
            output_file = input_file + ".json"
            
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(serializable, f, indent=4, ensure_ascii=False)
            
        print(f"Successfully deserialized {input_file} to {output_file}")
        
    except Exception as e:
        print(f"Error during deserialization: {e}")
        sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Deserialize a binary .model file to JSON")
    parser.add_argument("input", help="Path to the .model file")
    parser.add_argument("-o", "--output", help="Output JSON file path (optional)")
    
    args = parser.parse_args()
    deserialize_model(args.input, args.output)
