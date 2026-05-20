<template>
  <div class="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col h-[400px]">
    <!-- Card Header -->
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-slate-100 tracking-wide font-sans">
        {{ title }}
      </h3>
      <!-- Small indicator if live vs mock -->
      <span 
        v-if="!loading && !error && data.length > 0"
        class="text-xs px-2.5 py-0.5 rounded-full font-medium"
        :class="isMock ? 'bg-amber-950/40 text-amber-400 border border-amber-900/30' : 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30'"
      >
        {{ isMock ? 'Demo Data' : 'Live' }}
      </span>
    </div>

    <!-- Main Content Container -->
    <div class="flex-grow flex items-center justify-center relative">
      <!-- 1. LOADING STATE (Skeleton Loader) -->
      <div v-if="loading" class="w-full h-full flex flex-col justify-between py-2 space-y-4">
        <div class="h-6 w-1/3 bg-slate-800/60 rounded shimmer-effect relative overflow-hidden"></div>
        <div class="flex-grow flex items-end space-x-3 pt-4">
          <div class="h-2/3 w-full bg-slate-800/40 rounded-t shimmer-effect relative overflow-hidden"></div>
          <div class="h-4/5 w-full bg-slate-800/40 rounded-t shimmer-effect relative overflow-hidden"></div>
          <div class="h-1/2 w-full bg-slate-800/40 rounded-t shimmer-effect relative overflow-hidden"></div>
          <div class="h-3/4 w-full bg-slate-800/40 rounded-t shimmer-effect relative overflow-hidden"></div>
          <div class="h-2/5 w-full bg-slate-800/40 rounded-t shimmer-effect relative overflow-hidden"></div>
        </div>
      </div>

      <!-- 2. ERROR STATE -->
      <div v-else-if="error" class="text-center p-4 flex flex-col items-center">
        <div class="w-12 h-12 rounded-full bg-red-950/40 border border-red-900/30 flex items-center justify-center text-red-400 mb-3 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p class="text-sm text-red-200 font-medium max-w-[280px] mb-4 line-clamp-3">
          {{ error }}
        </p>
        <button 
          @click="$emit('retry')"
          class="glass-btn-secondary py-1.5 px-4 text-xs font-semibold hover:border-red-900/40 text-red-300 hover:bg-red-950/20"
        >
          Retry Connection
        </button>
      </div>

      <!-- 3. EMPTY STATE -->
      <div v-else-if="data.length === 0" class="text-center p-4 flex flex-col items-center">
        <div class="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-3 shadow-inner">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p class="text-sm text-slate-400 font-medium max-w-[280px]">
          No data available for this report. Check the M-Files view contents.
        </p>
      </div>

      <!-- 4. RENDER CHART -->
      <div v-else class="w-full h-full">
        <apexchart
          class="w-full h-full"
          :type="type === 'doughnut' ? 'donut' : type"
          :options="chartOptions"
          :series="chartSeries"
          height="100%"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import apexchart from 'vue3-apexcharts';

const props = defineProps({
  chartId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'bar' // bar, pie, doughnut (donut), line
  },
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  },
  isMock: {
    type: Boolean,
    default: false
  }
});

defineEmits(['retry']);

// Premium color palette for dashboard charts
const chartColors = [
  '#0ea5e9', // Sky blue
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#10b981', // Emerald green
  '#f59e0b', // Amber
  '#8b5cf6', // Purple
  '#f43f5e', // Rose
  '#06b6d4'  // Cyan
];

// Process Chart Series based on Chart Type
const chartSeries = computed(() => {
  if (props.type === 'pie' || props.type === 'doughnut') {
    return props.data.map(item => Number(item.value));
  }
  
  // Bar or Line chart requires formatted series
  return [{
    name: props.title,
    data: props.data.map(item => Number(item.value))
  }];
});

// Process Chart Options
const chartOptions = computed(() => {
  const categories = props.data.map(item => item.label);
  
  const baseOptions = {
    chart: {
      background: 'transparent',
      fontFamily: 'Inter, sans-serif',
      foreColor: '#94a3b8', // slate-400
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    colors: chartColors,
    theme: {
      mode: 'dark'
    },
    grid: {
      borderColor: '#1e293b', // slate-800
      strokeDashArray: 4,
      padding: {
        left: 10,
        right: 10,
        bottom: 0,
        top: 0
      }
    },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '13px',
        fontFamily: 'Outfit, sans-serif'
      },
      y: {
        formatter: (val) => `${val} objects`
      }
    },
    noData: {
      text: 'Loading Chart...',
      style: {
        color: '#94a3b8'
      }
    }
  };

  // 1. Doughnut / Pie Specific Options
  if (props.type === 'pie' || props.type === 'doughnut') {
    return {
      ...baseOptions,
      labels: categories,
      stroke: {
        show: true,
        colors: ['#0f172a'], // slate-900 border separation
        width: 2
      },
      legend: {
        position: 'bottom',
        fontSize: '12px',
        horizontalAlign: 'center',
        markers: {
          radius: 12
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            background: 'transparent',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '14px',
                color: '#94a3b8',
                offsetY: -5
              },
              value: {
                show: true,
                fontSize: '22px',
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 'bold',
                color: '#f8fafc', // slate-50
                offsetY: 5,
                formatter: (val) => val
              },
              total: {
                show: true,
                label: 'Total',
                color: '#64748b',
                fontSize: '12px',
                formatter: (w) => {
                  return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                }
              }
            }
          }
        }
      }
    };
  }

  // 2. Bar Chart Specific Options
  if (props.type === 'bar') {
    return {
      ...baseOptions,
      xaxis: {
        categories: categories,
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          style: {
            colors: '#64748b', // slate-500
            fontSize: '11px'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#64748b',
            fontSize: '11px'
          }
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: '45%',
          distributed: true, // give bars different colors
          dataLabels: {
            position: 'top'
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => val,
        offsetY: -20,
        style: {
          fontSize: '11px',
          colors: ['#cbd5e1'] // slate-300
        }
      },
      legend: {
        show: false
      }
    };
  }

  // 3. Line Chart Specific Options
  if (props.type === 'line') {
    return {
      ...baseOptions,
      stroke: {
        curve: 'smooth',
        width: 3.5
      },
      markers: {
        size: 5,
        strokeWidth: 2,
        strokeColors: '#0f172a',
        hover: {
          size: 7
        }
      },
      xaxis: {
        categories: categories,
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          style: {
            colors: '#64748b',
            fontSize: '11px'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#64748b',
            fontSize: '11px'
          }
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: "vertical",
          shadeIntensity: 0.5,
          gradientToColors: ['#38bdf8'], // glow gradient
          inverseColors: true,
          opacityFrom: 0.9,
          opacityTo: 0.3,
          stops: [0, 100]
        }
      }
    };
  }

  return baseOptions;
});
</script>
