<script setup>
import { useExpenseStore } from '../stores/expense.js'
import db from '../db/index.js'

const store = useExpenseStore()

async function clearAll() {
  if (confirm('确定清除所有记账数据吗？此操作不可恢复。')) {
    await db.expenses.clear()
    store.expenses = []
    alert('数据已清除')
  }
}
</script>

<template>
  <div class="profile-view">
    <h2 class="page-title">我的</h2>

    <div class="app-info">
      <div class="app-logo">
        <span class="logo-icon">📝</span>
      </div>
      <div class="app-name">记账本</div>
      <div class="app-desc">管理你的每一笔支出</div>
      <div class="app-version">v1.0.0</div>
    </div>

    <div class="section">
      <button class="danger-btn" @click="clearAll">
        <span>清除所有数据</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.profile-view {
  padding: 20px 16px;
}

.page-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 32px;
  color: var(--text-primary);
}

.app-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 0 24px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  animation: fadeInUp 0.4s ease both;
}

.app-logo {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent);
  border-radius: 20px;
  margin-bottom: 14px;
  box-shadow: var(--shadow-float);
}

.logo-icon {
  font-size: 32px;
}

.app-name {
  font-family: 'Noto Serif SC', serif;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.app-desc {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 4px;
}

.app-version {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 8px;
  opacity: 0.6;
}

.section {
  margin-top: 24px;
  animation: fadeInUp 0.4s ease 0.1s both;
}

.danger-btn {
  width: 100%;
  padding: 14px 18px;
  background: var(--bg-card);
  color: var(--danger);
  font-size: 14px;
  font-weight: 500;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.danger-btn:active {
  background: var(--danger-light);
}
</style>
