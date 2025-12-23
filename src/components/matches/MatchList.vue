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

    <!-- GRID DE PARTIDOS 2x2 -->
    <div class="matches-grid">
      <v-card 
        v-for="(match, i) in matches" 
        :key="i"
        class="match-card"
        elevation="2"
      >
        <!-- Badge de estado - SOLO EN LA PARTE SUPERIOR -->
        <div class="match-status-badge" :class="getStatusClass(match.status)">
          <v-icon size="12" class="mr-1">{{ getStatusIcon(match.status) }}</v-icon>
          <span class="status-text">{{ match.status }}</span>
        </div>

        <!-- Contenido principal del partido - EN LA PARTE INFERIOR -->
        <v-card-text class="pa-4 pt-10 mt-auto d-flex flex-column justify-end" style="flex: 1;">
          <!-- EQUIPOS EN FORMATO HORIZONTAL -->
          <v-row class="align-center mb-2">
            <!-- EQUIPO LOCAL -->
            <v-col cols="5" class="text-center pa-1">
              <div class="team-container">
                <div class="team-shield mb-2">
                  <v-icon size="42" color="white">mdi-shield</v-icon>
                </div>
                <h5 class="text-body-1 font-weight-bold text-white mb-1 text-truncate">{{ match.home }}</h5>
                <v-chip size="x-small" color="blue-grey-darken-2" class="text-caption chip-label">Local</v-chip>
              </div>
            </v-col>

            <!-- VS CENTRAL -->
            <v-col cols="2" class="text-center pa-1">
              <div class="vs-container">
                <div class="vs-circle mx-auto mb-2">
                  <span class="text-body-1 font-weight-black text-white">VS</span>
                </div>
                <div class="match-time-badge">
                  <v-icon size="12" color="white" class="mr-1">mdi-clock-outline</v-icon>
                  <span class="text-caption text-white font-weight-bold">{{ match.time }}</span>
                </div>
              </div>
            </v-col>

            <!-- EQUIPO VISITANTE -->
            <v-col cols="5" class="text-center pa-1">
              <div class="team-container">
                <div class="team-shield mb-2">
                  <v-icon size="42" color="white">mdi-shield</v-icon>
                </div>
                <h5 class="text-body-1 font-weight-bold text-white mb-1 text-truncate">{{ match.away }}</h5>
                <v-chip size="x-small" color="blue-grey-darken-2" class="text-caption chip-label">Visitante</v-chip>
              </div>
            </v-col>
          </v-row>

          <v-divider class="border-opacity-25 my-2"></v-divider>
          
          <!-- INFORMACIÓN ADICIONAL - EN UNA SOLA FILA -->
          <div class="match-details-row-inline mb-2">
            <div class="detail-item-inline">
              <v-icon size="16" color="grey-lighten-2" class="mr-1">mdi-calendar</v-icon>
              <span class="text-caption text-grey-lighten-2">{{ formatDate(match.date) }}</span>
            </div>
            
            <div class="detail-item-inline">
              <v-icon size="16" color="grey-lighten-2" class="mr-1">mdi-map-marker</v-icon>
              <span class="text-caption text-grey-lighten-2">{{ match.location }}</span>
            </div>
          </div>

          <!-- BOTÓN DE ACCIÓN -->
          <v-btn 
            block
            class="mt-2 details-btn" 
            rounded="pill"
            append-icon="mdi-arrow-right"
            height="38"
            color="blue-grey-darken-2"
            variant="flat"
            @click="viewMatchDetails(match)"
          >
            <span class="text-caption font-weight-medium">Ver Detalles</span>
          </v-btn>
        </v-card-text>
      </v-card>
    </div>

    <!-- MENSAJE SI NO HAY PARTIDOS -->
    <v-card 
      v-if="matches.length === 0"
      class="empty-state pa-8 text-center"
      elevation="2"
    >
      <v-icon size="80" color="grey-darken-2" class="mb-4">mdi-calendar-remove</v-icon>
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
  }
]);

// Formatear fecha como "Jue, Diciembre 23"
const formatDate = (dateString) => {
  const parts = dateString.split(' ');
  const day = parts[0];
  const month = parts[1];
  const year = parts[2];
  
  const date = new Date(`${month} ${day}, ${year}`);
  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const diaSemana = diasSemana[date.getDay()];
  
  return `${diaSemana}, ${month} ${day}`;
};

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
  background: rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px !important;
}

.filter-chip {
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border-color: rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.7) !important;
}

.filter-chip:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.5);
  color: white !important;
}

/* GRID DE PARTIDOS 2x2 - MÁS ANCHO */
.matches-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 26px;
}

/* CARD DE PARTIDO - MENOS ALTO */
.match-card {
  background: rgba(255, 255, 255, 0.12) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 18px !important;
  transition: all 0.3s ease;
  position: relative;
  overflow: visible;
  min-height: 310px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.match-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4) !important;
}

/* BADGE DE ESTADO - FIJO EN LA PARTE SUPERIOR */
.match-status-badge {
  position: absolute;
  top: 14px;
  right: 14px;
  padding: 5px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  z-index: 3;
  backdrop-filter: blur(10px);
}

.status-text {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.status-confirmed {
  background: rgba(34, 197, 94, 0.25);
  border: 1px solid rgba(34, 197, 94, 0.5);
  color: #86efac;
}

.status-upcoming {
  background: rgba(251, 146, 60, 0.25);
  border: 1px solid rgba(251, 146, 60, 0.5);
  color: #fdba74;
}

.status-live {
  background: rgba(239, 68, 68, 0.25);
  border: 1px solid rgba(239, 68, 68, 0.5);
  color: #fca5a5;
  animation: pulse 2s infinite;
}

.status-finished {
  background: rgba(156, 163, 175, 0.25);
  border: 1px solid rgba(156, 163, 175, 0.5);
  color: #d1d5db;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* CONTENEDORES DE EQUIPOS */
.team-container {
  padding: 4px;
}

.team-shield {
  background: rgba(255, 255, 255, 0.1);
  width: 62px;
  height: 62px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.match-card:hover .team-shield {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* VS CENTRAL */
.vs-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.vs-circle {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.25);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.match-card:hover .vs-circle {
  transform: rotate(180deg) scale(1.05);
  border-color: rgba(255, 255, 255, 0.4);
}

.match-time-badge {
  background: rgba(0, 0, 0, 0.4);
  padding: 3px 8px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

/* ALINEAR HORA CON LOCAL/VISITANTE */
.chip-label {
  min-height: 20px;
}

/* DETALLES DEL PARTIDO - EN UNA SOLA FILA HORIZONTAL */
.match-details-row-inline {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: rgba(0, 0, 0, 0.2);
  padding: 8px 12px;
  border-radius: 10px;
  flex-wrap: wrap;
}

.detail-item-inline {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}

/* BOTÓN DE DETALLES - MÁS DELGADO */
.details-btn {
  font-weight: 500 !important;
  letter-spacing: 0.3px;
  text-transform: none !important;
}

/* ESTADO VACÍO */
.empty-state {
  background: rgba(255, 255, 255, 0.08) !important;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px !important;
}

.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }

/* RESPONSIVE */
@media (max-width: 960px) {
  .matches-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .matches-grid {
    grid-template-columns: 1fr;
  }
  
  .team-shield {
    width: 55px;
    height: 55px;
  }
  
  .vs-circle {
    width: 44px;
    height: 44px;
  }
  
  .match-details-row-inline {
    flex-direction: column;
    gap: 8px;
  }
  
  .match-card {
    min-height: auto;
  }
}
</style>