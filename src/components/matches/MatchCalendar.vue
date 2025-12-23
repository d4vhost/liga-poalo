<template>
  <v-card class="glass-panel pa-4" elevation="0">
    <h3 class="text-h6 text-white font-weight-bold mb-4">
      <v-icon color="blue-lighten-2" class="mr-2">mdi-calendar-month</v-icon>
      Filtrar por Fecha
    </h3>
    
    <v-date-picker
      color="blue-lighten-1"
      theme="dark"
      width="100%"
      elevation="0"
      class="bg-transparent"
    ></v-date-picker>

    <v-btn block class="mt-4 btn-glass-outline" rounded="pill">
      Ver Todo el Mes
    </v-btn>
  </v-card>
</template>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}
.btn-glass-outline {
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
}
</style>