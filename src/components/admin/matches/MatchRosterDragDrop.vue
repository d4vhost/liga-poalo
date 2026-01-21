<script setup>
import { ref, computed } from 'vue'
import MatchFieldTactical from './MatchFieldTactical.vue'

const props = defineProps({ 
  modelValue: Object, 
  playersPool: Array 
})
const emit = defineEmits(['update:modelValue', 'notify'])

const LIMIT = 11
const playerSearch = ref('')

// --- COMPUTED ---
const filteredPlayers = computed(() => {
  const term = playerSearch.value.toLowerCase()
  const assignedIds = [...props.modelValue.team_a_roster, ...props.modelValue.team_b_roster].map(p => p.id)
  return props.playersPool.filter(p => 
    !assignedIds.includes(p.id) && 
    (p.nombres?.toLowerCase().includes(term) || p.cedula?.includes(term))
  )
})

// --- ACCIONES ---
function assignPlayerToTeam(player, team) {
  const isTeamA = team === 'A'
  const roster = isTeamA ? props.modelValue.team_a_roster : props.modelValue.team_b_roster
  
  if (roster.length >= LIMIT) {
    emit('notify', { text: `Límite alcanzado (${LIMIT} jugadores)`, color: 'warning' })
    return
  }
  
  const newRoster = [...roster, { 
    ...player, 
    fieldX: 50, 
    fieldY: isTeamA ? 30 : 70 // Posición inicial diferente por equipo
  }]
  
  emit('update:modelValue', { 
    ...props.modelValue, 
    [isTeamA ? 'team_a_roster' : 'team_b_roster']: newRoster 
  })
  
  playerSearch.value = ''
}

function updateTeamRoster(team, newRoster) {
  const key = team === 'A' ? 'team_a_roster' : 'team_b_roster'
  emit('update:modelValue', { ...props.modelValue, [key]: newRoster })
}

function removePlayer(team, playerId) {
  const isTeamA = team === 'A'
  const roster = isTeamA ? props.modelValue.team_a_roster : props.modelValue.team_b_roster
  const newRoster = roster.filter(p => p.id !== playerId)
  emit('update:modelValue', { 
    ...props.modelValue, 
    [isTeamA ? 'team_a_roster' : 'team_b_roster']: newRoster 
  })
}

// Drag desde el pool
function startDragFromPool(event, player) {
  event.dataTransfer.effectAllowed = 'copy'
  event.dataTransfer.setData('player', JSON.stringify(player))
}

// Drop en campo específico
function dropOnField(event, team) {
  event.preventDefault()
  const playerData = event.dataTransfer.getData('player')
  if (playerData) {
    const player = JSON.parse(playerData)
    assignPlayerToTeam(player, team)
  }
}

function allowDrop(event) {
  event.preventDefault()
}
</script>

<template>
  <div class="roster-drag-container">
    
    <!-- POOL DE JUGADORES (IZQUIERDA) -->
    <div class="players-pool-section">
      <div class="pool-header">
        <div class="text-center mb-3">
          <v-icon size="36" color="grey-lighten-1" class="mb-2">mdi-account-group</v-icon>
          <h4 class="text-h6 font-weight-bold text-white mb-1">Pool de Jugadores</h4>
          <p class="text-caption text-grey mb-0">{{ filteredPlayers.length }} disponibles</p>
        </div>
        
        <v-text-field 
          v-model="playerSearch" 
          placeholder="Buscar jugador..." 
          prepend-inner-icon="mdi-magnify" 
          density="compact" 
          variant="solo-filled" 
          bg-color="rgba(255,255,255,0.05)" 
          class="search-input" 
          hide-details 
          clearable
        ></v-text-field>
      </div>

      <v-list bg-color="transparent" class="players-list">
        <v-list-item 
          v-for="p in filteredPlayers" 
          :key="p.id" 
          class="player-pool-item mb-2"
          draggable="true"
          @dragstart="startDragFromPool($event, p)"
        >
          <template v-slot:prepend>
            <v-avatar color="grey-darken-3" size="36" class="mr-3">
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
            <div class="d-flex gap-2">
              <v-btn 
                icon="mdi-chevron-down" 
                size="small" 
                color="blue-lighten-2" 
                variant="tonal"
                @click="assignPlayerToTeam(p, 'A')"
                title="Asignar a equipo local"
              ></v-btn>
              <v-btn 
                icon="mdi-chevron-up" 
                size="small" 
                color="orange-lighten-2" 
                variant="tonal"
                @click="assignPlayerToTeam(p, 'B')"
                title="Asignar a equipo visitante"
              ></v-btn>
            </div>
          </template>
        </v-list-item>

        <v-list-item v-if="filteredPlayers.length === 0" class="text-center py-8">
          <v-list-item-title class="text-grey-darken-1">
            No hay jugadores disponibles
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </div>

    <!-- CAMPOS TÁCTICOS (DERECHA - DOS COLUMNAS) -->
    <div class="tactical-fields">
      
      <!-- EQUIPO A (LOCAL) - ARRIBA -->
      <div 
        class="field-container"
        @drop="dropOnField($event, 'A')"
        @dragover="allowDrop"
      >
        <MatchFieldTactical
          :team-name="modelValue.team_a_name || 'EQUIPO LOCAL'"
          :roster="modelValue.team_a_roster"
          team-side="A"
          @update:roster="updateTeamRoster('A', $event)"
          @remove-player="removePlayer('A', $event)"
        />
      </div>

      <!-- EQUIPO B (VISITANTE) - ABAJO -->
      <div 
        class="field-container"
        @drop="dropOnField($event, 'B')"
        @dragover="allowDrop"
      >
        <MatchFieldTactical
          :team-name="modelValue.team_b_name || 'EQUIPO VISITANTE'"
          :roster="modelValue.team_b_roster"
          team-side="B"
          @update:roster="updateTeamRoster('B', $event)"
          @remove-player="removePlayer('B', $event)"
        />
      </div>

    </div>

  </div>
</template>

<style scoped>
.roster-drag-container {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 20px;
  height: 100%;
  padding: 20px;
  background: rgba(0, 0, 0, 0.1);
}

/* POOL DE JUGADORES */
.players-pool-section {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
}

.pool-header {
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
}

.players-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.players-list::-webkit-scrollbar {
  width: 6px;
}

.players-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.player-pool-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  transition: all 0.2s;
  cursor: grab;
}

.player-pool-item:active {
  cursor: grabbing;
}

.player-pool-item:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

/* CAMPOS TÁCTICOS */
.tactical-fields {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 20px;
  overflow-y: auto;
}

.field-container {
  min-height: 600px;
  border-radius: 16px;
  overflow: hidden;
}

.gap-2 { gap: 8px; }

/* RESPONSIVE */
@media (max-width: 1400px) {
  .roster-drag-container {
    grid-template-columns: 280px 1fr;
  }
}

@media (max-width: 1200px) {
  .roster-drag-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }

  .players-pool-section {
    max-height: 300px;
  }

  .tactical-fields {
    grid-template-rows: auto auto;
  }
}
</style>