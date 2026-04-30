<script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useExpenseStore } from './stores/expense.js'
import BottomNav from './components/BottomNav.vue'

const route = useRoute()
const store = useExpenseStore()

const isFormPage = computed(() => ['add', 'edit'].includes(route.name))

onMounted(() => {
  store.loadExpenses()
})
</script>

<template>
  <div class="app-shell">
    <router-view class="page-content" v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <BottomNav v-if="!isFormPage" />
  </div>
</template>

<style scoped>
.app-shell {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.page-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 80px;
  -webkit-overflow-scrolling: touch;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
