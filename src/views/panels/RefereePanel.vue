<template>
  <div class="referee-panel">
    <!-- HEADER CON ESTADO DE CONEXIÓN -->
    <div class="referee-header">
      <v-container class="py-4">
        <div class="d-flex justify-space-between align-center flex-wrap gap-3">
          <div class="d-flex align-center">
            <v-avatar color="rgba(255, 255, 255, 0.08)" size="50" class="mr-3 elevation-3">
              <v-icon color="yellow-lighten-2" size="28">mdi-whistle</v-icon>
            </v-avatar>
            <div>
              <h1 class="text-h5 font-weight-bold text-white mb-0">Panel Arbitral</h1>
              <p class="text-caption text-grey-lighten-1 mb-0">Gestión de Partido</p>
            </div>
          </div>

          <!-- ESTADO DE CONEXIÓN - SUPERIOR DERECHA -->
          <div class="connection-status">
            <v-chip
              :color="isOnline ? 'success' : 'warning'"
              :prepend-icon="isOnline ? 'mdi-wifi' : 'mdi-wifi-off'"
              variant="flat"
              size="small"
              class="font-weight-bold"
            >
              {{ isOnline ? 'ONLINE' : 'OFFLINE' }}
            </v-chip>
            <v-btn
              icon="mdi-logout"
              variant="text"
              color="grey-lighten-1"
              class="ml-2"
              @click="handleLogout"
              size="small"
            >
              <v-icon>mdi-logout</v-icon>
              <v-tooltip activator="parent" location="bottom">Cerrar Sesión</v-tooltip>
            </v-btn>
          </div>
        </div>
      </v-container>
    </div>

    <!-- CONTENIDO PRINCIPAL -->
    <section class="referee-content py-8">
      <v-container>
        <v-row>
          <!-- COLUMNA PRINCIPAL -->
          <v-col cols="12" md="8">
            <!-- PARTIDO ACTUAL -->
            <v-card class="match-card pa-6 mb-6" elevation="0">
              <div class="d-flex align-center mb-5">
                <div class="icon-wrapper mr-3">
                  <v-icon color="green-lighten-2" size="32">mdi-soccer-field</v-icon>
                </div>
                <div>
                  <h2 class="text-h5 font-weight-bold text-white mb-0">Partido Actual</h2>
                  <p class="text-caption text-grey-lighten-1 mb-0">{{ matchData.homeTeam }} vs {{ matchData.awayTeam }}</p>
                </div>
              </div>

              <!-- MARCADOR -->
              <div class="score-container pa-6 mb-5">
                <v-row class="align-center">
                  <v-col cols="5" class="text-center">
                    <div class="team-shield mb-3">
                      <v-icon size="50" color="white">mdi-shield</v-icon>
                    </div>
                    <h3 class="text-h6 font-weight-bold text-white mb-2">{{ matchData.homeTeam }}</h3>
                    <div class="score-display">
                      <span class="text-h2 font-weight-black text-white">{{ matchData.homeScore }}</span>
                    </div>
                  </v-col>

                  <v-col cols="2" class="text-center">
                    <div class="vs-section">
                      <span class="text-h6 font-weight-bold text-grey-lighten-1">VS</span>
                      <div class="time-badge mt-3">
                        <v-icon size="16" color="white" class="mb-1">mdi-clock-outline</v-icon>
                        <div class="text-h6 font-weight-bold text-white">{{ matchData.currentTime }}'</div>
                      </div>
                    </div>
                  </v-col>

                  <v-col cols="5" class="text-center">
                    <div class="team-shield mb-3">
                      <v-icon size="50" color="white">mdi-shield</v-icon>
                    </div>
                    <h3 class="text-h6 font-weight-bold text-white mb-2">{{ matchData.awayTeam }}</h3>
                    <div class="score-display">
                      <span class="text-h2 font-weight-black text-white">{{ matchData.awayScore }}</span>
                    </div>
                  </v-col>
                </v-row>
              </div>

              <!-- ACCIONES RÁPIDAS -->
              <div class="actions-grid">
                <v-btn
                  block
                  color="green-darken-2"
                  variant="flat"
                  height="60"
                  @click="openDialog('gol')"
                  class="action-btn"
                >
                  <v-icon size="28" class="mr-2">mdi-soccer</v-icon>
                  Registrar Gol
                </v-btn>

                <v-btn
                  block
                  color="yellow-darken-3"
                  variant="flat"
                  height="60"
                  @click="openDialog('amarilla')"
                  class="action-btn"
                >
                  <v-icon size="28" class="mr-2">mdi-card</v-icon>
                  Tarjeta Amarilla
                </v-btn>

                <v-btn
                  block
                  color="red-darken-2"
                  variant="flat"
                  height="60"
                  @click="openDialog('roja')"
                  class="action-btn"
                >
                  <v-icon size="28" class="mr-2">mdi-card</v-icon>
                  Tarjeta Roja
                </v-btn>

                <v-btn
                  block
                  color="blue-grey-darken-2"
                  variant="flat"
                  height="60"
                  @click="openDialog('cambio')"
                  class="action-btn"
                >
                  <v-icon size="28" class="mr-2">mdi-swap-horizontal</v-icon>
                  Cambio
                </v-btn>
              </div>
            </v-card>

            <!-- EVENTOS DEL PARTIDO -->
            <v-card class="events-card pa-6" elevation="0">
              <div class="d-flex align-center mb-4">
                <v-icon color="blue-lighten-2" size="28" class="mr-3">mdi-history</v-icon>
                <h3 class="text-h6 font-weight-bold text-white mb-0">Eventos Registrados</h3>
              </div>

              <div v-if="events.length === 0" class="text-center py-8">
                <v-icon color="grey-darken-2" size="60" class="mb-3">mdi-calendar-blank</v-icon>
                <p class="text-body-2 text-grey-lighten-1">No hay eventos registrados</p>
              </div>

              <div v-else class="events-list">
                <div v-for="(event, i) in events" :key="i" class="event-item pa-4 mb-3">
                  <div class="d-flex justify-space-between align-center">
                    <div class="d-flex align-center">
                      <v-avatar :color="getEventColor(event.type)" size="36" class="mr-3">
                        <v-icon size="20" color="white">{{ getEventIcon(event.type) }}</v-icon>
                      </v-avatar>
                      <div>
                        <p class="text-body-1 font-weight-bold text-white mb-1">{{ event.description }}</p>
                        <p class="text-caption text-grey-lighten-1 mb-0">{{ event.team }} - Minuto {{ event.minute }}</p>
                      </div>
                    </div>
                    <v-chip :color="getEventColor(event.type)" size="small" variant="flat">
                      {{ event.minute }}'
                    </v-chip>
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- COLUMNA LATERAL -->
          <v-col cols="12" md="4">
            <!-- CONTROL DE TIEMPO -->
            <v-card class="time-card pa-6 mb-6" elevation="0">
              <div class="d-flex align-center mb-4">
                <v-icon color="purple-lighten-2" size="28" class="mr-3">mdi-timer</v-icon>
                <h3 class="text-h6 font-weight-bold text-white mb-0">Control</h3>
              </div>

              <div class="time-display-large mb-4">
                <span class="text-h1 font-weight-black text-white">{{ matchData.currentTime }}'</span>
              </div>

              <v-btn
                block
                :color="matchData.status === 'En Curso' ? 'warning' : 'success'"
                variant="flat"
                height="50"
                @click="toggleMatch"
                class="mb-3"
              >
                <v-icon class="mr-2">{{ matchData.status === 'En Curso' ? 'mdi-pause' : 'mdi-play' }}</v-icon>
                {{ matchData.status === 'En Curso' ? 'Pausar' : 'Iniciar' }}
              </v-btn>

              <v-btn
                block
                color="red-darken-2"
                variant="flat"
                height="50"
                @click="finishMatch"
              >
                <v-icon class="mr-2">mdi-flag-checkered</v-icon>
                Finalizar Partido
              </v-btn>
            </v-card>

            <!-- ESTADÍSTICAS -->
            <v-card class="stats-card pa-6" elevation="0">
              <div class="d-flex align-center mb-4">
                <v-icon color="orange-lighten-2" size="28" class="mr-3">mdi-chart-bar</v-icon>
                <h3 class="text-h6 font-weight-bold text-white mb-0">Estadísticas</h3>
              </div>

              <div class="stat-item mb-3">
                <span class="text-body-2 text-grey-lighten-1">Goles</span>
                <div class="d-flex align-center gap-2">
                  <span class="text-h6 font-weight-bold text-white">{{ matchData.homeScore }}</span>
                  <span class="text-caption text-grey">-</span>
                  <span class="text-h6 font-weight-bold text-white">{{ matchData.awayScore }}</span>
                </div>
              </div>
              <v-divider class="my-3 border-opacity-25"></v-divider>

              <div class="stat-item mb-3">
                <span class="text-body-2 text-grey-lighten-1">Tarjetas Amarillas</span>
                <div class="d-flex align-center gap-2">
                  <v-chip size="x-small" color="yellow-darken-3">{{ stats.yellowCards.home }}</v-chip>
                  <span class="text-caption text-grey">-</span>
                  <v-chip size="x-small" color="yellow-darken-3">{{ stats.yellowCards.away }}</v-chip>
                </div>
              </div>
              <v-divider class="my-3 border-opacity-25"></v-divider>

              <div class="stat-item">
                <span class="text-body-2 text-grey-lighten-1">Tarjetas Rojas</span>
                <div class="d-flex align-center gap-2">
                  <v-chip size="x-small" color="red-darken-2">{{ stats.redCards.home }}</v-chip>
                  <span class="text-caption text-grey">-</span>
                  <v-chip size="x-small" color="red-darken-2">{{ stats.redCards.away }}</v-chip>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- DIÁLOGO ÚNICO PARA TODAS LAS ACCIONES -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card class="dialog-card pa-6">
        <div class="d-flex align-center mb-4">
          <v-icon :color="dialogConfig.color" size="32" class="mr-3">{{ dialogConfig.icon }}</v-icon>
          <h3 class="text-h6 font-weight-bold text-white">{{ dialogConfig.title }}</h3>
        </div>

        <v-form @submit.prevent="saveEvent">
          <v-select
            v-model="form.team"
            :items="['Local', 'Visitante']"
            label="Equipo"
            variant="solo-filled"
            bg-color="rgba(255,255,255,0.06)"
            color="white"
            rounded="lg"
            class="mb-3"
            theme="dark"
          ></v-select>

          <v-text-field
            v-model="form.player"
            :label="dialogConfig.playerLabel"
            variant="solo-filled"
            bg-color="rgba(255,255,255,0.06)"
            color="white"
            rounded="lg"
            class="mb-3"
            theme="dark"
          ></v-text-field>

          <v-text-field
            v-model="form.minute"
            label="Minuto"
            type="number"
            variant="solo-filled"
            bg-color="rgba(255,255,255,0.06)"
            color="white"
            rounded="lg"
            class="mb-4"
            theme="dark"
          ></v-text-field>

          <div class="d-flex gap-2">
            <v-btn color="grey-darken-2" variant="flat" @click="dialog = false" block>
              Cancelar
            </v-btn>
            <v-btn :color="dialogConfig.btnColor" variant="flat" type="submit" :loading="saving" block>
              Registrar
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../../services/supabase';
import { useDataSync } from '../../composables/useDataSync';

