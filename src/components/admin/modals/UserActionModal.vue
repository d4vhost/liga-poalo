<template>
  <v-dialog v-model="dialogModel" max-width="400">
    <v-card class="glass-card pa-4">
      <v-card-title class="text-white text-center text-h6 font-weight-bold">
        {{ action === 'aprobar' ? '¿Activar como Jugador?' : '¿Bloquear Acceso?' }}
      </v-card-title>
      
      <v-card-text class="text-center text-grey-lighten-1">
        <p v-if="action === 'aprobar'">
          El usuario <strong>{{ user?.nombres }}</strong> dejará de ser solo Viewer y podrá acceder al panel de Jugadores.
        </p>
        <p v-else>
           El usuario <strong>{{ user?.nombres }}</strong> será bloqueado del sistema.
        </p>
      </v-card-text>
      
      <v-card-actions class="justify-center mt-2">
        <v-btn variant="text" color="grey" @click="close">Cancelar</v-btn>
        <v-btn 
          :color="action === 'aprobar' ? 'green-lighten-1' : 'red-lighten-1'"
          variant="flat"
          class="px-6 font-weight-bold"
          :loading="loading"
          @click="$emit('confirm')"
        >
          Confirmar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: Boolean, // Para v-model
  user: Object,
  action: String,
  loading: Boolean
});

const emit = defineEmits(['update:modelValue', 'confirm']);

// Computada para usar v-model bidireccional
const dialogModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const close = () => {
  dialogModel.value = false;
};
</script>

<style scoped>
.glass-card {
  background: rgba(30, 30, 35, 0.9) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
}
</style>