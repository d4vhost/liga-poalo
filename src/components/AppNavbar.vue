// src/components/AppNavbar.vue
<template>
  <div class="light-switch-container" :class="{ 'swinging': !isPulling }">
    <div class="ceiling-base"></div>
    
    <div class="rope" :class="{ 'rope-pulled': isPulling }"></div>
    
    <div 
      class="bulb-switch" 
      :class="{ 
        'pulled': isPulling,
        'light-on': isDarkMode,  /* MODO OSCURO = PRENDIDO */
        'light-off': !isDarkMode /* MODO CLARO = APAGADO */
      }"
      @mousedown="startPull"
      @touchstart="startPull"
    >
      <div class="bulb-glow" v-if="isDarkMode"></div>

      <svg viewBox="0 0 70 110" class="bulb-svg">
        <defs>
          <linearGradient id="metal-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#7f8c8d" />
            <stop offset="50%" stop-color="#bdc3c7" />
            <stop offset="100%" stop-color="#7f8c8d" />
          </linearGradient>
        </defs>
        
        <rect x="25" y="0" width="20" height="10" fill="url(#metal-grad)" />
        <rect x="23" y="10" width="24" height="8" fill="url(#metal-grad)" />
        <rect x="25" y="18" width="20" height="8" fill="url(#metal-grad)" />
        <path d="M 27 26 L 27 32 Q 35 35 43 32 L 43 26 Z" fill="#576574" />

        <path 
          d="M 20 35 
             Q 10 45 10 65 
             Q 10 95 35 105 
             Q 60 95 60 65 
             Q 60 45 50 35 Z"
          :fill="isDarkMode ? 'rgba(255, 250, 220, 0.9)' : 'rgba(200, 200, 200, 0.4)'"
          :stroke="isDarkMode ? '#f1c40f' : '#95a5a6'"
          stroke-width="1.5"
          class="bulb-glass"
        />
        
        <g class="filament-assembly" :class="{ 'glowing': isDarkMode }">
          <path d="M 28 35 L 28 65 M 42 35 L 42 65" stroke="#7f8c8d" stroke-width="1" />
          <path 
            d="M 28 65 L 30 75 L 32 65 L 34 75 L 36 65 L 38 75 L 40 65 L 42 75 L 42 65"
            fill="none" 
            :stroke="isDarkMode ? '#FFD700' : '#7f8c8d'" 
            :stroke-width="isDarkMode ? 2 : 1.5"
            stroke-linejoin="round"
            class="filament-wire"
          />
        </g>
      </svg>
    </div>
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
      style="letter-spacing: 2px; font-size: 1.5rem; cursor: pointer; min-width: 200px; padding-left: 80px;"
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
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const currentLang = ref('es');

// ESTADO INICIAL: FALSE (MODO CLARO / FOCO APAGADO)
const isDarkMode = ref(false); 
const isPulling = ref(false);

const currentFlag = computed(() => {
  return currentLang.value === 'es' ? '🇪🇨' : '🇺🇸';
});

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

// --- LÓGICA DEL TIRANTE ---
const startPull = (e) => {
  e.preventDefault();
  isPulling.value = true;
  
  const startY = e.clientY || e.touches?.[0]?.clientY;
  const bulbElement = document.querySelector('.bulb-switch');
  const ropeElement = document.querySelector('.rope');
  // Altura base de la cuerda (coincide con el CSS)
  const baseRopeHeight = 120; 
  
  const onMove = (moveEvent) => {
    const currentY = moveEvent.clientY || moveEvent.touches?.[0]?.clientY;
    const delta = currentY - startY;

    if (delta > 0 && delta < 150) {
      bulbElement.style.transform = `translateY(${delta}px)`;
      ropeElement.style.height = `${baseRopeHeight + delta}px`;
    }

    if (delta > 70) {
      if (navigator.vibrate) navigator.vibrate(25);
      toggleTheme();
      endPull();
    }
  };
  
  const endPull = () => {
    isPulling.value = false;
    bulbElement.style.transform = ''; 
    ropeElement.style.height = ''; 

    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', endPull);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', endPull);
  };
  
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', endPull);
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('touchend', endPull);
};

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  applyTheme();
};

const applyTheme = () => {
  if (isDarkMode.value) {
    // MODO OSCURO
    document.body.classList.remove('light-mode');
    document.body.classList.add('dark-mode');
  } else {
    // MODO CLARO
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
  }
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
}

const loadTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  
  // LÓGICA DE CARGA CORREGIDA:
  // Si es 'dark', iniciamos en modo oscuro.
  // En cualquier otro caso (incluyendo la primera vez), iniciamos en MODO CLARO.
  if (savedTheme === 'dark') {
    isDarkMode.value = true;
  } else {
    isDarkMode.value = false;
  }
  applyTheme();
};

