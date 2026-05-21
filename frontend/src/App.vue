<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-slate-950 text-slate-100 font-sans antialiased">
    <!-- Sidebar Navigation -->
    <aside class="w-full md:w-64 bg-slate-900/40 backdrop-blur-md border-b md:border-b-0 md:border-r border-slate-800/60 flex flex-col justify-between shrink-0">
      <div>
        <!-- Brand Section -->
        <div class="p-6 flex items-center space-x-3 border-b border-slate-850">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-mfiles-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 class="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-50 via-slate-100 to-mfiles-300 tracking-tight">
              M-Files Analytics
            </h1>
            <p class="text-[10px] text-slate-400 font-medium tracking-wide">
              Reporting Engine
            </p>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="p-4 space-y-1.5">
          <button 
            @click="currentTab = 'dashboard'"
            class="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left font-medium text-sm group"
            :class="currentTab === 'dashboard' 
              ? 'bg-gradient-to-r from-mfiles-600/20 to-indigo-600/5 border-l-4 border-mfiles-500 text-slate-100 shadow-md' 
              : 'text-slate-450 hover:text-slate-200 hover:bg-slate-800/30 border-l-4 border-transparent'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-200 group-hover:scale-110" :class="currentTab === 'dashboard' ? 'text-mfiles-450' : 'text-slate-450 group-hover:text-slate-300'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
            </svg>
            <span>Dashboard</span>
          </button>

          <button 
            @click="currentTab = 'config'"
            class="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left font-medium text-sm group"
            :class="currentTab === 'config' 
              ? 'bg-gradient-to-r from-mfiles-600/20 to-indigo-600/5 border-l-4 border-mfiles-500 text-slate-100 shadow-md' 
              : 'text-slate-450 hover:text-slate-200 hover:bg-slate-800/30 border-l-4 border-transparent'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-200 group-hover:scale-110" :class="currentTab === 'config' ? 'text-mfiles-450' : 'text-slate-450 group-hover:text-slate-300'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Config / Settings</span>
          </button>
        </nav>
      </div>

      <!-- Sidebar Footer Status Info -->
      <div class="p-4 border-t border-slate-850 bg-slate-950/20">
        <div class="rounded-xl bg-slate-900/35 border border-slate-850 p-3.5 space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Gateway Status</span>
            <span class="w-2 h-2 rounded-full animate-pulse" :class="connectionStatusIndicatorClass"></span>
          </div>
          <div>
            <div class="text-xs font-bold" :class="connectionStatusTextClass">
              {{ connectionStatusLabel }}
            </div>
            <div class="text-[10px] text-slate-400 mt-0.5 truncate" :title="connectionStatusSubLabel">
              {{ connectionStatusSubLabel }}
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 overflow-y-auto">
      <!-- Top Header / Bar -->
      <header class="flex justify-between items-center py-4 px-6 md:px-8 border-b border-slate-850 bg-slate-900/10 backdrop-blur-sm sticky top-0 z-10">
        <div>
          <h2 class="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <span>{{ currentTab === 'dashboard' ? 'Analytics Dashboard' : 'Vault Config & Mapping' }}</span>
          </h2>
        </div>

        <!-- Global controls -->
        <div class="flex items-center space-x-3">
          <button 
            v-if="currentTab === 'dashboard'"
            @click="loadAllReportsData"
            class="glass-btn-secondary py-1.5 px-3.5 text-xs font-semibold flex items-center space-x-1.5"
            :disabled="globalLoading"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-3.5 w-3.5" 
              :class="{ 'animate-spin': globalLoading }" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.2" />
            </svg>
            <span>Refresh Data</span>
          </button>

          <span v-if="currentTab === 'dashboard'" class="text-[11px] text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-850 font-mono">
            Updated: {{ lastRefreshedTime }}
          </span>
        </div>
      </header>

      <!-- Main Body Container -->
      <main class="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
        
        <!-- DASHBOARD VIEW -->
        <div v-if="currentTab === 'dashboard'" class="space-y-8 animate-fadeIn">
          
          <!-- Global Warning Banner if settings are not connected -->
          <div 
            v-if="!isDemoMode && connectionStatus === false"
            class="bg-red-950/20 border border-red-900/30 rounded-2xl p-6 text-center shadow-lg animate-fadeIn"
          >
            <div class="max-w-md mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 class="text-md font-semibold text-red-200">M-Files Gateway Disconnected</h3>
              <p class="text-xs text-slate-400 mt-2">
                The dashboard is currently unable to query M-Files. Please check the connection credentials in the <a @click="currentTab = 'config'" class="text-mfiles-450 hover:underline cursor-pointer">Config / Settings</a> tab, or toggle "Demo / Offline Mock Mode" to preview report widgets.
              </p>
            </div>
          </div>

          <!-- Summary Stats Bar -->
          <section v-if="reports.length > 0" class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div class="glass-card rounded-2xl p-5 flex items-center justify-between">
              <div>
                <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Reports</span>
                <span class="text-2xl font-bold text-slate-100 block mt-1">{{ reports.length }}</span>
              </div>
              <div class="w-10 h-10 rounded-xl bg-slate-800/40 flex items-center justify-center text-slate-400 border border-slate-750">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>

            <div class="glass-card rounded-2xl p-5 flex items-center justify-between">
              <div>
                <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Aggregated Objects</span>
                <span class="text-2xl font-bold text-slate-100 block mt-1">
                  {{ totalObjectsCount }}
                </span>
              </div>
              <div class="w-10 h-10 rounded-xl bg-slate-800/40 flex items-center justify-center text-slate-400 border border-slate-750">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>

            <div class="glass-card rounded-2xl p-5 flex items-center justify-between">
              <div>
                <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">System State</span>
                <span class="text-2xl font-bold block mt-1" :class="isDemoMode ? 'text-amber-400' : 'text-emerald-400'">
                  {{ isDemoMode ? 'Demo Sandbox' : 'Live Gateway' }}
                </span>
              </div>
              <div class="w-10 h-10 rounded-xl bg-slate-800/40 flex items-center justify-center text-slate-400 border border-slate-750">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </section>

          <!-- Charts Grid -->
          <section>
            <!-- Loading Config Skeleton -->
            <div v-if="loadingConfig" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="n in (reports.length || 4)" :key="n" class="glass-card rounded-2xl p-6 h-[400px] flex flex-col justify-between">
                <div class="h-6 w-1/2 bg-slate-800/60 rounded shimmer-effect relative overflow-hidden"></div>
                <div class="h-[250px] w-full bg-slate-800/20 rounded shimmer-effect relative overflow-hidden"></div>
              </div>
            </div>

            <!-- Config Load Error -->
            <div v-else-if="configError" class="glass-panel rounded-2xl p-8 text-center max-w-lg mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 class="text-lg font-bold text-slate-100">Failed to Load Dashboard Schema</h3>
              <p class="text-sm text-slate-400 mt-2 mb-6">{{ configError }}</p>
              <button @click="loadDashboardConfig" class="glass-btn-primary">
                Retry Loading Config
              </button>
            </div>

            <!-- Render Grid of Report Charts -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardChart 
                v-for="report in reports" 
                :key="report.id"
                :chartId="report.id"
                :title="report.title"
                :type="report.type"
                :data="report.data"
                :loading="report.loading"
                :error="report.error"
                :isMock="isDemoMode"
                @retry="loadSingleReportData(report.id)"
              />
            </div>
          </section>
        </div>

        <!-- CONFIG VIEW -->
        <div v-show="currentTab === 'config'" class="animate-fadeIn">
          <!-- Connection Settings Module -->
          <VaultSettings 
            @settings-saved="handleSettingsSaved"
            @status-changed="handleStatusChanged"
          />
        </div>

      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import VaultSettings from './components/VaultSettings.vue';
