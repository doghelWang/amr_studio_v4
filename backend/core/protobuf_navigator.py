import logging
from typing import Any, Tuple, List, Optional
import struct

logger = logging.getLogger(__name__)

def float_to_uint64(f: float) -> int:
    """Convert an IEEE 754 64-bit float to its unsigned 64-bit integer representation"""
    return struct.unpack('<Q', struct.pack('<d', float(f)))[0]

class ProtoNavigator:
    """
    Utility class to safely and recursively navigate parsed blackboxprotobuf dictionaries,
    finding and updating values based on standard tag numbers (e.g. tag "1" for semantic keys)
    instead of fragile block indices.
    """

    @classmethod
    def find_param(cls, data: Any, key: str) -> Optional[dict]:
        """
        Recursively searches for a dictionary that has key "1" matching the given `key`.
        Assumes `data` is the parsed blackboxprotobuf dictionary or a list of such dictionaries.
        """
        key_bytes = key.encode('utf-8')
        
        if isinstance(data, list):
            for item in data:
                found = cls.find_param(item, key)
                if found is not None:
                    return found
        elif isinstance(data, dict):
            # Check if this dict itself is the parameter block we're looking for
            if data.get("1") == key_bytes or data.get(1) == key_bytes:
                return data
            # Otherwise, search its values
            for k, v in data.items():
                found = cls.find_param(v, key)
                if found is not None:
                    return found
        return None

    @classmethod
    def update_float_param(cls, data: dict, key: str, value: float) -> bool:
        """
        Finds a parameter block by key and updates its float value (tag 17).
        """
        param = cls.find_param(data, key)
        if param is not None:
            # Tag 17 is generally used for double/float representations in these models
            # but we use string keys for the dict fields parsed by blackboxprotobuf
            param["17"] = float_to_uint64(value)
            return True
        logger.warning(f"Parameter block for key '{key}' not found.")
        return False

    @classmethod
    def update_string_param(cls, data: dict, key: str, value: str) -> bool:
        """
        Finds a parameter block by key and updates its string value (tag 10).
        """
        param = cls.find_param(data, key)
        if param is not None:
            param["10"] = value.encode('utf-8')
            return True
        logger.warning(f"Parameter block for key '{key}' not found.")
        return False

    @classmethod
    def find_block_by_key(cls, data: Any, key_tag: str, expected_key: bytes) -> Optional[dict]:
        """
        Searches for a dict where `dict[key_tag] == expected_key`.
        Useful for finding specifically identified nested structures (e.g. part ID).
        """
        if isinstance(data, list):
            for item in data:
                found = cls.find_block_by_key(item, key_tag, expected_key)
                if found is not None:
                    return found
        elif isinstance(data, dict):
            if data.get(key_tag) == expected_key:
                return data
            for k, v in data.items():
                found = cls.find_block_by_key(v, key_tag, expected_key)
                if found is not None:
                    return found
        return None
