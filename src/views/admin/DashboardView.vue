<template>
  <div class="dashboard-wrapper">
    <header class="d-flex justify-space-between align-end mb-8">
      <div>
        <div class="d-flex align-center mb-1">
          <v-icon color="blue-lighten-2" class="mr-2" size="small">mdi-shield-check</v-icon>
          <span class="text-overline font-weight-bold text-blue-lighten-2" style="letter-spacing: 2px !important;">
            ADMINISTRACIÓN CENTRAL
          </span>
        </div>
        <h1 class="text-h3 font-weight-black text-white">Panel de Control</h1>
      </div>
      
      <div class="text-right d-none d-md-block">
        <v-chip variant="outlined" color="grey-lighten-1" size="small" class="mb-2">
          {{ currentDateTime }}
        </v-chip>
        <div class="d-flex align-center justify-end">
          <span class="text-caption text-green-lighten-2 font-weight-bold mr-2">SISTEMA ACTIVO</span>
          <div class="pulse-indicator"></div>
        </div>
      </div>
    </header>

    <v-row>
      <v-col cols="12" lg="8">
        <v-row class="mb-6">
          <v-col cols="12" sm="6" md="3" v-for="(stat, i) in mainStats" :key="i">
            <v-card class="stat-card-clean" elevation="0">
              <p class="text-overline text-grey-darken-1 mb-0">{{ stat.label }}</p>
              <div class="d-flex align-center justify-space-between">
                <h2 class="text-h4 font-weight-black text-white">{{ stat.value }}</h2>
                <v-icon :color="stat.iconColor" size="24">{{ stat.icon }}</v-icon>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <v-card class="glass-panel main-table-height" elevation="0">
          <div class="pa-5 d-flex justify-space-between align-center border-bottom-dark">
            <h3 class="text-h6 font-weight-bold text-white d-flex align-center">
              <v-icon start color="blue">mdi-format-list-numbered</v-icon>
              Clasificación de Temporada
            </h3>
            <v-btn to="/panel-admin/resultados" variant="tonal" size="small" color="blue-lighten-3">Detalles</v-btn>
          </div>
          <v-table theme="dark" class="bg-transparent custom-table">
            <thead>
              <tr>
                <th class="text-left font-weight-bold">POS</th>
                <th class="text-left font-weight-bold">CLUB</th>
                <th class="text-center font-weight-bold">PJ</th>
                <th class="text-center font-weight-bold">PTS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(team, i) in topTeams" :key="i" class="table-row">
                <td><span class="pos-number" :class="{ 'top-three': i < 3 }">{{ i + 1 }}</span></td>
                <td class="font-weight-bold">{{ team.name }}</td>
                <td class="text-center text-grey">{{ team.played }}</td>
                <td class="text-center"><div class="points-badge">{{ team.points }}</div></td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <div class="d-flex flex-column main-table-height">
          <v-card class="glass-panel mb-4 flex-grow-1" elevation="0">
            <div class="pa-4 border-bottom-dark d-flex justify-space-between align-center">
              <h3 class="text-subtitle-1 font-weight-bold text-white d-flex align-center">
                <v-icon start color="orange" size="small">mdi-soccer-shoe</v-icon>
                Goleadores
              </h3>
              <div class="d-flex align-center">
                <v-btn icon="mdi-chevron-left" variant="text" size="x-small" @click="prevScorer" :disabled="scorerPage === 0"></v-btn>
                <span class="text-caption mx-2">{{ scorerPage + 1 }}</span>
                <v-btn icon="mdi-chevron-right" variant="text" size="x-small" @click="nextScorer" :disabled="(scorerPage + 1) * 3 >= topScorers.length"></v-btn>
              </div>
            </div>
            <v-list bg-color="transparent" class="pa-2">
              <v-list-item v-for="(player, i) in paginatedScorers" :key="i" class="mb-1 list-item-custom" density="compact">
                <v-list-item-title class="text-caption font-weight-bold text-white">{{ player.name }}</v-list-item-title>
                <v-list-item-subtitle class="text-overline" style="font-size: 0.6rem !important;">{{ player.team }}</v-list-item-subtitle>
                <template v-slot:append>
                  <span class="text-subtitle-1 font-weight-black text-orange-lighten-2">{{ player.goals }}</span>
                </template>
              </v-list-item>
            </v-list>
          </v-card>

          <v-card class="glass-panel" elevation="0" style="flex-shrink: 0;">
            <div class="pa-4 border-bottom-dark">
              <h3 class="text-subtitle-1 font-weight-bold text-white d-flex align-center">
                <v-icon start color="grey" size="small">mdi-history</v-icon>
                Actividad Reciente
              </h3>
            </div>
            <div class="pa-4">
              <div v-for="(activity, i) in recentActivity.slice(0, 3)" :key="i" class="activity-item-compact">
                <div class="activity-dot" :style="{ background: activity.color }"></div>
                <div>
                  <p class="text-caption font-weight-medium text-grey-lighten-2 mb-0">{{ activity.title }}</p>
                  <span class="text-overline text-grey-darken-2" style="font-size: 0.55rem !important;">{{ activity.time }}</span>
                </div>
              </div>
              <v-btn block variant="text" color="blue-lighten-4" size="x-small" class="mt-2 font-weight-bold">
                VER AUDITORÍA COMPLETA
              </v-btn>
            </div>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const currentDateTime = ref('');
