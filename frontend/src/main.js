import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import chartPlugin from './plugins/chart'
import { createPinia } from 'pinia'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPlus, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons'

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

// Adicionar ícones ao fontawesome
library.add(faPlus, faMinus, faTrash)

// Registrar o componente globalmente
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')