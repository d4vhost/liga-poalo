<script setup>
import AdminSidebar from '../../components/admin/AdminSidebar.vue'
</script>

<template>
  <v-app>
    <AdminSidebar />

    <v-app-bar flat border title="Administración"></v-app-bar>

    <v-main class="bg-grey-lighten-4">
      <v-container fluid class="pa-6">
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>