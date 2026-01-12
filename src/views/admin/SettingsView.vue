<template>
  <div class="d-flex flex-column h-100 w-100 fade-in-up">
    
    <div class="mb-6">
      <h1 class="text-h5 text-md-h4 font-weight-black text-white text-uppercase mb-1">
        Configuración
      </h1>
      <p class="text-body-2 text-grey-lighten-1">
        Ajustes generales de la liga y el sistema.
      </p>
    </div>

    <v-row>
      <v-col cols="12" md="6">
        <v-card class="glass-card pa-4 h-100" elevation="0">
          <v-card-title class="text-white px-0 d-flex align-center">
            <v-icon color="blue-lighten-2" class="mr-2">mdi-information-outline</v-icon>
            Información de la Liga
          </v-card-title>
          
          <v-divider class="border-opacity-25 mb-4"></v-divider>

          <v-text-field
            label="Nombre del Torneo"
            model-value="Liga Poalo 2024"
            variant="outlined"
            bg-color="rgba(0,0,0,0.2)"
            color="white"
            theme="dark"
            class="mb-2"
          ></v-text-field>

          <v-select
            label="Temporada Actual"
            :items="['Apertura 2024', 'Clausura 2024']"
            model-value="Apertura 2024"
            variant="outlined"
            bg-color="rgba(0,0,0,0.2)"
            color="white"
            theme="dark"
          ></v-select>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="glass-card pa-4 h-100" elevation="0">
          <v-card-title class="text-white px-0 d-flex align-center">
            <v-icon color="orange-lighten-2" class="mr-2">mdi-shield-lock-outline</v-icon>
            Sistema & Permisos
          </v-card-title>

          <v-divider class="border-opacity-25 mb-4"></v-divider>

          <v-list bg-color="transparent" theme="dark">
            <v-list-item class="px-0">
              <template v-slot:prepend>
                <v-switch color="green" hide-details model-value="true"></v-switch>
              </template>
              <v-list-item-title class="text-white font-weight-bold ml-2">Registro de Usuarios</v-list-item-title>
              <v-list-item-subtitle class="ml-2">Permitir que nuevos usuarios se registren.</v-list-item-subtitle>
            </v-list-item>

            <v-divider class="border-opacity-10 my-2"></v-divider>

            <v-list-item class="px-0">
              <template v-slot:prepend>
                <v-switch color="red" hide-details></v-switch>
              </template>
              <v-list-item-title class="text-white font-weight-bold ml-2">Modo Mantenimiento</v-list-item-title>
              <v-list-item-subtitle class="ml-2">Solo administradores podrán acceder.</v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <v-btn block color="blue-grey-darken-3" class="mt-4" variant="tonal">
            Guardar Cambios
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

  </div>
</template>

<script setup>
// Lógica de configuración futura
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