import os
import zipfile
import sys
import argparse

def unzip_cmodel(input_file, output_dir):
    """
    Unzips a .cmodel file (which is a ZIP archive) into a directory.
    """
    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found")
        sys.exit(1)
        
    if not output_dir:
        output_dir = input_file + "_extracted"
        
    os.makedirs(output_dir, exist_ok=True)
    
    try:
        with zipfile.ZipFile(input_file, 'r') as zip_ref:
            zip_ref.extractall(output_dir)
            print(f"Successfully extracted {input_file} to {output_dir}")
            print("Contents:")
            for name in zip_ref.namelist():
                print(f"  - {name}")
    except zipfile.BadZipFile:
        print(f"Error: {input_file} is not a valid cmodel/zip file")
        sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Unzip a .cmodel file")
    parser.add_argument("input", help="Path to the .cmodel file")
    parser.add_argument("-o", "--output", help="Output directory (optional)")
    
    args = parser.parse_args()
    unzip_cmodel(args.input, args.output)
