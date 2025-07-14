# Guia do Sistema de Tema Dark/Light

Este projeto implementa um sistema completo de tema dark/light com persistência de preferências e suporte a preferência do sistema.

## 🎨 Características

- ✅ **Tema Dark/Light**: Alternância suave entre temas
- ✅ **Preferência do Sistema**: Detecta automaticamente a preferência do usuário
- ✅ **Persistência**: Salva a preferência no localStorage
- ✅ **Transições Suaves**: Animações de transição entre temas
- ✅ **Tailwind CSS**: Integração completa com classes dark:
- ✅ **Composables**: Sistema reativo com Vue 3 Composition API

## 🚀 Como Usar

### 1. Composable useTheme

```javascript
import { useTheme } from '@/composables/useTheme'

const { isDark, isSystem, toggleTheme, setTheme } = useTheme()
```

#### Propriedades Disponíveis

- `isDark`: Boolean reativo indicando se o tema escuro está ativo
- `isSystem`: Boolean reativo indicando se está usando preferência do sistema
- `toggleTheme`: Função para alternar entre temas
- `setTheme`: Função para definir tema específico ('light', 'dark', 'system')

### 2. Componente ThemeToggle

```vue
<template>
  <ThemeToggle />
</template>

<script setup>
import ThemeToggle from '@/components/ThemeToggle.vue'
</script>
```

### 3. Classes CSS

Use as classes do Tailwind CSS com prefixo `dark:`:

```vue
<template>
  <div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
    <h1 class="text-2xl font-bold">Título</h1>
    <p class="text-gray-600 dark:text-gray-400">Texto secundário</p>
  </div>
</template>
```

## 🎯 Exemplos de Uso

### Botão de Toggle Simples

```vue
<template>
  <button @click="toggleTheme" class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
    <i v-if="isDark" class="fas fa-sun text-yellow-500"></i>
    <i v-else class="fas fa-moon text-gray-600"></i>
  </button>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>
```

### Menu de Opções de Tema

```vue
<template>
  <div class="relative">
    <button @click="showMenu = !showMenu" class="p-2 rounded-lg">
      <i class="fas fa-palette"></i>
    </button>
    
    <div v-if="showMenu" class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <button @click="setTheme('light')" class="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">
        Modo Claro
      </button>
      <button @click="setTheme('dark')" class="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">
        Modo Escuro
      </button>
      <button @click="setTheme('system')" class="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">
        Sistema
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { setTheme } = useTheme()
const showMenu = ref(false)
</script>
```

### Componente com Tema Condicional

```vue
<template>
  <div class="card p-6">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ title }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          {{ description }}
        </p>
      </div>
      <div class="text-right">
        <span class="text-2xl font-bold text-primary-600 dark:text-primary-400">
          {{ value }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
  value: [String, Number]
})
</script>
```

## 🎨 Paleta de Cores

### Cores Primárias
- **Azul**: `primary-50` até `primary-900`
- **Cinza**: `gray-50` até `gray-900`

### Cores de Estado
- **Sucesso**: `green-500`, `green-600`
- **Erro**: `red-500`, `red-600`
- **Aviso**: `yellow-500`, `yellow-600`
- **Info**: `blue-500`, `blue-600`

### Exemplos de Uso

```css
/* Backgrounds */
.bg-white dark:bg-gray-800
.bg-gray-50 dark:bg-gray-900
.bg-primary-50 dark:bg-primary-900

/* Textos */
.text-gray-900 dark:text-white
.text-gray-600 dark:text-gray-400
.text-primary-600 dark:text-primary-400

/* Bordas */
.border-gray-200 dark:border-gray-700
.border-primary-200 dark:border-primary-700

/* Hover States */
.hover:bg-gray-100 dark:hover:bg-gray-700
.hover:text-primary-700 dark:hover:text-primary-300
```

## 🔧 Configuração

### Tailwind Config

O arquivo `tailwind.config.js` já está configurado com:

```javascript
module.exports = {
  darkMode: 'class', // Habilita modo escuro baseado em classe
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          // ... outras variações
          900: '#1e3a8a',
        }
      }
    }
  }
}
```

### CSS Global

O arquivo `src/assets/styles/global.css` inclui:

- Transições suaves para mudanças de tema
- Scrollbars customizadas
- Animações
- Estilos para componentes comuns

## 📱 Responsividade

O sistema de tema funciona perfeitamente em todos os dispositivos:

```vue
<template>
  <div class="bg-white dark:bg-gray-800 p-4 md:p-6 lg:p-8">
    <h1 class="text-xl md:text-2xl lg:text-3xl text-gray-900 dark:text-white">
      Título Responsivo
    </h1>
  </div>
</template>
```

## 🎭 Animações

### Transições Suaves

```css
/* Aplicado globalmente */
* {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}
```

### Animações Customizadas

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
```

## 🔍 Debug

Para verificar se o tema está funcionando:

```javascript
// No console do navegador
console.log('Tema atual:', localStorage.getItem('theme'))
console.log('Classe dark ativa:', document.documentElement.classList.contains('dark'))
console.log('Preferência do sistema:', window.matchMedia('(prefers-color-scheme: dark)').matches)
```

## 🚨 Troubleshooting

### Tema não muda
1. Verifique se o Tailwind está configurado com `darkMode: 'class'`
2. Confirme se a classe `dark` está sendo adicionada ao `documentElement`
3. Verifique se as classes `dark:` estão sendo aplicadas

### Transições não funcionam
1. Confirme se o CSS global está sendo importado
2. Verifique se as transições estão definidas no CSS

### Persistência não funciona
1. Verifique se o localStorage está disponível
2. Confirme se a chave 'theme' está sendo salva corretamente

## 📚 Recursos Adicionais

- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [CSS Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions) 