<template>
  <div class="referee-panel">
    <!-- HERO SECTION CON IMAGEN DE ÁRBITRO -->
    <div class="hero-referee position-relative">
      <v-img
        src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1993&auto=format&fit=crop"
        cover
        class="hero-image"
      >
        <div class="hero-overlay"></div>
      </v-img>
      
      <v-container class="hero-content">
        <!-- HEADER CON ESTADO DE CONEXIÓN -->
        <div class="d-flex justify-space-between align-center mb-8 flex-wrap">
          <div class="d-flex align-center">
            <v-avatar color="rgba(255, 255, 255, 0.08)" size="60" class="mr-4 elevation-3">
              <v-icon color="yellow-lighten-2" size="36">mdi-whistle</v-icon>
            </v-avatar>
            <div>
              <h1 class="text-h4 font-weight-black text-white text-uppercase mb-1" style="letter-spacing: 1px;">Panel Arbitral</h1>
              <p class="text-body-2 text-grey-lighten-2 mb-0">Gestión del Partido en Tiempo Real</p>
            </div>
          </div>

          <!-- ESTADO DE CONEXIÓN - SUPERIOR DERECHA -->
          <div class="connection-status">
            <v-chip
              :color="isOnline ? 'success' : 'warning'"
              :prepend-icon="isOnline ? 'mdi-wifi' : 'mdi-wifi-off'"
              variant="flat"
              size="default"
              class="font-weight-bold mr-3"
            >
              {{ isOnline ? 'ONLINE' : 'OFFLINE' }}
            </v-chip>
            <v-btn
              icon
              variant="text"
              color="white"
              @click="handleLogout"
              size="default"
            >
              <v-icon>mdi-logout</v-icon>
              <v-tooltip activator="parent" location="bottom">Cerrar Sesión</v-tooltip>
            </v-btn>
          </div>
        </div>

        <!-- MARCADOR DEL PARTIDO -->
        <v-card class="match-score-card pa-8 mb-6" elevation="0">
          <v-row class="align-center">
            <!-- EQUIPO LOCAL -->
            <v-col cols="12" md="5" class="text-center">
              <div class="team-section">
                <div class="team-shield-large mb-4">
                  <v-icon size="70" color="white">mdi-shield</v-icon>
                </div>
                <h2 class="text-h4 font-weight-black text-white mb-2">{{ matchData.homeTeam }}</h2>
                <v-chip color="blue-grey-darken-2" size="small" class="mb-3">LOCAL</v-chip>
                <div class="score-box">
                  <span class="text-h1 font-weight-black text-white">{{ matchData.homeScore }}</span>
                </div>
              </div>
            </v-col>

            <!-- VS CENTRAL -->
            <v-col cols="12" md="2" class="text-center">
              <div class="vs-section">
                <div class="time-circle mb-4">
                  <v-icon color="grey-lighten-1" size="24" class="mb-2">mdi-clock-outline</v-icon>
                  <div class="text-h3 font-weight-black text-white">{{ matchData.currentTime }}'</div>
                </div>
                <div class="vs-badge">
                  <span class="text-h5 font-weight-black text-white">VS</span>
                </div>
                <v-chip 
                  :color="matchData.status === 'En Curso' ? 'success' : 'grey-darken-2'" 
                  class="mt-4"
                  size="small"
                >
                  <v-icon size="12" class="mr-1">{{ matchData.status === 'En Curso' ? 'mdi-circle' : 'mdi-pause-circle' }}</v-icon>
                  {{ matchData.status }}
                </v-chip>
              </div>
            </v-col>

            <!-- EQUIPO VISITANTE -->
            <v-col cols="12" md="5" class="text-center">
              <div class="team-section">
                <div class="team-shield-large mb-4">
                  <v-icon size="70" color="white">mdi-shield</v-icon>
                </div>
                <h2 class="text-h4 font-weight-black text-white mb-2">{{ matchData.awayTeam }}</h2>
                <v-chip color="blue-grey-darken-2" size="small" class="mb-3">VISITANTE</v-chip>
                <div class="score-box">
                  <span class="text-h1 font-weight-black text-white">{{ matchData.awayScore }}</span>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-container>

      <div class="hero-gradient"></div>
    </div>

    <!-- SECCIÓN DE ACCIONES Y CONTROL -->
    <section class="actions-section py-12">
      <v-container>
        <v-row>
          <!-- ACCIONES RÁPIDAS -->
          <v-col cols="12" lg="8">
            <v-card class="actions-card pa-8 mb-6" elevation="0">
              <h3 class="text-h5 font-weight-bold text-white mb-6">Acciones del Partido</h3>
              
              <v-row>
                <v-col cols="12" sm="6" md="3">
                  <v-btn
                    block
                    color="green-darken-2"
                    variant="flat"
                    height="100"
                    @click="openActionDialog('gol')"
                    class="action-btn-large"
                  >
                    <div class="d-flex flex-column align-center">
                      <v-icon size="48" class="mb-2">mdi-soccer</v-icon>
                      <span class="text-body-1 font-weight-bold">Registrar Gol</span>
                    </div>
                  </v-btn>
                </v-col>

                <v-col cols="12" sm="6" md="3">
                  <v-btn
                    block
                    color="yellow-darken-3"
                    variant="flat"
                    height="100"
                    @click="openActionDialog('amarilla')"
                    class="action-btn-large"
                  >
                    <div class="d-flex flex-column align-center">
                      <v-icon size="48" class="mb-2">mdi-card</v-icon>
                      <span class="text-body-1 font-weight-bold">Tarjeta Amarilla</span>
                    </div>
                  </v-btn>
                </v-col>

                <v-col cols="12" sm="6" md="3">
                  <v-btn
                    block
                    color="red-darken-2"
                    variant="flat"
                    height="100"
                    @click="openActionDialog('roja')"
                    class="action-btn-large"
                  >
                    <div class="d-flex flex-column align-center">
                      <v-icon size="48" class="mb-2">mdi-card</v-icon>
                      <span class="text-body-1 font-weight-bold">Tarjeta Roja</span>
                    </div>
                  </v-btn>
                </v-col>

                <v-col cols="12" sm="6" md="3">
                  <v-btn
                    block
                    color="blue-grey-darken-2"
                    variant="flat"
                    height="100"
                    @click="openActionDialog('cambio')"
                    class="action-btn-large"
                  >
                    <div class="d-flex flex-column align-center">
                      <v-icon size="48" class="mb-2">mdi-swap-horizontal</v-icon>
                      <span class="text-body-1 font-weight-bold">Cambio</span>
                    </div>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card>

            <!-- HISTORIAL DE ACCIONES -->
            <v-card class="history-card pa-8" elevation="0">
              <div class="d-flex justify-space-between align-center mb-6">
                <h3 class="text-h5 font-weight-bold text-white">Historial de Acciones</h3>
                <v-chip color="grey-darken-2" size="small">{{ history.length }} eventos</v-chip>
              </div>

              <div v-if="history.length === 0" class="text-center py-12">
                <v-icon color="grey-darken-2" size="80" class="mb-4">mdi-clipboard-text-clock</v-icon>
                <p class="text-h6 text-grey-lighten-1">No hay acciones registradas</p>
              </div>

              <div v-else class="history-list">
                <div v-for="(item, i) in history" :key="i" class="history-item pa-4 mb-3">
                  <div class="d-flex justify-space-between align-center">
                    <div class="d-flex align-center flex-grow-1">
                      <v-avatar :color="getActionColor(item.type)" size="48" class="mr-4">
                        <v-icon color="white" size="28">{{ getActionIcon(item.type) }}</v-icon>
                      </v-avatar>
                      <div class="flex-grow-1">
                        <p class="text-body-1 font-weight-bold text-white mb-1">{{ item.description }}</p>
                        <p class="text-caption text-grey-lighten-1 mb-0">{{ item.team }} - Min. {{ item.minute }}</p>
                      </div>
                    </div>
                    <v-btn
                      icon
                      size="small"
                      color="red-darken-2"
                      variant="text"
                      @click="deleteAction(i)"
                    >
                      <v-icon>mdi-delete</v-icon>
                      <v-tooltip activator="parent" location="top">Anular</v-tooltip>
                    </v-btn>
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- PANEL DE CONTROL -->
          <v-col cols="12" lg="4">
            <!-- CONTROL DE TIEMPO -->
            <v-card class="control-card pa-8 mb-6" elevation="0">
              <div class="d-flex align-center mb-5">
                <v-icon color="purple-lighten-2" size="32" class="mr-3">mdi-timer</v-icon>
                <h3 class="text-h6 font-weight-bold text-white mb-0">Control del Partido</h3>
              </div>

              <div class="time-display-box mb-5">
                <span class="text-h1 font-weight-black text-white">{{ matchData.currentTime }}'</span>
              </div>

              <v-btn
                block
                :color="matchData.status === 'En Curso' ? 'warning' : 'success'"
                variant="flat"
                height="56"
                @click="toggleMatch"
                class="mb-3 control-btn"
              >
                <v-icon class="mr-2" size="24">{{ matchData.status === 'En Curso' ? 'mdi-pause' : 'mdi-play' }}</v-icon>
                <span class="text-body-1 font-weight-bold">{{ matchData.status === 'En Curso' ? 'Pausar Partido' : 'Iniciar Partido' }}</span>
              </v-btn>

              <v-btn
                block
                color="red-darken-2"
                variant="flat"
                height="56"
                @click="finishMatch"
                class="control-btn"
              >
                <v-icon class="mr-2" size="24">mdi-flag-checkered</v-icon>
                <span class="text-body-1 font-weight-bold">Finalizar Partido</span>
              </v-btn>
            </v-card>

            <!-- ESTADÍSTICAS -->
            <v-card class="stats-card pa-8" elevation="0">
              <div class="d-flex align-center mb-5">
                <v-icon color="orange-lighten-2" size="32" class="mr-3">mdi-chart-bar</v-icon>
                <h3 class="text-h6 font-weight-bold text-white mb-0">Estadísticas</h3>
              </div>

              <div class="stat-row-item mb-4">
                <span class="text-body-1 text-grey-lighten-1 font-weight-medium">Goles</span>
                <div class="d-flex align-center">
                  <span class="text-h5 font-weight-bold text-white mx-2">{{ matchData.homeScore }}</span>
                  <span class="text-body-2 text-grey mx-2">-</span>
                  <span class="text-h5 font-weight-bold text-white mx-2">{{ matchData.awayScore }}</span>
                </div>
              </div>
              <v-divider class="my-4 border-opacity-25"></v-divider>

              <div class="stat-row-item mb-4">
                <span class="text-body-1 text-grey-lighten-1 font-weight-medium">Tarjetas Amarillas</span>
                <div class="d-flex align-center">
                  <v-chip size="small" color="yellow-darken-3" class="mx-1">{{ stats.yellowCards.home }}</v-chip>
                  <span class="text-body-2 text-grey mx-2">-</span>
                  <v-chip size="small" color="yellow-darken-3" class="mx-1">{{ stats.yellowCards.away }}</v-chip>
                </div>
              </div>
              <v-divider class="my-4 border-opacity-25"></v-divider>

              <div class="stat-row-item">
                <span class="text-body-1 text-grey-lighten-1 font-weight-medium">Tarjetas Rojas</span>
                <div class="d-flex align-center">
                  <v-chip size="small" color="red-darken-2" class="mx-1">{{ stats.redCards.home }}</v-chip>
                  <span class="text-body-2 text-grey mx-2">-</span>
                  <v-chip size="small" color="red-darken-2" class="mx-1">{{ stats.redCards.away }}</v-chip>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- MODAL DE ACCIÓN (LIQUID GLASS STYLE) -->
    <v-dialog v-model="actionDialog" max-width="700" persistent>
      <v-card class="action-dialog-card pa-8">
        <div class="d-flex justify-space-between align-center mb-6">
          <div class="d-flex align-center">
            <v-icon :color="dialogConfig.color" size="40" class="mr-3">{{ dialogConfig.icon }}</v-icon>
            <h2 class="text-h5 font-weight-bold text-white">{{ dialogConfig.title }}</h2>
          </div>
          <v-btn icon variant="text" color="grey-lighten-1" @click="actionDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <!-- SELECCIÓN DE EQUIPO -->
        <div class="team-selection mb-6">
          <p class="text-body-2 text-grey-lighten-1 mb-3 font-weight-medium">Selecciona el Equipo:</p>
          <v-row>
            <v-col cols="6">
              <div 
                class="team-selector-box" 
                :class="{ 'selected': selectedTeam === 'home' }"
                @click="selectTeam('home')"
              >
                <v-icon size="48" color="white" class="mb-3">mdi-shield</v-icon>
                <h4 class="text-h6 font-weight-bold text-white">{{ matchData.homeTeam }}</h4>
                <v-chip size="x-small" color="blue-grey-darken-2" class="mt-2">LOCAL</v-chip>
              </div>
            </v-col>
            <v-col cols="6">
              <div 
                class="team-selector-box" 
                :class="{ 'selected': selectedTeam === 'away' }"
                @click="selectTeam('away')"
              >
                <v-icon size="48" color="white" class="mb-3">mdi-shield</v-icon>
                <h4 class="text-h6 font-weight-bold text-white">{{ matchData.awayTeam }}</h4>
                <v-chip size="x-small" color="blue-grey-darken-2" class="mt-2">VISITANTE</v-chip>
              </div>
            </v-col>
          </v-row>
        </div>

        <!-- SELECCIÓN DE JUGADOR -->
        <div v-if="selectedTeam" class="player-selection mb-6">
          <p class="text-body-2 text-grey-lighten-1 mb-3 font-weight-medium">Selecciona el Jugador:</p>
          <v-row>
            <v-col 
              v-for="player in currentPlayers" 
              :key="player.number"
              cols="6" 
              sm="4"
            >
              <div 
                class="player-selector-box"
                :class="{ 'selected': selectedPlayer === player.number }"
                @click="selectPlayer(player.number)"
              >
                <div class="player-number mb-2">{{ player.number }}</div>
                <p class="text-body-2 font-weight-bold text-white mb-0">{{ player.name }}</p>
              </div>
            </v-col>
          </v-row>
        </div>

        <!-- MINUTO DEL EVENTO -->
        <div v-if="selectedPlayer" class="minute-input mb-6">
          <v-text-field
            v-model="eventMinute"
            label="Minuto del Evento"
            type="number"
            variant="solo-filled"
            bg-color="rgba(255,255,255,0.06)"
            color="white"
            rounded="lg"
            theme="dark"
            hide-details
          >
            <template v-slot:prepend-inner>
              <v-icon color="grey-lighten-1">mdi-clock-outline</v-icon>
            </template>
          </v-text-field>
        </div>

        <!-- BOTONES DE ACCIÓN -->
        <div class="d-flex gap-3">
          <v-btn
            color="grey-darken-2"
            variant="flat"
            size="large"
            @click="actionDialog = false"
            block
            height="52"
          >
            Cancelar
          </v-btn>
          <v-btn
            :color="dialogConfig.btnColor"
            variant="flat"
            size="large"
            :disabled="!selectedPlayer || !eventMinute"
            @click="saveAction"
            :loading="saving"
            block
            height="52"
          >
            <v-icon class="mr-2">mdi-check</v-icon>
            Confirmar
          </v-btn>
        </div>
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

