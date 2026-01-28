import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../services/supabase'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // --- RUTAS PÚBLICAS (Cualquiera las ve) ---
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
    
    // --- LOGIN (Única puerta de entrada) ---
    { 
      path: '/login', 
      name: 'login', 
      component: () => import('../views/auth/LoginView.vue'),
      meta: { hideLayout: true } // Oculta el navbar público
    },

    // --- PANEL ADMIN MODULAR ---
    {
      path: '/panel-admin',
      // NOTA: No le ponemos 'name' aquí porque tiene hijos.
      // Este componente actúa como LAYOUT (tiene el Sidebar y un <router-view>)
      component: () => import('../views/panels/AdminPanel.vue'),
      meta: { 
        hideLayout: true, // Oculta navbar público
        requiresAuth: true 
      },
      children: [
        // 1. Vista por defecto (Dashboard / Inicio del admin)
        {
          path: '', // Cuando entras a /panel-admin
          name: 'admin-dashboard',
          // Puedes crear un archivo DashboardView.vue sencillo o redirigir
          component: () => import('../views/admin/DashboardView.vue') 
        },
        // 2. La vista para crear actas e imprimir
        {
          path: 'programar-partidos', // URL: /panel-admin/programar-partidos
          name: 'admin-matches',
          component: () => import('../views/admin/MatchGenerator.vue')
        },
        // Aquí agregarás más en el futuro: 'resultados', 'equipos', etc.
      ]
    },

    // Redirección por defecto
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior() { return { top: 0 } }
})

// --- GUARDIA DE SEGURIDAD (Sin cambios, tu lógica es correcta) ---
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  // 1. Si es ruta pública, pase.
  if (!requiresAuth) return next();

  // 2. Verificar sesión
  const { data: { session } } = await supabase.auth.getSession();

  // Si no hay sesión -> Login
  if (!session) return next('/login');

  // 3. Verificación de Rol
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profile?.role === 'administrador') {
    next(); // Adelante, administrador.
  } else {
    await supabase.auth.signOut(); // Intruso o rol equivocado
    next('/login');
  }
});

export default router