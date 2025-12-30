import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/partidos',
      name: 'partidos',
      component: () => import('../views/MatchesView.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue')
    },
    // Rutas de Autenticación (Sin Navbar/Footer)
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: { hideLayout: true } // <--- ESTO ES LA CLAVE
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue'),
      meta: { hideLayout: true } // <--- ESTO ES LA CLAVE
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router