// Datos del partido
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

// Jugadores de ejemplo
const teams = ref({
  home: [
    { number: 1, name: 'Carlos Méndez' },
    { number: 7, name: 'Miguel Ángel' },
    { number: 10, name: 'Juan Torres' },
    { number: 11, name: 'Pedro Sánchez' },
    { number: 15, name: 'Luis Paredes' },
    { number: 20, name: 'Jorge Silva' }
  ],
  away: [
    { number: 2, name: 'Diego Rojas' },
    { number: 8, name: 'Andrés López' },
    { number: 9, name: 'Roberto García' },
    { number: 12, name: 'Fernando Ruiz' },
    { number: 17, name: 'Pablo Moreno' },
    { number: 21, name: 'Daniel Castro' }
  ]
});

// Historial de acciones
const history = ref([]);

// Modal de acción
const actionDialog = ref(false);
const currentAction = ref('');
const selectedTeam = ref(null);
const selectedPlayer = ref(null);
const eventMinute = ref('');
const saving = ref(false);

// Configuración del diálogo
const dialogConfig = computed(() => {
  const configs = {
    gol: {
      title: 'Registrar Gol',
      icon: 'mdi-soccer',
      color: 'green-lighten-2',
      btnColor: 'green-darken-2'
    },
    amarilla: {
      title: 'Tarjeta Amarilla',
      icon: 'mdi-card',
      color: 'yellow-darken-3',
      btnColor: 'yellow-darken-3'
    },
    roja: {
      title: 'Tarjeta Roja',
      icon: 'mdi-card',
      color: 'red-darken-2',
      btnColor: 'red-darken-2'
    },
    cambio: {
      title: 'Cambio de Jugador',
      icon: 'mdi-swap-horizontal',
      color: 'blue-lighten-2',
      btnColor: 'blue-darken-2'
    }
  };
  return configs[currentAction.value] || configs.gol;
});

