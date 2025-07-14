import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles/global.css'
import './style.css'
import chartPlugin from './plugins/chart'
import { createPinia } from 'pinia'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPlus, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons'

// Aplicar tema inicial
const applyInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark')
  } else if (savedTheme === 'system') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Aplicar tema antes de montar a aplicação
applyInitialTheme()

const app = createApp(App)
app.use(router)
app.use(chartPlugin)
app.use(createPinia())

// Adicionar ícones ao fontawesome
library.add(faPlus, faMinus, faTrash)

// Registrar o componente globalmente
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')