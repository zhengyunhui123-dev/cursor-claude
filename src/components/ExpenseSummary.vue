<script setup>
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { useExpenseStore } from '../stores/expense.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const store = useExpenseStore()

const chartData = computed(() => ({
  labels: ['工作日', '休息日'],
  datasets: [{
    data: [store.workdayExpense || 0.001, store.restdayExpense || 0.001],
    backgroundColor: ['#3d7a50', '#c9b896'],
    borderWidth: 0,
    hoverOffset: 0
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  cutout: '68%',
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false }
  }
}
</script>

<template>
  <div class="summary-card">
    <div class="summary-main">
      <div class="summary-left">
        <div class="summary-label">本月共支出</div>
        <div class="summary-total">
          <span class="yen">¥</span>{{ store.totalExpense.toFixed(2) }}
        </div>
        <div class="summary-breakdown">
          <div class="breakdown-item">
            <span class="bd-dot green"></span>
            <span class="bd-label">工作日</span>
            <span class="bd-value green">¥{{ store.workdayExpense.toFixed(2) }}</span>
          </div>
          <div class="breakdown-item">
            <span class="bd-dot muted"></span>
            <span class="bd-label">休息日</span>
            <span class="bd-value muted">¥{{ store.restdayExpense.toFixed(2) }}</span>
          </div>
        </div>
      </div>
      <div class="summary-chart">
        <Pie :data="chartData" :options="chartOptions" />
      </div>
    </div>
    <div class="summary-footer">
      <div class="footer-item">
        <span class="footer-icon">💳</span>
        <span class="footer-label">信用卡</span>
        <span class="footer-val">¥{{ store.creditTotal.toFixed(2) }}</span>
      </div>
      <div class="footer-divider"></div>
      <div class="footer-item">
        <span class="footer-icon">💵</span>
        <span class="footer-label">现金</span>
        <span class="footer-val">¥{{ store.cashTotal.toFixed(2) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.summary-card {
  margin: 8px 16px;
  padding: 18px 16px 14px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  animation: fadeInUp 0.4s ease both;
}

.summary-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.summary-left {
  flex: 1;
}

.summary-label {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 6px;
  font-weight: 400;
}

.summary-total {
  font-family: 'Noto Serif SC', serif;
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 14px;
  letter-spacing: -0.5px;
}

.yen {
  font-size: 18px;
  font-weight: 400;
  margin-right: 2px;
  vertical-align: 1px;
}

.summary-breakdown {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.breakdown-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.bd-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.bd-dot.green { background: var(--green); }
.bd-dot.muted { background: var(--text-muted); }

.bd-label {
  color: var(--text-secondary);
  min-width: 36px;
}

.bd-value.green { color: var(--green); font-weight: 600; }
.bd-value.muted { color: var(--text-muted); }

.summary-chart {
  width: 76px;
  height: 76px;
  flex-shrink: 0;
}

.summary-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid rgba(44, 24, 16, 0.06);
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  justify-content: center;
}

.footer-icon {
  font-size: 14px;
}

.footer-label {
  font-size: 12px;
  color: var(--text-muted);
}

.footer-val {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}

.footer-divider {
  width: 1px;
  height: 16px;
  background: rgba(44, 24, 16, 0.08);
}
</style>
