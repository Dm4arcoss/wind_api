# API de Produtos - Documentação

## Visão Geral

Esta API fornece um sistema completo para gerenciamento de produtos, categorias, pedidos e clientes. O sistema inclui autenticação de usuários, dashboard com estatísticas e operações CRUD para todas as entidades principais.

## Tecnologias Utilizadas

- **Backend**: NestJS, TypeScript, Prisma ORM
- **Banco de Dados**: MySQL
- **Autenticação**: JWT (JSON Web Tokens)
- **Documentação**: Swagger/OpenAPI
- **Frontend**: Vue.js, Tailwind CSS, Vite

## Estrutura do Projeto

```
wind_api/
├── src/                      # Código fonte do backend
│   ├── auth/                 # Módulo de autenticação
│   ├── categories/           # Módulo de categorias
│   ├── common/               # Código compartilhado (guards, decorators)
│   ├── customers/            # Módulo de clientes
│   ├── dashboard/            # Módulo de dashboard
│   ├── orders/               # Módulo de pedidos
│   ├── prisma/               # Serviço Prisma e configurações
│   ├── products/             # Módulo de produtos
│   ├── profile/              # Módulo de perfil de usuário
│   └── main.ts               # Ponto de entrada da aplicação
├── prisma/                   # Esquema do Prisma e migrações
├── public/                   # Arquivos estáticos
├── frontend/                 # Aplicação Vue.js
│   ├── src/                  # Código fonte do frontend
│   │   ├── router/           # Configuração de rotas
│   │   ├── views/            # Componentes de página
│   │   └── main.js           # Ponto de entrada do frontend
└── docs/                     # Documentação
```

## Modelos de Dados

### User (Usuário)
- `id`: Identificador único
- `email`: Email do usuário (único)
- `password`: Senha criptografada
- `name`: Nome do usuário
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

### Product (Produto)
- `id`: Identificador único
- `name`: Nome do produto
- `description`: Descrição do produto
- `price`: Preço do produto
- `stock`: Quantidade em estoque
- `imageUrl`: URL da imagem do produto
- `categoryId`: ID da categoria
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

### Category (Categoria)
- `id`: Identificador único
- `name`: Nome da categoria (único)
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

### Order (Pedido)
- `id`: Identificador único
- `userId`: ID do usuário que fez o pedido
- `customerId`: ID do cliente (opcional)
- `status`: Status do pedido (pending, processing, completed, cancelled)
- `total`: Valor total do pedido
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

### OrderItem (Item do Pedido)
- `id`: Identificador único
- `orderId`: ID do pedido
- `productId`: ID do produto
- `quantity`: Quantidade
- `price`: Preço unitário no momento da compra

### Customer (Cliente)
- `id`: Identificador único
- `name`: Nome do cliente
- `email`: Email do cliente (único)
- `phone`: Telefone do cliente (opcional)
- `address`: Endereço do cliente (opcional)
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

## Endpoints da API

### Autenticação

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/auth/register` | Registrar um novo usuário | Não |
| POST | `/auth/login` | Autenticar usuário e obter token JWT | Não |

### Perfil

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/profile` | Obter perfil do usuário autenticado | Sim |

### Produtos

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/products` | Listar todos os produtos | Não |
| GET | `/products?categoryId=1` | Filtrar produtos por categoria | Não |
| GET | `/products/:id` | Obter detalhes de um produto | Não |
| POST | `/products` | Criar um novo produto | Sim |
| PUT | `/products/:id` | Atualizar um produto | Sim |
| DELETE | `/products/:id` | Remover um produto | Sim |

### Categorias

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/categories` | Listar todas as categorias | Não |
| GET | `/categories/:id` | Obter detalhes de uma categoria | Não |
| POST | `/categories` | Criar uma nova categoria | Sim |
| PUT | `/categories/:id` | Atualizar uma categoria | Sim |
| DELETE | `/categories/:id` | Remover uma categoria | Sim |

### Pedidos

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/orders` | Listar todos os pedidos | Sim |
| GET | `/orders/:id` | Obter detalhes de um pedido | Sim |
| GET | `/orders/user/me` | Listar pedidos do usuário atual | Sim |
| GET | `/orders/customer/:customerId` | Listar pedidos de um cliente | Sim |
| POST | `/orders` | Criar um novo pedido | Sim |
| PUT | `/orders/:id` | Atualizar status de um pedido | Sim |

### Clientes

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/customers` | Listar todos os clientes | Sim |
| GET | `/customers/:id` | Obter detalhes de um cliente | Sim |
| POST | `/customers` | Criar um novo cliente | Sim |
| PUT | `/customers/:id` | Atualizar um cliente | Sim |
| DELETE | `/customers/:id` | Remover um cliente | Sim |

### Dashboard

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/dashboard/stats` | Obter estatísticas gerais | Sim |
| GET | `/dashboard/recent-products` | Obter produtos recentes | Sim |
| GET | `/dashboard/category-stats` | Obter estatísticas de categorias | Sim |
| GET | `/dashboard/top-selling` | Obter produtos mais vendidos | Sim |
| GET | `/dashboard/recent-orders` | Obter pedidos recentes | Sim |
| GET | `/dashboard/order-stats` | Obter estatísticas de pedidos | Sim |

## Autenticação

A API utiliza autenticação JWT (JSON Web Token). Para acessar endpoints protegidos:

1. Faça login através do endpoint `/auth/login`
2. Receba o token JWT na resposta
3. Inclua o token no cabeçalho de requisições para endpoints protegidos:
   ```
   Authorization: Bearer <seu_token_jwt>
   ```

## Frontend

O frontend Vue.js fornece uma interface de usuário para interagir com a API:

- **Páginas Públicas**:
  - Home: Página inicial com informações sobre a API
  - Login: Autenticação de usuários
  - Registro: Criação de novas contas

- **Páginas Protegidas**:
  - Dashboard: Visão geral com estatísticas e dados
  - Produtos: Gerenciamento de produtos
  - Categorias: Gerenciamento de categorias
  - Pedidos: Gerenciamento de pedidos
  - Clientes: Gerenciamento de clientes
  - Perfil: Informações do usuário

## Documentação Swagger

A documentação interativa da API está disponível em:
```
http://localhost:3001/api
```

Esta interface permite explorar todos os endpoints, ver modelos de dados e testar requisições diretamente no navegador.

## Executando o Projeto

### Backend
```bash
# Instalar dependências
npm install

# Executar migrações do banco de dados
npx prisma migrate dev

# Iniciar o servidor em modo de desenvolvimento
npm run start:dev
```

### Frontend
```bash
# Navegar para o diretório do frontend
cd frontend

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

## Considerações de Segurança

- Todas as senhas são armazenadas com hash
- Endpoints sensíveis são protegidos com autenticação JWT
- Validação de dados em todas as entradas
- Tratamento adequado de erros para evitar vazamento de informações sensíveis