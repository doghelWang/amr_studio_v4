#!/bin/bash
BASE_URL="http://localhost:8006/api/v1"
SAMPLE_CMODEL="docs/ModelSet39.cmodel"

echo "--- Starting E2E Verification (Fix-03) ---"

# 1. Upload original
echo "1. Uploading original model..."
UPLOAD_RESP=$(curl -s -F "file=@${SAMPLE_CMODEL}" "${BASE_URL}/models/upload")
echo "DEBUG Raw Upload Resp: $UPLOAD_RESP"
PROJECT_ID=$(echo $UPLOAD_RESP | sed -n 's/.*"project_id":"\([^"]*\)".*/\1/p')
echo "Project ID: $PROJECT_ID"

# 2. Get and modify Ability
echo "2. Fetching and modifying AbilitySet..."
ABI_JSON=$(curl -s "${BASE_URL}/models/${PROJECT_ID}/abilities")
# Change a known boolean or value. In AbiSet.proto, let's try a simple sed replacement
# (This is hacky but enough for verification of persistence)
MODIFIED_ABI=$(echo $ABI_JSON | sed 's/"bool_mustfill":false/"bool_mustfill":true/g' | sed 's/"bool_mustfill": false/"bool_mustfill": true/g')

# 3. Patch modified Ability
echo "3. Patching modified AbilitySet..."
PATCH_RESP=$(curl -s -X PATCH -H "Content-Type: application/json" -d "$MODIFIED_ABI" "${BASE_URL}/models/${PROJECT_ID}/abilities")
echo "Patch Response: $PATCH_RESP"

# 4. Compile and Download
echo "4. Compiling and downloading new cmodel..."
curl -s -X POST "${BASE_URL}/models/${PROJECT_ID}/compile" --output tmp/rebuilt.cmodel
echo "Rebuilt model saved to tmp/rebuilt.cmodel"

# 5. Re-upload and Verify
echo "5. Verifying by re-uploading..."
VERIFY_RESP=$(curl -s -F "file=@tmp/rebuilt.cmodel" "${BASE_URL}/models/upload")
NEW_PROJECT_ID=$(echo $VERIFY_RESP | sed -n 's/.*"project_id":"\([^"]*\)".*/\1/p')
echo "New Project ID: $NEW_PROJECT_ID"

# Check if the change persisted in the new project
VERIFY_ABI=$(curl -s "${BASE_URL}/models/${NEW_PROJECT_ID}/abilities")
if echo $VERIFY_ABI | grep -q '"bool_mustfill":true'; then
    echo "SUCCESS: Modification persisted through re-encode/decode cycle!"
else
    echo "FAILED: Modification lost!"
    echo "Verify Response snippet: $(echo $VERIFY_ABI | cut -c 1-200)"
fi

echo "--- E2E Verification Complete ---"
