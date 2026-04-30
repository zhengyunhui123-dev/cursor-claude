import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import App from './App.vue'
import './styles/global.css'

createApp(App).use(createPinia()).use(router).mount('#app')
