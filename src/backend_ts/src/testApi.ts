import * as fs from 'fs';
import * as path from 'path';

async function runTests() {
  console.log("=== STARTING END-TO-END API TEST FOR TS BACKEND ===");
  const baseUrl = "http://localhost:8002";

  // Test 1: System Version
  console.log("\n[Test 1] Fetching system version...");
  const versionRes = await fetch(`${baseUrl}/api/v1/system/version`);
  if (!versionRes.ok) throw new Error("Failed to get version");
  const versionData = await versionRes.json();
  console.log("System Version Response:", versionData);

  // Test 2: Upload CModel
  console.log("\n[Test 2] Uploading proj_1234.cmodel...");
  const cmodelPath = path.resolve(__dirname, "../../../proj_1234.cmodel");

  if (!fs.existsSync(cmodelPath)) {
    throw new Error(`Test cmodel file not found at ${cmodelPath}`);
  }
  const fileBuffer = fs.readFileSync(cmodelPath);
  const fileBlob = new Blob([fileBuffer]);
  
  const formData = new FormData();
  formData.append('file', fileBlob, 'proj_1234.cmodel');

  const uploadRes = await fetch(`${baseUrl}/api/v1/models/upload`, {
    method: "POST",
    body: formData
  });

  if (!uploadRes.ok) {
    const errorText = await uploadRes.text();
    throw new Error(`Upload failed: ${uploadRes.statusText} - ${errorText}`);
  }

  const uploadData: any = await uploadRes.json();
  console.log("Upload Success! Response structure keys:", Object.keys(uploadData));
  console.log("first level keys in full_json:", Object.keys(uploadData.full_json || {}));
  console.log("sample more_module_info:", JSON.stringify(uploadData.full_json?.more_module_info?.[0], null, 2));
  console.log("sample moreModuleInfo:", JSON.stringify(uploadData.full_json?.moreModuleInfo?.[0], null, 2));
  
  const projectId = uploadData.project_id || uploadData.projectId;
  const firstComp = (uploadData.full_json?.moreModuleInfo || uploadData.full_json?.more_module_info)?.[0]?.moduleComponets?.[0] || 
                    (uploadData.full_json?.moreModuleInfo || uploadData.full_json?.more_module_info)?.[0]?.module_componets?.[0];
  const compUuid = firstComp?.generalAttr?.moduleUuid?.stringValue || firstComp?.general_attr?.module_uuid?.string_value;
  console.log("Using component UUID for testing:", compUuid);


  if (compUuid) {
    // Test 3: Get Component
    console.log(`\n[Test 3] Fetching component details for UUID: ${compUuid}...`);
    const compRes = await fetch(`${baseUrl}/api/v1/models/${projectId}/components/${compUuid}`);
    if (!compRes.ok) throw new Error("Failed to get component");
    const compData = await compRes.json();
    console.log("Component generalAttr:", compData.generalAttr);

    // Test 4: Patch Component
    console.log(`\n[Test 4] Patching component details for UUID: ${compUuid}...`);
    const patchPayload = {
      generalAttr: {
        moduleDesc: {
          stringValue: "Modified by E2E API Test"
        }
      }
    };
    const patchRes = await fetch(`${baseUrl}/api/v1/models/${projectId}/components/${compUuid}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patchPayload)
    });
    if (!patchRes.ok) throw new Error("Failed to patch component");
    const patchData = await patchRes.json();
    console.log("Patch response status:", patchData.status);

    // Verify patch applied
    const verifyRes = await fetch(`${baseUrl}/api/v1/models/${projectId}/components/${compUuid}`);
    const verifyData = await verifyRes.json();
    console.log("Verified patched description:", verifyData.generalAttr?.moduleDesc?.stringValue);
  }

  // Test 5: Get Abilities
  console.log("\n[Test 5] Fetching project abilities...");
  const abiRes = await fetch(`${baseUrl}/api/v1/models/${projectId}/abilities`);
  if (!abiRes.ok) throw new Error("Failed to get abilities");
  const abiData = await abiRes.json();
  console.log("Abilities version:", abiData.version);

  // Test 6: Compile Sandbox
  console.log("\n[Test 6] Compiling sandboxed model back to binary CModel...");
  const compileRes = await fetch(`${baseUrl}/api/v1/models/${projectId}/compile`, {
    method: "POST"
  });
  if (!compileRes.ok) {
    const errorText = await compileRes.text();
    throw new Error(`Compile failed: ${errorText}`);
  }
  const compileData: any = await compileRes.json();
  console.log("Compile Success! Full response data:", compileData);
  const dlPath = compileData.downloadUrl || compileData.download_url;
  console.log("Download path selected:", dlPath);

  // Test 7: Verify compiled file downloadability
  console.log("\n[Test 7] Downloading compiled CModel via downloadUrl...");
  const downloadUrl = `${baseUrl}${dlPath}`;
  const dlRes = await fetch(downloadUrl);

  if (!dlRes.ok) throw new Error(`Failed to download compiled file from ${downloadUrl}`);
  const dlData = await dlRes.arrayBuffer();
  console.log(`Downloaded file size: ${dlData.byteLength} bytes. Test passed!`);

  console.log("\n=== ALL TS BACKEND API END-TO-END TESTS PASSED SUCCESSFULLY ===");
}

runTests().catch(err => {
  console.error("\n❌ TEST FAILED:", err);
  process.exit(1);
});
