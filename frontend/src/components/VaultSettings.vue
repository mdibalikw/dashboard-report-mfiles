<template>
  <div class="glass-panel rounded-2xl overflow-hidden transition-all duration-500 shadow-2xl mb-8">
    <!-- Header/Accordion Trigger -->
    <div 
      @click="isOpen = !isOpen"
      class="flex justify-between items-center px-6 py-4 cursor-pointer hover:bg-slate-900/30 transition-colors"
    >
      <div class="flex items-center space-x-3">
        <!-- M-Files Icon / Logo mockup -->
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-mfiles-700 to-mfiles-500 flex items-center justify-center shadow-lg shadow-mfiles-500/10">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h2 class="text-md font-semibold text-slate-100">M-Files Vault Connection Settings</h2>
          <p class="text-xs text-slate-400">
            {{ activeConnectionSummary }}
          </p>
        </div>
      </div>
      
      <div class="flex items-center space-x-4">
        <!-- Connection Status Pill -->
        <span 
          class="text-xs px-2.5 py-0.5 rounded-full font-medium"
          :class="statusClasses"
        >
          {{ statusText }}
        </span>
        
        <!-- Accordion Chevron -->
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="h-5 w-5 text-slate-400 transition-transform duration-300"
          :class="{ 'rotate-180': isOpen }"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    <!-- Collapsible content -->
    <div 
      class="transition-all duration-500 ease-in-out overflow-hidden"
      :style="{ maxHeight: isOpen ? '1000px' : '0px' }"
    >
      <div class="px-6 pb-6 pt-2 border-t border-slate-800/40">
        <form @submit.prevent="handleSave" class="space-y-6">
          
          <!-- Mock Mode Toggle -->
          <div class="bg-slate-900/35 border border-slate-800/60 rounded-xl p-4 flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-sm font-semibold text-slate-200">Demo / Offline Mock Mode</span>
              <span class="text-xs text-slate-400">Enable this to run the dashboard immediately with simulated M-Files data. No real M-Files server required.</span>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                v-model="form.mockMode" 
                class="sr-only peer"
              >
              <div class="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mfiles-500 peer-checked:after:bg-white"></div>
            </label>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6" :class="{ 'opacity-50 pointer-events-none transition-opacity duration-300': form.mockMode }">
            
            <!-- MFWS URL -->
            <div class="flex flex-col space-y-2">
              <label for="url" class="text-xs font-semibold text-slate-400 uppercase tracking-wider">MFWS URL</label>
              <input 
                id="url"
                type="text" 
                v-model="form.url" 
                placeholder="https://mfiles.yourcompany.com/REST"
                class="glass-input"
                :required="!form.mockMode"
              >
              <span class="text-[10px] text-slate-500">The base M-Files Web Service REST API URL, usually ending in `/REST`</span>
            </div>

            <!-- Vault GUID -->
            <div class="flex flex-col space-y-2">
              <label for="vaultGuid" class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Vault GUID</label>
              <input 
                id="vaultGuid"
                type="text" 
                v-model="form.vaultGuid" 
                placeholder="{C840BE1A-5B47-4AC0-8EF7-835C166C8E24}"
                class="glass-input"
                :required="!form.mockMode"
              >
              <span class="text-[10px] text-slate-500">Include brackets, format: `{XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX}`</span>
            </div>

            <!-- Username -->
            <div class="flex flex-col space-y-2">
              <label for="username" class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Username</label>
              <input 
                id="username"
                type="text" 
                v-model="form.username" 
                placeholder="e.g. jdoe"
                class="glass-input"
                :required="!form.mockMode"
              >
            </div>

            <!-- Password -->
            <div class="flex flex-col space-y-2">
              <label for="password" class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
              <div class="relative">
                <input 
                  id="password"
                  :type="showPassword ? 'text' : 'password'" 
                  v-model="form.password" 
                  placeholder="••••••••"
                  class="glass-input w-full pr-10"
                  :required="!form.mockMode"
                >
                <button 
                  type="button" 
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-3.5 text-slate-450 hover:text-slate-200"
                >
                  <!-- Eye Icon -->
                  <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <!-- Eye Off Icon -->
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </button>
              </div>
            </div>

          </div>

          <!-- Report Views Configuration Section -->
          <div class="border-t border-slate-800/45 pt-6" :class="{ 'opacity-50 pointer-events-none transition-opacity duration-300': form.mockMode }">
            <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-mfiles-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Dashboard Report Target Views</span>
              </div>
              <span v-if="loadingViews" class="text-[10px] text-slate-400 flex items-center space-x-1 font-normal capitalize">
                <svg class="animate-spin h-3 w-3 text-mfiles-500" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading available views...</span>
              </span>
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <!-- Docs by Class -->
              <div class="flex flex-col space-y-2">
                <label for="viewDocsByClass" class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Documents by Class View</label>
                <div class="relative">
                  <select 
                    id="viewDocsByClass"
                    v-model="reportsForm.docsByClass" 
                    class="glass-input w-full pr-10 appearance-none bg-slate-900/60 text-slate-200"
                    :required="!form.mockMode"
                  >
                    <option value="" disabled>-- Select M-Files View --</option>
                    <option v-for="view in viewsList" :key="view.id" :value="view.id">
                      {{ view.name }} (ID: {{ view.id }})
                    </option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-450">
                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
                <span class="text-[10px] text-slate-500">M-Files View containing files to analyze</span>
              </div>

              <!-- Workflow Status -->
              <div class="flex flex-col space-y-2">
                <label for="viewWorkflowStatus" class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Workflow Status View</label>
                <div class="relative">
                  <select 
                    id="viewWorkflowStatus"
                    v-model="reportsForm.workflowStatus" 
                    class="glass-input w-full pr-10 appearance-none bg-slate-900/60 text-slate-200"
                    :required="!form.mockMode"
                  >
                    <option value="" disabled>-- Select M-Files View --</option>
                    <option v-for="view in viewsList" :key="view.id" :value="view.id">
                      {{ view.name }} (ID: {{ view.id }})
                    </option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-450">
                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
                <span class="text-[10px] text-slate-500">M-Files View containing files to analyze</span>
              </div>

              <!-- Objects by Type -->
              <div class="flex flex-col space-y-2">
                <label for="viewObjectsByType" class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Objects by Type View</label>
                <div class="relative">
                  <select 
                    id="viewObjectsByType"
                    v-model="reportsForm.objectsByType" 
                    class="glass-input w-full pr-10 appearance-none bg-slate-900/60 text-slate-200"
                    :required="!form.mockMode"
                  >
                    <option value="" disabled>-- Select M-Files View --</option>
                    <option v-for="view in viewsList" :key="view.id" :value="view.id">
                      {{ view.name }} (ID: {{ view.id }})
                    </option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-450">
                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
                <span class="text-[10px] text-slate-500">M-Files View containing files to analyze</span>
              </div>

              <!-- Documents by Views -->
              <div class="flex flex-col space-y-2">
                <label for="viewDocsByViews" class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Documents by Views Source</label>
                <div class="relative">
                  <select 
                    id="viewDocsByViews"
                    v-model="reportsForm.docsByViews" 
                    class="glass-input w-full pr-10 appearance-none bg-slate-900/60 text-slate-200"
                  >
                    <option value="">-- Crawl Root Views (Default) --</option>
                    <option v-for="view in viewsList" :key="view.id" :value="view.id">
                      {{ view.name }} (ID: {{ view.id }})
                    </option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-450">
                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
                <span class="text-[10px] text-slate-500">Parent view to compare sub-views (or all root views)</span>
              </div>
            </div>
          </div>

          <!-- Connection test status alerts -->
          <div v-if="testResult" class="rounded-lg p-4 text-sm font-medium border animate-fadeIn"
               :class="testResult.success ? 'bg-emerald-950/30 text-emerald-300 border-emerald-900/30' : 'bg-red-950/30 text-red-300 border-red-900/30'">
            <div class="flex items-start space-x-3">
              <svg v-if="testResult.success" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <span class="font-semibold block">{{ testResult.success ? 'Success!' : 'Connection Failed' }}</span>
                <span class="text-xs text-slate-300 mt-1 block">{{ testResult.message }}</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-800/40">
            <span class="text-xs text-slate-500">
              * Note: Settings are cached dynamically in-memory on the backend.
            </span>
            <div class="flex items-center space-x-3 w-full sm:w-auto justify-end">
              <button 
                type="button"
                @click="testConnection"
                class="glass-btn-secondary w-full sm:w-auto"
                :disabled="testing || saving"
              >
                <div class="flex items-center justify-center space-x-2">
                  <!-- Loading spinner for testing -->
                  <svg v-if="testing" class="animate-spin h-4 w-4 text-slate-300" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Test Connection</span>
                </div>
              </button>

              <button 
                type="submit"
                class="glass-btn-primary w-full sm:w-auto"
                :disabled="testing || saving"
              >
                <div class="flex items-center justify-center space-x-2">
                  <!-- Loading spinner for saving -->
                  <svg v-if="saving" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Save Settings</span>
                </div>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const emit = defineEmits(['settings-saved', 'status-changed']);

