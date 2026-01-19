<script setup>
import { computed } from 'vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const formData = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<template>
  <v-container v-show="true" class="py-8" style="max-width: 900px;">
    <div class="step-content">
      
      <div class="text-center mb-8">
        <v-avatar color="rgba(255,255,255,0.05)" size="80" class="mb-4">
          <v-icon color="white" size="40">mdi-soccer-field</v-icon>
        </v-avatar>
        <h3 class="text-h5 font-weight-bold text-white mb-2">Información del Encuentro</h3>
        <p class="text-body-2 text-grey-lighten-1">Complete los datos básicos del partido oficial</p>
      </div>

      <v-row>
        <v-col cols="12" md="6">
          <v-card class="info-card pa-5" elevation="0">
            <div class="d-flex align-center mb-4">
              <v-icon color="blue-lighten-2" class="mr-3">mdi-shield-home</v-icon>
              <span class="text-overline font-weight-bold text-grey">Equipo Local</span>
            </div>
            <v-text-field 
              v-model="formData.team_a_name" placeholder="Ej: Los Tigres FC"
              variant="outlined" density="comfortable" bg-color="rgba(255,255,255,0.03)"
              hide-details="auto" class="input-premium"
            ></v-text-field>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card class="info-card pa-5" elevation="0">
            <div class="d-flex align-center mb-4">
              <v-icon color="orange-lighten-2" class="mr-3">mdi-shield-airplane</v-icon>
              <span class="text-overline font-weight-bold text-grey">Equipo Visitante</span>
            </div>
            <v-text-field 
              v-model="formData.team_b_name" placeholder="Ej: Águilas United"
              variant="outlined" density="comfortable" bg-color="rgba(255,255,255,0.03)"
              hide-details="auto" class="input-premium"
            ></v-text-field>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <div class="text-caption text-grey-lighten-1 mb-2 ml-1 font-weight-bold tracking-wider">FECHA</div>
          <v-text-field 
            v-model="formData.date" type="date"
            variant="outlined" density="comfortable" bg-color="rgba(255,255,255,0.03)"
            prepend-inner-icon="mdi-calendar" hide-details="auto" class="input-premium"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <div class="text-caption text-grey-lighten-1 mb-2 ml-1 font-weight-bold tracking-wider">HORA (ECU)</div>
          <v-text-field 
            v-model="formData.time" type="time"
            variant="outlined" density="comfortable" bg-color="rgba(255,255,255,0.03)"
            prepend-inner-icon="mdi-clock-outline" hide-details="auto" class="input-premium"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <div class="text-caption text-grey-lighten-1 mb-2 ml-1 font-weight-bold tracking-wider">MODALIDAD</div>
          <v-text-field
            model-value="Fútbol 11"
            readonly disabled
            variant="outlined" density="comfortable" bg-color="rgba(255,255,255,0.03)"
            prepend-inner-icon="mdi-account-group" hide-details="auto" class="input-premium"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="8">
          <div class="text-caption text-grey-lighten-1 mb-2 ml-1 font-weight-bold tracking-wider">UBICACIÓN</div>
          <v-text-field 
            v-model="formData.location" placeholder="Ej: Estadio Municipal"
            variant="outlined" density="comfortable" bg-color="rgba(255,255,255,0.03)"
            prepend-inner-icon="mdi-map-marker" hide-details="auto" class="input-premium"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <div class="text-caption text-grey-lighten-1 mb-2 ml-1 font-weight-bold tracking-wider">ESTADO</div>
          <v-select
            v-model="formData.status"
            :items="[{ value: 'programado', title: 'Programado' }, { value: 'en_juego', title: 'En Juego' }, { value: 'finalizado', title: 'Finalizado' }]"
            variant="outlined" density="comfortable" bg-color="rgba(255,255,255,0.03)"
            prepend-inner-icon="mdi-list-status" hide-details="auto" class="input-premium"
          ></v-select>
        </v-col>
      </v-row>

    </div>
  </v-container>
</template>

<style scoped>
/* ESTILOS ORIGINALES DEL FORMULARIO */
.step-content { animation: fadeIn 0.4s ease; }
.info-card {
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  transition: all 0.3s;
}
.info-card:hover {
  background: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(255, 255, 255, 0.15);
}
.input-premium :deep(.v-field) {
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.input-premium :deep(.v-field--focused) {
  border-color: rgba(255, 255, 255, 0.3);
}
.tracking-wider { letter-spacing: 1.5px; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>