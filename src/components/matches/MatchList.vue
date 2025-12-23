<template>
  <div class="d-flex flex-column gap-4">
    <v-card 
      v-for="(match, i) in matches" 
      :key="i"
      class="match-item pa-4"
      elevation="0"
    >
      <div class="d-flex align-center justify-space-between flex-wrap">
        
        <div class="d-flex align-center team-container justify-end">
          <span class="text-h6 font-weight-bold text-white mr-3">{{ match.home }}</span>
          <v-icon size="40" color="white">mdi-shield-outline</v-icon>
        </div>

        <div class="text-center px-4 mx-2">
          <div class="vs-badge mb-1">VS</div>
          <div class="text-caption text-grey-lighten-1">{{ match.time }}</div>
        </div>

        <div class="d-flex align-center team-container">
          <v-icon size="40" color="white">mdi-shield-outline</v-icon>
          <span class="text-h6 font-weight-bold text-white ml-3">{{ match.away }}</span>
        </div>
      </div>
      
      <v-divider class="my-3 border-opacity-25"></v-divider>
      
      <div class="d-flex justify-space-between align-center">
        <span class="text-caption text-blue-lighten-2 font-weight-bold">
          <v-icon size="small" class="mr-1">mdi-map-marker</v-icon> {{ match.location }}
        </span>
        <v-btn size="small" variant="text" color="white" append-icon="mdi-chevron-right">
          Detalles
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const matches = ref([
  { home: 'Los Tigres', away: 'Águilas FC', time: '14:00', location: 'Estadio Central' },
  { home: 'Real Poaló', away: 'Dep. Sur', time: '16:00', location: 'Cancha 2' },
  { home: 'Huracán', away: 'LDU Poaló', time: '10:00', location: 'Estadio Central' },
]);
</script>

<style scoped>
.gap-4 { gap: 16px; }

.match-item {
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  transition: all 0.3s;
}
.match-item:hover {
  background: rgba(255, 255, 255, 0.08) !important;
  transform: translateX(5px);
}
.vs-badge {
  background: rgba(255,255,255,0.1);
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 900;
  color: white;
  font-size: 0.8rem;
}
.team-container {
  flex: 1;
  min-width: 140px;
}
</style>