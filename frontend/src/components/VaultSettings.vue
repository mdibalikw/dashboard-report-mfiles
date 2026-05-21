<template>
  <div class="space-y-8">
    <!-- CARD 1: M-Files Vault Connection Settings -->
    <div class="glass-panel rounded-2xl overflow-hidden transition-all duration-500 shadow-2xl">
      <!-- Header -->
      <div class="flex justify-between items-center px-6 py-5 border-b border-slate-800/40 bg-slate-900/10">
        <div class="flex items-center space-x-3">
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
        
        <!-- Connection Status Pill -->
        <span 
          class="text-xs px-2.5 py-0.5 rounded-full font-medium"
          :class="statusClasses"
        >
          {{ statusText }}
        </span>
      </div>

      <!-- Content -->
      <div class="px-6 py-6">
        <form @submit.prevent="handleSaveConnection" class="space-y-6">
          
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

          <!-- Connection Inputs -->
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

          <!-- Connection test/save status alerts -->
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
                  <svg v-if="saving" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Save Connection</span>
                </div>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>

    <!-- CARD 2: Dashboard Report Target Views -->
    <div class="glass-panel rounded-2xl overflow-hidden transition-all duration-500 shadow-2xl relative">
      <!-- Overlay for Disabled State -->
      <div 
        v-if="form.mockMode || (!form.mockMode && connectionHealthy !== true)"
        class="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] z-20 flex items-center justify-center p-6 text-center transition-all duration-300"
      >
        <div class="max-w-md bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-3">
          <div class="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center mx-auto text-slate-450">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 class="text-sm font-semibold text-slate-200">
            {{ form.mockMode ? 'Views Mapping Disabled' : 'Connection Required' }}
          </h3>
          <p class="text-xs text-slate-400">
            {{ form.mockMode 
              ? 'Demo / Mock Mode is currently active. The dashboard uses simulated data, so customizing target M-Files views is disabled.' 
              : 'Please configure and save a valid M-Files Vault connection above to load and configure report target views.' }}
          </p>
        </div>
      </div>

      <!-- Header -->
      <div class="flex justify-between items-center px-6 py-5 border-b border-slate-800/40 bg-slate-900/10">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h2 class="text-md font-semibold text-slate-100">Dashboard Report Target Views</h2>
            <p class="text-xs text-slate-400">
              Map specific M-Files views to feed the dashboard chart widgets
            </p>
          </div>
        </div>
        
        <span v-if="loadingViews" class="text-xs text-slate-400 flex items-center space-x-1.5 font-medium">
          <svg class="animate-spin h-3.5 w-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading views...</span>
        </span>
      </div>

      <!-- Views Load Error Alert -->
      <div v-if="viewsLoadError" class="mx-6 mt-6 rounded-lg p-4 text-sm font-medium border bg-red-950/30 text-red-300 border-red-900/30 animate-fadeIn">
        <div class="flex items-start space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div class="flex-1">
            <span class="font-semibold block">Failed to load M-Files views</span>
            <span class="text-xs text-slate-300 mt-1 block">{{ viewsLoadError }}</span>
            <button 
              type="button" 
              @click="loadViews" 
              class="mt-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline flex items-center space-x-1"
            >
              <span>Retry Loading Views</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty Views Alert -->
      <div v-if="viewsList.length === 0 && !loadingViews && !viewsLoadError && !form.mockMode && connectionHealthy === true" class="mx-6 mt-6 rounded-lg p-4 text-sm font-medium border bg-amber-950/30 text-amber-300 border-amber-900/30 animate-fadeIn">
        <div class="flex items-start space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <span class="font-semibold block">No Views Found</span>
            <span class="text-xs text-slate-300 mt-1 block">Connected successfully, but the vault returned 0 views. Make sure your user account has views configured that are visible to it in the M-Files Client.</span>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="px-6 py-6">
        <form @submit.prevent="handleSaveViews" class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <!-- Docs by Class -->
            <div class="flex flex-col space-y-2">
              <label for="viewDocsByClass" class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Documents by Class View</label>
              <div class="relative">
                <select 
                  id="viewDocsByClass"
                  v-model="reportsForm.docsByClass" 
                  class="glass-input w-full pr-10 appearance-none bg-slate-900/60 text-slate-200"
                  required
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
                  required
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
                  required
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

          <!-- Save view mapping status alert -->
          <div v-if="viewsSaveResult" class="rounded-lg p-4 text-sm font-medium border animate-fadeIn bg-emerald-950/30 text-emerald-300 border-emerald-900/30">
            <div class="flex items-start space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <span class="font-semibold block">Success!</span>
                <span class="text-xs text-slate-300 mt-1 block">{{ viewsSaveResult }}</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end pt-4 border-t border-slate-800/40">
            <button 
              type="submit"
              class="glass-btn-primary w-full sm:w-auto"
              :disabled="savingViews || loadingViews"
            >
              <div class="flex items-center justify-center space-x-2">
                <svg v-if="savingViews" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Save View Mappings</span>
              </div>
            </button>
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

const showPassword = ref(false);
const testing = ref(false);
const saving = ref(false);
const savingViews = ref(false);
const testResult = ref(null);
const viewsSaveResult = ref(null);
const connectionHealthy = ref(null); // true = live connected, false = failed, null = unknown

const viewsList = ref([]);
const loadingViews = ref(false);
const viewsLoadError = ref(null);

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
  if (form.value.mockMode) {
    viewsList.value = [];
    viewsLoadError.value = null;
    return;
  }
  loadingViews.value = true;
  viewsLoadError.value = null;
  try {
    const res = await axios.get('/api/vault/views');
    viewsList.value = Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error("Failed to load available M-Files views:", error);
    viewsLoadError.value = error.response?.data?.error || error.message;
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
        connected: form.value.mockMode ? null : null, 
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
    await loadViews();

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

// Persist only connection settings
const handleSaveConnection = async () => {
  saving.value = true;
  testResult.value = null;
  
  try {
    const response = await axios.post('/api/vault/settings', form.value);
    if (response.data && response.data.success) {
      testResult.value = {
        success: true,
        message: "Vault connection settings successfully saved."
      };
      
      if (form.value.mockMode) {
        connectionHealthy.value = null;
      } else {
        connectionHealthy.value = true;
      }

      // Refresh views list based on the newly saved credentials
      await loadViews();
      
      // Notify parent that configuration status changed
      emit('status-changed', { 
        connected: form.value.mockMode ? null : true,
        isMock: form.value.mockMode,
        url: form.value.url,
        username: form.value.username
      });
    }
  } catch (error) {
    connectionHealthy.value = form.value.mockMode ? null : false;
    const errorDetails = error.response?.data?.error || error.message;
    testResult.value = {
      success: false,
      message: "Failed to save connection settings: " + errorDetails
    };
  } finally {
    saving.value = false;
  }
};

// Persist only view mappings and trigger dashboard refresh
const handleSaveViews = async () => {
  savingViews.value = true;
  viewsSaveResult.value = null;
  
  try {
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

    viewsSaveResult.value = "Report view configurations successfully updated. Redirecting to Dashboard...";
    
    // Notify parent to refresh and redirect
    setTimeout(() => {
      emit('settings-saved', { 
        isMock: form.value.mockMode,
        settings: form.value
      });
      viewsSaveResult.value = null;
    }, 1500);
  } catch (error) {
    const errorDetails = error.response?.data?.error || error.message;
    alert("Failed to save view mappings: " + errorDetails);
  } finally {
    savingViews.value = false;
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
