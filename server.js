import express from 'express';
import cors from 'cors';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as vaultStore from './config/vaultStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Path to reports configuration
const REPORTS_CONFIG_PATH = path.join(__dirname, 'config', 'reports.json');

// In-memory token cache
let cachedToken = null;
let cachedConfigHash = null;
let tokenPromise = null;

// In-memory metadata cache for resolving names
let metadataCache = {
  classes: null,      // Map of classID -> Name
  objectTypes: null,  // Map of typeID -> Name
  lastFetched: 0,
  cachedConfigHash: null
};
let metadataPromise = null;

/**
 * Resolves metadata structure names from M-Files and caches them.
 */
async function resolveMetadataNames(settings) {
  const hash = getConfigHash(settings);
  const now = Date.now();
  
  if (
    metadataCache.classes && 
    metadataCache.objectTypes && 
    metadataCache.cachedConfigHash === hash &&
    (now - metadataCache.lastFetched < 600000)
  ) {
    return;
  }
  
  if (metadataPromise && metadataCache.cachedConfigHash === hash) {
    return metadataPromise;
  }
  
  metadataPromise = (async () => {
    try {
      console.log("Resolving M-Files metadata structure for friendly names...");
      const classesData = await callMFiles('/structure/classes', settings);
      const typesData = await callMFiles('/structure/objecttypes', settings);
      
      const classesMap = {};
      if (Array.isArray(classesData)) {
        classesData.forEach(c => {
          classesMap[c.ID] = c.Name;
        });
      }
      
      const typesMap = {};
      if (Array.isArray(typesData)) {
        typesData.forEach(t => {
          typesMap[t.ID] = t.NameSingular || t.Name || `Type ${t.ID}`;
        });
      }
      
      metadataCache.classes = classesMap;
      metadataCache.objectTypes = typesMap;
      metadataCache.lastFetched = Date.now();
      metadataCache.cachedConfigHash = hash;
      console.log("Metadata structure resolved and cached successfully.");
    } catch (err) {
      console.warn("Failed to fetch M-Files metadata structure. Falling back to IDs:", err.message);
    } finally {
      metadataPromise = null;
    }
  })();
  
  metadataCache.cachedConfigHash = hash;
  return metadataPromise;
}

/**
 * Returns a hash of the current configuration to detect credential changes.
 */
function getConfigHash(config) {
  return `${config.url}|${config.username}|${config.vaultGuid}`;
}

/**
 * Retreives an M-Files auth token from cache or makes a new request if needed.
 */
async function getMFilesToken(settings) {
  const hash = getConfigHash(settings);
  
  if (cachedToken && cachedConfigHash === hash) {
    return cachedToken;
  }
  
  if (tokenPromise && cachedConfigHash === hash) {
    return tokenPromise;
  }
  
  tokenPromise = (async () => {
    const baseUrl = settings.url.replace(/\/$/, "");
    try {
      const response = await axios.post(`${baseUrl}/server/authenticationtokens`, {
        Username: settings.username,
        Password: settings.password,
        VaultGuid: settings.vaultGuid
      }, {
        timeout: 10000 // 10s timeout
      });
      
      let token = response.data;
      if (typeof token !== 'string') {
        token = token.Value || (token.toString ? token.toString() : '');
      }
      
      token = token.replace(/^"+|"+$/g, '').trim();
      
      if (!token) {
        throw new Error("M-Files did not return a valid authentication token.");
      }
      
      cachedToken = token;
      cachedConfigHash = hash;
      console.log("Successfully authenticated with M-Files. Token cached.");
      return token;
    } catch (error) {
      cachedToken = null;
      cachedConfigHash = null;
      
      let errorMessage = "Connection failed.";
      if (error.response) {
        errorMessage = error.response.data?.Message || `M-Files error (HTTP ${error.response.status})`;
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        errorMessage = "M-Files server is unreachable. Please verify the URL and network connection.";
      } else {
        errorMessage = error.message;
      }
      throw new Error(errorMessage);
    } finally {
      tokenPromise = null;
    }
  })();
  
  cachedConfigHash = hash;
  return tokenPromise;
}

/**
 * Executes a call to the M-Files Web Service, handling token refresh automatically on 401/403.
 */
