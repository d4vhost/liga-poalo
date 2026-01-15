<template>
  <div class="dashboard-container">
    <!-- HEADER CON ESTADÍSTICAS PRINCIPALES -->
    <div class="mb-8">
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 font-weight-black text-white mb-1">
            Dashboard General
          </h1>
          <p class="text-body-2 text-grey-lighten-1">
            Vista general de la liga y estadísticas en tiempo real
          </p>
        </div>
        <v-chip
          :color="systemStatus === 'online' ? 'green' : 'red'"
          variant="flat"
          size="small"
          class="px-4"
        >
          <v-icon start size="10">mdi-circle</v-icon>
          <span class="font-weight-bold">{{ systemStatus === 'online' ? 'SISTEMA ACTIVO' : 'OFFLINE' }}</span>
        </v-chip>
      </div>

      <!-- TARJETAS DE ESTADÍSTICAS -->
      <v-row>
        <v-col cols="12" sm="6" lg="3" v-for="(stat, i) in mainStats" :key="i">
          <v-card class="stat-card pa-5" elevation="0">
            <div class="d-flex justify-space-between align-center mb-4">
              <div class="stat-icon-wrapper" :style="{ background: stat.bgColor }">
                <v-icon :color="stat.iconColor" size="28">{{ stat.icon }}</v-icon>
              </div>
              <v-chip
                :color="stat.trend === 'up' ? 'green' : 'red'"
                size="x-small"
                variant="flat"
                class="trend-chip"
              >
                <v-icon start size="12">{{ stat.trend === 'up' ? 'mdi-arrow-up' : 'mdi-arrow-down' }}</v-icon>
                {{ stat.trendValue }}
              </v-chip>
            </div>
            <div>
              <p class="text-caption text-grey-lighten-1 mb-1 text-uppercase tracking-wide">
                {{ stat.label }}
              </p>
              <h2 class="text-h3 font-weight-black text-white mb-1">
                {{ stat.value }}
              </h2>
              <p class="text-caption text-grey-darken-1">{{ stat.description }}</p>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- GRÁFICOS Y ACTIVIDAD RECIENTE -->
    <v-row>
      <!-- GRÁFICO DE PARTIDOS -->
      <v-col cols="12" lg="8">
        <v-card class="glass-card pa-6" elevation="0">
          <div class="d-flex justify-space-between align-center mb-6">
            <div>
              <h3 class="text-h6 font-weight-bold text-white mb-1">
                Partidos por Mes
              </h3>
              <p class="text-caption text-grey-lighten-1">
                Resumen de actividad de la temporada actual
              </p>
            </div>
            <v-btn-toggle
              v-model="chartPeriod"
              mandatory
              density="compact"
              variant="outlined"
              divided
              color="white"
              class="chart-toggle"
            >
              <v-btn value="week" size="small">Semana</v-btn>
              <v-btn value="month" size="small">Mes</v-btn>
              <v-btn value="year" size="small">Año</v-btn>
            </v-btn-toggle>
          </div>

          <!-- GRÁFICO SIMPLE CON BARRAS CSS -->
          <div class="chart-wrapper">
            <div class="chart-bars">
              <div 
                v-for="(month, i) in chartData" 
                :key="i"
                class="chart-bar-container"
              >
                <div class="chart-bar-info">
                  <span class="chart-bar-value">{{ month.value }}</span>
                </div>
                <div 
                  class="chart-bar"
                  :style="{ height: `${(month.value / maxChartValue) * 100}%` }"
                >
                  <div class="chart-bar-fill"></div>
                </div>
                <span class="chart-bar-label">{{ month.month }}</span>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- ACTIVIDAD RECIENTE -->
      <v-col cols="12" lg="4">
        <v-card class="glass-card pa-6" elevation="0" style="height: 100%;">
          <div class="d-flex justify-space-between align-center mb-6">
            <h3 class="text-h6 font-weight-bold text-white">
              Actividad Reciente
            </h3>
            <v-btn
              icon
              variant="text"
              size="small"
              color="grey"
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </div>

          <v-timeline 
            side="end" 
            density="compact" 
            align="start"
            class="activity-timeline"
          >
            <v-timeline-item
              v-for="(activity, i) in recentActivity"
              :key="i"
              :dot-color="activity.color"
              size="x-small"
              class="mb-4"
            >
              <template v-slot:opposite>
                <span class="text-caption text-grey-darken-1">{{ activity.time }}</span>
              </template>
              <div class="activity-content">
                <p class="text-body-2 font-weight-medium text-white mb-1">
                  {{ activity.title }}
                </p>
                <p class="text-caption text-grey-lighten-1">
                  {{ activity.description }}
                </p>
              </div>
            </v-timeline-item>
          </v-timeline>

          <v-btn
            block
            variant="outlined"
            color="white"
            class="mt-4 btn-border-subtle"
            size="small"
          >
            Ver Todo el Registro
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- SECCIÓN DE EQUIPOS Y JUGADORES DESTACADOS -->
    <v-row class="mt-4">
      <!-- TABLA DE POSICIONES MINI -->
      <v-col cols="12" md="6">
        <v-card class="glass-card pa-6" elevation="0">
          <div class="d-flex justify-space-between align-center mb-4">
            <h3 class="text-h6 font-weight-bold text-white">
              Tabla de Posiciones
            </h3>
            <v-btn
              variant="text"
              size="small"
              color="blue-lighten-2"
              append-icon="mdi-arrow-right"
            >
              Ver Completa
            </v-btn>
          </div>

          <v-table theme="dark" class="standings-table">
            <thead>
              <tr>
                <th class="text-left text-caption font-weight-bold">#</th>
                <th class="text-left text-caption font-weight-bold">EQUIPO</th>
                <th class="text-center text-caption font-weight-bold">PJ</th>
                <th class="text-center text-caption font-weight-bold">PTS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(team, i) in topTeams" :key="i" class="team-row">
                <td class="text-grey-lighten-1 font-weight-bold">{{ i + 1 }}</td>
                <td>
                  <div class="d-flex align-center">
                    <v-avatar size="28" color="grey-darken-3" class="mr-3">
                      <v-icon size="16" color="white">mdi-shield</v-icon>
                    </v-avatar>
                    <span class="text-white font-weight-medium">{{ team.name }}</span>
                  </div>
                </td>
                <td class="text-center text-grey-lighten-1">{{ team.played }}</td>
                <td class="text-center">
                  <v-chip size="small" color="green-darken-2" variant="flat">
                    {{ team.points }}
                  </v-chip>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>

      <!-- GOLEADORES DESTACADOS -->
      <v-col cols="12" md="6">
        <v-card class="glass-card pa-6" elevation="0">
          <div class="d-flex justify-space-between align-center mb-4">
            <h3 class="text-h6 font-weight-bold text-white">
              Goleadores
            </h3>
            <v-btn
              variant="text"
              size="small"
              color="orange-lighten-2"
              append-icon="mdi-arrow-right"
            >
              Ver Todos
            </v-btn>
          </div>

          <v-list bg-color="transparent" class="pa-0">
            <v-list-item
              v-for="(player, i) in topScorers"
              :key="i"
              class="scorer-item px-0 mb-3"
            >
              <template v-slot:prepend>
                <div class="position-badge" :class="{ 'golden': i === 0, 'silver': i === 1, 'bronze': i === 2 }">
                  <span class="font-weight-black">{{ i + 1 }}</span>
                </div>
              </template>

              <v-list-item-title class="text-white font-weight-bold mb-1">
                {{ player.name }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-grey-lighten-1 text-caption">
                {{ player.team }}
              </v-list-item-subtitle>

              <template v-slot:append>
                <div class="goals-badge">
                  <v-icon color="orange-lighten-2" size="18" class="mr-1">mdi-soccer</v-icon>
                  <span class="text-h6 font-weight-black text-white">{{ player.goals }}</span>
                </div>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- ACCIONES RÁPIDAS -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card class="glass-card pa-6" elevation="0">
          <h3 class="text-h6 font-weight-bold text-white mb-5">
            Acciones Rápidas
          </h3>
          
          <v-row>
            <v-col cols="6" sm="4" md="2" v-for="(action, i) in quickActions" :key="i">
              <v-btn
                block
                height="100"
                class="quick-action-btn"
                variant="outlined"
                @click="handleQuickAction(action.route)"
              >
                <div class="d-flex flex-column align-center">
                  <v-icon :color="action.color" size="32" class="mb-2">{{ action.icon }}</v-icon>
                  <span class="text-caption font-weight-bold text-white text-center">
                    {{ action.label }}
                  </span>
                </div>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Estado
const systemStatus = ref('online');
const chartPeriod = ref('month');

// Estadísticas principales
const mainStats = ref([
  {
    label: 'Total Usuarios',
    value: '247',
    description: '+12 este mes',
    icon: 'mdi-account-group',
    iconColor: 'blue-lighten-2',
    bgColor: 'rgba(33, 150, 243, 0.1)',
    trend: 'up',
    trendValue: '+4.5%'
  },
  {
    label: 'Partidos Jugados',
    value: '38',
    description: 'Temporada 2025',
    icon: 'mdi-soccer',
    iconColor: 'green-lighten-2',
    bgColor: 'rgba(76, 175, 80, 0.1)',
    trend: 'up',
    trendValue: '+8.2%'
  },
  {
    label: 'Equipos Activos',
    value: '12',
    description: 'En competencia',
    icon: 'mdi-shield-star',
    iconColor: 'purple-lighten-2',
    bgColor: 'rgba(156, 39, 176, 0.1)',
    trend: 'up',
    trendValue: '+2'
  },
  {
    label: 'Árbitros',
    value: '8',
    description: 'Certificados',
    icon: 'mdi-whistle',
    iconColor: 'orange-lighten-2',
    bgColor: 'rgba(255, 152, 0, 0.1)',
    trend: 'up',
    trendValue: '+1'
  }
]);

// Datos del gráfico
const chartData = ref([
  { month: 'Ene', value: 8 },
  { month: 'Feb', value: 12 },
  { month: 'Mar', value: 15 },
  { month: 'Abr', value: 10 },
  { month: 'May', value: 18 },
  { month: 'Jun', value: 14 }
]);

const maxChartValue = computed(() => Math.max(...chartData.value.map(d => d.value)));

// Actividad reciente
const recentActivity = ref([
  {
    title: 'Nuevo usuario registrado',
    description: 'Juan Pérez se unió como jugador',
    time: 'Hace 5 min',
    color: 'green'
  },
  {
    title: 'Partido programado',
    description: 'Tigres vs Águilas - Sábado 15:00',
    time: 'Hace 1h',
    color: 'blue'
  },
  {
    title: 'Resultado actualizado',
    description: 'Real Poaló 3 - 2 Deportivo Sur',
    time: 'Hace 2h',
    color: 'orange'
  },
  {
    title: 'Tarjeta roja emitida',
    description: 'Carlos Méndez - Conducta violenta',
    time: 'Hace 3h',
    color: 'red'
  },
  {
    title: 'Cambio de horario',
    description: 'Unidos FC vs Los Leones',
    time: 'Hace 5h',
    color: 'purple'
  }
]);

// Tabla de posiciones
const topTeams = ref([
  { name: 'Los Tigres', played: 10, points: 28 },
  { name: 'Real Poaló', played: 10, points: 25 },
  { name: 'Águilas FC', played: 10, points: 22 },
  { name: 'Unidos FC', played: 10, points: 20 },
  { name: 'Deportivo Sur', played: 10, points: 18 }
]);

// Goleadores
const topScorers = ref([
  { name: 'Carlos Méndez', team: 'Los Tigres', goals: 15 },
  { name: 'Juan Torres', team: 'Real Poaló', goals: 12 },
  { name: 'Miguel Ángel', team: 'Águilas FC', goals: 11 },
  { name: 'Roberto García', team: 'Unidos FC', goals: 9 },
  { name: 'Diego Rojas', team: 'Deportivo Sur', goals: 8 }
]);

// Acciones rápidas
const quickActions = ref([
  { label: 'Nuevo Usuario', icon: 'mdi-account-plus', color: 'blue-lighten-2', route: '/panel-admin/usuarios' },
  { label: 'Programar Partido', icon: 'mdi-calendar-plus', color: 'green-lighten-2', route: '/panel-admin/partidos' },
  { label: 'Ver Resultados', icon: 'mdi-trophy', color: 'orange-lighten-2', route: '/panel-admin/resultados' },
  { label: 'Estadísticas', icon: 'mdi-chart-line', color: 'purple-lighten-2', route: '/panel-admin' },
  { label: 'Configuración', icon: 'mdi-cog', color: 'grey-lighten-1', route: '/panel-admin/configuracion' },
  { label: 'Reportes', icon: 'mdi-file-document', color: 'cyan-lighten-2', route: '/panel-admin' }
]);

const handleQuickAction = (route) => {
  router.push(route);
};
</script>

<style scoped>
.dashboard-container {
  width: 100%;
  max-width: 100%;
}

/* TARJETAS DE ESTADÍSTICAS */
.stat-card {
  background: rgba(255, 255, 255, 0.04) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px !important;
  transition: all 0.3s ease;
  height: 100%;
}

.stat-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.stat-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.trend-chip {
  height: 24px !important;
  font-size: 0.7rem !important;
  font-weight: bold;
}

.tracking-wide {
  letter-spacing: 0.5px;
}

/* GLASS CARDS */
.glass-card {
  background: rgba(255, 255, 255, 0.04) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px !important;
}

/* GRÁFICO DE BARRAS */
.chart-wrapper {
  height: 280px;
  position: relative;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 100%;
  padding: 20px 10px 40px;
}

.chart-bar-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  height: 100%;
}

