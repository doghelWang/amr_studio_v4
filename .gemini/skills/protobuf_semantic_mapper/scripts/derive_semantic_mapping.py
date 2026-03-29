#!/usr/bin/env python3
import json
import sys
import re
from collections import OrderedDict
import argparse

def unescape_protoc(s):
    if not isinstance(s, str): return s
    if s.startswith('"') and s.endswith('"'): s = s[1:-1]
    return s

def parse_msg_indented(text):
    res = OrderedDict(); stack = [(res, -1)]
    for line in text.splitlines():
        if not line.strip(): continue
        indent = len(line) - len(line.lstrip())
        while stack and stack[-1][1] >= indent: stack.pop()
        m_msg = re.search(r'^(\d+)[:\s]*[\{<]', line.lstrip())
        m_val = re.search(r'^(\d+)\s*:\s*(.*)', line.lstrip())
        if m_msg:
            tag = m_msg.group(1); sub = OrderedDict()
            if tag not in stack[-1][0]: stack[-1][0][tag] = []
            stack[-1][0][tag].append(sub); stack.append((sub, indent))
        elif m_val:
            tag, val = m_val.group(1), m_val.group(2)
            while val and val[-1] in ['}', '>', ' ']: val = val[:-1]
            if tag not in stack[-1][0]: stack[-1][0][tag] = []
            is_quoted = val.startswith('"')
            final = unescape_protoc(val)
            try:
                raw_s = final.strip()
                if not is_quoted:
                    if raw_s and ('.' in raw_s or 'e' in raw_s.lower()) and not raw_s.startswith('0x'): final = float(raw_s)
                    elif raw_s and raw_s.startswith('0x'): final = raw_s
                    elif raw_s: final = int(raw_s, 0)
            except: pass
            stack[-1][0][tag].append(final)
    return res

def extract_paths(node, prefix="", is_pb=False):
    paths = []
    if isinstance(node, dict):
        for k, v in node.items():
            p = prefix + "." + str(k) if prefix else str(k)
            paths.extend(extract_paths(v, p, is_pb))
    elif isinstance(node, list):
        for i, v in enumerate(node):
            p = prefix # Skip array indices for canonical path schema
            paths.extend(extract_paths(v, p, is_pb))
    else:
        paths.append((prefix, str(node).strip()))
    return paths

def main():
    parser = argparse.ArgumentParser(description="Derive Protobuf Tag to JSON Key hierarchical mappings.")
    parser.add_argument("--json", required=True, help="Path to the reference Semantic JSON file")
    parser.add_argument("--pb", required=True, help="Path to the output of `protoc --decode_raw`")
    args = parser.parse_args()

    print(f"[*] Parsing origin JSON: {args.json}", file=sys.stderr)
    with open(args.json, 'r') as f:
        orig_json = json.load(f)

    json_paths = extract_paths(orig_json, is_pb=False)
    json_val_map = {}
    for p, v in json_paths:
        if v and v not in ["None", "{}"]:
            json_val_map.setdefault(v, set()).add(p)

    print(f"[*] Parsing PB Raw: {args.pb}", file=sys.stderr)
    with open(args.pb, 'r') as f:
        pb_raw = parse_msg_indented(f.read())

    pb_paths = extract_paths(pb_raw, is_pb=True)
    pb_val_map = {}
    for p, v in pb_paths:
        if v and v not in ["None", "{}"]:
            pb_val_map.setdefault(v, set()).add(p)

    print("[*] Correlating Unique Values...", file=sys.stderr)
    exact_path_map = {}
    for val, p_paths in pb_val_map.items():
        if val in json_val_map:
            j_paths = json_val_map[val]
            if len(p_paths) == 1 and len(j_paths) == 1: # Strict exact 1-to-1 matching
                exact_path_map[list(p_paths)[0]] = list(j_paths)[0]

    context_mapping = {}
    for pb_p, json_p in exact_path_map.items():
        pb_tags = pb_p.split('.')
        json_keys = json_p.split('.')
        # Use the parent json key to map the child tag to the child json key
        for i in range(1, len(json_keys)):
            parent_key = json_keys[i-1]
            child_tag = pb_tags[i]
            child_key = json_keys[i]
            if parent_key not in context_mapping: context_mapping[parent_key] = {}
            context_mapping[parent_key][child_tag] = child_key
            
        # Also handle root level
        if len(json_keys) > 0 and len(pb_tags) > 0:
            if "ROOT" not in context_mapping: context_mapping["ROOT"] = {}
            context_mapping["ROOT"][pb_tags[0]] = json_keys[0]

    print("\n--- INFERRED CONTEXT MAPPINGS ---")
    print(json.dumps(context_mapping, indent=4, ensure_ascii=False))

if __name__ == "__main__":
    main()
