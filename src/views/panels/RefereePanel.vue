<script setup>
import { ref } from 'vue'
import { useDataSync } from '@/composables/useDataSync' // <--- Importamos nuestro cerebro

// Extraemos las herramientas
const { guardarDato, isOnline } = useDataSync()

const cargando = ref(false)

const simularSancion = async () => {
  cargando.value = true
  
  try {
    // Simulamos datos de una tarjeta
    const nuevaSancion = {
      jugador_id: 1, // Ejemplo
      motivo: 'Falta agresiva',
      minuto: 35
    }

    // AQUÍ ESTÁ LA MAGIA: Usamos guardarDato en vez de supabase
    // 'sanciones' es el nombre (ficticio por ahora) de tu tabla en Supabase
    await guardarDato('sanciones', nuevaSancion)
    
    alert(isOnline.value ? '¡Enviado a la Nube!' : '¡Guardado Offline! Se subirá cuando tengas red.')
    
  } catch (error) {
    console.error(error)
    alert('Error al guardar')
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <v-container>
    <h1>Panel de Árbitro</h1>
    
    <v-alert
      :color="isOnline ? 'success' : 'warning'"
      :icon="isOnline ? 'mdi-wifi' : 'mdi-wifi-off'"
      class="mb-4"
    >
      Estás: {{ isOnline ? 'ONLINE' : 'OFFLINE (Modo Local)' }}
    </v-alert>

    <v-btn 
      color="red" 
      size="x-large"
      @click="simularSancion"
      :loading="cargando"
    >
      🟥 Sacar Tarjeta Roja (Prueba)
    </v-btn>

  </v-container>
</template>