.chart-bar-info {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
}

.chart-bar-container:hover .chart-bar-info {
  opacity: 1;
}

.chart-bar-value {
  background: rgba(255, 255, 255, 0.9);
  color: #000;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: bold;
  white-space: nowrap;
}

.chart-bar {
  width: 100%;
  max-width: 50px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px 8px 0 0;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.chart-bar:hover {
  background: rgba(255, 255, 255, 0.15);
}

.chart-bar-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(180deg, #4CAF50 0%, #2E7D32 100%);
  border-radius: 8px 8px 0 0;
  animation: fillBar 1s ease-out;
}

@keyframes fillBar {
  from { height: 0; }
  to { height: 100%; }
}

.chart-bar-label {
  margin-top: 12px;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 600;
  text-align: center;
}

.chart-toggle {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  overflow: hidden;
}

/* TIMELINE DE ACTIVIDAD */
.activity-timeline :deep(.v-timeline-divider__dot) {
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.05);
}

.activity-content {
  padding-left: 8px;
}

/* TABLA DE POSICIONES */
.standings-table {
  background: transparent !important;
}

.standings-table :deep(thead tr th) {
  background: rgba(255, 255, 255, 0.05) !important;
  color: rgba(255, 255, 255, 0.7) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  padding: 12px 16px !important;
}

