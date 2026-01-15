<script setup>
// AdminSidebar.vue - Versión Mejorada
</script>

<template>
  <v-list density="comfortable" nav bg-color="transparent">
    
    <!-- DASHBOARD PRINCIPAL -->
    <v-list-item 
      to="/panel-admin" 
      exact
      prepend-icon="mdi-view-dashboard-outline" 
      title="DASHBOARD" 
      rounded="lg" 
      active-class="active-item"
      class="mb-1 text-grey-lighten-1"
    ></v-list-item>

    <v-divider class="my-4 border-opacity-25"></v-divider>
    
    <div class="text-overline text-grey-darken-1 font-weight-bold mb-2 ml-2">
      GESTIÓN DEPORTIVA
    </div>

    <v-list-item 
      to="/panel-admin/usuarios" 
      prepend-icon="mdi-account-group-outline" 
      title="USUARIOS" 
      rounded="lg" 
      active-class="active-item"
      class="mb-1 text-grey-lighten-1"
    ></v-list-item>

    <v-list-item 
      to="/panel-admin/partidos" 
      prepend-icon="mdi-soccer" 
      title="PARTIDOS" 
      rounded="lg"
      active-class="active-item"
      class="mb-1 text-grey-lighten-1"
    ></v-list-item>

    <v-list-item 
      to="/panel-admin/resultados" 
      prepend-icon="mdi-scoreboard-outline" 
      title="RESULTADOS" 
      rounded="lg"
      active-class="active-item"
      class="mb-1 text-grey-lighten-1"
    ></v-list-item>

    <v-divider class="my-4 border-opacity-25"></v-divider>

    <div class="text-overline text-grey-darken-1 font-weight-bold mb-2 ml-2">
      SISTEMA
    </div>

    <v-list-item 
      to="/panel-admin/configuracion" 
      prepend-icon="mdi-cog-outline" 
      title="CONFIGURACIÓN" 
      rounded="lg"
      active-class="active-item"
      class="text-grey-lighten-1"
    ></v-list-item>
  </v-list>
</template>

<style scoped>
.active-item {
  background-color: white !important;
  color: #0f1012 !important;
  font-weight: bold;
}
</style>