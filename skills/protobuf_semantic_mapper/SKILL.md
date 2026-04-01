---
name: Protobuf Semantic Mapper
description: "A tool to automatically derive hierarchical Protobuf tag-to-string-key mappings by correlating a raw protoc output with a reference JSON file."
---

# Protobuf Semantic Mapper Skill

This skill provides a robust heuristic algorithm to reverse-engineer undocumented binary Protobuf schemas. It achieves this by matching unique scalar values (like UUIDs, special strings, distinct numbers) found in a reference semantic JSON file with those found in a generic numeric parsed Protobuf tree.

## Prerequisites
- A raw, numeric Protobuf parsing (e.g., from `protoc --decode_raw`).
- A reference JSON file representing the expected semantic structure of the same binary message.

## How It Works
1. The script extracts all hierarchical paths to leaf scalar values in both the JSON and the Raw Protobuf trees.
2. It correlates paths that point to exactly the same **unique** value.
3. It recursively applies these 1-to-1 matches upward through the tree, deriving parent-child structural mappings.
4. The output is a highly accurate, multi-tiered mapping dictionary (e.g., `{"parentKey": {"1": "childKeyA", "2": "childKeyB"}}`) which can be plugged directly into a deserializer.

## Usage
Run the following script to derive the mapping. You will need to modify the script's `__main__` block or pass the paths to your JSON and RAW inputs.

```bash
python3 /Users/wangfeifei/.gemini/antigravity/skills/protobuf_semantic_mapper/scripts/derive_semantic_mapping.py <origin_json_path> <raw_protoc_txt_path>
```
