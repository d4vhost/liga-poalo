import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/partidos', name: 'partidos', component: () => import('../views/MatchesView.vue') },
    { path: '/contact', name: 'contact', component: () => import('../views/ContactView.vue') },
    
    // Auth
    { 
      path: '/login', 
      name: 'login', 
      component: () => import('../views/auth/LoginView.vue'),
      meta: { hideLayout: true }
    },
    { 
      path: '/register', 
      name: 'register', 
      component: () => import('../views/auth/RegisterView.vue'),
      meta: { hideLayout: true }
    },

    // 🟢 NUEVOS PANELES (Protegidos)
    {
      path: '/panel-admin',
      name: 'admin-panel',
      component: () => import('../views/panels/AdminPanel.vue'),
      meta: { hideLayout: true } 
    },
    {
      path: '/panel-arbitro',
      name: 'referee-panel',
      component: () => import('../views/panels/RefereePanel.vue'),
      meta: { hideLayout: true }
    },
    {
      path: '/panel-jugador',
      name: 'player-panel',
      component: () => import('../views/panels/PlayerPanel.vue'),
      meta: { hideLayout: true }
    }
  ],
  scrollBehavior() { return { top: 0 } }
})

export default router