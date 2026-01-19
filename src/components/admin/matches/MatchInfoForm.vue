<script setup>
import { computed } from 'vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const formData = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const GAME_MODES = {
  '6v6': { label: 'Fútbol 6' },
  '8v8': { label: 'Fútbol 8' }
}
</script>

<template>
  <v-container class="py-8" style="max-width: 900px;">
    <div class="text-center mb-8">
      <v-avatar color="rgba(255,255,255,0.05)" size="80" class="mb-4">
        <v-icon color="white" size="40">mdi-soccer-field</v-icon>
      </v-avatar>
      <h3 class="text-h5 font-weight-bold text-white mb-2">Información del Encuentro</h3>
    </div>

    <v-row>
      <v-col cols="12" md="6">
        <v-text-field 
          v-model="formData.team_a_name" label="Equipo Local" 
          prepend-inner-icon="mdi-shield-home" variant="outlined" class="mb-2"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field 
          v-model="formData.team_b_name" label="Equipo Visitante" 
          prepend-inner-icon="mdi-shield-airplane" variant="outlined" class="mb-2"
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="4">
        <v-text-field v-model="formData.date" type="date" label="Fecha" variant="outlined"></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field v-model="formData.time" type="time" label="Hora" variant="outlined"></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="formData.game_type"
          :items="Object.entries(GAME_MODES).map(([k,v]) => ({ value: k, title: v.label }))"
          label="Modalidad"
          variant="outlined"
        ></v-select>
      </v-col>

      <v-col cols="12" md="8">
        <v-text-field 
          v-model="formData.location" label="Ubicación" 
          prepend-inner-icon="mdi-map-marker" variant="outlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="formData.status"
          :items="[
            { value: 'programado', title: 'Programado' },
            { value: 'en_juego', title: 'En Juego' },
            { value: 'finalizado', title: 'Finalizado' }
          ]"
          label="Estado"
          variant="outlined"
        ></v-select>
      </v-col>
    </v-row>
  </v-container>
</template>