.standings-table :deep(tbody tr td) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
  padding: 12px 16px !important;
}

.team-row {
  transition: background 0.2s;
}

.team-row:hover {
  background: rgba(255, 255, 255, 0.02);
}

/* GOLEADORES */
.scorer-item {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  margin-bottom: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s;
}

.scorer-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.position-badge {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.9rem;
  margin-right: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.position-badge.golden {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #000;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

.position-badge.silver {
  background: linear-gradient(135deg, #C0C0C0 0%, #808080 100%);
  color: #000;
}

.position-badge.bronze {
  background: linear-gradient(135deg, #CD7F32 0%, #8B4513 100%);
  color: #fff;
}

.goals-badge {
  display: flex;
  align-items: center;
  background: rgba(255, 152, 0, 0.1);
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid rgba(255, 152, 0, 0.2);
}

/* ACCIONES RÁPIDAS */
.quick-action-btn {
  background: rgba(255, 255, 255, 0.02) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
  border-radius: 12px !important;
  transition: all 0.3s ease;
}

.quick-action-btn:hover {
  background: rgba(255, 255, 255, 0.08) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
  transform: translateY(-4px);
}

.btn-border-subtle {
  border-color: rgba(255, 255, 255, 0.15) !important;
}

/* RESPONSIVE */
@media (max-width: 960px) {
  .chart-wrapper {
    height: 220px;
  }
  
  .chart-bars {
    padding: 15px 5px 30px;
  }
  
  .chart-bar {
    max-width: 40px;
  }
}

@media (max-width: 600px) {
  .stat-card {
    margin-bottom: 12px;
  }
  
  .quick-action-btn {
    height: 80px !important;
  }
}
</style>