// Usamos onMounted para asegurar que el DOM esté listo
onMounted(() => {
  loadTheme();
});
</script>

<style scoped>
/* --- ESTILOS DEL INTERRUPTOR (Lado Izquierdo) --- */
.light-switch-container {
  position: fixed;
  top: 0;
  left: 80px; 
  z-index: 1001;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* Punto de pivote para el balanceo en la parte superior */
  transform-origin: top center;
}

/* Animación de balanceo (tambaleo sutil) */
.light-switch-container.swinging {
  animation: swing 3s ease-in-out infinite;
}

@keyframes swing {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(1.5deg); }
  50% { transform: rotate(0deg); }
  75% { transform: rotate(-1.5deg); }
  100% { transform: rotate(0deg); }
}

.ceiling-base {
  width: 16px;
  height: 4px;
  background: #444;
  border-radius: 0 0 4px 4px;
}

.rope {
  width: 3px;
  height: 120px; /* CUERDA MÁS LARGA */
  background-image: repeating-linear-gradient(
    45deg,
    #4e342e 0px,
    #4e342e 4px,
    #3e2723 5px,
    #3e2723 8px
  );
  box-shadow: 1px 1px 2px rgba(0,0,0,0.6);
  position: relative;
  transition: height 0.1s linear;
  z-index: 1;
}

.rope::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: -1.5px;
  width: 6px;
  height: 6px;
  background: #3e2723;
  border-radius: 50%;
}

.rope:not(.rope-pulled) {
  transition: height 0.6s cubic-bezier(0.5, -0.5, 0.2, 1.5);
}

.bulb-switch {
  position: relative;
  top: -2px; 
  width: 50px;
  height: 80px; /* Ajustado para el nuevo foco */
  cursor: grab;
  transition: transform 0.6s cubic-bezier(0.5, -0.5, 0.2, 1.5);
  z-index: 2;
  filter: drop-shadow(0 2px 5px rgba(0,0,0,0.5));
}

.bulb-switch:active {
  cursor: grabbing;
  transition: none; 
}

/* Solo brilla la sombra en modo oscuro */
.bulb-switch.light-on {
  filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8));
}

.bulb-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* --- Efectos de Luz (Solo activos en Dark Mode) --- */
.bulb-glow {
  position: absolute;
  top: 65%; /* Ajustado para el centro de la parte de cristal */
  left: 50%;
  transform: translate(-50%, -50%);
  width: 140px;
  height: 140px;
  background: radial-gradient(circle, rgba(255, 220, 100, 0.6) 0%, rgba(255, 215, 0, 0) 70%);
  border-radius: 50%;
  pointer-events: none;
  animation: pulse-glow 4s infinite alternate ease-in-out;
  z-index: -1;
}

@keyframes pulse-glow {
  from { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1.15); }
}

.filament-assembly.glowing .filament-wire {
  filter: drop-shadow(0 0 2px #fff);
  animation: flicker 0.1s infinite alternate;
}

@keyframes flicker {
  0% { opacity: 1; stroke-width: 2; }
  100% { opacity: 0.85; stroke-width: 1.8; }
}

/* Responsive */
@media (max-width: 600px) {
  .light-switch-container {
    left: 20px;
  }
}

/* --- ESTILOS DEL NAVBAR (Existentes) --- */
.absolute-center-menu {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  min-width: 400px; 
  height: 50px;
}

.bg-glass-container {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

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
/* --- ESTILOS GLOBALES LIGHT MODE (POR DEFECTO AHORA) --- */
body.light-mode {
  background: linear-gradient(180deg, #f0f2f5 0%, #e1e5ea 100%) !important;
  color: #2c3e50 !important;
}

body.light-mode .v-app-bar.bg-transparent {
    background: rgba(255,255,255,0.1) !important;
}

body.light-mode .v-app-bar-title,
body.light-mode .login-link span,
body.light-mode .login-link i {
    color: #2c3e50 !important;
}

body.light-mode .bg-glass-container {
    background: rgba(255, 255, 255, 0.7) !important;
    border: 1px solid rgba(0,0,0,0.1) !important;
}

body.light-mode .nav-link {
    color: rgba(0,0,0,0.6) !important;
}

body.light-mode .nav-link:hover, 
body.light-mode .active-drop {
    color: #000 !important;
    background: rgba(0,0,0,0.05) !important;
    text-shadow: none !important;
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
}

body.light-mode h1, body.light-mode h2, body.light-mode p {
    color: #2c3e50;
    text-shadow: none !important;
}
</style>