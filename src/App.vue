<template>
  <v-app>
    <AppNavbar v-if="!$route.meta.hideLayout" />
    <v-main class="pa-0" style="--v-layout-top: 0px;">
      <router-view />
    </v-main>
    <AppFooter v-if="!$route.meta.hideLayout" />
  </v-app>
</template>

<script setup>
import AppNavbar from './components/AppNavbar.vue'
import AppFooter from './components/AppFooter.vue'
// No necesitas importar useRoute aquí, $route está disponible en el template
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300;400;500;700;900&display=swap');
body, .v-application {
  font-family: 'Montserrat', sans-serif !important;
}
</style>