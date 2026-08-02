#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROTO_DIR="$ROOT_DIR/specifications/protocols"
PYTHON_OUT="$ROOT_DIR/src/backend/app/infrastructure/protobuf/generated"
WORKER_OUT="$ROOT_DIR/cloudflare/generated"
PROTO_FILES=(
  "$PROTO_DIR/controller_model_comp_desc.proto"
  "$PROTO_DIR/controller_model_abi_set.proto"
  "$PROTO_DIR/controller_model_abi_desc.proto"
)

for proto_file in "${PROTO_FILES[@]}"; do
  if [[ ! -f "$proto_file" ]]; then
    echo "Missing authoritative Proto source: $proto_file" >&2
    exit 1
  fi
done

mkdir -p "$PYTHON_OUT" "$WORKER_OUT"

protoc \
  -I "$PROTO_DIR" \
  --python_out="$PYTHON_OUT" \
  "${PROTO_FILES[@]}"

"$ROOT_DIR/node_modules/.bin/pbjs" \
  -t static-module \
  -w es6 \
  -o "$WORKER_OUT/protobuf_models.js" \
  "${PROTO_FILES[@]}"

"$ROOT_DIR/node_modules/.bin/pbts" \
  -o "$WORKER_OUT/protobuf_models.d.ts" \
  "$WORKER_OUT/protobuf_models.js"

(
  cd "$ROOT_DIR"
  shasum -a 256 \
    specifications/protocols/controller_model_comp_desc.proto \
    specifications/protocols/controller_model_abi_set.proto \
    specifications/protocols/controller_model_abi_desc.proto \
    > cloudflare/generated/PROTO_SOURCE.sha256
)

echo "Generated bindings directly from specifications/protocols."
