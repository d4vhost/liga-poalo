<template>
  <div class="d-flex flex-column h-100 w-100 fade-in-up">
    <div class="mb-6">
      <h1 class="text-h5 text-md-h4 font-weight-black text-white text-uppercase mb-1">
        Resultados
      </h1>
      <p class="text-body-2 text-grey-lighten-1">
        Actualiza los marcadores y cierra las jornadas.
      </p>
    </div>

    <v-card class="glass-card pa-6 flex-grow-1 d-flex flex-column align-center justify-center text-center" elevation="0">
      
      <v-avatar color="rgba(255,255,255,0.05)" size="120" class="mb-6">
        <v-icon size="60" color="blue-grey-lighten-2">mdi-scoreboard-outline</v-icon>
      </v-avatar>

      <h2 class="text-h5 text-white font-weight-bold mb-2">Panel de Resultados</h2>
      <p class="text-grey-lighten-1 mb-6" style="max-width: 400px;">
        Aquí podrás seleccionar la jornada actual y validar los resultados reportados por los árbitros.
      </p>

      <v-btn 
        color="blue-darken-2" 
        prepend-icon="mdi-plus" 
        variant="flat" 
        rounded="lg"
        class="text-none font-weight-bold"
      >
        Ingresar Resultado Manual
      </v-btn>

    </v-card>
  </div>
</template>

<script setup>
// Aquí irá la lógica para filtrar por Jornada (Fecha 1, Fecha 2, etc.)
</script>

<style scoped>
.glass-card {
  background: rgba(30, 30, 35, 0.6) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
}

.fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.6s ease forwards;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>