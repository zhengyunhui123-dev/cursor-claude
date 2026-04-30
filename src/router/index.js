import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/charts', name: 'charts', component: () => import('../views/ChartsView.vue') },
  { path: '/profile', name: 'profile', component: () => import('../views/ProfileView.vue') },
  { path: '/add', name: 'add', component: () => import('../components/ExpenseForm.vue') },
  { path: '/edit/:id', name: 'edit', component: () => import('../components/ExpenseForm.vue') }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})
