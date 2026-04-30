import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import db from '../db/index.js'
import { isWorkday } from '../utils/calendar.js'

export const useExpenseStore = defineStore('expense', () => {
  const expenses = ref([])
  const currentYear = ref(new Date().getFullYear())
  const currentMonth = ref(new Date().getMonth() + 1)
  const viewMode = ref('calendar')

  const monthExpenses = computed(() => {
    const prefix = `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}`
    return expenses.value.filter(e => e.date.startsWith(prefix))
  })

  const totalExpense = computed(() => {
    return monthExpenses.value.reduce((sum, e) => sum + e.amount, 0)
  })

  const workdayExpense = computed(() => {
    return monthExpenses.value
      .filter(e => isWorkday(e.date))
      .reduce((sum, e) => sum + e.amount, 0)
  })

  const restdayExpense = computed(() => {
    return monthExpenses.value
      .filter(e => !isWorkday(e.date))
      .reduce((sum, e) => sum + e.amount, 0)
  })

  const creditTotal = computed(() => {
    return monthExpenses.value
      .filter(e => e.paymentMethod === 'credit')
      .reduce((sum, e) => sum + e.amount, 0)
  })

  const cashTotal = computed(() => {
    return monthExpenses.value
      .filter(e => e.paymentMethod === 'cash')
      .reduce((sum, e) => sum + e.amount, 0)
  })

  const dailyTotals = computed(() => {
    const map = {}
    monthExpenses.value.forEach(e => {
      map[e.date] = (map[e.date] || 0) + e.amount
    })
    return map
  })

  const expensesByDate = computed(() => {
    const groups = {}
    monthExpenses.value.forEach(e => {
      if (!groups[e.date]) {
        groups[e.date] = []
      }
      groups[e.date].push(e)
    })
    return Object.keys(groups)
      .sort((a, b) => b.localeCompare(a))
      .map(date => ({
        date,
        items: groups[date].sort((a, b) => b.createdAt - a.createdAt)
      }))
  })

  async function loadExpenses() {
    expenses.value = await db.expenses.toArray()
  }

  async function addExpense(data) {
    const record = { ...data, createdAt: Date.now() }
    const id = await db.expenses.add(record)
    expenses.value.push({ ...record, id })
  }

  async function updateExpense(id, data) {
    await db.expenses.update(id, data)
    const idx = expenses.value.findIndex(e => e.id === id)
    if (idx !== -1) {
      expenses.value[idx] = { ...expenses.value[idx], ...data }
    }
  }

  async function deleteExpense(id) {
    await db.expenses.delete(id)
    expenses.value = expenses.value.filter(e => e.id !== id)
  }

  function setMonth(year, month) {
    currentYear.value = year
    currentMonth.value = month
  }

  function prevMonth() {
    if (currentMonth.value === 1) {
      currentMonth.value = 12
      currentYear.value--
    } else {
      currentMonth.value--
    }
  }

  function nextMonth() {
    if (currentMonth.value === 12) {
      currentMonth.value = 1
      currentYear.value++
    } else {
      currentMonth.value++
    }
  }

  return {
    expenses, currentYear, currentMonth, viewMode,
    monthExpenses, totalExpense, workdayExpense, restdayExpense,
    creditTotal, cashTotal, dailyTotals, expensesByDate,
    loadExpenses, addExpense, updateExpense, deleteExpense,
    setMonth, prevMonth, nextMonth
  }
})
