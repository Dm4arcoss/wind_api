import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import chartPlugin from './plugins/chart'
import { createPinia } from 'pinia'

// Verificar e aplicar o tema salvo
const savedTheme = localStorage.getItem('theme')
if (savedTheme === 'dark') {
  document.body.classList.add('dark')
} else {
  document.body.classList.remove('dark')
}

const app = createApp(App)
app.use(router)
app.use(chartPlugin)
app.use(createPinia())
app.mount('#app')