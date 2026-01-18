<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../../services/supabase'

// --- CONSTANTES TÁCTICAS ---
const POSITIONS = {
  arquero:   { label: 'Arquero',   icon: 'mdi-hand-back-left', color: 'yellow-accent-4', order: 1 },
  defensa:   { label: 'Defensa',   icon: 'mdi-shield',         color: 'blue-accent-3',   order: 2 },
  medio:     { label: 'Medio',     icon: 'mdi-circle-slice-8', color: 'green-accent-3',  order: 3 },
  delantero: { label: 'Delantero', icon: 'mdi-soccer',         color: 'red-accent-2',    order: 4 }
}

const GAME_MODES = {
  '6v6': { label: 'Fútbol 6', limit: 6 },
  '8v8': { label: 'Fútbol 8', limit: 8 }
}

// --- ESTADO ---
const loading = ref(false)
const saving = ref(false)
const dialog = ref(false)
const tab = ref('info') 
const search = ref('')
const snackbar = ref({ show: false, text: '', color: 'success' })

const matches = ref([])
const players = ref([]) // Pool de jugadores

// Modelo para el Partido
const editedItem = ref({
  id: null,
  date: '',
  time: '',
  location: '',
  team_a_name: '',
  team_b_name: '',
  status: 'programado',
  game_type: '8v8', // Por defecto 8 vs 8
  team_a_roster: [], 
  team_b_roster: []
})

// --- COMPUTED ---
const currentLimit = computed(() => GAME_MODES[editedItem.value.game_type].limit)

// Filtra jugadores disponibles (que no estén ya asignados)
const filteredPlayers = computed(() => {
  const term = playerSearch.value.toLowerCase()
  return players.value.filter(p => 
    !editedItem.value.team_a_roster.find(x => x.id === p.id) && 
    !editedItem.value.team_b_roster.find(x => x.id === p.id) && 
    (p.nombres?.toLowerCase().includes(term) || p.email?.toLowerCase().includes(term))
  )
})

// Ordenar rosters tácticamente (Arquero primero)
const sortedTeamA = computed(() => sortRoster([...editedItem.value.team_a_roster]))
const sortedTeamB = computed(() => sortRoster([...editedItem.value.team_b_roster]))

