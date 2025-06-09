# Documentação do Sistema E-commerce

## Estrutura do Projeto

O sistema é composto por duas partes principais:
- Frontend (Vue.js com Pinia)
- Backend (Node.js com Express)

### Frontend

#### Estrutura de Diretórios
```
frontend/
├── src/
│   ├── assets/           # Arquivos estáticos
│   ├── components/       # Componentes reutilizáveis
│   ├── layouts/         # Layouts principais
│   ├── services/        # Serviços HTTP
│   ├── stores/         # Estado global (Pinia)
│   └── views/          # Páginas do sistema
├── public/              # Arquivos públicos
└── package.json        # Dependências do projeto
```

#### Stores (Pinia)
- `auth.js`: Gerencia autenticação e dados do usuário
- `cart.js`: Gerencia carrinho de compras
- `customers.js`: Gerencia clientes
- `products.js`: Gerencia produtos

### Backend

#### Estrutura de Diretórios
```
backend/
├── controllers/         # Controladores das rotas
├── models/             # Modelos do banco de dados
├── routes/             # Rotas da API
├── services/           # Serviços de negócio
└── utils/              # Utilitários
```

## Funcionalidades Principais

### Autenticação
- Login com email e senha
- Registro de novos usuários
- Permanência do usuário logado
- Proteção de rotas

### Gerenciamento de Produtos
- Listagem de produtos
- Criação de novos produtos
- Atualização de produtos
- Remoção de produtos
- Busca de produtos

### Gerenciamento de Categorias
- Listagem de categorias
- Criação de novas categorias
- Atualização de categorias
- Remoção de categorias

### Gerenciamento de Clientes
- Listagem de clientes
- Criação de novos clientes
- Atualização de clientes
- Remoção de clientes

### Sistema de Pedidos
- Criação de novos pedidos
- Seleção de cliente
- Adição de produtos ao carrinho
- Atualização de quantidades
- Finalização do pedido
- Validação de estoque

## Estados e Erros

### Estados do Sistema
- Loading states
- Erro states
- Sucesso states

### Tratamento de Erros
- Erros de autenticação
- Erros de validação
- Erros de API
- Erros de rede

## Componentes Principais

### NewOrder.vue
Responsável pela criação de novos pedidos:
- Seleção de cliente
- Adição de produtos ao carrinho
- Atualização de quantidades
- Cálculo de total
- Validação de estoque
- Finalização do pedido

### Login.vue
Responsável pelo login do usuário:
- Formulário de login
- Validação de credenciais
- Armazenamento do token
- Redirecionamento

### Profile.vue
Responsável pelo perfil do usuário:
- Exibição de dados do usuário
- Atualização de dados
- Mudança de tema
- Logout

## Fluxos Principais

### Fluxo de Login
1. Usuário acessa a página de login
2. Preenche email e senha
3. Sistema valida credenciais
4. Armazena token e dados do usuário
5. Redireciona para dashboard

### Fluxo de Criação de Pedido
1. Usuário seleciona cliente
2. Adiciona produtos ao carrinho
3. Atualiza quantidades
4. Sistema valida estoque
5. Finaliza pedido
6. Redireciona para dashboard

## Dependências Principais

### Frontend
- Vue 3
- Pinia (State Management)
- Axios (HTTP Client)
- Font Awesome (Ícones)
- Tailwind CSS (Estilização)

### Backend
- Node.js
- Express
- MongoDB
- JWT (Autenticação)

## Observações Técnicas

### Segurança
- Tokens JWT para autenticação
- Validação de dados
- Sanitização de inputs
- Proteção contra CSRF

### Performance
- Lazy loading de componentes
- Cache de dados
- Otimização de imagens
- Minificação de assets

### Manutenibilidade
- Código modular
- Documentação completa
- Testes unitários
- Logs detalhados

## Próximos Passos

1. Implementar testes unitários
2. Adicionar suporte a múltiplos idiomas
3. Implementar sistema de logs
4. Adicionar dashboard de métricas
5. Implementar sistema de notificações

## Considerações Finais

Este sistema foi desenvolvido seguindo as melhores práticas de desenvolvimento web, com foco em segurança, performance e experiência do usuário. A documentação completa está disponível nesta pasta e deve ser atualizada conforme novas funcionalidades forem implementadas.
