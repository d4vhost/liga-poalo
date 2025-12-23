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
      // Ahora importamos la nueva vista creada
      component: () => import('../views/MatchesView.vue') 
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/HomeView.vue') // Mantén temporal hasta hacer el login
    }
  ]
})

export default router