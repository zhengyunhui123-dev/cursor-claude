<script setup>
import { ref } from 'vue'
import MonthSelector from '../components/MonthSelector.vue'
import CalendarGrid from '../components/CalendarGrid.vue'
import ExpenseList from '../components/ExpenseList.vue'
import ExpenseSummary from '../components/ExpenseSummary.vue'

const showCalendar = ref(false)
</script>

<template>
  <div class="home-view">
    <div class="top-bar">
      <MonthSelector />
      <button class="view-toggle" @click="showCalendar = !showCalendar" :title="showCalendar ? '查看列表' : '查看日历'">
        <svg v-if="!showCalendar" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M3 10h18M8 2v4M16 2v4" />
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>
    </div>

    <transition name="cal">
      <CalendarGrid v-if="showCalendar" />
    </transition>

    <ExpenseSummary />
    <ExpenseList />
  </div>
</template>

<style scoped>
.home-view {
  padding-bottom: 16px;
}

.top-bar {
  display: flex;
  align-items: flex-start;
  padding: 0 16px;
}

.top-bar :deep(.month-selector) {
  flex: 1;
  padding: 20px 0 8px;
}

.view-toggle {
  margin-top: 28px;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: var(--bg-card);
  color: var(--text-secondary);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.view-toggle:active {
  transform: scale(0.92);
  background: var(--bg-tertiary);
}

.cal-enter-active {
  animation: scaleIn 0.25s ease both;
}

.cal-leave-active {
  animation: scaleIn 0.2s ease reverse both;
}
</style>
