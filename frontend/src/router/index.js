import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Profile from '../views/Profile.vue'
import Test from '../views/Test.vue'
import TestAlias from '../views/TestAlias.vue'
import Dashboard from '../views/Dashboard.vue'
// Novas páginas
import ProductList from '../views/products/ProductList.vue'
import ProductForm from '../views/products/ProductForm.vue'
import CategoryList from '../views/categories/CategoryList.vue'
import CategoryForm from '../views/categories/CategoryForm.vue'
import OrderList from '../views/orders/OrderList.vue'
import OrderDetail from '../views/orders/OrderDetail.vue'
import Customers from '../views/Customers.vue'
import NewOrder from '../views/NewOrder.vue'
import Reports from '../views/Reports.vue'
import Payment from '../views/Payment.vue'
import PaymentList from '../views/payments/PaymentList.vue'

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
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/orders/new',
    name: 'NewOrder',
    component: NewOrder,
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
    component: Customers,
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

  // Relatórios
  {
    path: '/dashboard/reports',
    name: 'Reports',
    component: Reports,
    meta: { requiresAuth: true }
  },

  // Pagamentos
  {
    path: '/dashboard/payment/:orderId',
    name: 'Payment',
    component: Payment,
    meta: { requiresAuth: true }
  },

  // Lista de Pagamentos
  {
    path: '/dashboard/payments',
    name: 'PaymentList',
    component: PaymentList,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Adicionando guard de rota
router.beforeEach(async (to, from, next) => {
  // Verificar se a rota requer autenticação
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Verificar se há token no localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Se não há token, redirecionar para login
      next({ name: 'Login' });
    } else {
      // Se há token, verificar se é válido
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) throw new Error('Token inválido');
        
        const payload = JSON.parse(atob(tokenParts[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp < currentTime) {
          // Token expirado, redirecionar para login
          localStorage.removeItem('token');
          next({ name: 'Login' });
        } else {
          // Token válido, continuar
          next();
        }
      } catch (error) {
        // Em caso de erro, redirecionar para login
        localStorage.removeItem('token');
        next({ name: 'Login' });
      }
    }
  } else {
    // Se a rota não requer autenticação, continuar
    next();
  }
});

// Middleware de autenticação
router.beforeEach((to, from, next) => {
  // Se for uma rota pública, permitir acesso
  if (to.path === '/login' || to.path === '/register' || to.path === '/') {
    next();
    return;
  }

  // Se a rota requer autenticação
  if (to.meta?.requiresAuth) {
    // Verificar autenticação
    const isAuthenticated = auth.isAuthenticated();
    
    if (!isAuthenticated) {
      // Salvar a rota atual para redirecionar após o login
      localStorage.setItem('redirectAfterLogin', to.fullPath);
      next('/login');
      return;
    }
  }
  
  // Permitir acesso à rota
  next();
});

export default router