const isOpen = ref(true);
const showPassword = ref(false);
const testing = ref(false);
const saving = ref(false);
const testResult = ref(null);
const connectionHealthy = ref(null); // true = live connected, false = failed, null = unknown

const viewsList = ref([]);
const loadingViews = ref(false);

const form = ref({
  url: '',
  username: '',
  password: '',
  vaultGuid: '',
  mockMode: false
});

const reportsForm = ref({
  docsByClass: '',
  workflowStatus: '',
  objectsByType: '',
  docsByViews: ''
});

let rawReportsConfig = [];

// Dynamic summary text under the title
const activeConnectionSummary = computed(() => {
  if (form.value.mockMode) {
    return 'Demo Mode active - running with simulated local sandbox data';
  }
  if (form.value.url && form.value.username) {
    return `Server: ${form.value.url.replace('/REST', '')} | User: ${form.value.username}`;
  }
  return 'Connection credentials are not configured yet';
});

// Dynamic state pill text
const statusText = computed(() => {
  if (form.value.mockMode) return 'Demo / Mock';
  if (connectionHealthy.value === true) return 'Connected';
  if (connectionHealthy.value === false) return 'Connection Error';
  return 'Not Verified';
});

// Dynamic state pill css
const statusClasses = computed(() => {
  if (form.value.mockMode) {
    return 'bg-amber-950/40 text-amber-400 border border-amber-900/30';
  }
  if (connectionHealthy.value === true) {
    return 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30';
  }
  if (connectionHealthy.value === false) {
    return 'bg-red-950/40 text-red-400 border border-red-900/30';
  }
  return 'bg-slate-900 text-slate-400 border border-slate-800';
});

