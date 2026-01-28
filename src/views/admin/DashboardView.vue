<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-4">Panel de Control</h1>
        <p class="text-body-1">Bienvenido al sistema de administración de Liga Poaló.</p>
      </v-col>
    </v-row>
    
    <v-row class="mt-4">
      <v-col cols="12" md="4">
        <v-card color="blue-darken-3" theme="dark" :to="{ name: 'admin-matches' }" hover>
          <v-card-item>
            <template v-slot:prepend>
              <v-icon size="x-large" icon="mdi-calendar-plus"></v-icon>
            </template>
            <v-card-title>Programar Partidos</v-card-title>
            <v-card-subtitle>Crear actas de juego</v-card-subtitle>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// Lógica simple del dashboard
</script>