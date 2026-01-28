<template>
  <v-container fluid>
    <!-- HEADER DEL DASHBOARD -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="dashboard-header">
          <div>
            <h1 class="text-h3 font-weight-bold mb-2">Panel de Control</h1>
            <p class="text-h6 text-grey-darken-1">Administración de Liga San José de Poaló</p>
          </div>
          <v-chip color="success" variant="flat" prepend-icon="mdi-check-circle" size="large">
            Sistema Activo
          </v-chip>
        </div>
      </v-col>
    </v-row>

    <!-- TARJETAS DE ESTADÍSTICAS -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" lg="3" v-for="(stat, i) in stats" :key="i">
        <v-card class="stat-card" :class="`stat-card-${stat.color}`" elevation="2" hover>
          <v-card-text class="pa-6">
            <div class="d-flex justify-space-between align-center mb-4">
              <div class="stat-icon" :class="`bg-${stat.color}`">
                <v-icon :icon="stat.icon" size="32" color="white"></v-icon>
              </div>
              <v-chip :color="stat.color" size="small" variant="flat">
                {{ stat.change }}
              </v-chip>
            </div>
            <h3 class="text-h4 font-weight-bold mb-1">{{ stat.value }}</h3>
            <p class="text-body-2 text-grey-darken-1 mb-0">{{ stat.label }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- ACCESOS RÁPIDOS -->
    <v-row class="mb-6">
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold mb-4">Accesos Rápidos</h2>
      </v-col>
      
      <v-col cols="12" sm="6" lg="3" v-for="(action, i) in quickActions" :key="i">
        <v-card 
          class="action-card" 
          elevation="2" 
          hover
          :to="action.route"
        >
          <v-card-text class="pa-6 text-center">
            <div class="action-icon mb-4" :class="`bg-${action.color}-lighten-5`">
              <v-icon :icon="action.icon" :color="action.color" size="48"></v-icon>
            </div>
            <h4 class="text-h6 font-weight-bold mb-2">{{ action.title }}</h4>
            <p class="text-body-2 text-grey-darken-1">{{ action.description }}</p>
          </v-card-text>
          <v-card-actions class="px-6 pb-4">
            <v-btn 
              :color="action.color" 
              variant="flat" 
              block
              append-icon="mdi-arrow-right"
            >
              Ir a {{ action.title }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- ACTIVIDAD RECIENTE -->
    <v-row>
      <v-col cols="12" lg="8">
        <v-card elevation="2" class="activity-card">
          <v-card-title class="d-flex align-center py-4 px-6 bg-grey-lighten-5">
            <v-icon class="mr-2" color="primary">mdi-history</v-icon>
            <span class="text-h6 font-weight-bold">Actividad Reciente</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-0">
            <v-list lines="three">
              <v-list-item
                v-for="(activity, i) in recentActivities"
                :key="i"
                :prepend-icon="activity.icon"
                :title="activity.title"
                :subtitle="activity.description"
              >
                <template v-slot:append>
                  <div class="text-caption text-grey">{{ activity.time }}</div>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="px-6 py-3">
            <v-btn variant="text" color="primary">
              Ver todo el historial
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- PRÓXIMOS EVENTOS -->
      <v-col cols="12" lg="4">
        <v-card elevation="2" class="events-card">
          <v-card-title class="d-flex align-center py-4 px-6 bg-grey-lighten-5">
            <v-icon class="mr-2" color="orange">mdi-calendar-star</v-icon>
            <span class="text-h6 font-weight-bold">Próximos Eventos</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-4">
            <div v-for="(event, i) in upcomingEvents" :key="i" class="event-item mb-4">
              <div class="d-flex align-center mb-2">
                <v-chip :color="event.color" size="small" class="mr-2">
                  {{ event.date }}
                </v-chip>
                <span class="text-caption text-grey">{{ event.time }}</span>
              </div>
              <h5 class="text-body-1 font-weight-bold mb-1">{{ event.title }}</h5>
              <p class="text-caption text-grey-darken-1 mb-0">{{ event.location }}</p>
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="px-4 py-3">
            <v-btn variant="text" color="orange" block>
              Ver calendario completo
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const stats = ref([
  {
    icon: 'mdi-soccer',
    value: '24',
    label: 'Partidos Programados',
    color: 'blue',
    change: '+3 esta semana'
  },
  {
    icon: 'mdi-account-group',
    value: '156',
    label: 'Jugadores Activos',
    color: 'green',
    change: '+8 nuevos'
  },
  {
    icon: 'mdi-shield-star',
    value: '12',
    label: 'Equipos Registrados',
    color: 'orange',
    change: 'Sin cambios'
  },
  {
    icon: 'mdi-trophy',
    value: '3',
    label: 'Torneos Activos',
    color: 'purple',
    change: 'En progreso'
  }
])

const quickActions = ref([
  {
    icon: 'mdi-file-document-plus',
    title: 'Programar Partidos',
    description: 'Crear nuevas actas de juego e imprimir',
    color: 'blue',
    route: { name: 'admin-matches' }
  },
  {
    icon: 'mdi-account-multiple-plus',
    title: 'Gestionar Jugadores',
    description: 'Registrar y administrar jugadores',
    color: 'green',
    route: '#'
  },
  {
    icon: 'mdi-scoreboard',
    title: 'Resultados',
    description: 'Actualizar marcadores y estadísticas',
    color: 'orange',
    route: '#'
  },
  {
    icon: 'mdi-table-edit',
    title: 'Tabla de Posiciones',
    description: 'Ver y editar clasificación',
    color: 'purple',
    route: '#'
  }
])

const recentActivities = ref([
  {
    icon: 'mdi-file-document-check',
    title: 'Acta de partido creada',
    description: 'Partido: Los Tigres vs Águilas FC - Copa Evolución 2025',
    time: 'Hace 2 horas'
  },
  {
    icon: 'mdi-account-plus',
    title: 'Nuevo jugador registrado',
    description: 'Juan Pérez se unió al equipo Real Poaló',
    time: 'Hace 5 horas'
  },
  {
    icon: 'mdi-trophy-variant',
    title: 'Resultado actualizado',
    description: 'Unidos FC 3 - 1 Los Leones (Finalizado)',
    time: 'Ayer'
  },
  {
    icon: 'mdi-calendar-check',
    title: 'Partido programado',
    description: 'Huracán vs LDU Poaló - 24 Enero 2025',
    time: 'Hace 2 días'
  }
])

const upcomingEvents = ref([
  {
    date: 'Hoy',
    time: '14:00',
    title: 'Los Tigres vs Águilas FC',
    location: 'Estadio Central',
    color: 'red'
  },
  {
    date: 'Mañana',
    time: '16:00',
    title: 'Real Poaló vs Dep. Sur',
    location: 'Cancha 2',
    color: 'orange'
  },
  {
    date: '24 Ene',
    time: '10:00',
    title: 'Huracán vs LDU Poaló',
    location: 'Estadio Central',
    color: 'blue'
  },
  {
    date: '25 Ene',
    time: '15:30',
    title: 'Unidos FC vs Los Leones',
    location: 'Cancha Municipal',
    color: 'green'
  }
])
</script>

<style scoped>
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
}

.dashboard-header h1,
.dashboard-header p {
  color: white !important;
}

/* TARJETAS DE ESTADÍSTICAS */
.stat-card {
  border-radius: 12px !important;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.stat-card-blue {
  border-left-color: #2196F3;
}

.stat-card-green {
  border-left-color: #4CAF50;
}

.stat-card-orange {
  border-left-color: #FF9800;
}

.stat-card-purple {
  border-left-color: #9C27B0;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-blue {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
}

.bg-green {
  background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
}

.bg-orange {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
}

.bg-purple {
  background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%);
}

/* TARJETAS DE ACCIONES RÁPIDAS */
.action-card {
  border-radius: 12px !important;
  transition: all 0.3s ease;
  cursor: pointer;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0,0,0,0.15) !important;
}

.action-icon {
  width: 96px;
  height: 96px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.bg-blue-lighten-5 {
  background: #E3F2FD;
}

.bg-green-lighten-5 {
  background: #E8F5E9;
}

.bg-orange-lighten-5 {
  background: #FFF3E0;
}

.bg-purple-lighten-5 {
  background: #F3E5F5;
}

/* TARJETAS DE ACTIVIDAD Y EVENTOS */
.activity-card,
.events-card {
  border-radius: 12px !important;
  height: 100%;
}

.event-item {
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.event-item:hover {
  background: #eeeeee;
  transform: translateX(4px);
}

.event-item:last-child {
  margin-bottom: 0 !important;
}

/* RESPONSIVE */
@media (max-width: 960px) {
  .dashboard-header {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .dashboard-header h1 {
    font-size: 1.75rem !important;
  }
}
</style>