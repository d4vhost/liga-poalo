<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../../services/supabase'

// --- CONSTANTES TÁCTICAS ---
const POSITIONS = {
  arquero:   { label: 'Arquero',   icon: 'mdi-hand-back-left', color: 'yellow-accent-4', order: 1, abbr: 'ARQ' },
  defensa:   { label: 'Defensa',   icon: 'mdi-shield',         color: 'blue-accent-3',   order: 2, abbr: 'DEF' },
  medio:     { label: 'Medio',     icon: 'mdi-circle-slice-8', color: 'green-accent-3',  order: 3, abbr: 'MED' },
  delantero: { label: 'Delantero', icon: 'mdi-soccer',         color: 'red-accent-2',    order: 4, abbr: 'DEL' }
}

const GAME_MODES = {
  '6v6': { label: 'Fútbol 6', limit: 6 },
  '8v8': { label: 'Fútbol 8', limit: 8 }
}

// --- ESTADO ---
const loading = ref(false)
const saving = ref(false)
const dialog = ref(false)
const step = ref(1) // Control de pasos del wizard
const playerSearch = ref('')
const snackbar = ref({ show: false, text: '', color: 'success' })

const matches = ref([])
const players = ref([])

// Modelo para el Partido
const editedItem = ref({
  id: null,
  date: '',
  time: '',
  location: '',
  team_a_name: '',
  team_b_name: '',
  status: 'programado',
  game_type: '8v8',
  team_a_roster: [], 
  team_b_roster: []
})

// --- COMPUTED ---
const currentLimit = computed(() => GAME_MODES[editedItem.value.game_type].limit)

const filteredPlayers = computed(() => {
  const term = playerSearch.value.toLowerCase()
  return players.value.filter(p => 
    !editedItem.value.team_a_roster.find(x => x.id === p.id) && 
    !editedItem.value.team_b_roster.find(x => x.id === p.id) && 
    (p.nombres?.toLowerCase().includes(term) || p.email?.toLowerCase().includes(term))
  )
})

const sortedTeamA = computed(() => sortRoster([...editedItem.value.team_a_roster]))
const sortedTeamB = computed(() => sortRoster([...editedItem.value.team_b_roster]))

function sortRoster(roster) {
  return roster.sort((a, b) => {
    const orderA = POSITIONS[a.position]?.order || 99
    const orderB = POSITIONS[b.position]?.order || 99
    return orderA - orderB
  })
}

const canProceedToStep2 = computed(() => {
  return editedItem.value.team_a_name && 
         editedItem.value.team_b_name && 
         editedItem.value.date &&
         editedItem.value.time &&
         editedItem.value.location
})

const totalAssigned = computed(() => {
  return editedItem.value.team_a_roster.length + editedItem.value.team_b_roster.length
})

