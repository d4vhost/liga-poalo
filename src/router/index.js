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
      // Carga perezosa (mejor rendimiento)
      component: () => import('../views/HomeView.vue') // TEMPORAL hasta que creemos la vista Partidos
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/HomeView.vue') // TEMPORAL
    }
  ]
})

export default router