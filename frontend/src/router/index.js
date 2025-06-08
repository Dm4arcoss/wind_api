import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Profile from '../views/Profile.vue'
import Dashboard from '../views/Dashboard.vue'
import Test from '../views/Test.vue'
import TestProductList from '../views/products/TestProductList.vue'
import TestAlias from '../views/TestAlias.vue'

// Novas páginas
import ProductList from '../views/products/ProductList.vue'
import ProductForm from '../views/products/ProductForm.vue'
import CategoryList from '../views/categories/CategoryList.vue'
import CategoryForm from '../views/categories/CategoryForm.vue'
import OrderList from '../views/orders/OrderList.vue'
import OrderDetail from '../views/orders/OrderDetail.vue'
// Componentes de clientes
import Customers from '../views/Customers.vue'

// Serviço de autenticação
import auth from '@/services/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  
  // Dashboard
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  
  // Produtos
  {
    path: '/dashboard/products',
    name: 'Products',
    component: ProductList,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/products/new',
    name: 'ProductCreate',
    component: ProductForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/products/:id/edit',
    name: 'ProductEdit',
    component: ProductForm,
    meta: { requiresAuth: true }
  },
  
  // Categorias
  {
    path: '/dashboard/categories',
    name: 'Categories',
    component: CategoryList,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/categories/new',
    name: 'CategoryCreate',
    component: CategoryForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/categories/:id/edit',
    name: 'CategoryEdit',
    component: CategoryForm,
    meta: { requiresAuth: true }
  },
  
  // Clientes
  {
    path: '/dashboard/customers',
    name: 'Customers',
    component: () => import('../views/Customers.vue'),
    meta: { requiresAuth: true }
  },
  
  // Pedidos
  {
    path: '/dashboard/orders',
    name: 'Orders',
    component: OrderList,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/orders/:id',
    name: 'OrderDetail',
    component: OrderDetail,
    meta: { requiresAuth: true }
  },
  
  // Clientes
  {
    path: '/dashboard/customers',
    name: 'Customers',
    component: Customers,
    meta: { requiresAuth: true }
  },
  // Usuários
  {
    path: '/dashboard/users',
    name: 'UsersList',
    component: () => import('../views/users/UsersList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/users/new',
    name: 'UserCreate',
    component: () => import('../views/users/UserForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/users/:id/edit',
    name: 'UserEdit',
    component: () => import('../views/users/UserForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/products/new',
    name: 'ProductCreate',
    component: ProductForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/products/:id/edit',
    name: 'ProductEdit',
    component: ProductForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/categories/new',
    name: 'CategoryCreate',
    component: CategoryForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/categories/:id/edit',
    name: 'CategoryEdit',
    component: CategoryForm,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  // Verificar se a rota requer autenticação
  if (to.meta.requiresAuth) {
    // Verificar se está autenticado
    if (!auth.isAuthenticated()) {
      // Se não estiver autenticado, redirecionar para login
      next('/login');
      return;
    }
  }

  next();
})

export default router