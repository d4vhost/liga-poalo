<template>
  <div class="referee-panel bg-dark-theme">
    
    <v-app-bar color="#0f1012" elevation="0" class="border-bottom-subtle px-4">
      <div class="d-flex align-center">
        <v-icon color="white" size="24" class="mr-3">mdi-whistle</v-icon>
        <span class="text-subtitle-1 font-weight-bold text-white tracking-wide">
          PANEL ARBITRAL
        </span>
      </div>

      <v-spacer></v-spacer>

      <div class="d-flex align-center mr-4">
        <v-icon 
          :color="isOnline ? 'green-accent-3' : 'red-accent-2'" 
          size="12" 
          class="mr-2"
        >
          mdi-circle
        </v-icon>
        <span class="text-caption font-weight-medium text-grey-lighten-1">
          {{ isOnline ? 'ONLINE' : 'OFFLINE' }}
        </span>
      </div>

      <v-btn 
        icon 
        variant="outlined" 
        color="white" 
        size="small" 
        class="btn-border-subtle"
        @click="handleLogout"
      >
        <v-icon size="18">mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container class="py-8" max-width="1200">
        
        <v-card class="card-dark-outline mb-8 pa-6" elevation="0">
          <div class="d-flex justify-space-between align-center">
            
            <div class="text-center flex-1">
              <h2 class="text-h5 font-weight-bold text-white mb-1">{{ matchData.homeTeam }}</h2>
              <span class="text-caption text-grey-lighten-2 tracking-wide">LOCAL</span>
              <div class="text-h2 font-weight-black text-white mt-2">{{ matchData.homeScore }}</div>
            </div>

            <div class="text-center px-4">
              <div class="timer-box mb-2">
                <span class="text-h3 font-weight-bold text-white">{{ matchData.currentTime }}'</span>
              </div>
              <v-chip 
                :color="matchData.status === 'En Curso' ? 'green-darken-1' : 'grey-darken-3'"
                size="small"
                label
                class="font-weight-bold px-4"
                style="border: 1px solid rgba(255,255,255,0.1)"
              >
                {{ matchData.status.toUpperCase() }}
              </v-chip>
            </div>

            <div class="text-center flex-1">
              <h2 class="text-h5 font-weight-bold text-white mb-1">{{ matchData.awayTeam }}</h2>
              <span class="text-caption text-grey-lighten-2 tracking-wide">VISITANTE</span>
              <div class="text-h2 font-weight-black text-white mt-2">{{ matchData.awayScore }}</div>
            </div>

          </div>
        </v-card>

        <v-row>
          <v-col cols="12" md="8">
            <h3 class="text-overline text-grey-lighten-1 mb-4 font-weight-bold tracking-wide">
              CONTROL DEL PARTIDO
            </h3>

            <div class="actions-grid mb-8">
              <v-btn
                height="100"
                class="action-btn-dark goal-area"
                variant="outlined"
                @click="openActionDialog('gol')"
              >
                <div class="d-flex flex-column align-center">
                  <v-icon size="32" color="white" class="mb-2">mdi-soccer</v-icon>
                  <span class="text-h6 font-weight-bold text-white">GOL</span>
                </div>
              </v-btn>

              <v-btn
                height="100"
                class="action-btn-dark"
                variant="outlined"
                @click="openActionDialog('amarilla')"
              >
                <div class="d-flex flex-column align-center">
                  <v-icon size="32" color="yellow-darken-2" class="mb-2">mdi-card</v-icon>
                  <span class="text-body-1 font-weight-bold text-white">AMARILLA</span>
                </div>
              </v-btn>

              <v-btn
                height="100"
                class="action-btn-dark"
                variant="outlined"
                @click="openActionDialog('roja')"
              >
                <div class="d-flex flex-column align-center">
                  <v-icon size="32" color="red-darken-2" class="mb-2">mdi-card</v-icon>
                  <span class="text-body-1 font-weight-bold text-white">ROJA</span>
                </div>
              </v-btn>

              <v-btn
                height="100"
                class="action-btn-dark"
                variant="outlined"
                @click="openActionDialog('cambio')"
              >
                <div class="d-flex flex-column align-center">
                  <v-icon size="32" color="blue-grey-lighten-2" class="mb-2">mdi-swap-horizontal</v-icon>
                  <span class="text-body-1 font-weight-bold text-white">CAMBIO</span>
                </div>
              </v-btn>
            </div>

            <v-card class="card-dark-outline pa-0" elevation="0" style="min-height: 300px;">
              <div class="px-6 py-4 border-bottom-subtle d-flex justify-space-between align-center">
                <span class="text-subtitle-2 font-weight-bold text-white">HISTORIAL DE EVENTOS</span>
                <span class="text-caption text-grey">{{ history.length }} registros</span>
              </div>
              
              <div v-if="history.length === 0" class="d-flex justify-center align-center py-12">
                <span class="text-grey-darken-1 text-body-2">No hay eventos registrados aún.</span>
              </div>

              <v-list bg-color="transparent" class="pa-0" v-else>
                <template v-for="(item, i) in history" :key="i">
                  <v-list-item class="py-3 event-item">
                    <template v-slot:prepend>
                      <div class="text-h6 font-weight-bold text-grey-darken-1 mr-4" style="width: 40px; text-align: center;">
                        {{ item.minute }}'
                      </div>
                    </template>

                    <v-list-item-title class="text-white font-weight-bold mb-1">
                      {{ getActionName(item.type) }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-grey-lighten-1">
                      {{ item.player }} ({{ item.team }})
                    </v-list-item-subtitle>

                    <template v-slot:append>
                      <v-icon :color="getActionColor(item.type)" class="mr-4">{{ getActionIcon(item.type) }}</v-icon>
                      <v-btn icon variant="text" size="small" color="grey-darken-2" @click="deleteAction(i)">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </template>
                  </v-list-item>
                  <v-divider class="border-subtle" v-if="i < history.length - 1"></v-divider>
                </template>
              </v-list>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <h3 class="text-overline text-grey-lighten-1 mb-4 font-weight-bold tracking-wide">
              GESTIÓN
            </h3>

            <v-card class="card-dark-outline pa-5 mb-6">
              <v-btn
                block
                height="50"
                class="mb-3 text-body-1 font-weight-bold"
                :color="matchData.status === 'En Curso' ? 'grey-darken-3' : 'white'"
                :variant="matchData.status === 'En Curso' ? 'outlined' : 'flat'"
                @click="toggleMatch"
              >
                <v-icon start class="mr-2">{{ matchData.status === 'En Curso' ? 'mdi-pause' : 'mdi-play' }}</v-icon>
                {{ matchData.status === 'En Curso' ? 'PAUSAR' : 'INICIAR' }}
              </v-btn>
              
              <v-btn
                block
                height="50"
                variant="outlined"
                color="red-darken-1"
                class="text-body-2"
                style="border-color: rgba(244, 67, 54, 0.3);"
                @click="finishMatch"
              >
                FINALIZAR PARTIDO
              </v-btn>
            </v-card>

            <v-card class="card-dark-outline pa-5">
              <span class="text-caption text-grey font-weight-bold text-uppercase mb-4 d-block">Resumen de Sanciones</span>
              
              <div class="d-flex justify-space-between mb-4 align-center">
                <div class="d-flex align-center">
                  <v-icon color="yellow-darken-2" size="20" class="mr-2">mdi-card</v-icon>
                  <span class="text-grey-lighten-1">Amarillas</span>
                </div>
                <div class="text-white font-weight-bold">
                  {{ stats.yellowCards.home }} - {{ stats.yellowCards.away }}
                </div>
              </div>
              
              <v-divider class="border-subtle mb-4"></v-divider>
              
              <div class="d-flex justify-space-between align-center">
                <div class="d-flex align-center">
                  <v-icon color="red-darken-2" size="20" class="mr-2">mdi-card</v-icon>
                  <span class="text-grey-lighten-1">Rojas</span>
                </div>
                <div class="text-white font-weight-bold">
                  {{ stats.redCards.home }} - {{ stats.redCards.away }}
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-dialog v-model="actionDialog" max-width="500">
      <v-card color="#0f1012" class="card-dark-outline">
        <v-card-title class="text-white font-weight-bold py-4 px-6 border-bottom-subtle d-flex justify-space-between align-center">
          <span>{{ dialogConfig.title }}</span>
          <v-btn icon variant="text" color="grey" size="small" @click="actionDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pt-6 px-6">
          
          <p class="text-caption text-grey font-weight-bold mb-2">1. SELECCIONAR EQUIPO</p>
          <v-row class="mb-4">
            <v-col cols="6">
              <v-card
                @click="selectTeam('home')"
                class="py-4 text-center selection-card"
                :class="{ 'selected': selectedTeam === 'home' }"
                elevation="0"
                variant="outlined"
              >
                <div class="text-body-1 font-weight-bold" :class="selectedTeam === 'home' ? 'text-white' : 'text-grey'">LOCAL</div>
                <div class="text-caption text-grey-darken-1">{{ matchData.homeTeam }}</div>
              </v-card>
            </v-col>
            <v-col cols="6">
              <v-card
                @click="selectTeam('away')"
                class="py-4 text-center selection-card"
                :class="{ 'selected': selectedTeam === 'away' }"
                elevation="0"
                variant="outlined"
              >
                <div class="text-body-1 font-weight-bold" :class="selectedTeam === 'away' ? 'text-white' : 'text-grey'">VISITA</div>
                <div class="text-caption text-grey-darken-1">{{ matchData.awayTeam }}</div>
              </v-card>
            </v-col>
          </v-row>

          <div v-if="selectedTeam" class="mb-6">
            <p class="text-caption text-grey font-weight-bold mb-2">2. SELECCIONAR JUGADOR</p>
            <v-select
              v-model="selectedPlayer"
              :items="currentPlayers"
              item-title="name"
              item-value="number"
              placeholder="Buscar jugador..."
              variant="outlined"
              density="comfortable"
              bg-color="rgba(255,255,255,0.03)"
              color="white"
              hide-details
              class="custom-select"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" class="text-white">
                  <template v-slot:prepend>
                    <v-avatar color="grey-darken-3" size="30" class="mr-2">
                      <span class="text-caption font-weight-bold text-white">{{ item.raw.number }}</span>
                    </v-avatar>
                  </template>
                </v-list-item>
              </template>
            </v-select>
          </div>

          <div v-if="selectedPlayer">
            <p class="text-caption text-grey font-weight-bold mb-2">3. MINUTO DEL EVENTO</p>
            <v-text-field
              v-model="eventMinute"
              type="number"
              variant="outlined"
              density="comfortable"
              bg-color="rgba(255,255,255,0.03)"
              color="white"
              hide-details
            ></v-text-field>
          </div>

        </v-card-text>

        <v-card-actions class="px-6 pb-6 pt-2">
          <v-btn block color="white" variant="flat" height="45" @click="saveAction" :disabled="!selectedPlayer" class="font-weight-bold text-black">
            CONFIRMAR
          </v-btn>
        </v-card-actions>
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

// --- DATOS (MOCKUP) ---
const matchData = ref({
  homeTeam: 'Los Tigres',
  awayTeam: 'Águilas FC',
  homeScore: 0,
  awayScore: 0,
  currentTime: 0,
  status: 'Pausado'
});

const stats = ref({
  yellowCards: { home: 0, away: 0 },
  redCards: { home: 0, away: 0 }
});

const teams = ref({
  home: [
    { number: 1, name: 'Carlos Méndez' },
    { number: 10, name: 'Juan Torres' },
    { number: 7, name: 'Miguel Ángel' }
  ],
  away: [
    { number: 1, name: 'Diego Rojas' },
    { number: 9, name: 'Roberto García' }
  ]
});

const history = ref([]);

// --- LOGICA DIALOGO ---
const actionDialog = ref(false);
const currentAction = ref('');
const selectedTeam = ref(null);
const selectedPlayer = ref(null);
const eventMinute = ref(0);

const dialogConfig = computed(() => {
  const configs = {
    gol: { title: 'REGISTRAR GOL' },
    amarilla: { title: 'TARJETA AMARILLA' },
    roja: { title: 'TARJETA ROJA' },
    cambio: { title: 'SUSTITUCIÓN' }
  };
  return configs[currentAction.value] || configs.gol;
});

const currentPlayers = computed(() => selectedTeam.value ? teams.value[selectedTeam.value] : []);

const openActionDialog = (action) => {
  currentAction.value = action;
  selectedTeam.value = null;
  selectedPlayer.value = null;
  eventMinute.value = matchData.value.currentTime;
  actionDialog.value = true;
};

const selectTeam = (team) => {
  selectedTeam.value = team;
  selectedPlayer.value = null;
};

const saveAction = async () => {
  const teamName = selectedTeam.value === 'home' ? matchData.value.homeTeam : matchData.value.awayTeam;
  const player = currentPlayers.value.find(p => p.number === selectedPlayer.value);
  
  const actionData = {
    type: currentAction.value,
    team: teamName,
    player: player.name,
    minute: eventMinute.value
  };

  // Guardar (Lógica Real o Sync)
  await guardarDato('match_events', actionData);

  // Actualizar UI
  if (currentAction.value === 'gol') {
    selectedTeam.value === 'home' ? matchData.value.homeScore++ : matchData.value.awayScore++;
  } else if (currentAction.value === 'amarilla') {
    stats.value.yellowCards[selectedTeam.value]++;
  } else if (currentAction.value === 'roja') {
    stats.value.redCards[selectedTeam.value]++;
  }

  history.value.unshift({ ...actionData, teamSide: selectedTeam.value });
  actionDialog.value = false;
};

const deleteAction = (index) => {
  const item = history.value[index];
  if (item.type === 'gol') {
    item.teamSide === 'home' ? matchData.value.homeScore-- : matchData.value.awayScore--;
  }
  history.value.splice(index, 1);
};

// --- CONTROL PARTIDO ---
const toggleMatch = () => {
  matchData.value.status = matchData.value.status === 'En Curso' ? 'Pausado' : 'En Curso';
};

const finishMatch = () => {
  if(confirm('¿Finalizar partido?')) router.push('/panel-admin');
};

const handleLogout = async () => {
  await supabase.auth.signOut();
  router.push('/login');
};

// --- HELPERS ---
const getActionName = (t) => ({gol:'GOL', amarilla:'T. AMARILLA', roja:'T. ROJA', cambio:'CAMBIO'}[t]);
const getActionColor = (t) => ({gol:'green', amarilla:'yellow', roja:'red', cambio:'blue'}[t]);
const getActionIcon = (t) => ({gol:'mdi-soccer', amarilla:'mdi-card', roja:'mdi-card', cambio:'mdi-swap-horizontal'}[t]);

</script>

<style scoped>
/* --- ESTILO DARK PREMIUM --- */
.bg-dark-theme {
  background-color: #0f1012;
  min-height: 100vh;
  font-family: 'Montserrat', sans-serif;
}

/* Bordes Sutiles (Estilo Login) */
.card-dark-outline {
  background-color: transparent !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.border-bottom-subtle {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.border-subtle {
  border-color: rgba(255, 255, 255, 0.05) !important;
}

.btn-border-subtle {
  border-color: rgba(255, 255, 255, 0.2);
}

/* Acciones Grid */
.actions-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr; /* Gol más grande */
  gap: 12px;
}

@media (max-width: 960px) {
  .actions-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
  }
}

.action-btn-dark {
  background: rgba(255, 255, 255, 0.02);
  border-color: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  text-transform: none;
  transition: all 0.2s ease;
}

.action-btn-dark:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.4);
}

.goal-area {
  background: rgba(255, 255, 255, 0.05); /* Ligeramente más claro */
}

/* Cards de Selección en Modal */
.selection-card {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.2s;
}

.selection-card:hover {
  background: rgba(255, 255, 255, 0.05);
}

.selection-card.selected {
  background: white;
  border-color: white;
}
.selection-card.selected div {
  color: black !important;
}

/* Tracking (Espaciado de letras elegante) */
.tracking-wide {
  letter-spacing: 1.5px;
}

/* Helper Flex */
.flex-1 { flex: 1; }

.event-item:hover {
  background: rgba(255, 255, 255, 0.02);
}
</style>