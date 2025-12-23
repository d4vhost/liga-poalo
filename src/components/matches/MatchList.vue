<template>
  <div class="matches-container">
    <!-- HEADER CON FILTROS -->
    <v-card class="filter-card pa-4 mb-5" elevation="0">
      <div class="d-flex flex-wrap align-center justify-space-between gap-3">
        <div class="d-flex align-center">
          <v-icon color="grey-lighten-1" size="24" class="mr-2">mdi-soccer-field</v-icon>
          <h3 class="text-h6 text-white font-weight-bold mb-0">
            Próximos Encuentros
          </h3>
        </div>
        
        <div class="d-flex gap-2 flex-wrap">
          <v-chip
            v-for="filter in filters"
            :key="filter.value"
            :color="activeFilter === filter.value ? 'grey-darken-1' : 'transparent'"
            :variant="activeFilter === filter.value ? 'flat' : 'outlined'"
            @click="activeFilter = filter.value"
            class="filter-chip"
            size="small"
          >
            {{ filter.label }}
          </v-chip>
        </div>
      </div>
    </v-card>

    <!-- LISTA DE PARTIDOS -->
    <div class="matches-grid">
      <v-card 
        v-for="(match, i) in matches" 
        :key="i"
        class="match-card-enhanced"
        elevation="0"
        @click="viewMatchDetails(match)"
      >
        <!-- Badge de estado -->
        <div class="match-status-badge" :class="getStatusClass(match.status)">
          <v-icon size="14" class="mr-1">{{ getStatusIcon(match.status) }}</v-icon>
          <span class="text-caption font-weight-bold">{{ match.status }}</span>
        </div>

        <!-- Contenido principal del partido -->
        <div class="match-content pa-5">
          <!-- EQUIPOS -->
          <div class="teams-section mb-4">
            <div class="team-block">
              <div class="team-shield-wrapper mb-2">
                <v-icon size="50" color="white">mdi-shield</v-icon>
              </div>
              <h4 class="text-h6 font-weight-bold text-white text-center">{{ match.home }}</h4>
              <p class="text-caption text-grey-lighten-1 text-center mb-0">Local</p>
            </div>

            <div class="vs-section">
              <div class="vs-circle">
                <span class="text-h6 font-weight-black text-white">VS</span>
              </div>
              <div class="match-time mt-2">
                <v-icon size="16" color="grey-lighten-1" class="mr-1">mdi-clock-outline</v-icon>
                <span class="text-body-2 text-white font-weight-medium">{{ match.time }}</span>
              </div>
            </div>

            <div class="team-block">
              <div class="team-shield-wrapper mb-2">
                <v-icon size="50" color="white">mdi-shield</v-icon>
              </div>
              <h4 class="text-h6 font-weight-bold text-white text-center">{{ match.away }}</h4>
              <p class="text-caption text-grey-lighten-1 text-center mb-0">Visitante</p>
            </div>
          </div>

          <v-divider class="border-opacity-10 mb-4"></v-divider>
          
          <!-- INFORMACIÓN ADICIONAL -->
          <div class="match-info-grid">
            <div class="info-item">
              <v-icon size="18" color="grey-lighten-1" class="mr-2">mdi-calendar</v-icon>
              <span class="text-body-2 text-grey-lighten-2">{{ match.date }}</span>
            </div>
            
            <div class="info-item">
              <v-icon size="18" color="grey-lighten-1" class="mr-2">mdi-map-marker</v-icon>
              <span class="text-body-2 text-grey-lighten-2">{{ match.location }}</span>
            </div>
          </div>

          <!-- BOTÓN DE ACCIÓN -->
          <v-btn 
            block
            class="mt-4 details-btn" 
            rounded="pill"
            append-icon="mdi-arrow-right"
            height="42"
          >
            Ver Detalles
          </v-btn>
        </div>

        <!-- Efecto de brillo al hover -->
        <div class="hover-glow"></div>
      </v-card>
    </div>

    <!-- MENSAJE SI NO HAY PARTIDOS -->
    <v-card 
      v-if="matches.length === 0"
      class="empty-state pa-8 text-center"
      elevation="0"
    >
      <v-icon size="80" color="grey-darken-1" class="mb-4">mdi-calendar-remove</v-icon>
      <h3 class="text-h6 text-grey-lighten-1 mb-2">No hay partidos programados</h3>
      <p class="text-body-2 text-grey">Revisa más adelante para ver nuevos encuentros</p>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const activeFilter = ref('todos');

const filters = ref([
  { label: 'Todos', value: 'todos' },
  { label: 'Hoy', value: 'hoy' },
  { label: 'Esta Semana', value: 'semana' },
  { label: 'Próximos', value: 'proximos' }
]);

