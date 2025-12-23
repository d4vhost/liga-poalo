<template>
  <v-card class="calendar-glass-card pa-5 d-flex flex-column" elevation="0">
    <div class="d-flex align-center mb-5">
      <div class="icon-wrapper mr-3">
        <v-icon color="grey-lighten-1" size="28">mdi-calendar-month</v-icon>
      </div>
      <h3 class="text-h6 text-white font-weight-bold mb-0">
        Filtrar por Fecha
      </h3>
    </div>
    
    <v-date-picker
      v-model="selectedDate"
      color="grey-lighten-1"
      theme="dark"
      width="100%"
      elevation="0"
      class="custom-picker flex-grow-1"
      bg-color="transparent"
      show-adjacent-months
    ></v-date-picker>

    <div class="mt-5 d-flex flex-column gap-3">
      <v-btn 
        block 
        class="btn-primary-glass" 
        rounded="pill"
        prepend-icon="mdi-calendar-check"
        height="48"
      >
        Aplicar Filtro
      </v-btn>
      
      <v-btn 
        block 
        class="btn-secondary-glass" 
        rounded="pill"
        variant="outlined"
        prepend-icon="mdi-calendar-refresh"
        height="44"
      >
        Ver Todo el Mes
      </v-btn>
    </div>

    <!-- ESTADÍSTICAS RÁPIDAS -->
    <div class="stats-mini mt-6 pt-5" style="border-top: 1px solid rgba(255,255,255,0.08);">
      <h4 class="text-caption text-grey-lighten-1 font-weight-bold mb-3 text-uppercase" style="letter-spacing: 1px;">
        Esta Semana
      </h4>
      <div class="d-flex justify-space-between align-center mb-2">
        <span class="text-body-2 text-grey-lighten-2">Partidos Programados</span>
        <v-chip size="small" color="grey-darken-1" class="font-weight-bold">8</v-chip>
      </div>
      <div class="d-flex justify-space-between align-center">
        <span class="text-body-2 text-grey-lighten-2">Próximo Encuentro</span>
        <v-chip size="small" color="grey-darken-2" class="font-weight-bold">Hoy</v-chip>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';

const selectedDate = ref(new Date());
</script>

<style scoped>
.calendar-glass-card {
  background: rgba(255, 255, 255, 0.04) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px !important;
  transition: all 0.4s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  height: 100%;
}

.calendar-glass-card:hover {
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

.icon-wrapper {
  background: rgba(255, 255, 255, 0.08);
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

/* CALENDAR PICKER OSCURO - ELIMINA TODO EL BLANCO */
.custom-picker {
  background: transparent !important;
  border-radius: 16px !important;
  overflow: hidden;
}

.custom-picker :deep(.v-picker__header) {
  background: rgba(255, 255, 255, 0.02) !important;
  padding: 12px;
}

.custom-picker :deep(.v-picker-title) {
  background: transparent !important;
  color: white !important;
}

.custom-picker :deep(.v-date-picker-header) {
  background: rgba(38, 50, 56, 0.3) !important;
  padding: 12px;
}

.custom-picker :deep(.v-date-picker-header__content) {
  color: white !important;
}

.custom-picker :deep(.v-btn) {
  color: rgba(255, 255, 255, 0.7) !important;
}

.custom-picker :deep(.v-date-picker-month) {
  background: rgba(0, 0, 0, 0.2) !important;
}

.custom-picker :deep(.v-date-picker-month__day) {
  color: rgba(255, 255, 255, 0.7) !important;
}

.custom-picker :deep(.v-date-picker-month__day--selected) {
  background: rgba(255, 255, 255, 0.15) !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
}

.custom-picker :deep(.v-date-picker-month__day:hover) {
  background: rgba(255, 255, 255, 0.1) !important;
}

.custom-picker :deep(.v-date-picker-month__weekday) {
  color: rgba(255, 255, 255, 0.5) !important;
}

.custom-picker :deep(.v-date-picker-years) {
  background: rgba(0, 0, 0, 0.3) !important;
}

.custom-picker :deep(.v-date-picker-years__content) {
  color: rgba(255, 255, 255, 0.7) !important;
}

.custom-picker :deep(.v-btn--active) {
  background: rgba(255, 255, 255, 0.15) !important;
  color: white !important;
}

/* BOTONES */
.btn-primary-glass {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: white !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-primary-glass:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%) !important;
  border-color: rgba(255, 255, 255, 0.4) !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.btn-secondary-glass {
  background: transparent !important;
  border: 2px solid rgba(255, 255, 255, 0.2) !important;
  color: white !important;
  font-weight: 500 !important;
  transition: all 0.3s ease;
}

.btn-secondary-glass:hover {
  background: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(255, 255, 255, 0.4) !important;
  transform: translateY(-2px);
}

.stats-mini {
  background: rgba(0, 0, 0, 0.2);
  padding: 16px;
  border-radius: 12px;
}

.gap-3 {
  gap: 12px;
}

.flex-grow-1 {
  flex-grow: 1;
}
</style>