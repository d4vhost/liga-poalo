<template>
  <v-app>
    <AppNavbar />

    <v-main class="pa-0" style="--v-layout-top: 0px;">
      <router-view />
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script setup>
import AppNavbar from './components/AppNavbar.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<style>
/* Forzamos la fuente Montserrat en toda la app */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300;400;500;700;900&display=swap');

body, .v-application {
  font-family: 'Montserrat', sans-serif !important;
}
</style>