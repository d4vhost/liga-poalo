import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../services/supabase' // Importamos supabase para verificar sesión
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // --- RUTAS PÚBLICAS ---
    { path: '/', name: 'home', component: HomeView },
    { path: '/partidos', name: 'partidos', component: () => import('../views/MatchesView.vue') },
    { path: '/contact', name: 'contact', component: () => import('../views/ContactView.vue') },
    
    // Auth (Login/Register) - Si ya está logueado, redirigimos según su rol (opcional)
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

    // --- 🟢 PANEL ADMIN (PROTEGIDO) ---
    {
      path: '/panel-admin',
      component: () => import('../views/panels/AdminPanel.vue'),
      // META: Aquí definimos las reglas de seguridad para este grupo
      meta: { 
        hideLayout: true, 
        requiresAuth: true, 
        role: 'admin' // Solo admins pueden entrar aquí
      },
      children: [
        { 
          path: '', 
          redirect: { name: 'admin-users' } 
        },
        {
          path: 'usuarios',
          name: 'admin-users',
          component: () => import('../views/admin/UsersView.vue')
        },
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
      ]
    },

    // --- 🟡 PANEL ÁRBITRO (PROTEGIDO) ---
    {
      path: '/panel-arbitro',
      name: 'referee-panel',
      component: () => import('../views/panels/RefereePanel.vue'),
      meta: { 
        hideLayout: true, 
        requiresAuth: true, 
        role: 'arbitro' // Solo árbitros
      }
    },

    // --- 🔵 PANEL JUGADOR (PROTEGIDO) ---
    {
      path: '/panel-jugador',
      name: 'player-panel',
      component: () => import('../views/panels/PlayerPanel.vue'),
      meta: { 
        hideLayout: true, 
        requiresAuth: true, 
        role: 'jugador' // Solo jugadores
      }
    }
  ],
  scrollBehavior() { return { top: 0 } }
})

// 🛡️ GUARDIA DE NAVEGACIÓN GLOBAL
router.beforeEach(async (to, from, next) => {
  
  // 1. Verificamos si la ruta requiere autenticación
  // .matched.some busca en la ruta padre e hijas si alguna tiene requiresAuth
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  // Si es ruta pública, dejamos pasar
  if (!requiresAuth) {
    return next();
  }

  // 2. Obtenemos la sesión actual de Supabase
  const { data: { session } } = await supabase.auth.getSession();

  // Si NO hay sesión y la ruta requiere auth -> Mandar al Home
  if (!session) {
    return next('/'); 
  }

  // 3. Verificación de ROL
  const requiredRole = to.meta.role;

  if (requiredRole) {
    // Consultamos el perfil del usuario para ver su rol real en base de datos
    // (Esto evita que alguien edite el localStorage manualmente)
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (error || !profile || profile.role !== requiredRole) {
      console.warn('Acceso denegado: Rol incorrecto');
      return next('/'); // Si no tiene el rol, mandamos al Home
    }
  }

  // Si pasó todas las pruebas, dejamos entrar
  next();
});

export default router