async function callMFiles(endpoint, settings) {
  const baseUrl = settings.url.replace(/\/$/, "");
  
  const requestConfig = async (token) => {
    return {
      method: 'GET',
      url: `${baseUrl}${endpoint}`,
      headers: {
        'X-Authentication': token,
        'Accept': 'application/json'
      },
      timeout: 15000
    };
  };

  let token = await getMFilesToken(settings);
  try {
    const response = await axios(await requestConfig(token));
    return response.data;
  } catch (error) {
    // If the cached token was rejected (expired), clear and try exactly once more
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn("Cached M-Files token invalid/expired, renewing...");
      cachedToken = null;
      cachedConfigHash = null;
      token = await getMFilesToken(settings);
      const retryResponse = await axios(await requestConfig(token));
      return retryResponse.data;
    }
    throw error;
  }
}

// ----------------------------------------------------
// MOCK DATA GENERATOR (For Offline Demo Mode)
// ----------------------------------------------------
const MOCK_DATA = {
  'docs-by-class': [
    { label: 'Purchase Invoices', value: 34 },
    { label: 'Employment Contracts', value: 15 },
    { label: 'Project Plans', value: 22 },
    { label: 'Non-Disclosure Agreements', value: 9 },
    { label: 'Customer Proposals', value: 18 }
  ],
  'top-classes': [
    { label: 'Purchase Invoices', value: 34 },
    { label: 'Project Plans', value: 22 },
    { label: 'Customer Proposals', value: 18 },
    { label: 'Employment Contracts', value: 15 },
    { label: 'Non-Disclosure Agreements', value: 9 }
  ],
  'workflow-status': [
    { label: 'New / Draft', value: 12 },
    { label: 'Under Review', value: 28 },
    { label: 'Awaiting Approval', value: 8 },
    { label: 'Approved', value: 45 },
    { label: 'Rejected', value: 5 }
  ],
  'objects-by-type': [
    { label: 'Documents', value: 98 },
    { label: 'Customer Accounts', value: 54 },
    { label: 'Active Projects', value: 24 },
    { label: 'Contacts', value: 82 }
  ],
  'docs-by-views': [
    { label: '01 DRAFT', value: 12 },
    { label: '02 PUBLISH', value: 45 },
    { label: '03 OBSOLETE', value: 15 },
    { label: '04 SIGN MONITORING', value: 28 },
    { label: 'Controlled Documents', value: 34 }
  ]
};

// ----------------------------------------------------
// ENDPOINTS
// ----------------------------------------------------

/**
 * POST /api/vault/test
 * Tests the provided credentials against M-Files auth endpoint.
 */
