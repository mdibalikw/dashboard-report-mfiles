import axios from 'axios';
import { fork } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target server
const serverPath = './server.js';

console.log("==================================================");
console.log(" Starting M-Files Backend API Integration Tests...");
console.log("==================================================");

const serverProcess = fork(serverPath, [], {
  env: { ...process.env, PORT: 3001 },
  stdio: 'inherit'
});

// Wait for server to start
setTimeout(async () => {
  let failed = false;
  try {
    // Test 1: Get settings
    console.log("\n[Test 1] Fetching initial vault settings...");
    const settingsRes = await axios.get('http://localhost:3001/api/vault/settings');
    if (settingsRes.status === 200 && settingsRes.data.success) {
      console.log("✓ Success: Received initial settings:", JSON.stringify(settingsRes.data.settings));
    } else {
      throw new Error(`Failed with status ${settingsRes.status}`);
    }

    // Test 2: Get reports configuration
    console.log("\n[Test 2] Fetching active dashboard reports list...");
    const configRes = await axios.get('http://localhost:3001/api/dashboard/config');
    if (configRes.status === 200 && Array.isArray(configRes.data)) {
      console.log("✓ Success: Loaded reports:", configRes.data.map(r => r.id).join(', '));
    } else {
      throw new Error(`Failed with status ${configRes.status}`);
    }

    // Test 3: Save settings (enable mock mode)
    console.log("\n[Test 3] Updating settings to enable Mock/Demo Mode...");
    const saveRes = await axios.post('http://localhost:3001/api/vault/settings', {
      mockMode: true
    });
    if (saveRes.status === 200 && saveRes.data.success) {
      console.log("✓ Success: Saved settings. New obscured state:", JSON.stringify(saveRes.data.settings));
    } else {
      throw new Error(`Failed with status ${saveRes.status}`);
    }

    // Test 4: Fetch report data in Mock mode
    console.log("\n[Test 4] Querying report data for 'docs-by-class' (Mock mode)...");
    const reportRes = await axios.get('http://localhost:3001/api/dashboard/reports/docs-by-class');
    if (reportRes.status === 200 && Array.isArray(reportRes.data)) {
      console.log("✓ Success: Retrieved aggregated report data:", JSON.stringify(reportRes.data));
      
      // Verify structure of items
      const valid = reportRes.data.every(item => item.label !== undefined && item.value !== undefined);
      if (valid) {
        console.log("✓ Success: Data structure matches { label, value } schema perfectly.");
      } else {
        throw new Error("Invalid item structure: missing 'label' or 'value'");
      }
    } else {
      throw new Error(`Failed with status ${reportRes.status}`);
    }

    // Test 5: Verify credentials test connection endpoint
    console.log("\n[Test 5] Testing connection validator endpoint in Mock mode...");
    const testRes = await axios.post('http://localhost:3001/api/vault/test', {
      mockMode: true
    });
    if (testRes.status === 200 && testRes.data.success) {
      console.log("✓ Success: Test connection endpoint works under mock constraints.");
    } else {
      throw new Error(`Failed with status ${testRes.status}`);
    }

  } catch (error) {
    failed = true;
    console.error("\n❌ Integration Test Failed!");
    if (error.response) {
      console.error(`  Status: ${error.response.status}`);
      console.error(`  Data:`, error.response.data);
    } else {
      console.error(`  Message: ${error.message}`);
    }
  } finally {
    console.log("\n==================================================");
    console.log(" Shutting down test server and exiting...");
    console.log("==================================================");
    serverProcess.kill();
    process.exit(failed ? 1 : 0);
  }
}, 2500);
