import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

// Verificar e aplicar o tema salvo
const savedTheme = localStorage.getItem('theme')
if (savedTheme === 'dark') {
  document.body.classList.add('dark-mode')
} else {
  document.body.classList.add('light-mode')
}

createApp(App)
  .use(router)
  .mount('#app')