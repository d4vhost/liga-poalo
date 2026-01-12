<template>
  <v-navigation-drawer
    :model-value="drawer"
    @update:model-value="$emit('update:drawer', $event)"
    :permanent="!isMobile"
    :temporary="isMobile"
    color="#0f1012"
    class="border-r-gray"
    width="280"
    elevation="0"
  >
    <div class="pa-6 d-flex flex-column align-center">
      <v-avatar size="80" color="blue-grey-darken-4" class="mb-4 elevation-5">
        <v-icon size="40" color="blue-lighten-2">mdi-shield-crown</v-icon>
      </v-avatar>
      <h3 class="text-h6 font-weight-bold text-white tracking-wider text-center">FEDERACIÓN</h3>
      <span class="text-caption text-grey-lighten-1">Panel Administrativo</span>
    </div>

    <v-divider class="border-opacity-25 my-2"></v-divider>

    <v-list nav class="pa-4">
      <v-list-item
        v-for="(item, i) in menuItems"
        :key="i"
        :to="{ name: item.routeName }" 
        rounded="lg"
        class="mb-2 nav-item"
        active-class="active-nav"
      >
        <template v-slot:prepend>
          <v-icon>{{ item.icon }}</v-icon>
        </template>
        
        <v-list-item-title class="font-weight-medium">{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-4 mb-16">
        <v-btn
          block
          variant="outlined"
          color="red-lighten-2"
          class="border-opacity-50"
          prepend-icon="mdi-logout"
          @click="$emit('logout')"
        >
          Cerrar Sesión
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
defineProps({
  drawer: Boolean,
  isMobile: Boolean
});

defineEmits(['update:drawer', 'logout']);

const menuItems = [
  { title: 'Usuarios & Socios', icon: 'mdi-account-group', routeName: 'admin-users' },
  { title: 'Partidos', icon: 'mdi-soccer', routeName: 'admin-matches' },
  { title: 'Resultados', icon: 'mdi-scoreboard', routeName: 'admin-results' },
  { title: 'Configuración', icon: 'mdi-cog', routeName: 'admin-settings' },
];
</script>

<style scoped>
.border-r-gray { border-right: 1px solid rgba(255, 255, 255, 0.05); }
.nav-item { color: #bdbdbd; transition: all 0.3s ease; }
.active-nav {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.15), transparent);
  border-left: 3px solid #60a5fa;
  color: white !important;
}
/* Forzar color de icono activo */
.active-nav :deep(.v-icon) { color: white !important; }
</style>