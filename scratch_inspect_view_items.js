import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function getMFilesToken(settings) {
  const baseUrl = settings.url.replace(/\/$/, "");
  const response = await axios.post(`${baseUrl}/server/authenticationtokens`, {
    Username: settings.username,
    Password: settings.password,
    VaultGuid: settings.vaultGuid
  });
  let token = response.data;
  if (typeof token !== 'string') {
    token = token.Value || (token.toString ? token.toString() : '');
  }
  return token.replace(/^"+|"+$/g, '').trim();
}

async function testAllRootViews() {
  const settings = {
    url: process.env.MFWS_URL,
    username: process.env.MFWS_USERNAME,
    password: process.env.MFWS_PASSWORD,
    vaultGuid: process.env.MFWS_VAULT_GUID
  };
  
  const token = await getMFilesToken(settings);
  const baseUrl = settings.url.replace(/\/$/, "");
  const headers = { 'X-Authentication': token, 'Accept': 'application/json' };
  
  try {
    const res = await axios.get(`${baseUrl}/views/items`, { headers });
    const items = res.data.Items || res.data || [];
    
    console.log(`Found ${items.length} root views. Testing /views/v{ID}/items for each...`);
    
    for (const item of items) {
      if (item.View) {
        const id = item.View.ID;
        const name = item.View.Name;
        
        try {
          const viewRes = await axios.get(`${baseUrl}/views/v${id}/items`, { headers });
          const viewItems = viewRes.data.Items || viewRes.data || [];
          console.log(`View "${name}" (ID: ${id}) -> SUCCESS! Items count: ${viewItems.length}`);
        } catch (err) {
          console.log(`View "${name}" (ID: ${id}) -> FAILED: ${err.message} (HTTP ${err.response?.status})`);
        }
      }
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

testAllRootViews();