import DashboardChart from './components/DashboardChart.vue';

const reports = ref([]);
const loadingConfig = ref(true);
const configError = ref(null);
const lastRefreshed = ref(new Date());

const isDemoMode = ref(false);
const connectionStatus = ref(null); // true, false, or null
const vaultUrl = ref('');
const vaultUsername = ref('');
const currentTab = ref('dashboard');

// Format refresh timestamp
const lastRefreshedTime = computed(() => {
  return lastRefreshed.value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
});

// Sum up all item values for statistics
const totalObjectsCount = computed(() => {
  return reports.value.reduce((total, r) => {
    if (r.data && Array.isArray(r.data)) {
      return total + r.data.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
    }
    return total;
  }, 0);
});

// Detect global loading state across all charts
const globalLoading = computed(() => {
  return reports.value.some(r => r.loading);
});

// Load the dashboard configuration (which reports are active)
const loadDashboardConfig = async () => {
  loadingConfig.value = true;
  configError.value = null;
  
  try {
    const response = await axios.get('/api/dashboard/config');
    if (response.data && Array.isArray(response.data)) {
      reports.value = response.data.map(report => ({
        ...report,
        data: [],
        loading: true,
        error: null
      }));
      // Once config is loaded, fetch actual data for each chart
      loadAllReportsData();
    } else {
      throw new Error("Invalid report config format received.");
    }
  } catch (error) {
    configError.value = error.response?.data?.error || error.message;
  } finally {
    loadingConfig.value = false;
  }
};

