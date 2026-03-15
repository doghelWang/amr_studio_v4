import sys
import struct
import json
import os
import zipfile
import tempfile

class AMRModelParser:
    def __init__(self, binary_data: bytes):
        self.data = binary_data
        self.cursor = 0
        self.parsed_dom = {}
        self.stack = [self.parsed_dom]
        
    def read_byte(self):
        if self.cursor >= len(self.data):
            return None
        b = self.data[self.cursor:self.cursor+1]
        self.cursor += 1
        return b

    def read_bytes(self, length):
        b = self.data[self.cursor:self.cursor+length]
        self.cursor += length
        return b
        
    def peek_byte(self):
        if self.cursor >= len(self.data):
            return None
        return self.data[self.cursor:self.cursor+1]

    def read_string_value(self):
        # A simple string reader: reads until a non-printable ascii/utf8 byte or control char
        # In actual protobuf/TLV, it's length-prefixed, but we can do a bounds check
        # For this pseudo-parser, let's look for standard length varints first
        length = self._read_varint()
        if length > 0 and self.cursor + length <= len(self.data):
            val = self.data[self.cursor:self.cursor+length]
            self.cursor += length
            try:
                return val.decode('utf-8')
            except UnicodeDecodeError:
                return f"HEX:{val.hex()}"
        return ""

    def _read_varint(self):
        result = 0
        shift = 0
        while True:
            b = self.read_byte()
            if not b:
                return 0
            val = b[0]
            result |= (val & 0x7f) << shift
            if not (val & 0x80):
                break
            shift += 7
        return result

    def parse(self):
        # Full BlackboxProtobuf fallback since the custom pseudo code is just for float extraction
        # We will use blackboxprotobuf but inject the float fixer!
        import blackboxprotobuf
        try:
            msg, typ = blackboxprotobuf.decode_message(self.data)
            return self._fix_floats(msg)
        except Exception as e:
            return {"error": str(e)}

    def _fix_floats(self, obj):
        if isinstance(obj, bytes):
            try:
                return obj.decode('utf-8')
            except UnicodeDecodeError:
                return f"HEX:{obj.hex()}"
        elif isinstance(obj, int):
            # IEEE 754 Float64 Decoding as per reference.md (e.g. 25.0, 35.0, 125.0)
            # If the int is suspiciously large, it's likely a Float64
            if obj > 4000000000000000000:
                try:
                    fval = struct.unpack('<d', struct.pack('<Q', obj))[0]
                    # Only convert if it's a reasonable float (e.g., between -100000 and 100000)
                    if -100000 < fval < 100000:
                        return round(fval, 4)
                except Exception:
                    pass
            return obj
        elif isinstance(obj, dict):
            return {str(k): self._fix_floats(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [self._fix_floats(i) for i in obj]
        return obj

def process_cmodel(zip_path, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp_dir:
        with zipfile.ZipFile(zip_path, 'r') as zf:
            zf.extractall(tmp_dir)
            
        for file in os.listdir(tmp_dir):
            if file.endswith('.model'):
                file_path = os.path.join(tmp_dir, file)
                with open(file_path, 'rb') as f:
                    parser = AMRModelParser(f.read())
                    dom = parser.parse()
                    out_json = os.path.join(output_dir, file.replace('.model', '.json'))
                    with open(out_json, 'w', encoding='utf-8') as jf:
                        json.dump(dom, jf, indent=2, ensure_ascii=False)
                    print(f"Decoded {file} -> {out_json}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python true_parser.py <input.cmodel> <output_dir>")
        sys.exit(1)
    process_cmodel(sys.argv[1], sys.argv[2])