// Jugadores del equipo seleccionado
const currentPlayers = computed(() => {
  if (!selectedTeam.value) return [];
  return teams.value[selectedTeam.value];
});

// Abrir modal de acción
const openActionDialog = (action) => {
  currentAction.value = action;
  selectedTeam.value = null;
  selectedPlayer.value = null;
  eventMinute.value = matchData.value.currentTime.toString();
  actionDialog.value = true;
};

// Seleccionar equipo
const selectTeam = (team) => {
  selectedTeam.value = team;
  selectedPlayer.value = null;
};

// Seleccionar jugador
const selectPlayer = (playerNumber) => {
  selectedPlayer.value = playerNumber;
};

// Guardar acción
const saveAction = async () => {
  saving.value = true;
  try {
    const teamName = selectedTeam.value === 'home' ? matchData.value.homeTeam : matchData.value.awayTeam;
    const player = currentPlayers.value.find(p => p.number === selectedPlayer.value);
    
    const actionData = {
      type: currentAction.value,
      team: teamName,
      teamSide: selectedTeam.value,
      player: player.name,
      playerNumber: player.number,
      minute: parseInt(eventMinute.value)
    };

    await guardarDato('match_events', actionData);

    // Actualizar marcadores y estadísticas
    if (currentAction.value === 'gol') {
      if (selectedTeam.value === 'home') {
        matchData.value.homeScore++;
      } else {
        matchData.value.awayScore++;
      }
    } else if (currentAction.value === 'amarilla') {
      stats.value.yellowCards[selectedTeam.value]++;
    } else if (currentAction.value === 'roja') {
      stats.value.redCards[selectedTeam.value]++;
    }

    // Agregar al historial
    history.value.unshift({
      ...actionData,
      description: `${getActionName(currentAction.value)} - ${player.name} #${player.number}`
    });

    actionDialog.value = false;

    if (!isOnline.value) {
      alert('📡 Offline: Acción guardada localmente.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al registrar la acción');
  } finally {
    saving.value = false;
  }
};

// Anular acción
const deleteAction = (index) => {
  if (confirm('¿Anular esta acción?')) {
    const action = history.value[index];
    
    // Revertir marcadores y estadísticas
    if (action.type === 'gol') {
      if (action.teamSide === 'home') {
        matchData.value.homeScore--;
      } else {
        matchData.value.awayScore--;
      }
    } else if (action.type === 'amarilla') {
      stats.value.yellowCards[action.teamSide]--;
    } else if (action.type === 'roja') {
      stats.value.redCards[action.teamSide]--;
    }
    
    history.value.splice(index, 1);
  }
};

// Control del partido
const toggleMatch = () => {
  matchData.value.status = matchData.value.status === 'En Curso' ? 'Pausado' : 'En Curso';
};

const finishMatch = () => {
  if (confirm('¿Finalizar el partido?')) {
    matchData.value.status = 'Finalizado';
    alert(`Partido finalizado: ${matchData.value.homeScore} - ${matchData.value.awayScore}`);
  }
};

// Funciones auxiliares
const getActionName = (type) => {
  const names = {
    gol: 'Gol',
    amarilla: 'Tarjeta Amarilla',
    roja: 'Tarjeta Roja',
    cambio: 'Cambio'
  };
  return names[type] || type;
};

const getActionColor = (type) => {
  const colors = {
    gol: 'green-darken-2',
    amarilla: 'yellow-darken-3',
    roja: 'red-darken-2',
    cambio: 'blue-grey-darken-2'
  };
  return colors[type] || 'grey-darken-2';
};

const getActionIcon = (type) => {
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

/* HERO SECTION */
.hero-referee {
  min-height: 60vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding-top: 0;
}

.hero-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  filter: brightness(0.6);
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(10, 10, 10, 0.7) 0%, rgba(10, 10, 10, 0.9) 100%);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  padding-top: 40px;
}