// Fetch data for a specific report card
const loadSingleReportData = async (reportId) => {
  const report = reports.value.find(r => r.id === reportId);
  if (!report) return;
  
  report.loading = true;
  report.error = null;
  
  try {
    const response = await axios.get(`/api/dashboard/reports/${reportId}`);
    report.data = response.data;
  } catch (error) {
    report.error = error.response?.data?.error || error.message;
  } finally {
    report.loading = false;
    lastRefreshed.value = new Date();
  }
};

// Fetch data for all reports in parallel
const loadAllReportsData = () => {
  reports.value.forEach(report => {
    loadSingleReportData(report.id);
  });
};

// Listen to saved event from VaultSettings
const handleSettingsSaved = (payload) => {
  isDemoMode.value = payload.isMock;
  if (payload.isMock) {
    connectionStatus.value = null;
  } else {
    connectionStatus.value = true;
  }
  if (payload.settings) {
    vaultUrl.value = payload.settings.url || '';
    vaultUsername.value = payload.settings.username || '';
  }
  // Trigger full reload of dashboard configuration and data
  loadDashboardConfig();
  
  // Navigate back to Dashboard tab automatically
  currentTab.value = 'dashboard';
};

// Listen to health status updates from VaultSettings
const handleStatusChanged = (payload) => {
  connectionStatus.value = payload.connected;
  if (payload.isMock !== undefined) {
    isDemoMode.value = payload.isMock;
  }
  if (payload.url !== undefined) {
    vaultUrl.value = payload.url;
  }
  if (payload.username !== undefined) {
    vaultUsername.value = payload.username;
  }
};

// Sidebar connection status computed metadata
const connectionStatusIndicatorClass = computed(() => {
  if (isDemoMode.value) return 'bg-amber-500 shadow-lg shadow-amber-500/50';
  if (connectionStatus.value === true) return 'bg-emerald-500 shadow-lg shadow-emerald-500/50';
  if (connectionStatus.value === false) return 'bg-red-500 shadow-lg shadow-red-500/50';
  return 'bg-slate-500';
});

const connectionStatusTextClass = computed(() => {
  if (isDemoMode.value) return 'text-amber-400';
  if (connectionStatus.value === true) return 'text-emerald-400';
  if (connectionStatus.value === false) return 'text-red-400';
  return 'text-slate-400';
});

const connectionStatusLabel = computed(() => {
  if (isDemoMode.value) return 'Demo Sandbox';
  if (connectionStatus.value === true) return 'Live Connected';
  if (connectionStatus.value === false) return 'Gateway Error';
  return 'Checking Gateway...';
});

const connectionStatusSubLabel = computed(() => {
  if (isDemoMode.value) return 'Local Simulated Data';
  if (vaultUrl.value && vaultUsername.value) {
    const cleanUrl = vaultUrl.value.replace(/^https?:\/\//, '').replace(/\/REST$/, '');
    return `${vaultUsername.value}@${cleanUrl}`;
  }
  return 'Credentials missing';
});

onMounted(() => {
  loadDashboardConfig();
});
</script>

<style>
/* Basic layout resets */
.min-height-screen {
  min-height: 100vh;
}

/* Smooth fade-in for tab content transitions */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
