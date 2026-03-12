import logging
from typing import Any, List, Optional
import struct

logger = logging.getLogger(__name__)

def float_to_uint64(f: float) -> int:
    return struct.unpack('<Q', struct.pack('<d', float(f)))[0]

class ProtoNavigator:
    @classmethod
    def deep_patch(cls, data: Any, target_key: str, value: Any, val_tag: str):
        """
        Recursively searches the entire data tree. 
        Supports aliases (e.g. 'ip' vs 'ipAddress').
        Updates ALL occurrences.
        """
        ALIASES = {
            "ipAddress": [b"ip", b"ipAddress"],
            "nodeId": [b"nodeId", b"nodeID", b"canNodeId"],
            "port": [b"port", b"portNum"]
        }
        
        target_bytes_list = ALIASES.get(target_key, [target_key.encode('utf-8')])
        
        if isinstance(data, list):
            for item in data:
                cls.deep_patch(item, target_key, value, val_tag)
        elif isinstance(data, dict):
            k1 = data.get("1") or data.get(1)
            if k1 in target_bytes_list:
                if val_tag == "17": # Float
                    data[val_tag] = float_to_uint64(float(value))
                elif val_tag == "10" or val_tag == "1": # String or Key
                    data[val_tag] = str(value).encode('utf-8')
                else: # Int (12, etc)
                    data[val_tag] = int(value)
            
            # Continue recursion to catch all possible fields
            for v in data.values():
                if isinstance(v, (dict, list)):
                    cls.deep_patch(v, target_key, value, val_tag)

    @classmethod
    def find_block_by_key(cls, data: Any, key_tag: str, expected_key: bytes) -> Optional[dict]:
        if isinstance(data, list):
            for item in data:
                res = cls.find_block_by_key(item, key_tag, expected_key)
                if res: return res
        elif isinstance(data, dict):
            if data.get(key_tag) == expected_key: return data
            for v in data.values():
                if isinstance(v, (dict, list)):
                    res = cls.find_block_by_key(v, key_tag, expected_key)
                    if res: return res
        return None

    @classmethod
    def update_int_param(cls, data: Any, target_key: str, value: int):
        return cls.deep_patch(data, target_key, value, "12")

    @classmethod
    def safe_get_path(cls, data: Any, path: List[str]) -> Any:
        curr = data
        for tag in path:
            if isinstance(curr, list) and len(curr) > 0: curr = curr[0]
            if isinstance(curr, dict):
                curr = curr.get(tag) or curr.get(int(tag) if tag.isdigit() else None)
            else: return None
        return curr