const matches = ref([
  { 
    home: 'Los Tigres', 
    away: 'Águilas FC', 
    time: '14:00', 
    date: '23 Diciembre 2025',
    location: 'Estadio Central',
    status: 'Confirmado'
  },
  { 
    home: 'Real Poaló', 
    away: 'Dep. Sur', 
    time: '16:00', 
    date: '23 Diciembre 2025',
    location: 'Cancha 2',
    status: 'Confirmado'
  },
  { 
    home: 'Huracán', 
    away: 'LDU Poaló', 
    time: '10:00', 
    date: '24 Diciembre 2025',
    location: 'Estadio Central',
    status: 'Próximo'
  },
  { 
    home: 'Unidos FC', 
    away: 'Los Leones', 
    time: '15:30', 
    date: '25 Diciembre 2025',
    location: 'Cancha Municipal',
    status: 'Próximo'
  },
  { 
    home: 'Atlético SP', 
    away: 'Deportivo Cóndor', 
    time: '11:00', 
    date: '26 Diciembre 2025',
    location: 'Estadio Central',
    status: 'Próximo'
  },
  { 
    home: 'Deportivo Norte', 
    away: 'San José FC', 
    time: '17:00', 
    date: '27 Diciembre 2025',
    location: 'Cancha 2',
    status: 'Próximo'
  }
]);

const getStatusClass = (status) => {
  const classes = {
    'Confirmado': 'status-confirmed',
    'Próximo': 'status-upcoming',
    'En Vivo': 'status-live',
    'Finalizado': 'status-finished'
  };
  return classes[status] || 'status-default';
};

const getStatusIcon = (status) => {
  const icons = {
    'Confirmado': 'mdi-check-circle',
    'Próximo': 'mdi-clock-outline',
    'En Vivo': 'mdi-circle',
    'Finalizado': 'mdi-flag-checkered'
  };
  return icons[status] || 'mdi-information';
};

const viewMatchDetails = (match) => {
  console.log('Ver detalles de:', match);
};
</script>

<style scoped>
.matches-container {
  width: 100%;
}

/* CARD DE FILTROS */
.filter-card {
  background: rgba(255, 255, 255, 0.04) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px !important;
}

.filter-chip {
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border-color: rgba(255, 255, 255, 0.2);
}

.filter-chip:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.4);
}

/* GRID DE PARTIDOS */
.matches-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
}

@media (min-width: 1280px) {
  .matches-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* CARD DE PARTIDO MEJORADA */
.match-card-enhanced {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.match-card-enhanced::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.match-card-enhanced:hover {
  transform: translateY(-8px);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 0 30px rgba(0, 0, 0, 0.2);
}

.match-card-enhanced:hover::before {
  opacity: 1;
}

.hover-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.match-card-enhanced:hover .hover-glow {
  opacity: 1;
}

/* BADGE DE ESTADO */
.match-status-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  z-index: 2;
  backdrop-filter: blur(10px);
}

.status-confirmed {
  background: rgba(34, 197, 94, 0.2);
  border: 1px solid rgba(34, 197, 94, 0.4);
  color: #86efac;
}

.status-upcoming {
  background: rgba(251, 146, 60, 0.2);
  border: 1px solid rgba(251, 146, 60, 0.4);
  color: #fdba74;
}

.status-live {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #fca5a5;
  animation: pulse 2s infinite;
}

.status-finished {
  background: rgba(156, 163, 175, 0.2);
  border: 1px solid rgba(156, 163, 175, 0.4);
  color: #d1d5db;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* CONTENIDO DEL PARTIDO */
.match-content {
  position: relative;
  z-index: 1;
}

.teams-section {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 16px;
  align-items: center;
}

.team-block {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.team-shield-wrapper {
  background: rgba(255, 255, 255, 0.05);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.match-card-enhanced:hover .team-shield-wrapper {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.vs-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.vs-circle {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.match-card-enhanced:hover .vs-circle {
  transform: scale(1.1) rotate(180deg);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
}

.match-time {
  background: rgba(0, 0, 0, 0.3);
  padding: 4px 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.match-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.info-item {
  background: rgba(0, 0, 0, 0.2);
  padding: 10px 14px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.details-btn {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: white !important;
  font-weight: 600 !important;
  transition: all 0.3s ease;
}

.details-btn:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
  transform: translateY(-2px);
}

/* ESTADO VACÍO */
.empty-state {
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px !important;
}

.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }

/* RESPONSIVE */
@media (max-width: 600px) {
  .teams-section {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .vs-section {
    order: -1;
  }
  
  .team-shield-wrapper {
    width: 70px;
    height: 70px;
  }
  
  .filter-card {
    padding: 16px !important;
  }
  
  .match-content {
    padding: 20px !important;
  }
}
</style>