<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
</script>

<template>
  <nav class="bottom-nav">
    <router-link to="/" class="nav-item" :class="{ active: route.path === '/' }">
      <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        <path d="M9 14l2 2 4-4" />
      </svg>
      <span class="nav-label">记账</span>
    </router-link>

    <button class="nav-add" @click="router.push('/add')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </button>

    <router-link to="/charts" class="nav-item" :class="{ active: route.path === '/charts' }">
      <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M3 3v18h18" />
        <path d="M7 16l4-6 4 4 5-8" />
      </svg>
      <span class="nav-label">图表</span>
    </router-link>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 64px;
  background: var(--bg-secondary);
  border-top: 1px solid rgba(26, 26, 46, 0.06);
  z-index: 100;
  padding: 0 24px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  text-decoration: none;
  color: var(--text-muted);
  transition: all 0.2s ease;
  padding: 8px 28px;
  flex: 1;
  position: relative;
}

.nav-item.active {
  color: var(--accent);
}

.nav-item.active::after {
  content: '';
  position: absolute;
  top: -1px;
  width: 20px;
  height: 2.5px;
  background: var(--accent);
  border-radius: 2px;
}

.nav-svg {
  width: 22px;
  height: 22px;
}

.nav-label {
  font-size: 10px;
  font-weight: 500;
}

.nav-add {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -20px;
  box-shadow: var(--shadow-float);
  flex-shrink: 0;
  transition: all 0.15s ease;
}

.nav-add svg {
  width: 22px;
  height: 22px;
}

.nav-add:active {
  transform: scale(0.9);
  box-shadow: 0 2px 8px rgba(240, 160, 48, 0.3);
}
</style>