// Load available views from M-Files
const loadViews = async () => {
  loadingViews.value = true;
  try {
    const res = await axios.get('/api/vault/views');
    viewsList.value = Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error("Failed to load available M-Files views:", error);
  } finally {
    loadingViews.value = false;
  }
};

// Load settings on component mount
const loadSettings = async () => {
  try {
    const response = await axios.get('/api/vault/settings');
    if (response.data && response.data.settings) {
      form.value = { ...response.data.settings };
      
      // Emit the initial state to the parent immediately on mount
      emit('status-changed', {
        connected: form.value.mockMode ? null : null, // Will be verified shortly if live
        isMock: form.value.mockMode,
        url: form.value.url,
        username: form.value.username
      });

      if (form.value.mockMode) {
        connectionHealthy.value = null;
      } else if (form.value.url && form.value.username) {
        // Run a silent initial test to verify if saved credentials actually work
        runSilentCheck();
      }
    }

    // Load views list based on active settings
    loadViews();

    // Fetch reports configuration
    const configResponse = await axios.get('/api/dashboard/config');
    if (Array.isArray(configResponse.data)) {
      rawReportsConfig = configResponse.data;
      
      const classReport = configResponse.data.find(r => r.id === 'docs-by-class');
      const workflowReport = configResponse.data.find(r => r.id === 'workflow-status');
      const typeReport = configResponse.data.find(r => r.id === 'objects-by-type');
      const viewsReport = configResponse.data.find(r => r.id === 'docs-by-views');
      
      reportsForm.value.docsByClass = classReport ? classReport.sourceViewId : '';
      reportsForm.value.workflowStatus = workflowReport ? workflowReport.sourceViewId : '';
      reportsForm.value.objectsByType = typeReport ? typeReport.sourceViewId : '';
      reportsForm.value.docsByViews = viewsReport ? viewsReport.sourceViewId : '';
    }
  } catch (error) {
    console.error("Failed to load settings or report configurations:", error);
  }
};