.hero-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(to bottom, transparent, #0a0a0a);
  z-index: 2;
}

.connection-status {
  display: flex;
  align-items: center;
}

/* MARCADOR */
.match-score-card {
  background: rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 24px !important;
  transition: all 0.3s ease;
}

.team-section {
  padding: 16px;
}

.team-shield-large {
  background: rgba(255, 255, 255, 0.1);
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border: 3px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.team-shield-large:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.05);
}

.score-box {
  background: rgba(0, 0, 0, 0.4);
  padding: 16px 32px;
  border-radius: 16px;
  display: inline-block;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.vs-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.time-circle {
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.15);
}

.vs-badge {
  background: rgba(255, 255, 255, 0.08);
  padding: 12px 24px;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* SECCIÓN DE ACCIONES */
.actions-section {
  background: transparent;
}

.actions-card,
.history-card,
.control-card,
.stats-card {
  background: rgba(255, 255, 255, 0.04) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px !important;
  transition: all 0.3s ease;
}

.actions-card:hover,
.history-card:hover,
.control-card:hover,
.stats-card:hover {
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.action-btn-large {
  text-transform: none !important;
  transition: all 0.3s ease;
}

.action-btn-large:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

/* HISTORIAL */
.history-list {
  max-height: 500px;
  overflow-y: auto;
}

.history-item {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.history-item:hover {
  background: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

/* CONTROL */
.time-display-box {
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
  padding: 24px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.control-btn {
  text-transform: none !important;
  transition: all 0.3s ease;
}

.control-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

/* ESTADÍSTICAS */
.stat-row-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* MODAL DE ACCIÓN (LIQUID GLASS) */
.action-dialog-card {
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.95) 100%) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 24px !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5) !important;
}

/* SELECCIÓN DE EQUIPO */
.team-selector-box {
  background: rgba(255, 255, 255, 0.04);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.team-selector-box:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

.team-selector-box.selected {
  background: rgba(76, 175, 234, 0.15);
  border-color: #4CAFEA;
  box-shadow: 0 0 20px rgba(76, 175, 234, 0.3);
}

/* SELECCIÓN DE JUGADOR */
.player-selector-box {
  background: rgba(255, 255, 255, 0.04);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.player-selector-box:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

.player-selector-box.selected {
  background: rgba(76, 175, 234, 0.15);
  border-color: #4CAFEA;
  box-shadow: 0 0 15px rgba(76, 175, 234, 0.3);
}

.player-number {
  background: rgba(255, 255, 255, 0.1);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.player-selector-box.selected .player-number {
  background: rgba(76, 175, 234, 0.3);
  border-color: #4CAFEA;
}

/* RESPONSIVE */
@media (max-width: 960px) {
  .hero-referee {
    min-height: 50vh;
  }

  .team-shield-large {
    width: 90px;
    height: 90px;
  }

  .time-circle {
    width: 100px;
    height: 100px;
  }

  .connection-status {
    margin-top: 16px;
  }
}

@media (max-width: 600px) {
  .hero-referee {
    min-height: auto;
    padding-bottom: 40px;
  }

  .team-shield-large {
    width: 70px;
    height: 70px;
  }

  .score-box span {
    font-size: 3rem !important;
  }

  .time-circle {
    width: 80px;
    height: 80px;
  }

  .action-btn-large {
    height: 90px !important;
  }
}

/* UTILIDADES */
.gap-3 { gap: 12px; }
</style>