// --- MÉTODOS DB ---
async function fetchMatches() {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        match_players (
          team_side,
          player_id,
          position,
          profiles:player_id ( id, nombres, email, cedula )
        )
      `)
      .order('date', { ascending: true })

    if (error) throw error

    matches.value = data.map(match => {
      const mapPlayers = (side) => match.match_players
        .filter(mp => mp.team_side === side && mp.profiles)
        .map(mp => ({ ...mp.profiles, position: mp.position }))

      return {
        ...match,
        team_a_roster: mapPlayers('A'),
        team_b_roster: mapPlayers('B')
      }
    })
  } catch (error) {
    console.error(error)
    showSnackbar('Error al cargar partidos', 'error')
  } finally {
    loading.value = false
  }
}

async function fetchPlayers() {
  const { data } = await supabase
    .from('profiles')
    .select('id, nombres, cedula, role')
    .in('role', ['jugador', 'arbitro'])
    .eq('status', 'activo')
    .order('nombres')
  if (data) players.value = data
}

async function saveMatch() {
  if (!canProceedToStep2.value) {
    showSnackbar('Complete todos los campos obligatorios', 'warning')
    return
  }

  saving.value = true
  try {
    const matchData = {
      team_a_name: editedItem.value.team_a_name,
      team_b_name: editedItem.value.team_b_name,
      date: editedItem.value.date,
      time: editedItem.value.time,
      location: editedItem.value.location,
      status: editedItem.value.status,
      game_type: editedItem.value.game_type
    }

    let matchId = editedItem.value.id
    if (matchId) {
      await supabase.from('matches').update(matchData).eq('id', matchId)
    } else {
      const { data } = await supabase.from('matches').insert(matchData).select().single()
      matchId = data.id
    }

    // Guardar Alineaciones
    await supabase.from('match_players').delete().eq('match_id', matchId)

    const newRoster = []
    const processRoster = (roster, side) => {
      roster.forEach(p => {
        newRoster.push({
          match_id: matchId,
          player_id: p.id,
          team_side: side,
          position: p.position
        })
      })
    }
    processRoster(editedItem.value.team_a_roster, 'A')
    processRoster(editedItem.value.team_b_roster, 'B')

    if (newRoster.length > 0) {
      await supabase.from('match_players').insert(newRoster)
    }

    showSnackbar('Partido guardado correctamente', 'success')
    dialog.value = false
    fetchMatches()

  } catch (error) {
    showSnackbar('Error al guardar: ' + error.message, 'error')
  } finally {
    saving.value = false
  }
}

// --- UI LOGIC ---
function openDialog(item) {
  if (item) {
    editedItem.value = JSON.parse(JSON.stringify(item))
    if (!editedItem.value.game_type) editedItem.value.game_type = '8v8'
  } else {
    editedItem.value = {
      id: null,
      date: new Date().toISOString().substr(0, 10),
      time: '14:00',
      location: 'Cancha Principal',
      team_a_name: '',
      team_b_name: '',
      status: 'programado',
      game_type: '8v8',
      team_a_roster: [],
      team_b_roster: []
    }
  }
  step.value = 1
  dialog.value = true
}

function assignPlayer(player, team, position) {
  const targetRoster = team === 'A' ? editedItem.value.team_a_roster : editedItem.value.team_b_roster
  
  if (targetRoster.length >= currentLimit.value) {
    showSnackbar(`Límite alcanzado (${currentLimit.value} jugadores)`, 'warning')
    return
  }

  targetRoster.push({ ...player, position })
  playerSearch.value = ''
}

function removePlayer(playerId, team) {
  if (team === 'A') {
    editedItem.value.team_a_roster = editedItem.value.team_a_roster.filter(p => p.id !== playerId)
  } else {
    editedItem.value.team_b_roster = editedItem.value.team_b_roster.filter(p => p.id !== playerId)
  }
}

function showSnackbar(text, color) {
  snackbar.value = { show: true, text, color }
}

function getStatusColor(status) {
  return { programado: 'blue', en_juego: 'green', finalizado: 'grey' }[status] || 'grey'
}

function nextStep() {
  if (step.value === 1 && canProceedToStep2.value) {
    step.value = 2
  }
}

function prevStep() {
  if (step.value > 1) step.value--
}

onMounted(() => {
  fetchMatches()
  fetchPlayers()
})
</script>

<template>
  <div class="h-100 d-flex flex-column">
    
    <!-- HEADER -->
    <div class="header-section mb-6">
      <div class="d-flex align-center justify-space-between">
        <div>
          <div class="d-flex align-center mb-1">
            <v-icon color="green-lighten-2" class="mr-2" size="small">mdi-soccer-field</v-icon>
            <span class="text-overline font-weight-bold text-green-lighten-2 tracking-wider">
              GESTIÓN DEPORTIVA
            </span>
          </div>
          <h2 class="text-h4 font-weight-black text-white">Calendario de Encuentros</h2>
          <p class="text-caption text-grey-lighten-1 mt-1">Programa partidos y asigna plantillas tácticas completas</p>
        </div>
        <v-btn 
          color="white" 
          prepend-icon="mdi-plus-circle" 
          rounded="lg" 
          @click="openDialog(null)" 
          elevation="4"
          class="text-black font-weight-bold px-6"
          height="48"
        >
          Nuevo Partido
        </v-btn>
      </div>
    </div>

    <!-- TABLA DE PARTIDOS -->
    <v-card class="card-dark-outline flex-grow-1" elevation="0">
      <v-data-table
        :headers="[
          { title: 'ENCUENTRO', key: 'teams', sortable: false, width: '35%' },
          { title: 'DETALLES', key: 'info', sortable: true },
          { title: 'ALINEACIONES', key: 'rosters', align: 'center' },
          { title: 'MODO', key: 'game_type', align: 'center' },
          { title: 'ESTADO', key: 'status', align: 'center' },
          { title: '', key: 'actions', align: 'end', sortable: false },
        ]"
        :items="matches"
        :loading="loading"
        theme="dark"
        class="bg-transparent h-100"
        hover
        density="comfortable"
      >
        <template v-slot:item.teams="{ item }">
          <div class="teams-cell py-3">
            <div class="team-block">
              <v-icon color="blue-lighten-2" size="18" class="mr-2">mdi-shield-home</v-icon>
              <div>
                <div class="text-body-2 font-weight-bold text-white">{{ item.team_a_name }}</div>
                <div class="text-caption text-grey">Local</div>
              </div>
            </div>
            <div class="vs-divider my-2">
              <v-chip size="x-small" color="grey-darken-3" label class="font-weight-black">VS</v-chip>
            </div>
            <div class="team-block">
              <v-icon color="orange-lighten-2" size="18" class="mr-2">mdi-shield-airplane</v-icon>
              <div>
                <div class="text-body-2 font-weight-bold text-white">{{ item.team_b_name }}</div>
                <div class="text-caption text-grey">Visitante</div>
              </div>
            </div>
          </div>
        </template>

        <template v-slot:item.info="{ item }">
          <div class="info-cell">
            <div class="d-flex align-center mb-1">
              <v-icon size="14" color="blue-grey" class="mr-1">mdi-calendar</v-icon>
              <span class="text-caption text-white">{{ item.date }}</span>
            </div>
            <div class="d-flex align-center mb-1">
              <v-icon size="14" color="blue-grey" class="mr-1">mdi-clock-outline</v-icon>
              <span class="text-caption text-grey-lighten-1">{{ item.time.substring(0,5) }}</span>
            </div>
            <div class="d-flex align-center">
              <v-icon size="14" color="blue-grey" class="mr-1">mdi-map-marker</v-icon>
              <span class="text-caption text-grey-lighten-1">{{ item.location }}</span>
            </div>
          </div>
        </template>

        <template v-slot:item.rosters="{ item }">
          <div class="rosters-cell">
            <v-chip 
              size="small" 
              :color="item.team_a_roster.length === parseInt(item.game_type) ? 'green-darken-2' : 'grey-darken-3'" 
              variant="flat"
              class="mr-1"
            >
              {{ item.team_a_roster.length }}
            </v-chip>
            <span class="text-caption text-grey mx-1">|</span>
            <v-chip 
              size="small" 
              :color="item.team_b_roster.length === parseInt(item.game_type) ? 'green-darken-2' : 'grey-darken-3'" 
              variant="flat"
            >
              {{ item.team_b_roster.length }}
            </v-chip>
          </div>
        </template>

        <template v-slot:item.game_type="{ item }">
          <v-chip size="small" variant="tonal" color="blue-grey" class="font-weight-bold">
            {{ item.game_type || '8v8' }}
          </v-chip>
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip 
            :color="getStatusColor(item.status)" 
            size="small" 
            variant="outlined" 
            class="text-uppercase font-weight-bold border-subtle"
          >
            {{ item.status.replace('_', ' ') }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn 
            icon 
            size="small" 
            variant="text" 
            color="white" 
            @click="openDialog(item)"
          >
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- DIALOG WIZARD -->
    <v-dialog 
      v-model="dialog" 
      fullscreen 
      transition="dialog-bottom-transition" 
      :scrim="false"
    >
      <v-card theme="dark" class="bg-dark-elevated">
        
        <!-- TOOLBAR -->
        <v-toolbar color="transparent" class="border-bottom-subtle px-4" height="70">
          <v-btn icon="mdi-close" @click="dialog = false" variant="text"></v-btn>
          
          <v-toolbar-title class="font-weight-bold text-h6">
            {{ editedItem.id ? 'Editar Encuentro' : 'Programar Nuevo Encuentro' }}
          </v-toolbar-title>

          <v-spacer></v-spacer>

          <!-- STEPPER INDICATOR -->
          <div class="stepper-indicator mr-6 d-none d-md-flex">
            <div class="step-item" :class="{ active: step === 1 }">
              <div class="step-number">1</div>
              <span class="step-label">Datos del Partido</span>
            </div>
            <div class="step-divider"></div>
            <div class="step-item" :class="{ active: step === 2 }">
              <div class="step-number">2</div>
              <span class="step-label">Convocatorias</span>
            </div>
          </div>

          <v-btn 
            v-if="step === 2"
            color="white" 
            variant="flat" 
            :loading="saving" 
            @click="saveMatch" 
            class="font-weight-bold text-black px-6"
            prepend-icon="mdi-content-save-check"
          >
            Guardar Partido
          </v-btn>
        </v-toolbar>

        <!-- CONTENIDO DEL WIZARD -->
        <v-card-text class="pa-0 fill-height overflow-auto">
          
          <!-- PASO 1: DATOS DEL PARTIDO -->
          <v-container v-show="step === 1" class="py-8" style="max-width: 900px;">
            <div class="step-content">
              
              <div class="text-center mb-8">
                <v-avatar color="rgba(255,255,255,0.05)" size="80" class="mb-4">
                  <v-icon color="white" size="40">mdi-soccer-field</v-icon>
                </v-avatar>
                <h3 class="text-h5 font-weight-bold text-white mb-2">Información del Encuentro</h3>
                <p class="text-body-2 text-grey-lighten-1">Complete los datos básicos del partido antes de asignar jugadores</p>
              </div>

              <v-row>
                <!-- EQUIPOS -->
                <v-col cols="12" md="6">
                  <v-card class="info-card pa-5" elevation="0">
                    <div class="d-flex align-center mb-4">
                      <v-icon color="blue-lighten-2" class="mr-3">mdi-shield-home</v-icon>
                      <span class="text-overline font-weight-bold text-grey">Equipo Local</span>
                    </div>
                    <v-text-field 
                      v-model="editedItem.team_a_name" 
                      placeholder="Ej: Los Tigres FC"
                      variant="outlined" 
                      density="comfortable"
                      bg-color="rgba(255,255,255,0.03)"
                      hide-details="auto"
                      class="input-premium"
                    ></v-text-field>
                  </v-card>
                </v-col>

                <v-col cols="12" md="6">
                  <v-card class="info-card pa-5" elevation="0">
                    <div class="d-flex align-center mb-4">
                      <v-icon color="orange-lighten-2" class="mr-3">mdi-shield-airplane</v-icon>
                      <span class="text-overline font-weight-bold text-grey">Equipo Visitante</span>
                    </div>
                    <v-text-field 
                      v-model="editedItem.team_b_name" 
                      placeholder="Ej: Águilas United"
                      variant="outlined" 
                      density="comfortable"
                      bg-color="rgba(255,255,255,0.03)"
                      hide-details="auto"
                      class="input-premium"
                    ></v-text-field>
                  </v-card>
                </v-col>

                <!-- FECHA Y HORA -->
                <v-col cols="12" md="4">
                  <div class="text-caption text-grey-lighten-1 mb-2 ml-1 font-weight-bold tracking-wider">FECHA DEL ENCUENTRO</div>
                  <v-text-field 
                    v-model="editedItem.date" 
                    type="date" 
                    variant="outlined" 
                    density="comfortable"
                    bg-color="rgba(255,255,255,0.03)"
                    prepend-inner-icon="mdi-calendar"
                    hide-details="auto"
                    class="input-premium"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <div class="text-caption text-grey-lighten-1 mb-2 ml-1 font-weight-bold tracking-wider">HORA DE INICIO</div>
                  <v-text-field 
                    v-model="editedItem.time" 
                    type="time" 
                    variant="outlined" 
                    density="comfortable"
                    bg-color="rgba(255,255,255,0.03)"
                    prepend-inner-icon="mdi-clock-outline"
                    hide-details="auto"
                    class="input-premium"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <div class="text-caption text-grey-lighten-1 mb-2 ml-1 font-weight-bold tracking-wider">MODALIDAD</div>
                  <v-select
                    v-model="editedItem.game_type"
                    :items="Object.entries(GAME_MODES).map(([k,v]) => ({ value: k, title: v.label }))"
                    variant="outlined"
                    density="comfortable"
                    bg-color="rgba(255,255,255,0.03)"
                    prepend-inner-icon="mdi-account-group"
                    hide-details="auto"
                    class="input-premium"
                  ></v-select>
                </v-col>

                <!-- UBICACIÓN Y ESTADO -->
                <v-col cols="12" md="8">
                  <div class="text-caption text-grey-lighten-1 mb-2 ml-1 font-weight-bold tracking-wider">UBICACIÓN</div>
                  <v-text-field 
                    v-model="editedItem.location" 
                    placeholder="Ej: Estadio Municipal"
                    variant="outlined" 
                    density="comfortable"
                    bg-color="rgba(255,255,255,0.03)"
                    prepend-inner-icon="mdi-map-marker"
                    hide-details="auto"
                    class="input-premium"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <div class="text-caption text-grey-lighten-1 mb-2 ml-1 font-weight-bold tracking-wider">ESTADO</div>
                  <v-select
                    v-model="editedItem.status"
                    :items="[
                      { value: 'programado', title: 'Programado' },
                      { value: 'en_juego', title: 'En Juego' },
                      { value: 'finalizado', title: 'Finalizado' }
                    ]"
                    variant="outlined"
                    density="comfortable"
                    bg-color="rgba(255,255,255,0.03)"
                    prepend-inner-icon="mdi-list-status"
                    hide-details="auto"
                    class="input-premium"
                  ></v-select>
                </v-col>
              </v-row>

              <!-- BOTÓN CONTINUAR -->
              <div class="text-center mt-8">
                <v-btn
                  color="white"
                  variant="flat"
                  size="large"
                  :disabled="!canProceedToStep2"
                  @click="nextStep"
                  class="text-black font-weight-bold px-12"
                  append-icon="mdi-arrow-right"
                  rounded="lg"
                  height="52"
                >
                  Continuar a Convocatorias
                </v-btn>
                <p v-if="!canProceedToStep2" class="text-caption text-orange-darken-1 mt-3">
                  Complete todos los campos para continuar
                </p>
              </div>

            </div>
          </v-container>

          <!-- PASO 2: CONVOCATORIAS -->
          <div v-show="step === 2" class="step-lineup fill-height">
            <v-row no-gutters class="fill-height">
              
              <!-- EQUIPO LOCAL -->
              <v-col cols="12" md="3" class="lineup-panel border-right-subtle">
                <div class="panel-header">
                  <div class="d-flex align-center justify-space-between mb-2">
                    <div class="d-flex align-center">
                      <v-icon color="blue-lighten-2" class="mr-2">mdi-shield-home</v-icon>
                      <span class="text-subtitle-2 font-weight-bold text-white">{{ editedItem.team_a_name || 'LOCAL' }}</span>
                    </div>
                    <v-chip 
                      size="x-small" 
                      :color="sortedTeamA.length === currentLimit ? 'green' : 'grey'" 
                      variant="flat"
                    >
                      {{ sortedTeamA.length }}/{{ currentLimit }}
                    </v-chip>
                  </div>
                  <v-progress-linear 
                    :model-value="(sortedTeamA.length / currentLimit) * 100" 
                    color="blue-lighten-2" 
                    height="3" 
                    rounded
                  ></v-progress-linear>
                </div>

                <v-list bg-color="transparent" class="roster-list">
                  <transition-group name="list">
                    <v-card 
                      v-for="p in sortedTeamA" 
                      :key="p.id" 
                      class="player-card mb-2" 
                      flat
                    >
                      <div class="d-flex align-center pa-3">
                        <v-avatar 
                          size="36" 
                          :color="POSITIONS[p.position]?.color" 
                          variant="tonal" 
                          class="mr-3"
                        >
                          <span class="text-caption font-weight-bold">{{ POSITIONS[p.position]?.abbr }}</span>
                        </v-avatar>
                        <div class="flex-grow-1 player-info">
                          <div class="text-body-2 font-weight-bold text-white text-truncate">{{ p.nombres }}</div>
                          <div class="text-caption text-grey text-uppercase">{{ POSITIONS[p.position]?.label }}</div>
                        </div>
                        <v-btn 
                          icon="mdi-close" 
                          size="x-small" 
                          variant="text" 
                          color="red" 
                          @click="removePlayer(p.id, 'A')"
                        ></v-btn>
                      </div>
                    </v-card>
                  </transition-group>
                </v-list>
              </v-col>

              <!-- POOL DE JUGADORES -->
              <v-col cols="12" md="6" class="players-pool">
                <div class="pool-header">
                  <div class="text-center mb-4">
                    <h4 class="text-h6 font-weight-bold text-white mb-1">Pool de Jugadores Disponibles</h4>
                    <p class="text-caption text-grey">Selecciona la posición y asigna al equipo correspondiente</p>
                  </div>
                  
                  <v-text-field 
                    v-model="playerSearch" 
                    placeholder="Buscar por nombre o cédula..." 
                    prepend-inner-icon="mdi-magnify" 
                    density="compact" 
                    hide-details 
                    variant="solo-filled" 
                    bg-color="rgba(255,255,255,0.05)"
                    class="search-input mb-4"
                    clearable
                  ></v-text-field>

                  <div class="text-center text-caption text-grey mb-3">
                    {{ filteredPlayers.length }} jugadores • {{ totalAssigned }} asignados
                  </div>
                </div>

                <v-list bg-color="transparent" class="players-list">
                  <v-list-item 
                    v-for="p in filteredPlayers" 
                    :key="p.id" 
                    class="player-item mb-2"
                  >
                    <template v-slot:prepend>
                      <v-avatar color="grey-darken-3" size="40" class="mr-3">
                        <span class="text-caption font-weight-bold text-white">{{ p.nombres?.charAt(0) }}</span>
                      </v-avatar>
                    </template>

                    <v-list-item-title class="text-body-2 font-weight-medium text-white">
                      {{ p.nombres }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-caption text-grey">
                      {{ p.cedula }}
                    </v-list-item-subtitle>

                    <template v-slot:append>
                      <div class="assignment-buttons">
                        <!-- Botón Equipo A -->
                        <v-menu location="start">
                          <template v-slot:activator="{ props }">
                            <v-btn 
                              v-bind="props" 
                              icon="mdi-chevron-left" 
                              size="small" 
                              color="blue-lighten-2" 
                              variant="tonal"
                              :disabled="sortedTeamA.length >= currentLimit"
                            ></v-btn>
                          </template>
                          <v-list density="compact" nav bg-color="grey-darken-3" class="position-menu">
                            <v-list-subheader class="text-caption">Posición en {{ editedItem.team_a_name }}</v-list-subheader>
                            <v-list-item 
                              v-for="(val, key) in POSITIONS" 
                              :key="key" 
                              @click="assignPlayer(p, 'A', key)"
                            >
                              <template v-slot:prepend>
                                <v-icon :color="val.color" size="18">{{ val.icon }}</v-icon>
                              </template>
                              <v-list-item-title class="text-caption">{{ val.label }}</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>

                        <!-- Botón Equipo B -->
                        <v-menu location="end">
                          <template v-slot:activator="{ props }">
                            <v-btn 
                              v-bind="props" 
                              icon="mdi-chevron-right" 
                              size="small" 
                              color="orange-lighten-2" 
                              variant="tonal"
                              :disabled="sortedTeamB.length >= currentLimit"
                            ></v-btn>
                          </template>
                          <v-list density="compact" nav bg-color="grey-darken-3" class="position-menu">
                            <v-list-subheader class="text-caption">Posición en {{ editedItem.team_b_name }}</v-list-subheader>
                            <v-list-item 
                              v-for="(val, key) in POSITIONS" 
                              :key="key" 
                              @click="assignPlayer(p, 'B', key)"
                            >
                              <template v-slot:prepend>
                                <v-icon :color="val.color" size="18">{{ val.icon }}</v-icon>
                              </template>
                              <v-list-item-title class="text-caption">{{ val.label }}</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </div>
                    </template>
                  </v-list-item>
                </v-list>
              </v-col>

              <!-- EQUIPO VISITANTE -->
              <v-col cols="12" md="3" class="lineup-panel border-left-subtle">
                <div class="panel-header">
                  <div class="d-flex align-center justify-space-between mb-2">
                    <div class="d-flex align-center">
                      <v-icon color="orange-lighten-2" class="mr-2">mdi-shield-airplane</v-icon>
                      <span class="text-subtitle-2 font-weight-bold text-white">{{ editedItem.team_b_name || 'VISITANTE' }}</span>
                    </div>
                    <v-chip 
                      size="x-small" 
                      :color="sortedTeamB.length === currentLimit ? 'green' : 'grey'" 
                      variant="flat"
                    >
                      {{ sortedTeamB.length }}/{{ currentLimit }}
                    </v-chip>
                  </div>
                  <v-progress-linear 
                    :model-value="(sortedTeamB.length / currentLimit) * 100" 
                    color="orange-lighten-2" 
                    height="3" 
                    rounded
                  ></v-progress-linear>
                </div>

                <v-list bg-color="transparent" class="roster-list">
                  <transition-group name="list">
                    <v-card 
                      v-for="p in sortedTeamB" 
                      :key="p.id" 
                      class="player-card mb-2" 
                      flat
                    >
                      <div class="d-flex align-center pa-3 flex-row-reverse text-right">
                        <v-avatar 
                          size="36" 
                          :color="POSITIONS[p.position]?.color" 
                          variant="tonal" 
                          class="ml-3"
                        >
                          <span class="text-caption font-weight-bold">{{ POSITIONS[p.position]?.abbr }}</span>
                        </v-avatar>
                        <div class="flex-grow-1 player-info">
                          <div class="text-body-2 font-weight-bold text-white text-truncate">{{ p.nombres }}</div>
                          <div class="text-caption text-grey text-uppercase">{{ POSITIONS[p.position]?.label }}</div>
                        </div>
                        <v-btn 
                          icon="mdi-close" 
                          size="x-small" 
                          variant="text" 
                          color="red" 
                          @click="removePlayer(p.id, 'B')"
                        ></v-btn>
                      </div>
                    </v-card>
                  </transition-group>
                </v-list>
              </v-col>

            </v-row>

            <!-- BOTÓN VOLVER -->
            <div class="back-button-container">
              <v-btn
                variant="outlined"
                color="white"
                @click="prevStep"
                prepend-icon="mdi-arrow-left"
                class="font-weight-bold"
                rounded="lg"
              >
                Volver a Datos del Partido
              </v-btn>
            </div>
          </div>

        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- SNACKBAR -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000" location="top">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<style scoped>
/* === ESTILOS GLOBALES === */
.bg-dark-elevated {
  background: #0a0b0d !important;
}

.card-dark-outline {
  background-color: transparent !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.border-subtle { border: 1px solid rgba(255, 255, 255, 0.08); }
.border-right-subtle { border-right: 1px solid rgba(255, 255, 255, 0.08); }
.border-left-subtle { border-left: 1px solid rgba(255, 255, 255, 0.08); }
.border-bottom-subtle { border-bottom: 1px solid rgba(255, 255, 255, 0.08); }

.tracking-wider { letter-spacing: 1.5px; }

/* === HEADER === */
.header-section {
  background: rgba(255, 255, 255, 0.02);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

/* === TABLA === */
.teams-cell {
  padding: 8px 0;
}

.team-block {
  display: flex;
  align-items: center;
}

.vs-divider {
  display: flex;
  justify-content: center;
  align-items: center;
}

.info-cell, .rosters-cell {
  padding: 4px 0;
}

/* === STEPPER === */
.stepper-indicator {
  display: flex;
  align-items: center;
  gap: 16px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0.4;
  transition: opacity 0.3s;
}

.step-item.active {
  opacity: 1;
}

.step-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.75rem;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.step-item.active .step-number {
  background: white;
  color: black;
  border-color: white;
}

.step-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
}

.step-item.active .step-label {
  color: white;
}

.step-divider {
  width: 40px;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
}

/* === PASO 1: INFO CARDS === */
.step-content {
  animation: fadeIn 0.4s ease;
}

.info-card {
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  transition: all 0.3s;
}

.info-card:hover {
  background: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(255, 255, 255, 0.15);
}

.input-premium :deep(.v-field) {
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.input-premium :deep(.v-field--focused) {
  border-color: rgba(255, 255, 255, 0.3);
}

/* === PASO 2: CONVOCATORIAS === */
.step-lineup {
  display: flex;
  flex-direction: column;
}

.lineup-panel {
  background: rgba(255, 255, 255, 0.02);
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 140px);
}

.panel-header {
  padding: 16px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
}

.roster-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.roster-list::-webkit-scrollbar { width: 4px; }
.roster-list::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 2px; }

.player-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  transition: all 0.2s;
}

.player-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}

.player-info {
  min-width: 0;
}

/* === POOL DE JUGADORES === */
.players-pool {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.01);
  max-height: calc(100vh - 140px);
}

.pool-header {
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
}

.search-input :deep(.v-field) {
  border-radius: 12px;
}

.players-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px 20px;
}

.players-list::-webkit-scrollbar { width: 6px; }
.players-list::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 3px; }

.player-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 8px 12px;
  transition: all 0.2s;
}

.player-item:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.15);
}

.assignment-buttons {
  display: flex;
  gap: 8px;
}

.position-menu {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

/* === BOTÓN VOLVER === */
.back-button-container {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

/* === ANIMACIONES === */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.list-enter-active, .list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* === RESPONSIVE === */
@media (max-width: 960px) {
  .stepper-indicator {
    display: none;
  }

  .lineup-panel, .players-pool {
    max-height: none;
  }

  .roster-list, .players-list {
    max-height: 400px;
  }
}
</style>