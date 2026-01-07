<template>
  <v-container class="fill-height d-flex flex-column justify-center align-center bg-dark-theme">
    <div class="text-center">
      <v-icon color="yellow-lighten-2" size="80" class="mb-4">mdi-whistle</v-icon>
      <h1 class="text-h3 font-weight-bold text-white mb-2">Panel Arbitral</h1>
      <p class="text-h6 text-grey-lighten-1 mb-6">ESTE ES EL PANEL DE ÁRBITROS</p>

      <v-card color="grey-darken-3" class="pa-4 mb-6 mx-auto" max-width="400">
        <p class="text-subtitle-1 mb-2">Estado de Conexión:</p>
        
        <v-alert
          :color="isOnline ? 'success' : 'warning'"
          :icon="isOnline ? 'mdi-wifi' : 'mdi-wifi-off'"
          density="compact"
          class="mb-4 text-left"
        >
          {{ isOnline ? 'CONECTADO (Online)' : 'SIN CONEXIÓN (Modo Local)' }}
        </v-alert>

        <v-btn 
          color="red-accent-4" 
          block
          @click="simularSancion"
          :loading="cargando"
          prepend-icon="mdi-cards"
        >
          Prueba: Sacar Tarjeta
        </v-btn>
      </v-card>
      <v-btn color="grey-darken-1" variant="text" @click="handleLogout">
        Cerrar Sesión
      </v-btn>
    </div>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../services/supabase'

// CORRECCIÓN AQUÍ: Usamos '../..' en lugar de '@'
import { useDataSync } from '../../composables/useDataSync'

const router = useRouter()

// 1. Extraemos la funcionalidad offline
const { guardarDato, isOnline } = useDataSync()
const cargando = ref(false)

// 2. Lógica de Logout original
const handleLogout = async () => {
  // 1. IMPORTANTE: Borramos el rol guardado para que no entre automático
  localStorage.removeItem('user_role'); 
  
  // 2. Cerramos sesión en Supabase
  await supabase.auth.signOut();
  
  // 3. Volvemos al login
  router.push('/login');
};

// 3. Lógica de prueba para guardar datos
const simularSancion = async () => {
  cargando.value = true
  try {
    const nuevaSancion = {
      jugador_id: 1, 
      motivo: 'Falta agresiva (Prueba)',
      minuto: 35
    }

    // Usamos nuestra función inteligente
    await guardarDato('sanciones', nuevaSancion)
    
    // Feedback visual simple
    if (!isOnline.value) {
      alert('📡 Estás offline. Dato guardado en cola local.')
    }
    
  } catch (error) {
    console.error(error)
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
.bg-dark-theme { background: #0f1012; min-height: 100vh; }
</style>