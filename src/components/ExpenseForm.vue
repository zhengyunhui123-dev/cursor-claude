<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useExpenseStore } from '../stores/expense.js'
import AmountKeypad from './AmountKeypad.vue'

const router = useRouter()
const route = useRoute()
const store = useExpenseStore()

const isEdit = computed(() => !!route.params.id)
const editId = computed(() => isEdit.value ? Number(route.params.id) : null)

const selectedCategory = ref('')
const amount = ref('')
const paymentMethod = ref('credit')
const showSheet = ref(false)

const categories = [
  { key: 'takeout', icon: '🥡', name: '外卖', bg: '#e8f0ea' },
  { key: 'dining', icon: '🍜', name: '堂食', bg: '#e4ecf2' },
  { key: 'grocery', icon: '🛒', name: '买菜', bg: '#f0e8d4' },
  { key: 'telecom', icon: '📱', name: '通讯', bg: '#ece4f0' },
  { key: 'credit', icon: '💳', name: '还信用卡', bg: '#f0e4e4' },
  { key: 'study', icon: '📚', name: '学习', bg: '#e0ece8' },
  { key: 'fun', icon: '🎮', name: '娱乐', bg: '#f0e8dc' },
  { key: 'badminton', icon: '🏸', name: '羽毛球', bg: '#e4f0e8' },
  { key: 'ai', icon: '🤖', name: 'AI', bg: '#e4e8f4' }
]

// 编辑模式：预填数据
if (isEdit.value) {
  const expense = store.expenses.find(e => e.id === editId.value)
  if (expense) {
    selectedCategory.value = expense.category
    amount.value = String(expense.amount)
    paymentMethod.value = expense.paymentMethod
    showSheet.value = true
  }
}

function selectCategory(cat) {
  selectedCategory.value = cat
  showSheet.value = true
}

function closeSheet() {
  showSheet.value = false
  if (!isEdit.value) {
    selectedCategory.value = ''
    amount.value = ''
    paymentMethod.value = 'credit'
  }
}

async function save() {
  const num = parseFloat(amount.value)
  if (!selectedCategory.value || !num || num <= 0) return

  const today = new Date().toISOString().slice(0, 10)
  const data = {
    category: selectedCategory.value,
    amount: num,
    paymentMethod: paymentMethod.value,
    date: isEdit.value ? store.expenses.find(e => e.id === editId.value)?.date || today : today,
    note: ''
  }

  if (isEdit.value) {
    await store.updateExpense(editId.value, data)
  } else {
    await store.addExpense(data)
  }
  router.back()
}

async function remove() {
  if (confirm('确定删除这条记录吗？')) {
    await store.deleteExpense(editId.value)
    router.back()
  }
}
</script>

<template>
  <div class="expense-form">
    <div class="form-header">
      <button class="back-btn" @click="router.back()">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M12 4L6 10L12 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h2>{{ isEdit ? '编辑记录' : '记一笔' }}</h2>
      <button v-if="isEdit" class="delete-btn" @click="remove">删除</button>
      <span v-else class="header-spacer"></span>
    </div>

    <div class="type-toggle">
      <button class="type-btn active">支出</button>
    </div>

    <div class="category-grid">
      <button
        v-for="cat in categories"
        :key="cat.key"
        class="cat-item"
        :class="{ selected: selectedCategory === cat.key }"
        @click="selectCategory(cat.key)"
      >
        <span class="cat-icon" :style="{ background: cat.bg }">{{ cat.icon }}</span>
        <span class="cat-name">{{ cat.name }}</span>
      </button>
    </div>

    <!-- 底部弹窗 -->
    <transition name="sheet">
      <div v-if="showSheet" class="sheet-overlay" @click.self="closeSheet">
        <div class="sheet">
          <div class="sheet-header">
            <span class="sheet-title">选择支付方式</span>
            <button class="sheet-close" @click="closeSheet">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <div class="payment-row">
            <button
              class="payment-btn"
              :class="{ active: paymentMethod === 'credit' }"
              @click="paymentMethod = 'credit'"
            >信用卡</button>
            <button
              class="payment-btn"
              :class="{ active: paymentMethod === 'cash' }"
              @click="paymentMethod = 'cash'"
            >现金</button>
          </div>

          <AmountKeypad v-model="amount" />

          <div class="sheet-footer">
            <button class="save-btn" @click="save">保存</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.expense-form {
  min-height: 100%;
  background: var(--bg-primary);
  position: relative;
}

.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: var(--bg-card);
  box-shadow: var(--shadow-sm);
}

.form-header h2 {
  font-size: 17px;
  font-weight: 600;
}

.back-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: var(--text-secondary);
}

.back-btn:active {
  background: var(--bg-tertiary);
}

.delete-btn {
  font-size: 14px;
  padding: 6px 12px;
  color: var(--danger);
  border-radius: 8px;
  font-weight: 500;
}

.header-spacer {
  width: 36px;
}

.type-toggle {
  padding: 20px 16px 12px;
}

.type-btn {
  padding: 7px 22px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background: var(--accent);
  box-shadow: var(--shadow-float);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 8px 16px;
}

.cat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 4px 14px;
  border-radius: var(--radius-md);
  background: var(--bg-card);
  border: 2px solid transparent;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}

.cat-item.selected {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.cat-item:active {
  transform: scale(0.95);
}

.cat-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border-radius: 14px;
}

.cat-name {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}

.cat-item.selected .cat-name {
  color: var(--accent);
  font-weight: 600;
}

/* 底部弹窗 */
.sheet-overlay {
  position: fixed;
  inset: 0;
  background: rgba(44, 24, 16, 0.3);
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.sheet {
  width: 100%;
  max-width: 480px;
  background: var(--bg-primary);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  padding: 0 16px 32px;
  box-shadow: 0 -8px 32px rgba(44, 24, 16, 0.15);
  max-height: 75vh;
  overflow-y: auto;
}

.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 4px 14px;
  position: sticky;
  top: 0;
  background: var(--bg-primary);
  z-index: 1;
}

.sheet-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.sheet-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--text-muted);
  transition: background 0.15s;
}

.sheet-close:active {
  background: var(--bg-tertiary);
}

.payment-row {
  display: flex;
  gap: 10px;
  padding: 0 4px 12px;
}

.payment-btn {
  flex: 1;
  padding: 12px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--bg-card);
  border: 2px solid transparent;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}

.payment-btn.active {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-dim);
}

.payment-btn:active {
  transform: scale(0.97);
}

.sheet-footer {
  padding: 12px 4px 0;
}

.save-btn {
  width: 100%;
  padding: 14px;
  background: var(--accent);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-float);
  transition: all 0.2s ease;
}

.save-btn:active {
  transform: scale(0.98);
}

/* 弹窗动画 */
.sheet-enter-active {
  transition: opacity 0.25s ease;
}
.sheet-enter-active .sheet {
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.sheet-leave-active {
  transition: opacity 0.2s ease;
}
.sheet-leave-active .sheet {
  transition: transform 0.2s ease;
}

.sheet-enter-from {
  opacity: 0;
}
.sheet-enter-from .sheet {
  transform: translateY(100%);
}
.sheet-leave-to {
  opacity: 0;
}
.sheet-leave-to .sheet {
  transform: translateY(100%);
}
</style>