const scorerPage = ref(0);

onMounted(() => {
  const now = new Date();
  currentDateTime.value = now.toLocaleDateString('es-EC', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });
});

const mainStats = ref([
  { label: 'USUARIOS', value: '247', icon: 'mdi-account-group', iconColor: 'blue-lighten-2' },
  { label: 'PARTIDOS', value: '38', icon: 'mdi-soccer', iconColor: 'green-lighten-2' },
  { label: 'EQUIPOS', value: '12', icon: 'mdi-shield', iconColor: 'purple-lighten-2' },
  { label: 'ÁRBITROS', value: '8', icon: 'mdi-whistle', iconColor: 'orange-lighten-2' }
]);

const topTeams = ref([
  { name: 'Los Tigres', points: 28, played: 10 },
  { name: 'Real Poaló', points: 25, played: 10 },
  { name: 'Águilas FC', points: 22, played: 10 },
  { name: 'Unidos FC', points: 20, played: 10 },
  { name: 'Deportivo Sur', points: 18, played: 10 }
]);

const topScorers = ref([
  { name: 'Carlos Méndez', team: 'Tigres', goals: 15 },
  { name: 'Juan Torres', team: 'Poaló', goals: 12 },
  { name: 'Miguel Ángel', team: 'Águilas', goals: 11 },
  { name: 'Roberto García', team: 'Unidos', goals: 9 },
  { name: 'Diego Rojas', team: 'Sur', goals: 8 },
  { name: 'Luis Vera', team: 'Poaló', goals: 7 }
]);

const paginatedScorers = computed(() => {
  const start = scorerPage.value * 3;
  return topScorers.value.slice(start, start + 3);
});

const nextScorer = () => { if ((scorerPage.value + 1) * 3 < topScorers.length) scorerPage.value++; };
const prevScorer = () => { if (scorerPage.value > 0) scorerPage.value--; };

const recentActivity = ref([
  { title: 'Nuevo jugador registrado', time: 'HACE 5 MIN', color: '#4CAF50' },
  { title: 'Partido validado: 3-2', time: 'HACE 1 HORA', color: '#2196F3' },
  { title: 'Reporte disciplinario', time: 'HACE 3 HORAS', color: '#F44336' }
]);
</script>

<style scoped>
.dashboard-wrapper { max-width: 1400px; margin: 0 auto; }

/* ALTURA SINCRONIZADA */
.main-table-height {
  height: 460px; /* Ajuste preciso para que ambas columnas midan lo mismo */
}

.stat-card-clean {
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px !important;
  padding: 16px;
}

.glass-panel {
  background: rgba(15, 16, 18, 0.6) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px !important;
  display: flex;
  flex-direction: column;
}

.border-bottom-dark { border-bottom: 1px solid rgba(255, 255, 255, 0.05); }

.custom-table :deep(th) {
  font-size: 0.65rem !important;
  color: #616161 !important;
  letter-spacing: 1px;
}

.pos-number {
  display: inline-flex;
  width: 22px; height: 22px;
  align-items: center; justify-content: center;
  font-size: 0.7rem; font-weight: bold;
  border-radius: 4px; background: rgba(255, 255, 255, 0.05);
}

.pos-number.top-three { background: rgba(33, 150, 243, 0.2); color: #64B5F6; }

.points-badge {
  background: #1e1e1e; padding: 2px 10px;
  border-radius: 6px; font-weight: 800; color: #BBDEFB; font-size: 0.85rem;
}

.list-item-custom { background: rgba(255, 255, 255, 0.02); border-radius: 8px; }

.activity-item-compact { display: flex; align-items: flex-start; margin-bottom: 12px; }

.activity-dot {
  width: 6px; height: 6px; border-radius: 50%;
  margin-top: 5px; margin-right: 12px; flex-shrink: 0;
}

.pulse-indicator {
  width: 8px; height: 8px; background: #4CAF50; border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
  70% { box-shadow: 0 0 0 8px rgba(76, 175, 80, 0); }
  100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
}
</style>