import sys
import os
import time

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from core.model_parser import ModelParser

sample_path = "/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-03/ModelSet312.cmodel"

print(f"Starting parsing test for: {sample_path}")
start_time = time.time()

try:
    # Use a timeout logic or just run to see where it sticks
    result = ModelParser.parse_modelset(sample_path, return_raw=True)
    print(f"Parsing finished in {time.time() - start_time:.2f} seconds.")
    print(f"Found {len(result['config']['sensors'])} sensors.")
    print(f"Found {len(result['config']['others'])} other modules.")
except Exception as e:
    print(f"Parsing failed with error: {e}")
