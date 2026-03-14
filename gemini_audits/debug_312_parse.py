import sys
import os
import json

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from core.model_parser import ModelParser

sample_path = "/Users/wangfeifei/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/doghell_aeda/msg/file/2026-03/ModelSet312.cmodel"

print(f"--- DEBUG PARSE: {sample_path} ---")
try:
    result = ModelParser.parse_modelset(sample_path)
    # Output the config part which the frontend uses
    print(json.dumps(result.get('config', {}), indent=2, ensure_ascii=False))
except Exception as e:
    print(f"Error during parse: {e}")
