<template>
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

      <v-btn 
        to="/login" 
        variant="text"
        :ripple="false"
        class="login-link-custom text-decoration-none d-flex align-center text-none px-2"
      >
        <v-icon color="grey-lighten-2" size="small" class="mr-2">mdi-account-circle-outline</v-icon>
        <span class="text-grey-lighten-1 font-weight-medium text-caption" style="font-family: 'Montserrat', sans-serif;">
          {{ texts[currentLang].login }}
        </span>
      </v-btn>

    </div>

  </v-app-bar>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const currentLang = ref('es');

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
    login: 'login'
  },
  en: {
    home: 'Home',
    matches: 'Matches',
    contact: 'Contact Us',
    login: 'login'
  }
};

const setLang = (lang) => {
  currentLang.value = lang;
};
</script>

<style scoped>
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

.login-link-custom {
  transition: all 0.3s ease;
  cursor: pointer;
  outline: none;
  border: none;
}

.login-link-custom:hover {
  opacity: 0.8;
}

.login-link-custom:focus {
  outline: none;
}
</style>