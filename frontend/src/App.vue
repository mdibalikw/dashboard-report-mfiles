<template>
  <div class="min-height-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <!-- Top Branding / Header -->
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div class="flex items-center space-x-4">
        <!-- Dashboard Icon -->
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-mfiles-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-50 via-slate-100 to-mfiles-300 font-sans tracking-tight">
            M-Files Analytics Dashboard
          </h1>
          <p class="text-xs sm:text-sm text-slate-400 font-medium">
            Configuration-Driven Reporting Engine for M-Files Web Service (MFWS)
          </p>
        </div>
      </div>

      <!-- Action Items & Health Summary -->
      <div class="flex flex-wrap items-center gap-3">
        <!-- Global Refresh Button -->
        <button 
          @click="loadAllReportsData"
          class="glass-btn-secondary py-2 px-4 text-xs font-semibold flex items-center space-x-2"
          :disabled="globalLoading"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-4 w-4" 
            :class="{ 'animate-spin': globalLoading }" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.2" />
          </svg>
          <span>Refresh All</span>
        </button>

        <!-- Current local time or indicator -->
        <span class="text-xs text-slate-500 bg-slate-900/50 px-3.5 py-2 rounded-lg border border-slate-850 font-mono">
          As of: {{ lastRefreshedTime }}
        </span>
      </div>
    </header>

    <!-- Connection Settings Module -->
    <VaultSettings 
      @settings-saved="handleSettingsSaved"
      @status-changed="handleStatusChanged"
    />

    <!-- Summary Stats Bar -->
    <section v-if="reports.length > 0" class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
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

    <!-- Global Warning Banner if settings are not connected -->
    <div 
      v-if="!isDemoMode && connectionStatus === false"
      class="bg-red-950/20 border border-red-900/30 rounded-2xl p-6 mb-8 text-center"
    >
      <div class="max-w-md mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 class="text-md font-semibold text-red-200">M-Files Gateway Disconnected</h3>
        <p class="text-xs text-slate-400 mt-2">
          The dashboard is currently unable to query M-Files. Please check the connection credentials at the top, or toggle "Demo / Offline Mock Mode" to preview report widgets.
        </p>
      </div>
    </div>

    <!-- Main Chart Grid -->
    <main>
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
    </main>
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
  // Trigger full reload of dashboard configuration and data
  loadDashboardConfig();
};

// Listen to health status updates from VaultSettings
const handleStatusChanged = (payload) => {
  connectionStatus.value = payload.connected;
};

onMounted(() => {
  loadDashboardConfig();
});
</script>

<style>
/* Basic layout resets */
.min-height-screen {
  min-height: 100vh;
}
</style>
