import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../services/supabase'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // --- RUTAS PÚBLICAS (Cualquiera las ve) ---
    { path: '/', name: 'home', component: HomeView },
    { path: '/partidos', name: 'partidos', component: () => import('../views/MatchesView.vue') },
    { path: '/contact', name: 'contact', component: () => import('../views/ContactView.vue') },
    
    // --- LOGIN (Única puerta de entrada) ---
    { 
      path: '/login', 
      name: 'login', 
      component: () => import('../views/auth/LoginView.vue'),
      meta: { hideLayout: true } // Oculta el navbar normal
    },

    // --- PANEL ADMIN (Única zona privada) ---
    {
      path: '/panel-admin',
      component: () => import('../views/panels/AdminPanel.vue'),
      meta: { 
        hideLayout: true, 
        requiresAuth: true 
      },
      children: [
        { 
          path: '', 
          name: 'admin-dashboard',
          component: () => import('../views/admin/DashboardView.vue') 
        },
        // Mantenemos estas rutas por si quieres gestionar el torneo
        {
          path: 'partidos',
          name: 'admin-matches',
          component: () => import('../views/admin/MatchesView.vue')
        },
        {
          path: 'resultados',
          name: 'admin-results',
          component: () => import('../views/admin/ResultsView.vue')
        },
        {
          path: 'configuracion',
          name: 'admin-settings',
          component: () => import('../views/admin/SettingsView.vue')
        }
        // NOTA: He quitado 'usuarios' porque dijiste que ya no los necesitas.
        // Si quisieras gestionar usuarios manualmente, descomenta la ruta correspondiente.
      ]
    },
    // Redirección por defecto: Si ponen una ruta loca, van al Home
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior() { return { top: 0 } }
})

// --- GUARDIA DE SEGURIDAD SIMPLIFICADO ---
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  // 1. Si es ruta pública, pase.
  if (!requiresAuth) return next();

  // 2. Verificar sesión
  const { data: { session } } = await supabase.auth.getSession();

  // Si no hay sesión -> Login
  if (!session) return next('/login');

  // 3. Verificación Rápida de Admin
  // (Como ya limpiaste la BD, solo TÚ existes, así que si hay sesión, eres tú.
  // Pero por seguridad extra, consultamos el rol).
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profile?.role === 'administrador') {
    next(); // Adelante, jefe.
  } else {
    await supabase.auth.signOut(); // Intruso detectado
    next('/login');
  }
});

export default router