app.post('/api/vault/test', async (req, res) => {
  const { url, username, password, vaultGuid, mockMode } = req.body;
  
  if (mockMode) {
    // Mock test is always successful
    return res.json({ success: true, message: "Demo Mode is enabled. Connection test passed." });
  }

  if (!url || !username || !password || !vaultGuid) {
    return res.status(400).json({ 
      success: false, 
      error: "All fields (URL, Username, Password, Vault GUID) are required." 
    });
  }

  try {
    const testSettings = { url, username, password, vaultGuid };
    // Call authenticate directly
    await getMFilesToken(testSettings);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/vault/settings
 * Saves connection settings into the dynamic vault store.
 */
app.post('/api/vault/settings', (req, res) => {
  try {
    const updatedSettings = vaultStore.saveSettings(req.body);
    // If settings changed, reset cached tokens to force re-evaluation
    cachedToken = null;
    cachedConfigHash = null;
    res.json({ success: true, settings: updatedSettings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/vault/settings
 * Returns the currently active vault settings (obscuring password).
 */
app.get('/api/vault/settings', (req, res) => {
  try {
    const settings = vaultStore.getObscuredSettings();
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/vault/views
 * Retrieves a flat list of available views from M-Files (up to 2 levels deep).
 */
app.get('/api/vault/views', async (req, res) => {
  const settings = vaultStore.getSettings();
  
  if (settings.mockMode || !settings.url || !settings.username) {
    return res.json([
      { id: "315/281", name: "8 - HR ➔ All Employees" },
      { id: "315/283", name: "8 - HR ➔ All Departments" },
      { id: "2", name: "By Class" },
      { id: "5", name: "Checked Out to Me" },
      { id: "7", name: "Recently Modified by Me" }
    ]);
  }
  
  try {
    const allViewsList = [];
    
    // Fetch root views
    const rootData = await callMFiles('/views/items', settings);
    const rootItems = Array.isArray(rootData) ? rootData : (rootData.Items || []);
    
    // Map root items and fetch sub-views in parallel
    const scanPromises = rootItems.map(async (item) => {
      if (item && item.View) {
        const viewObj = item.View;
        const viewId = viewObj.ID;
        const viewName = viewObj.Name;
        
        allViewsList.push({
          id: String(viewId),
          name: viewName
        });
        
        // Fetch sub-views (Level 2)
        try {
          const subData = await callMFiles(`/views/v${viewId}/items`, settings);
          const subItems = Array.isArray(subData) ? subData : (subData.Items || []);
          
          for (const subItem of subItems) {
            if (subItem && subItem.View) {
              allViewsList.push({
                id: `${viewId}/${subItem.View.ID}`,
                name: `${viewName} ➔ ${subItem.View.Name}`
              });
            }
          }
        } catch (subErr) {
          // Ignore exceptions for specific system views that are not navigable
        }
      }
    });
    
    await Promise.all(scanPromises);
    
    // Sort alphabetically by name
    allViewsList.sort((a, b) => a.name.localeCompare(b.name));
    
    res.json(allViewsList);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch views from M-Files: " + error.message });
  }
});



/**
 * GET /api/dashboard/config
 * Returns the active reports configuration list.
 */
app.get('/api/dashboard/config', (req, res) => {
  try {
    if (fs.existsSync(REPORTS_CONFIG_PATH)) {
      const data = fs.readFileSync(REPORTS_CONFIG_PATH, 'utf8');
      const config = JSON.parse(data);
      res.json(config);
    } else {
      res.status(404).json({ error: "Dashboard reports configuration not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to read dashboard configuration: " + error.message });
  }
});

/**
 * POST /api/dashboard/config
 * Saves/updates the active reports configuration list.
 */
app.post('/api/dashboard/config', (req, res) => {
  try {
    const newConfig = req.body;
    if (!Array.isArray(newConfig)) {
      return res.status(400).json({ error: "Configuration must be an array of report objects." });
    }
    
    // Validate each report object has id and sourceViewId
    for (const report of newConfig) {
      if (!report.id || report.sourceViewId === undefined) {
        return res.status(400).json({ error: "Each report must specify an 'id' and 'sourceViewId'." });
      }
    }
    
    // Write back to config file
    fs.writeFileSync(REPORTS_CONFIG_PATH, JSON.stringify(newConfig, null, 2), 'utf8');
    res.json({ success: true, config: newConfig });
  } catch (error) {
    res.status(500).json({ error: "Failed to write dashboard configuration: " + error.message });
  }
});

/**
 * Recursively fetches all leaf document/object items under a given view or folder path.
 */
async function fetchAllObjectsUnderPath(pathSegment, settings) {
  try {
    const responseData = await callMFiles(`/views/${pathSegment}/items`, settings);
    const items = Array.isArray(responseData) ? responseData : (responseData.Items || []);
    
    let objects = [];
    
    for (const item of items) {
      if (!item) continue;
      
      if (item.FolderContentItemType === 4 && item.ObjectVersion) {
        // It's a document/object! Add to results.
        objects.push(item);
      } else if (item.FolderContentItemType === 2 && item.PropertyFolder) {
        // It's a virtual folder (grouping level). Recursively descend.
        const propFolder = item.PropertyFolder;
        const value = propFolder.Lookup?.Item || propFolder.SerializedValue;
        if (value !== undefined && value !== null) {
          const subObjects = await fetchAllObjectsUnderPath(`${pathSegment}/L${value}`, settings);
          objects = objects.concat(subObjects);
        }
      } else if (item.FolderContentItemType === 1 && item.View) {
        // It's a sub-view. Recursively descend.
        const subViewId = item.View.ID;
        const subObjects = await fetchAllObjectsUnderPath(`${pathSegment}/v${subViewId}`, settings);
        objects = objects.concat(subObjects);
      }
    }
    
    return objects;
  } catch (error) {
    console.error(`Error traversing path "${pathSegment}":`, error.message);
    return [];
  }
}

/**
 * GET /api/dashboard/reports/:id
 * Connects to M-Files (or returns mock data) and aggregates items by the report configuration rules.
 */
app.get('/api/dashboard/reports/:id', async (req, res) => {
  const { id } = req.params;
  const settings = vaultStore.getSettings();
  
  // 1. Resolve Report Config
  let reportConfig = null;
  try {
    if (fs.existsSync(REPORTS_CONFIG_PATH)) {
      const data = fs.readFileSync(REPORTS_CONFIG_PATH, 'utf8');
      const reports = JSON.parse(data);
      reportConfig = reports.find(r => r.id === id);
    }
  } catch (err) {
    return res.status(500).json({ error: "Error reading configuration." });
  }

  if (!reportConfig) {
    return res.status(404).json({ error: `Report with ID "${id}" was not found.` });
  }

  // 2. Return Mock Data if Mock/Demo Mode is active or settings are incomplete
  const useMock = settings.mockMode || (!settings.url || !settings.username || !settings.password || !settings.vaultGuid);
  
  if (useMock) {
    // Artificial delay to simulate real network query (better UX for loading animations)
    await new Promise(resolve => setTimeout(resolve, 800));
    const data = MOCK_DATA[id] || [
      { label: 'Category X', value: 10 },
      { label: 'Category Y', value: 20 },
      { label: 'Category Z', value: 30 }
    ];
    return res.json(data);
  }

  // 3. Connect to M-Files and Fetch Items
  try {
    if (id === 'docs-by-views') {
      let viewId = reportConfig.sourceViewId;
      let apiPath = '/views/items';
      if (viewId) {
        viewId = viewId.split('/')
          .map(seg => {
            if (seg && !/^[VvLlTtSs]/.test(seg)) {
              return 'v' + seg;
            }
            return seg;
          })
          .join('/');
        apiPath = `/views/${viewId}/items`;
      }

      const responseData = await callMFiles(apiPath, settings);
      const items = Array.isArray(responseData) ? responseData : (responseData.Items || []);
      const childViews = items
        .filter(item => item.FolderContentItemType === 1 && item.View)
        .map(item => ({
          id: item.View.ID,
          name: item.View.Name
        }));
      
      const result = await Promise.all(childViews.map(async (view) => {
        try {
          const fullPath = viewId ? `${viewId}/v${view.id}` : `v${view.id}`;
          const objs = await fetchAllObjectsUnderPath(fullPath, settings);
          return {
            label: view.name,
            value: objs.length
          };
        } catch (err) {
          console.error(`Error fetching objects for view "${view.name}" (${view.id}):`, err.message);
          return {
            label: view.name,
            value: 0
          };
        }
      }));
      
      const activeViews = result.filter(r => r.value > 0);
      return res.json(activeViews);
    }

    let viewId = reportConfig.sourceViewId;
    // Format View ID/Path to include required prefix "v" for each numeric segment
    if (viewId) {
      viewId = viewId.split('/')
        .map(seg => {
          if (seg && !/^[VvLlTtSs]/.test(seg)) {
            return 'v' + seg;
          }
          return seg;
        })
        .join('/');
    }
    const groupBy = reportConfig.groupBy || 'class';
    
    // Resolve metadata friendly names from M-Files structure
    await resolveMetadataNames(settings);
    
    // Recursively query and gather all objects under the view path
    const items = await fetchAllObjectsUnderPath(viewId, settings);
    
    // 4. In-Memory Aggregation
    const counts = {};
    for (const item of items) {
      if (item && item.ObjectVersion) {
        const objVer = item.ObjectVersion;
        let groupKey = 'Unknown';
        
        if (groupBy === 'class') {
          const classId = objVer.Class;
          groupKey = metadataCache.classes?.[classId] || objVer.ClassName || (classId !== undefined ? `Class ${classId}` : 'Unknown Class');
        } else if (groupBy === 'state') {
          groupKey = objVer.StateName || (objVer.State !== undefined ? `State ${objVer.State}` : 'No State / Draft');
        } else if (groupBy === 'type') {
          // Object Type
          const typeId = objVer.ObjVer?.Type;
          groupKey = metadataCache.objectTypes?.[typeId] || (typeId !== undefined ? `Type ${typeId}` : 'Unknown Type');
        } else {
          groupKey = objVer.ClassName || 'Unknown';
        }
        
        counts[groupKey] = (counts[groupKey] || 0) + 1;
      }
    }
    
    // Convert counts map to flat array format { label, value }
    let result = Object.keys(counts).map(key => ({
      label: key,
      value: counts[key]
    }));
    
    // Sort descending for top-classes leaderboard
    if (id === 'top-classes') {
      result.sort((a, b) => b.value - a.value);
    }
    
    res.json(result);
  } catch (error) {
    console.error(`Error generating report "${id}":`, error.message);
    
    let errorResponse = error.message;
    let statusCode = 500;
    
    if (error.response) {
      statusCode = error.response.status;
      errorResponse = error.response.data?.Message || `M-Files returned error code ${error.response.status}`;
    }
    
    res.status(statusCode).json({ error: errorResponse });
  }
});

// Start backend server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(` M-Files Dashboard Backend running on port ${PORT}`);
  console.log(` API Endpoint: http://localhost:${PORT}`);
  console.log(`==================================================`);
});
