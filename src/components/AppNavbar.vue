// src/components/AppNavbar.vue
<template>
  <!-- BOTÓN DE TEMA FLOTANTE EN ESQUINA SUPERIOR IZQUIERDA -->
  <div class="theme-toggle-container">
    <button @click="toggleTheme" class="theme-toggle-button">
      <div class="toggle-switch" :class="{ 'active': !isDarkMode }">
        <div class="toggle-circle">
          <v-icon size="14" :color="isDarkMode ? 'white' : 'black'">
            {{ isDarkMode ? 'mdi-moon-waning-crescent' : 'mdi-white-balance-sunny' }}
          </v-icon>
        </div>
      </div>
      <span class="toggle-text">{{ isDarkMode ? 'Dark Mode' : 'Light Mode' }}</span>
    </button>
  </div>

  <v-app-bar 
    position="absolute"
    flat 
    color="transparent" 
    height="90"
    class="px-6" 
    theme="dark"
    style="top: 0; z-index: 100;"
  >
    <v-app-bar-title 
      class="font-weight-black text-uppercase pointer" 
      style="letter-spacing: 2px; font-size: 1.5rem; cursor: pointer; min-width: 200px;"
      @click="$router.push('/')"
    >
    </v-app-bar-title>

    <div class="absolute-center-menu d-none d-md-flex align-center justify-center bg-glass-container px-2 py-1 rounded-pill">
      
      <v-btn 
        to="/" 
        variant="text" 
        :ripple="false" 
        class="nav-link font-weight-bold"
        :class="{ 'active-drop': isActiveRoute('/') }"
      >
        {{ texts[currentLang].home }}
      </v-btn>

      <v-btn 
        to="/partidos" 
        variant="text" 
        :ripple="false" 
        class="nav-link font-weight-bold"
        :class="{ 'active-drop': isActiveRoute('/partidos') }"
      >
        {{ texts[currentLang].matches }}
      </v-btn>

      <v-btn 
        to="/contact" 
        variant="text" 
        :ripple="false" 
        class="nav-link font-weight-bold"
        :class="{ 'active-drop': isActiveRoute('/contact') }"
      >
        {{ texts[currentLang].contact }}
      </v-btn>

    </div>

    <v-spacer></v-spacer>

    <div style="min-width: 200px;" class="d-flex justify-end align-center gap-3">
      
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            icon
            class="mr-1"
            :ripple="false"
            density="compact"
          >
            <span style="font-size: 1.4rem;">{{ currentFlag }}</span>
          </v-btn>
        </template>
        <v-list density="compact" theme="dark" class="bg-glass-menu">
          <v-list-item @click="setLang('es')" value="es">
            <template v-slot:prepend><span class="mr-2">🇪🇨</span></template>
            <v-list-item-title class="text-caption">Español</v-list-item-title>
          </v-list-item>
          <v-list-item @click="setLang('en')" value="en">
             <template v-slot:prepend><span class="mr-2">🇺🇸</span></template>
            <v-list-item-title class="text-caption">English</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <router-link to="/login" class="text-decoration-none d-flex align-center login-link">
        <v-icon color="grey-lighten-2" size="small" class="mr-2">mdi-account-circle-outline</v-icon>
        <span class="text-grey-lighten-1 font-weight-medium text-caption" style="font-family: 'Montserrat', sans-serif;">
          {{ texts[currentLang].login }}
        </span>
      </router-link>

    </div>

  </v-app-bar>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const currentLang = ref('es');
const isDarkMode = ref(true);

const currentFlag = computed(() => {
  return currentLang.value === 'es' ? '🇪🇨' : '🇺🇸';
});

// Función para verificar si la ruta está activa
const isActiveRoute = (path) => {
  return route.path === path;
};

const texts = {
  es: {
    home: 'Inicio',
    matches: 'Partidos',
    contact: 'Contáctanos',
    login: 'Login / Registro'
  },
  en: {
    home: 'Home',
    matches: 'Matches',
    contact: 'Contact Us',
    login: 'Login / Sign Up'
  }
};

const setLang = (lang) => {
  currentLang.value = lang;
};

// Toggle del tema
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  
  // Cambiar clases en el body
  if (isDarkMode.value) {
    document.body.classList.remove('light-mode');
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
  }
  
  // Guardar preferencia
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
};

// Cargar tema guardado al montar
const loadTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    isDarkMode.value = false;
    document.body.classList.add('light-mode');
  } else {
    isDarkMode.value = true;
    document.body.classList.add('dark-mode');
  }
};

// Ejecutar al montar
if (typeof window !== 'undefined') {
  loadTheme();
}
</script>

<style scoped>
/* --- BOTÓN DE TEMA FLOTANTE --- */
.theme-toggle-container {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
}

.theme-toggle-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: none;
  border-radius: 50px;
  padding: 4px 12px 4px 4px;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  font-family: 'Montserrat', sans-serif;
}

.theme-toggle-button:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.toggle-switch {
  position: relative;
  width: 44px;
  height: 24px;
  background: #2c3e50;
  border-radius: 50px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  padding: 0 2px;
}

.toggle-switch.active {
  background: #2c3e50;
}

