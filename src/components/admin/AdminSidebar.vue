<script setup>
import { ref } from 'vue'
const drawer = ref(true)
const items = [
  { text: 'Inicio', icon: 'mdi-view-dashboard', to: { name: 'admin-dashboard' } },
  { text: 'Programar Partidos', icon: 'mdi-soccer', to: { name: 'admin-matches' } },
]
</script>

<template>
  <v-navigation-drawer v-model="drawer" permanent color="grey-darken-4" theme="dark">
    <div class="pa-4 text-center">
      <h3 class="text-h6 font-weight-bold">ADMIN LIGA</h3>
    </div>
    <v-divider></v-divider>
    <v-list nav>
      <v-list-item 
        v-for="(item, i) in items" 
        :key="i" 
        :value="item" 
        active-color="blue"
        :to="item.to"
      >
        <template v-slot:prepend>
          <v-icon :icon="item.icon"></v-icon>
        </template>
        <v-list-item-title>{{ item.text }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>