const router = useRouter();
const { guardarDato, isOnline } = useDataSync();

// Estado del partido
const matchData = ref({
  homeTeam: 'Los Tigres',
  awayTeam: 'Águilas FC',
  homeScore: 0,
  awayScore: 0,
  currentTime: 0,
  status: 'Pausado'
});

// Estadísticas
const stats = ref({
  yellowCards: { home: 0, away: 0 },
  redCards: { home: 0, away: 0 }
});

// Eventos registrados
const events = ref([]);

// Diálogo
const dialog = ref(false);
const saving = ref(false);
const currentAction = ref('');

const form = ref({
  team: '',
  player: '',
  minute: ''
});

// Configuración del diálogo según la acción
const dialogConfig = computed(() => {
  const configs = {
    gol: {
      title: 'Registrar Gol',
      icon: 'mdi-soccer',
      color: 'green-lighten-2',
      btnColor: 'green-darken-2',
      playerLabel: 'Jugador que anota'
    },
    amarilla: {
      title: 'Tarjeta Amarilla',
      icon: 'mdi-card',
      color: 'yellow-darken-3',
      btnColor: 'yellow-darken-3',
      playerLabel: 'Jugador sancionado'
    },
    roja: {
      title: 'Tarjeta Roja',
      icon: 'mdi-card',
      color: 'red-darken-2',
      btnColor: 'red-darken-2',
      playerLabel: 'Jugador expulsado'
    },
    cambio: {
      title: 'Cambio de Jugador',
      icon: 'mdi-swap-horizontal',
      color: 'blue-lighten-2',
      btnColor: 'blue-darken-2',
      playerLabel: 'Sale / Entra'
    }
  };
  return configs[currentAction.value] || configs.gol;
});

