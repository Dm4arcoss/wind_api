import { ref, watch, onMounted } from 'vue'

export function useTheme() {
  const isDark = ref(false)
  const isSystem = ref(false)

  // Função para detectar preferência do sistema
  const getSystemPreference = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  // Função para aplicar o tema
  const applyTheme = (dark) => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Função para alternar tema
  const toggleTheme = () => {
    isDark.value = !isDark.value
    isSystem.value = false
    applyTheme(isDark.value)
    saveTheme()
  }

  // Função para definir tema específico
  const setTheme = (theme) => {
    if (theme === 'system') {
      isSystem.value = true
      isDark.value = getSystemPreference()
    } else {
      isSystem.value = false
      isDark.value = theme === 'dark'
    }
    applyTheme(isDark.value)
    saveTheme()
  }

  // Função para salvar preferência
  const saveTheme = () => {
    const theme = isSystem.value ? 'system' : (isDark.value ? 'dark' : 'light')
    localStorage.setItem('theme', theme)
  }

  // Função para carregar preferência salva
  const loadTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    
    if (savedTheme === 'system') {
      isSystem.value = true
      isDark.value = getSystemPreference()
    } else if (savedTheme === 'dark') {
      isSystem.value = false
      isDark.value = true
    } else {
      isSystem.value = false
      isDark.value = false
    }
    
    applyTheme(isDark.value)
  }

  // Observar mudanças na preferência do sistema
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  
  const handleSystemChange = (e) => {
    if (isSystem.value) {
      isDark.value = e.matches
      applyTheme(isDark.value)
    }
  }

  // Carregar tema na inicialização
  onMounted(() => {
    loadTheme()
    mediaQuery.addEventListener('change', handleSystemChange)
  })

  // Cleanup
  const cleanup = () => {
    mediaQuery.removeEventListener('change', handleSystemChange)
  }

  return {
    isDark,
    isSystem,
    toggleTheme,
    setTheme,
    getSystemPreference
  }
} 