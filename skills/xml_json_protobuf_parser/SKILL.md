---
name: "File Format Parser (JSON, XML, Protobuf)"
description: "A utility skill to automatically detect and parse various file formats including JSON, XML, raw Protobuf, SQLite, and extract strings from unknown binaries."
---

# File Format Parser Skill

## Overview
This skill provides a Python script to analyze and extract readable content from various data formats often found in local configuration, model, or data files. It helps inspect binary or structured files when the exact schema or format is unknown.

## Usage

Run the Python script located in the `scripts` directory against one or more target files:

```bash
python <appDataDir>/skills/xml_json_protobuf_parser/scripts/parser.py <file1> [<file2> ...]
```

## Capabilities
The script attempts to decode the file using the following strategies in order:
1. **SQLite3 Database Check**: Looks for the SQLite magic header.
2. **JSON Parsing**: Attempts to parse the file as strict JSON.
3. **XML Parsing**: Attempts to parse the file as strict XML.
4. **Protobuf Raw Decode**: Uses the `protoc --decode_raw` command to guess and extract protobuf structures. (Requires `protoc` installed on the system).
5. **Strings Extraction (Fallback)**: Uses the `strings` command to extract printable ASCII/UTF-8 characters from binary blobs.

## When to use
- When asked to read a `.model`, `.dat`, `.bin`, `.conf`, or any unknown file type.
- When `view_file` or `cat` returns "unsupported mime type" or binary garbage.
