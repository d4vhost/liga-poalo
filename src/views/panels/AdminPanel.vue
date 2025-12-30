<template>
  <v-container class="fill-height d-flex justify-center align-center bg-dark-theme">
    <div class="text-center">
      <v-icon color="blue-lighten-2" size="80" class="mb-4">mdi-shield-crown</v-icon>
      <h1 class="text-h3 font-weight-bold text-white mb-2">Panel de Liga (Federación)</h1>
      <p class="text-h6 text-grey-lighten-1">ESTE ES EL PANEL DE LA FEDERACIÓN</p>
      <v-btn color="red-darken-1" class="mt-6" rounded="pill" @click="handleLogout">Cerrar Sesión</v-btn>
    </div>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { supabase } from '../../services/supabase';

const router = useRouter();

const handleLogout = async () => {
  await supabase.auth.signOut();
  router.push('/login');
};
</script>

<style scoped>
.bg-dark-theme { background: #0f1012; min-height: 100vh; }
</style>