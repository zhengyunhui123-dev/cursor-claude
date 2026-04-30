<script setup>
import { computed } from 'vue'
import { Pie, Bar, Line } from 'vue-chartjs'
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler
} from 'chart.js'
import { useExpenseStore } from '../stores/expense.js'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler)

const store = useExpenseStore()

const categoryMap = {
  takeout: { name: '外卖', color: '#3d7a50' },
  dining: { name: '堂食', color: '#4a6e8a' },
  grocery: { name: '买菜', color: '#b89030' },
  telecom: { name: '通讯', color: '#7a5a8a' },
  credit: { name: '还信用卡', color: '#b53a2a' },
  study: { name: '学习', color: '#2d7a6a' },
  fun: { name: '娱乐', color: '#b06a30' },
  badminton: { name: '羽毛球', color: '#2d8a5a' },
  ai: { name: 'AI', color: '#4a6aaa' }
}

const categoryChartData = computed(() => {
  const totals = {}
  store.monthExpenses.forEach(e => {
    totals[e.category] = (totals[e.category] || 0) + e.amount
  })
  const keys = Object.keys(totals)
  return {
    labels: keys.map(k => categoryMap[k]?.name || k),
    datasets: [{
      data: keys.map(k => totals[k]),
      backgroundColor: keys.map(k => categoryMap[k]?.color || '#999'),
      borderWidth: 0
    }]
  }
})

const categoryChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'right',
      labels: { color: '#5c4030', padding: 10, font: { size: 11, family: 'Noto Sans SC' }, usePointStyle: true, pointStyleWidth: 8 }
    }
  }
}

const barChartData = computed(() => ({
  labels: ['工作日', '休息日'],
  datasets: [{
    data: [store.workdayExpense, store.restdayExpense],
    backgroundColor: ['#3d7a50', '#c9b896'],
    borderRadius: 6,
    barThickness: 36
  }]
}))

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: { legend: { display: false } },
  scales: {
    x: { ticks: { color: '#5c4030', font: { size: 12 } }, grid: { display: false } },
    y: { ticks: { color: '#9a8570', font: { size: 11 } }, grid: { color: 'rgba(44,24,16,0.06)' } }
  }
}

const trendData = computed(() => {
  const months = []
  let y = store.currentYear, m = store.currentMonth
  for (let i = 5; i >= 0; i--) {
    months.push({ year: y, month: m })
    m--
    if (m < 1) { m = 12; y-- }
  }
  months.reverse()

  return {
    labels: months.map(i => `${i.month}月`),
    datasets: [{
      data: months.map(i => {
        const prefix = `${i.year}-${String(i.month).padStart(2, '0')}`
        return store.expenses.filter(e => e.date.startsWith(prefix)).reduce((s, e) => s + e.amount, 0)
      }),
      borderColor: '#d4a04a',
      backgroundColor: 'rgba(212, 160, 74, 0.12)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#d4a04a',
      pointRadius: 4,
      pointHoverRadius: 6,
      borderWidth: 2
    }]
  }
})

const trendOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: { legend: { display: false } },
  scales: {
    x: { ticks: { color: '#5c4030', font: { size: 12 } }, grid: { display: false } },
    y: { ticks: { color: '#9a8570', font: { size: 11 } }, grid: { color: 'rgba(44,24,16,0.06)' }, beginAtZero: true }
  }
}
</script>

<template>
  <div class="charts-view">
    <h2 class="page-title">图表分析</h2>

    <div class="chart-card" v-if="store.monthExpenses.length > 0">
      <h3>支出分类</h3>
      <div class="chart-container">
        <Pie :data="categoryChartData" :options="categoryChartOptions" />
      </div>
    </div>

    <div class="chart-card">
      <h3>工作日 vs 休息日</h3>
      <div class="chart-container">
        <Bar :data="barChartData" :options="barChartOptions" />
      </div>
    </div>

    <div class="chart-card">
      <h3>近6个月趋势</h3>
      <div class="chart-container">
        <Line :data="trendData" :options="trendOptions" />
      </div>
    </div>

    <div v-if="store.monthExpenses.length === 0" class="empty">
      <div class="empty-icon">📊</div>
      <p class="empty-text">暂无数据</p>
      <p class="empty-hint">添加记账记录后查看图表分析</p>
    </div>
  </div>
</template>

<style scoped>
.charts-view {
  padding: 20px 16px;
}

.page-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.chart-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 18px;
  margin-bottom: 14px;
  box-shadow: var(--shadow-md);
  animation: fadeInUp 0.4s ease both;
}

.chart-card h3 {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 14px;
  font-weight: 500;
}

.chart-container {
  max-height: 240px;
}

.empty {
  text-align: center;
  padding: 60px 0;
}

.empty-icon {
  font-size: 40px;
  margin-bottom: 12px;
  opacity: 0.6;
}

.empty-text {
  color: var(--text-secondary);
  font-size: 15px;
  margin-bottom: 4px;
}

.empty-hint {
  font-size: 12px;
  color: var(--text-muted);
}
</style>