.toggle-circle {
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.toggle-switch.active .toggle-circle {
  transform: translateX(20px);
}

.toggle-text {
  font-size: 12px;
  font-weight: 600;
  color: #2c3e50;
  white-space: nowrap;
}

/* Responsive */
@media (max-width: 768px) {
  .theme-toggle-container {
    top: 15px;
    left: 15px;
  }
  
  .theme-toggle-button {
    padding: 3px 10px 3px 3px;
    gap: 6px;
  }
  
  .toggle-switch {
    width: 38px;
    height: 20px;
  }
  
  .toggle-circle {
    width: 16px;
    height: 16px;
  }
  
  .toggle-switch.active .toggle-circle {
    transform: translateX(18px);
  }
  
  .toggle-text {
    font-size: 11px;
  }
}

/* --- ALINEACIÓN --- */
.absolute-center-menu {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  min-width: 400px; 
  height: 50px;
}

/* --- CONTENEDOR VIDRIO OSCURO --- */
.bg-glass-container {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

/* --- ESTILO TEXTO --- */
.nav-link {
  font-size: 0.8rem !important; 
  letter-spacing: 0.5px;
  text-transform: capitalize !important;
  transition: all 0.3s ease;
  margin: 0 2px;
  border-radius: 30px;
  height: 38px !important;
  color: rgba(255, 255, 255, 0.6) !important;
}

/* --- EFECTO GOTA DE AGUA "CRISTALINA" --- */
.active-drop {
  background: linear-gradient(
    180deg, 
    rgba(255, 255, 255, 0.05) 0%, 
    rgba(255, 255, 255, 0.0) 100%
  ) !important;
  backdrop-filter: blur(5px);
  color: white !important;
  box-shadow: 
    inset 0 1px 1px rgba(255, 255, 255, 0.4),
    inset 0 -1px 2px rgba(0, 0, 0, 0.2),
    0 4px 10px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-weight: 700 !important;
  text-shadow: 0 2px 4px rgba(0,0,0,0.4);
}

.nav-link:not(.active-drop):hover {
  color: white !important;
  background: rgba(255, 255, 255, 0.05);
}

.bg-glass-menu {
  background: rgba(10, 10, 10, 0.9) !important;
  backdrop-filter: blur(10px);
}

.gap-3 { gap: 12px; }

.login-link {
  transition: opacity 0.2s;
}
.login-link:hover {
  opacity: 0.8;
}
</style>

<style>
/* --- ESTILOS GLOBALES PARA MODO CLARO --- */
body.light-mode {
  background: linear-gradient(180deg, #f5f5f5 0%, #e0e0e0 50%, #f0f0f0 100%) !important;
}

/* Hero sections en modo claro */
body.light-mode .hero-section,
body.light-mode .hero-matches,
body.light-mode .hero-contact {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.7), rgba(240, 240, 240, 0.9)) !important;
}

body.light-mode .hero-overlay {
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(240, 240, 240, 0.6) 100%
  ) !important;
}

body.light-mode .text-shadow-heavy {
  text-shadow: 1px 1px 2px rgba(255,255,255,0.5) !important;
  color: #1a1a1a !important;
}

/* Secciones en modo claro */
body.light-mode .section-upcoming-matches,
body.light-mode .section-benefits,
body.light-mode .section-players,
body.light-mode .section-cta,
body.light-mode .matches-content,
body.light-mode .section-contact-info,
body.light-mode .section-map,
body.light-mode .section-quick-info {
  background: linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%) !important;
}

/* Cards en modo claro */
body.light-mode .match-card,
body.light-mode .benefit-card,
body.light-mode .player-portal-card,
body.light-mode .contact-card,
body.light-mode .info-card,
body.light-mode .cta-card,
body.light-mode .map-card,
body.light-mode .calendar-glass-card,
body.light-mode .filter-card {
  background: rgba(255, 255, 255, 0.9) !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
}

body.light-mode .match-card:hover,
body.light-mode .benefit-card:hover,
body.light-mode .contact-card:hover,
body.light-mode .info-card:hover,
body.light-mode .cta-card:hover {
  border-color: rgba(0, 0, 0, 0.2) !important;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12) !important;
}

/* Textos en modo claro */
body.light-mode .text-white,
body.light-mode h1, body.light-mode h2, body.light-mode h3, 
body.light-mode h4, body.light-mode h5, body.light-mode h6 {
  color: #1a1a1a !important;
}

body.light-mode .text-grey-lighten-1,
body.light-mode .text-grey-lighten-2,
body.light-mode .text-grey-lighten-3 {
  color: #424242 !important;
}

/* Backgrounds secundarios */
body.light-mode .info-section,
body.light-mode .stats-preview,
body.light-mode .match-details,
body.light-mode .info-details,
body.light-mode .map-info {
  background: rgba(0, 0, 0, 0.05) !important;
}

/* Navbar en modo claro */
body.light-mode .bg-glass-container {
  background: rgba(255, 255, 255, 0.8) !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
}

body.light-mode .nav-link {
  color: rgba(0, 0, 0, 0.7) !important;
}

body.light-mode .nav-link:hover,
body.light-mode .active-drop {
  color: #1a1a1a !important;
}

/* Botones en modo claro */
body.light-mode .btn-glass,
body.light-mode .btn-glass-alt {
  background: rgba(33, 150, 243, 0.9) !important;
  color: white !important;
  border: 1px solid rgba(33, 150, 243, 1) !important;
}

body.light-mode .btn-glass:hover,
body.light-mode .btn-glass-alt:hover {
  background: rgba(33, 150, 243, 1) !important;
}
</style>