<script setup>
import { useRouter } from 'vue-router'
import { useExpenseStore } from '../stores/expense.js'
import { formatDateChinese } from '../utils/calendar.js'

const router = useRouter()
const store = useExpenseStore()

const categoryMap = {
  takeout: { name: '外卖', icon: '🥡', bg: '#e8f0ea' },
  dining: { name: '堂食', icon: '🍜', bg: '#e4ecf2' },
  grocery: { name: '买菜', icon: '🛒', bg: '#f0e8d4' },
  telecom: { name: '通讯', icon: '📱', bg: '#ece4f0' },
  credit: { name: '还信用卡', icon: '💳', bg: '#f0e4e4' },
  study: { name: '学习', icon: '📚', bg: '#e0ece8' },
  fun: { name: '娱乐', icon: '🎮', bg: '#f0e8dc' },
  badminton: { name: '羽毛球', icon: '🏸', bg: '#e4f0e8' },
  ai: { name: 'AI', icon: '🤖', bg: '#e4e8f4' }
}

const paymentLabel = {
  credit: '信用卡',
  cash: '现金'
}

function editExpense(id) {
  router.push('/edit/' + id)
}
</script>

<template>
  <div class="expense-list">
    <div v-if="store.expensesByDate.length === 0" class="empty">
      <div class="empty-icon">📝</div>
      <p class="empty-text">还没有记账记录</p>
      <p class="empty-hint">点击下方 + 开始记录第一笔</p>
    </div>

    <div
      v-for="(group, gi) in store.expensesByDate"
      :key="group.date"
      class="date-group"
      :style="{ animationDelay: gi * 0.05 + 's' }"
    >
      <div class="date-header">
        <span class="date-text">{{ formatDateChinese(group.date) }}</span>
        <span class="date-tag">支出</span>
      </div>
      <div
        v-for="(item, ii) in group.items"
        :key="item.id"
        class="expense-item"
        :style="{ animationDelay: (gi * 0.05 + ii * 0.03) + 's' }"
        @click="editExpense(item.id)"
      >
        <div class="item-icon" :style="{ background: categoryMap[item.category]?.bg || '#eee' }">
          {{ categoryMap[item.category]?.icon || '💰' }}
        </div>
        <div class="item-info">
          <span class="item-name">{{ categoryMap[item.category]?.name || item.category }}</span>
          <span class="item-meta">
            {{ paymentLabel[item.paymentMethod] || '' }}
            <template v-if="item.note"> · {{ item.note }}</template>
          </span>
        </div>
        <div class="item-amount">-{{ item.amount.toFixed(2) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.expense-list {
  padding: 0 16px;
}

.empty {
  text-align: center;
  padding: 48px 0 32px;
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

.date-group {
  margin-bottom: 18px;
  animation: fadeInUp 0.35s ease both;
}

.date-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 4px 8px;
}

.date-text {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}

.date-tag {
  font-size: 10px;
  color: var(--text-muted);
  background: rgba(44, 24, 16, 0.05);
  padding: 1px 8px;
  border-radius: 10px;
  font-weight: 500;
}

.expense-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  margin-bottom: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: var(--shadow-sm);
  animation: fadeInUp 0.35s ease both;
}

.expense-item:active {
  transform: scale(0.98);
  box-shadow: none;
}

.item-icon {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
  border-radius: 12px;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 14px;
  color: var(--text-primary);
  display: block;
  font-weight: 500;
}

.item-meta {
  font-size: 11px;
  color: var(--text-muted);
  display: block;
  margin-top: 2px;
}

.item-amount {
  font-family: 'Noto Serif SC', serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--danger);
  flex-shrink: 0;
}
</style>
