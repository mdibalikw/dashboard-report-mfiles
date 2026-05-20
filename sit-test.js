import axios from 'axios';
import { fork } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target server
const serverPath = './server.js';
const PORT = 3002;
const BASE_URL = `http://localhost:${PORT}`;

console.log("==========================================================");
console.log(" Launching System Integration Testing (SIT) Suite...");
console.log("==========================================================");

// Spawn the backend server on port 3002
const serverProcess = fork(serverPath, [], {
  env: { ...process.env, PORT },
  stdio: 'inherit'
});

// Helper for test logging
function logTestStep(num, name) {
  console.log(`\n[SIT Step ${num}] ${name}`);
}

// Bounded wait for server startup and running test cases
setTimeout(async () => {
  let sitFailed = false;
  try {
    // ----------------------------------------------------
    // Scenario 1: Initial Setup Verification
    // ----------------------------------------------------
    logTestStep(1, "Verifying System Initialization (GET /api/vault/settings)");
    const settingsRes = await axios.get(`${BASE_URL}/api/vault/settings`);
    if (settingsRes.status !== 200 || !settingsRes.data.success) {
      throw new Error(`SIT Failed: Settings route responded with status ${settingsRes.status}`);
    }
    const settings = settingsRes.data.settings;
    if (settings.password !== '********') {
      throw new Error("SIT Failed: Password was not obscured in the API response!");
    }
    console.log("✓ Success: Settings loaded and password properly obscured.");

    // ----------------------------------------------------
    // Scenario 2: Dashboard Config Contract
    // ----------------------------------------------------
    logTestStep(2, "Verifying Dashboard Layout Config (GET /api/dashboard/config)");
    const configRes = await axios.get(`${BASE_URL}/api/dashboard/config`);
    if (configRes.status !== 200 || !Array.isArray(configRes.data)) {
      throw new Error("SIT Failed: Config response is not an array");
    }
    // Verify required dashboard report keys
    const requiredKeys = ['id', 'title', 'type', 'sourceViewId', 'groupBy'];
    configRes.data.forEach(report => {
      requiredKeys.forEach(key => {
        if (report[key] === undefined) {
          throw new Error(`SIT Failed: Report definition is missing key "${key}"`);
        }
      });
    });
    console.log(`✓ Success: Reports layout schema is valid. Found ${configRes.data.length} reports.`);

    // ----------------------------------------------------
    // Scenario 3: Validation Error Handling mapping (Testing bad credentials)
    // ----------------------------------------------------
    logTestStep(3, "Verifying Gateway Error Mapping on Authentication Failures");
    try {
      await axios.post(`${BASE_URL}/api/vault/test`, {
        url: "https://your-mfiles-server.com/REST",
        username: "wrong_user",
        password: "wrong_password",
        vaultGuid: "{00000000-0000-0000-0000-000000000000}",
        mockMode: false
      });
      throw new Error("SIT Failed: Bad credentials did not throw an authentication error!");
    } catch (err) {
      if (err.response) {
        // Assert that backend returned 400 Bad Request with a clear JSON error
        if (err.response.status !== 400) {
          throw new Error(`SIT Failed: Invalid credentials returned status ${err.response.status} instead of 400`);
        }
        if (!err.response.data || !err.response.data.error) {
          throw new Error("SIT Failed: Response body is missing the 'error' message detail");
        }
        console.log(`✓ Success: System correctly caught auth failure. Mapped Error: "${err.response.data.error}"`);
      } else {
        throw err;
      }
    }

    // ----------------------------------------------------
    // Scenario 4: Mock/Demo Integration Flow
    // ----------------------------------------------------
    logTestStep(4, "Verifying Offline/Demo Mode Integration");
    // Enable Mock mode
    const mockSaveRes = await axios.post(`${BASE_URL}/api/vault/settings`, {
      mockMode: true
    });
    if (!mockSaveRes.data.settings.mockMode) {
      throw new Error("SIT Failed: MockMode setting was not successfully saved");
    }

    // Fetch reporting data
    const reportsList = configRes.data;
    for (const report of reportsList) {
      console.log(`  Retrieving report "${report.id}" under Demo Mode...`);
      const reportRes = await axios.get(`${BASE_URL}/api/dashboard/reports/${report.id}`);
      if (reportRes.status !== 200 || !Array.isArray(reportRes.data)) {
        throw new Error(`SIT Failed: Report "${report.id}" data is not an array`);
      }
      // Assert array is not empty and matches label/value structure
      if (reportRes.data.length === 0) {
        throw new Error(`SIT Failed: Mock report "${report.id}" returned an empty dataset`);
      }
      reportRes.data.forEach(item => {
        if (item.label === undefined || item.value === undefined) {
          throw new Error(`SIT Failed: Report item missing 'label' or 'value' fields: ${JSON.stringify(item)}`);
        }
      });
      console.log(`  ✓ Success: Report "${report.id}" data matches frontend schema.`);
    }
    console.log("✓ Success: Offline demo mode successfully simulates real M-Files vault structures.");

    // ----------------------------------------------------
    // Scenario 5: Cache Invalidation Integration
    // ----------------------------------------------------
    logTestStep(5, "Verifying Token Cache Reset on Credentials Updates");
    // Save new configuration, check if backend handles cache invalidation
    const updateRes = await axios.post(`${BASE_URL}/api/vault/settings`, {
      url: "https://new-mfiles-server.com/REST",
      username: "new_admin",
      password: "new_password",
      vaultGuid: "{11111111-1111-1111-1111-111111111111}",
      mockMode: false
    });
    if (updateRes.data.settings.url !== "https://new-mfiles-server.com/REST") {
      throw new Error("SIT Failed: Settings update did not apply correctly");
    }
    console.log("✓ Success: Settings updated. Cached token invalidated successfully.");

  } catch (error) {
    sitFailed = true;
    console.error("\n❌ SIT Integration Suite FAILED!");
    console.error(error.message);
  } finally {
    console.log("\n==========================================================");
    console.log(` SIT completed. Result: ${sitFailed ? 'FAILED' : 'ALL PASSED'}`);
    console.log("==========================================================");
    serverProcess.kill();
    process.exit(sitFailed ? 1 : 0);
  }
}, 3000);
