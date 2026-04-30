<script setup>
import { computed } from 'vue'
import { useExpenseStore } from '../stores/expense.js'
import { isToday } from '../utils/calendar.js'
import { holidays, extraWorkdays } from '../data/holidays.js'

const store = useExpenseStore()

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日']

const grid = computed(() => {
  const year = store.currentYear
  const month = store.currentMonth
  const firstDay = new Date(year, month - 1, 1)
  let startDay = firstDay.getDay()
  startDay = startDay === 0 ? 6 : startDay - 1

  const daysInMonth = new Date(year, month, 0).getDate()
  const prevMonthDays = new Date(year, month - 1, 0).getDate()
  const cells = []

  for (let i = startDay - 1; i >= 0; i--) {
    const day = prevMonthDays - i
    const m = month === 1 ? 12 : month - 1
    const y = month === 1 ? year - 1 : year
    cells.push({ date: `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`, day, currentMonth: false })
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`, day, currentMonth: true })
  }

  let nextDay = 1
  while (cells.length < 42) {
    const m = month === 12 ? 1 : month + 1
    const y = month === 12 ? year + 1 : year
    cells.push({ date: `${y}-${String(m).padStart(2, '0')}-${String(nextDay).padStart(2, '0')}`, day: nextDay, currentMonth: false })
    nextDay++
  }

  const rows = []
  for (let i = 0; i < 42; i += 7) rows.push(cells.slice(i, i + 7))
  return rows
})

function getCellTag(cell) {
  if (!cell.currentMonth) return null
  if (holidays[cell.date]) return { text: '休', type: 'holiday' }
  if (extraWorkdays[cell.date]) return { text: '班', type: 'work' }
  const dow = new Date(cell.date).getDay()
  if (dow === 0 || dow === 6) return { text: '休', type: 'weekend' }
  return null
}

function formatAmount(amount) {
  if (amount >= 10000) return (amount / 10000).toFixed(1) + 'w'
  if (amount >= 1000) return (amount / 1000).toFixed(1) + 'k'
  return amount >= 100 ? amount.toFixed(0) : amount.toFixed(amount % 1 === 0 ? 0 : 2)
}
</script>

<template>
  <div class="calendar-wrapper">
    <div class="calendar-grid">
      <div class="weekday-row">
        <span v-for="wd in WEEKDAYS" :key="wd" class="weekday">{{ wd }}</span>
      </div>
      <div class="days-grid">
        <template v-for="(row, ri) in grid" :key="ri">
          <div
            v-for="(cell, ci) in row"
            :key="ci"
            class="day-cell"
            :class="{
              today: cell.currentMonth && isToday(cell.date),
              'other-month': !cell.currentMonth,
              'has-tag': cell.currentMonth && getCellTag(cell)
            }"
          >
            <span class="day-num">{{ cell.day }}</span>
            <span v-if="cell.currentMonth && getCellTag(cell)" class="day-tag" :class="getCellTag(cell).type">
              {{ getCellTag(cell).text }}
            </span>
            <span v-else-if="cell.currentMonth && store.dailyTotals[cell.date]" class="day-amount">
              {{ formatAmount(store.dailyTotals[cell.date]) }}
            </span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-wrapper {
  padding: 0 16px;
  margin-bottom: 4px;
}

.calendar-grid {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 12px 10px 8px;
  box-shadow: var(--shadow-sm);
}

.weekday-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(44, 24, 16, 0.05);
  margin-bottom: 4px;
}

.weekday {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
  letter-spacing: 1px;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.day-cell {
  aspect-ratio: 1 / 1.15;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
  position: relative;
  border-radius: var(--radius-sm);
}

.day-cell.today {
  background: var(--accent);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  margin: 2px auto;
  aspect-ratio: auto;
}

.day-cell.today .day-num {
  color: #fff;
  font-weight: 700;
  font-size: 14px;
}

.day-cell.today .day-tag {
  display: none;
}

.day-cell.other-month .day-num {
  color: var(--text-muted);
  opacity: 0.35;
}

.day-num {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
  line-height: 1.2;
}

.day-tag {
  font-size: 8px;
  font-weight: 700;
  line-height: 1;
  margin-top: 1px;
}

.day-tag.holiday,
.day-tag.weekend {
  color: var(--danger);
}

.day-tag.work {
  color: var(--text-muted);
}

.day-amount {
  font-size: 9px;
  color: var(--green);
  line-height: 1;
  font-weight: 600;
  margin-top: 1px;
}
</style>
