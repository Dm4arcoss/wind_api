import auth from '@/services/auth';

export default function authGuard(to, from, next) {
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
}