function sortRoster(roster) {
  return roster.sort((a, b) => {
    const orderA = POSITIONS[a.position]?.order || 99
    const orderB = POSITIONS[b.position]?.order || 99
    return orderA - orderB
  })
}

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
      // Mapear jugadores con su posición
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
  if (!editedItem.value.team_a_name || !editedItem.value.team_b_name || !editedItem.value.date) {
    showSnackbar('Faltan datos obligatorios (Equipos o Fecha)', 'warning')
    return
  }

  saving.value = true
  try {
    // 1. Guardar Partido
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

    // 2. Guardar Alineaciones (Borrar y Recrear)
    await supabase.from('match_players').delete().eq('match_id', matchId)

    const newRoster = []
    const processRoster = (roster, side) => {
      roster.forEach(p => {
        newRoster.push({
          match_id: matchId,
          player_id: p.id,
          team_side: side,
          position: p.position // Guardamos la posición
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
const playerSearch = ref('')

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
  tab.value = 'info'
  dialog.value = true
}

function assignPlayer(player, team, position) {
  const targetRoster = team === 'A' ? editedItem.value.team_a_roster : editedItem.value.team_b_roster
  
  if (targetRoster.length >= currentLimit.value) {
    showSnackbar(`Límite alcanzado (${currentLimit.value} jugadores)`, 'warning')
    return
  }

  // Agregamos al jugador CON su posición
  targetRoster.push({ ...player, position })
  playerSearch.value = '' // Limpiar busqueda
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

onMounted(() => {
  fetchMatches()
  fetchPlayers()
})
</script>

<template>
  <div class="h-100 d-flex flex-column">
    
    <div class="d-flex align-center justify-space-between mb-4">
      <div>
        <h2 class="text-h5 font-weight-bold text-white tracking-wide">GESTIÓN DE ENCUENTROS</h2>
        <p class="text-caption text-grey">Control total de alineaciones y tácticas</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-soccer-field" rounded="lg" @click="openDialog(null)" elevation="4">
        Programar Partido
      </v-btn>
    </div>

    <v-card class="card-dark-outline flex-grow-1" elevation="0">
      <v-data-table
        :headers="[
          { title: 'ENCUENTRO', key: 'teams', sortable: false, width: '40%' },
          { title: 'DETALLES', key: 'info', sortable: true },
          { title: 'MODO', key: 'game_type', align: 'center' },
          { title: 'ESTADO', key: 'status', align: 'center' },
          { title: 'ACCIONES', key: 'actions', align: 'end', sortable: false },
        ]"
        :items="matches"
        :loading="loading"
        theme="dark"
        class="bg-transparent h-100"
        hover
      >
        <template v-slot:item.teams="{ item }">
          <div class="d-flex align-center py-4 justify-center">
            <div class="text-right" style="width: 140px;">
              <div class="font-weight-bold text-white text-subtitle-1">{{ item.team_a_name }}</div>
              <div class="text-caption text-grey">{{ item.team_a_roster.length }} convocados</div>
            </div>
            <div class="mx-6 text-h6 font-weight-black text-primary">VS</div>
            <div class="text-left" style="width: 140px;">
              <div class="font-weight-bold text-white text-subtitle-1">{{ item.team_b_name }}</div>
              <div class="text-caption text-grey">{{ item.team_b_roster.length }} convocados</div>
            </div>
          </div>
        </template>

        <template v-slot:item.info="{ item }">
          <div class="d-flex flex-column">
            <span class="text-body-2 text-white"><v-icon size="small" color="primary" start>mdi-calendar</v-icon>{{ item.date }} • {{ item.time.substring(0,5) }}</span>
            <span class="text-caption text-grey mt-1"><v-icon size="small" start>mdi-map-marker</v-icon>{{ item.location }}</span>
          </div>
        </template>

        <template v-slot:item.game_type="{ item }">
          <v-chip size="small" variant="flat" color="blue-grey-darken-3" class="font-weight-bold">{{ item.game_type || '8v8' }}</v-chip>
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip :color="getStatusColor(item.status)" size="small" variant="outlined" class="text-uppercase font-weight-bold border-subtle">
            {{ item.status.replace('_', ' ') }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn icon size="small" variant="text" color="blue-lighten-2" @click="openDialog(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition" :scrim="false">
      <v-card theme="dark" class="bg-grey-darken-4">
        <v-toolbar color="surface" class="border-bottom-subtle px-2">
          <v-btn icon="mdi-close" @click="dialog = false"></v-btn>
          <v-toolbar-title class="font-weight-bold">
            {{ editedItem.id ? 'Dirección Técnica' : 'Nuevo Encuentro' }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          
          <v-btn-toggle v-model="editedItem.game_type" mandatory density="compact" class="mr-4 border-subtle" divided rounded="lg">
            <v-btn value="6v6" size="small">6 vs 6</v-btn>
            <v-btn value="8v8" size="small">8 vs 8</v-btn>
          </v-btn-toggle>

          <v-btn color="primary" variant="flat" :loading="saving" @click="saveMatch" class="font-weight-bold">
            <v-icon start>mdi-content-save-check</v-icon> Guardar
          </v-btn>
        </v-toolbar>

        <v-card-text class="pa-0 fill-height">
          <v-row no-gutters class="fill-height">
            
            <v-col cols="12" md="3" class="bg-surface border-right-subtle pa-4 d-flex flex-column">
              <h3 class="text-overline font-weight-bold text-grey mb-2">Datos del Partido</h3>
              
              <v-text-field v-model="editedItem.team_a_name" label="Equipo Local" density="compact" variant="outlined" prepend-inner-icon="mdi-shield-home" class="mb-2"></v-text-field>
              <v-text-field v-model="editedItem.team_b_name" label="Equipo Visitante" density="compact" variant="outlined" prepend-inner-icon="mdi-shield-airplane" class="mb-4"></v-text-field>
              
              <v-divider class="mb-4"></v-divider>
              
              <v-text-field v-model="editedItem.date" type="date" label="Fecha" density="compact" variant="outlined" class="mb-2"></v-text-field>
              <v-text-field v-model="editedItem.time" type="time" label="Hora" density="compact" variant="outlined" class="mb-2"></v-text-field>
              <v-text-field v-model="editedItem.location" label="Cancha" density="compact" variant="outlined" class="mb-2"></v-text-field>
              <v-select v-model="editedItem.status" :items="['programado','en_juego','finalizado']" label="Estado" density="compact" variant="outlined"></v-select>

              <v-divider class="my-4"></v-divider>
              
              <div class="mt-auto">
                <div class="d-flex justify-space-between text-caption mb-1">
                  <span>{{ editedItem.team_a_name || 'Local' }}</span>
                  <span :class="sortedTeamA.length === currentLimit ? 'text-green' : 'text-grey'">{{ sortedTeamA.length }} / {{ currentLimit }}</span>
                </div>
                <v-progress-linear :model-value="(sortedTeamA.length / currentLimit)*100" color="primary" height="4" rounded class="mb-3"></v-progress-linear>
                
                <div class="d-flex justify-space-between text-caption mb-1">
                  <span>{{ editedItem.team_b_name || 'Visitante' }}</span>
                  <span :class="sortedTeamB.length === currentLimit ? 'text-green' : 'text-grey'">{{ sortedTeamB.length }} / {{ currentLimit }}</span>
                </div>
                <v-progress-linear :model-value="(sortedTeamB.length / currentLimit)*100" color="secondary" height="4" rounded></v-progress-linear>
              </div>
            </v-col>

            <v-col cols="12" md="3" class="bg-grey-darken-4 pa-0 border-right-subtle d-flex flex-column">
              <div class="pa-3 bg-surface border-bottom-subtle text-center">
                <div class="font-weight-bold text-primary">{{ editedItem.team_a_name || 'LOCAL' }}</div>
                <div class="text-caption text-grey">Plantilla Táctica</div>
              </div>
              
              <v-list bg-color="transparent" class="flex-grow-1 overflow-y-auto custom-scroll pa-2">
                <transition-group name="list">
                  <v-card v-for="p in sortedTeamA" :key="p.id" class="mb-2 bg-surface border-subtle" flat>
                    <div class="d-flex align-center pa-2">
                      <v-avatar size="32" :color="POSITIONS[p.position]?.color" variant="tonal" class="mr-3">
                        <v-icon size="small">{{ POSITIONS[p.position]?.icon }}</v-icon>
                      </v-avatar>
                      <div class="flex-grow-1">
                        <div class="text-body-2 font-weight-bold">{{ p.nombres }}</div>
                        <div class="text-caption text-grey text-uppercase" style="font-size: 10px !important;">{{ POSITIONS[p.position]?.label }}</div>
                      </div>
                      <v-btn icon="mdi-close" size="x-small" variant="text" color="red" @click="removePlayer(p.id, 'A')"></v-btn>
                    </div>
                  </v-card>
                </transition-group>
              </v-list>
            </v-col>

            <v-col cols="12" md="3" class="bg-black pa-0 border-right-subtle d-flex flex-column">
              <div class="pa-3 bg-surface border-bottom-subtle">
                <v-text-field 
                  v-model="playerSearch" 
                  placeholder="Buscar jugador..." 
                  prepend-inner-icon="mdi-magnify" 
                  density="compact" hide-details 
                  variant="solo-filled" 
                  bg-color="grey-darken-4"
                  class="rounded-lg"
                ></v-text-field>
              </div>
              
              <div class="text-center text-caption text-grey py-1 bg-grey-darken-4 border-bottom-subtle">
                {{ filteredPlayers.length }} jugadores disponibles
              </div>

              <v-list bg-color="transparent" class="flex-grow-1 overflow-y-auto custom-scroll pa-2">
                <v-list-item v-for="p in filteredPlayers" :key="p.id" class="mb-1 rounded hover-effect">
                  <v-list-item-title class="text-body-2 font-weight-medium">{{ p.nombres }}</v-list-item-title>
                  <v-list-item-subtitle class="text-caption">{{ p.cedula }}</v-list-item-subtitle>
                  
                  <template v-slot:append>
                    <div class="d-flex align-center gap-2">
                      <v-menu location="start">
                        <template v-slot:activator="{ props }">
                          <v-btn v-bind="props" icon="mdi-chevron-left" size="small" color="primary" variant="tonal" :disabled="sortedTeamA.length >= currentLimit"></v-btn>
                        </template>
                        <v-list density="compact" nav bg-color="grey-darken-3">
                          <v-list-subheader class="text-caption">Jugará como...</v-list-subheader>
                          <v-list-item v-for="(val, key) in POSITIONS" :key="key" :value="key" @click="assignPlayer(p, 'A', key)">
                            <template v-slot:prepend><v-icon :color="val.color" size="small">{{ val.icon }}</v-icon></template>
                            <v-list-item-title>{{ val.label }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>

                      <v-menu location="end">
                        <template v-slot:activator="{ props }">
                          <v-btn v-bind="props" icon="mdi-chevron-right" size="small" color="secondary" variant="tonal" :disabled="sortedTeamB.length >= currentLimit"></v-btn>
                        </template>
                        <v-list density="compact" nav bg-color="grey-darken-3">
                          <v-list-subheader class="text-caption">Jugará como...</v-list-subheader>
                          <v-list-item v-for="(val, key) in POSITIONS" :key="key" :value="key" @click="assignPlayer(p, 'B', key)">
                            <template v-slot:prepend><v-icon :color="val.color" size="small">{{ val.icon }}</v-icon></template>
                            <v-list-item-title>{{ val.label }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </div>
                  </template>
                </v-list-item>
              </v-list>
            </v-col>

            <v-col cols="12" md="3" class="bg-grey-darken-4 pa-0 d-flex flex-column">
              <div class="pa-3 bg-surface border-bottom-subtle text-center">
                <div class="font-weight-bold text-secondary">{{ editedItem.team_b_name || 'VISITANTE' }}</div>
                <div class="text-caption text-grey">Plantilla Táctica</div>
              </div>
              
              <v-list bg-color="transparent" class="flex-grow-1 overflow-y-auto custom-scroll pa-2">
                <transition-group name="list">
                  <v-card v-for="p in sortedTeamB" :key="p.id" class="mb-2 bg-surface border-subtle" flat>
                    <div class="d-flex align-center pa-2 flex-row-reverse text-right">
                      <v-avatar size="32" :color="POSITIONS[p.position]?.color" variant="tonal" class="ml-3">
                        <v-icon size="small">{{ POSITIONS[p.position]?.icon }}</v-icon>
                      </v-avatar>
                      <div class="flex-grow-1">
                        <div class="text-body-2 font-weight-bold">{{ p.nombres }}</div>
                        <div class="text-caption text-grey text-uppercase" style="font-size: 10px !important;">{{ POSITIONS[p.position]?.label }}</div>
                      </div>
                      <v-btn icon="mdi-close" size="x-small" variant="text" color="red" @click="removePlayer(p.id, 'B')"></v-btn>
                    </div>
                  </v-card>
                </transition-group>
              </v-list>
            </v-col>

          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000" location="top">
      {{ snackbar.text }}
      <template v-slot:actions><v-btn variant="text" @click="snackbar.show = false">Cerrar</v-btn></template>
    </v-snackbar>
  </div>
</template>

<style scoped>
.card-dark-outline {
  background-color: transparent !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}
.bg-transparent { background-color: transparent !important; }
.border-subtle { border: 1px solid rgba(255, 255, 255, 0.1); }
.border-right-subtle { border-right: 1px solid rgba(255, 255, 255, 0.1); }
.border-bottom-subtle { border-bottom: 1px solid rgba(255, 255, 255, 0.1); }

.custom-scroll::-webkit-scrollbar { width: 5px; }
.custom-scroll::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 3px; }

.gap-2 { gap: 8px; }
.hover-effect:hover { background-color: rgba(255,255,255,0.05); }

/* Animaciones de Lista */
.list-enter-active, .list-leave-active { transition: all 0.3s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateY(10px); }
</style>