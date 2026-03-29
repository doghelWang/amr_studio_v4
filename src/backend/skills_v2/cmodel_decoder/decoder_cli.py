import sys
import os
from decoder import decode_cmodel

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 decoder_cli.py <cmodel_path> <output_dir>")
        sys.exit(1)
        
    cmodel_path = sys.argv[1]
    output_dir = sys.argv[2]
    
    audit = decode_cmodel(cmodel_path, output_dir)
    print("\n".join(audit))