// Abrir diálogo
const openDialog = (action) => {
  currentAction.value = action;
  form.value = { team: '', player: '', minute: matchData.value.currentTime.toString() };
  dialog.value = true;
};

// Guardar evento
const saveEvent = async () => {
  saving.value = true;
  try {
    const eventData = {
      type: currentAction.value,
      team: form.value.team,
      player: form.value.player,
      minute: parseInt(form.value.minute),
      description: `${currentAction.value} - ${form.value.player}`
    };

    await guardarDato('match_events', eventData);

    // Actualizar marcadores o estadísticas
    if (currentAction.value === 'gol') {
      if (form.value.team === 'Local') {
        matchData.value.homeScore++;
      } else {
        matchData.value.awayScore++;
      }
    } else if (currentAction.value === 'amarilla') {
      const key = form.value.team === 'Local' ? 'home' : 'away';
      stats.value.yellowCards[key]++;
    } else if (currentAction.value === 'roja') {
      const key = form.value.team === 'Local' ? 'home' : 'away';
      stats.value.redCards[key]++;
    }

    // Agregar a la lista de eventos
    events.value.unshift({
      type: currentAction.value,
      team: form.value.team,
      description: `${form.value.player}`,
      minute: parseInt(form.value.minute)
    });

    dialog.value = false;

    if (!isOnline.value) {
      alert('📡 Offline: Evento guardado localmente.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al registrar el evento');
  } finally {
    saving.value = false;
  }
};

// Control del partido
const toggleMatch = () => {
  if (matchData.value.status === 'En Curso') {
    matchData.value.status = 'Pausado';
  } else {
    matchData.value.status = 'En Curso';
  }
};

const finishMatch = () => {
  if (confirm('¿Finalizar el partido?')) {
    matchData.value.status = 'Finalizado';
    alert(`Partido finalizado: ${matchData.value.homeScore} - ${matchData.value.awayScore}`);
  }
};

// Funciones auxiliares
const getEventColor = (type) => {
  const colors = {
    gol: 'green-darken-2',
    amarilla: 'yellow-darken-3',
    roja: 'red-darken-2',
    cambio: 'blue-grey-darken-2'
  };
  return colors[type] || 'grey-darken-2';
};

const getEventIcon = (type) => {
  const icons = {
    gol: 'mdi-soccer',
    amarilla: 'mdi-card',
    roja: 'mdi-card',
    cambio: 'mdi-swap-horizontal'
  };
  return icons[type] || 'mdi-circle';
};

// Logout
const handleLogout = async () => {
  localStorage.removeItem('user_role');
  localStorage.removeItem('offline_auth');
  await supabase.auth.signOut();
  router.push('/login');
};
</script>

<style scoped>
.referee-panel {
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
}

/* HEADER */
.referee-header {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}

.connection-status {
  display: flex;
  align-items: center;
}

/* CONTENIDO */
.referee-content {
  background: transparent;
}

/* CARDS */
.match-card,
.events-card,
.time-card,
.stats-card {
  background: rgba(255, 255, 255, 0.04) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px !important;
  transition: all 0.3s ease;
}

.match-card:hover,
.events-card:hover,
.time-card:hover,
.stats-card:hover {
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

/* ICONOS */
.icon-wrapper {
  background: rgba(255, 255, 255, 0.08);
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

/* MARCADOR */
.score-container {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
}

.team-shield {
  background: rgba(255, 255, 255, 0.1);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.team-shield:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.05);
}

.score-display {
  background: rgba(0, 0, 0, 0.3);
  padding: 12px 20px;
  border-radius: 12px;
  display: inline-block;
}

.vs-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time-badge {
  background: rgba(0, 0, 0, 0.3);
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* ACCIONES */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.action-btn {
  text-transform: none !important;
  font-weight: 600;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

/* EVENTOS */
.events-list {
  max-height: 500px;
  overflow-y: auto;
}

.event-item {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.event-item:hover {
  background: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

/* TIEMPO */
.time-display-large {
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
  padding: 24px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* ESTADÍSTICAS */
.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* DIÁLOGO */
.dialog-card {
  background: #1a1a1a !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px !important;
}

.dialog-card :deep(.v-field) {
  border-radius: 12px !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* RESPONSIVE */
@media (max-width: 960px) {
  .connection-status {
    margin-top: 12px;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .team-shield {
    width: 60px;
    height: 60px;
  }
  
  .score-display span {
    font-size: 2rem !important;
  }
}

/* UTILIDADES */
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
</style>