const runSilentCheck = async () => {
  try {
    const testPayload = { ...form.value };
    await axios.post('/api/vault/test', testPayload);
    connectionHealthy.value = true;
    emit('status-changed', { 
      connected: true, 
      isMock: false,
      url: form.value.url,
      username: form.value.username
    });
  } catch (error) {
    connectionHealthy.value = false;
    emit('status-changed', { 
      connected: false, 
      isMock: false,
      url: form.value.url,
      username: form.value.username
    });
  }
};

// Validate M-Files connection settings
const testConnection = async () => {
  testing.value = true;
  testResult.value = null;
  
  try {
    const testPayload = { ...form.value };
    const response = await axios.post('/api/vault/test', testPayload);
    
    testResult.value = {
      success: true,
      message: response.data.message || "Successfully authenticated against the M-Files Server."
    };
    
    if (form.value.mockMode) {
      connectionHealthy.value = null;
    } else {
      connectionHealthy.value = true;
    }
  } catch (error) {
    connectionHealthy.value = form.value.mockMode ? null : false;
    const errorDetails = error.response?.data?.error || error.message;
    testResult.value = {
      success: false,
      message: errorDetails
    };
  } finally {
    testing.value = false;
  }
};

// Persist settings in the backend dynamic store
const handleSave = async () => {
  saving.value = true;
  testResult.value = null;
  
  try {
    // 1. Save vault credentials
    const response = await axios.post('/api/vault/settings', form.value);
    if (response.data && response.data.success) {
      
      // 2. Map form values back to our report objects and save reports config
      const updatedReports = rawReportsConfig.map(r => {
        if (r.id === 'docs-by-class') {
          return { ...r, sourceViewId: reportsForm.value.docsByClass };
        } else if (r.id === 'top-classes') {
          return { ...r, sourceViewId: reportsForm.value.docsByClass };
        } else if (r.id === 'workflow-status') {
          return { ...r, sourceViewId: reportsForm.value.workflowStatus };
        } else if (r.id === 'objects-by-type') {
          return { ...r, sourceViewId: reportsForm.value.objectsByType };
        } else if (r.id === 'docs-by-views') {
          return { ...r, sourceViewId: reportsForm.value.docsByViews };
        }
        return r;
      });
      
      await axios.post('/api/dashboard/config', updatedReports);

      testResult.value = {
        success: true,
        message: "Vault credentials and report view configurations successfully updated."
      };
      
      if (form.value.mockMode) {
        connectionHealthy.value = null;
      } else {
        connectionHealthy.value = true;
      }

      // 3. Refresh views list based on the newly saved credentials
      await loadViews();
      
      // Notify parent that configuration has updated
      emit('settings-saved', { 
        isMock: form.value.mockMode,
        settings: response.data.settings
      });
      
      // Auto close accordion on successful save to focus on the dashboard
      setTimeout(() => {
        isOpen.value = false;
      }, 1000);
    }
  } catch (error) {
    connectionHealthy.value = form.value.mockMode ? null : false;
    const errorDetails = error.response?.data?.error || error.message;
    testResult.value = {
      success: false,
      message: "Failed to save settings: " + errorDetails
    };
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  loadSettings();
});
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}
</style>
