#!/bin/bash
BASE_URL="http://localhost:8003/api/v1"
CMODEL_PATH="docs/ModelSet39.cmodel"

echo "--- Starting CURL Test Fix-01 ---"

# 1. Upload
echo "1. Testing Upload..."
UPLOAD_RESP=$(curl -s -F "file=@${CMODEL_PATH}" "${BASE_URL}/models/upload")
PROJECT_ID=$(echo $UPLOAD_RESP | sed -n 's/.*"project_id":"\([^"]*\)".*/\1/p')

if [ -z "$PROJECT_ID" ]; then
    echo "FAILED: Upload failed or Project ID not found"
    echo "Raw Response: $UPLOAD_RESP"
    exit 1
fi
echo "SUCCESS: Project created: $PROJECT_ID"

# 2. Verify Snake Case
echo "2. Verifying Snake Case..."
if echo $UPLOAD_RESP | grep -q "more_module_info"; then
    echo "SUCCESS: Found 'more_module_info' (snake_case)"
else
    echo "FAILED: 'more_module_info' not found in root"
fi

# 3. Persistence Check
echo "3. Testing Persistence..."
# More robust UUID extraction: module_uuid is nested under general_attr
SAMPLE_UUID=$(echo $UPLOAD_RESP | sed -n 's/.*"module_uuid":{"string_value":"\([^"]*\)".*/\1/p' | head -n 1)

if [ -z "$SAMPLE_UUID" ]; then
    echo "FAILED: Could not extract sample UUID from response"
else
    echo "Sample UUID: $SAMPLE_UUID"
    COMP_RESP=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/models/${PROJECT_ID}/components/${SAMPLE_UUID}")
    if [ "$COMP_RESP" == "200" ]; then
        echo "SUCCESS: Component retrieved (200 OK)"
    else
        echo "FAILED: Component retrieval failed with $COMP_RESP"
    fi
fi

# 4. Ability API Check
echo "4. Testing Ability API..."
# Check if file exists on disk first to confirm my suspicion
if [ -f "backend/saved_projects/${PROJECT_ID}/AbiSet.json" ]; then
    echo "File exists on disk: backend/saved_projects/${PROJECT_ID}/AbiSet.json"
else
    echo "File DOES NOT EXIST on disk: backend/saved_projects/${PROJECT_ID}/AbiSet.json"
fi

ABI_RESP=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/models/${PROJECT_ID}/abilities")
if [ "$ABI_RESP" == "200" ]; then
    echo "SUCCESS: AbilitySet retrieved (200 OK)"
else
    echo "FAILED: AbilitySet retrieval failed with $ABI_RESP"
fi

echo "--- CURL Test Fix-01 Complete ---"
