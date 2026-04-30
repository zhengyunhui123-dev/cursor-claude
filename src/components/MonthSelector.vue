<script setup>
import { useExpenseStore } from '../stores/expense.js'

const store = useExpenseStore()
</script>

<template>
  <div class="month-selector">
    <button class="arrow" @click="store.prevMonth()">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M10 3L5 8L10 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <div class="month-display">
      <span class="year">{{ store.currentYear }}年</span>
      <span class="month">{{ store.currentMonth }}月</span>
    </div>
    <button class="arrow" @click="store.nextMonth()">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.month-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28px;
  padding: 24px 0 8px;
}

.month-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  min-width: 80px;
}

.year {
  font-size: 12px;
  color: var(--text-muted);
  letter-spacing: 2px;
  font-weight: 400;
}

.month {
  font-family: 'Noto Serif SC', serif;
  font-size: 36px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
  margin-top: 2px;
}

.arrow {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--text-muted);
  transition: all 0.2s ease;
}

.arrow:active {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}
</style>
