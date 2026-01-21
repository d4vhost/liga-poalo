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
const currentTeamStep = ref('A') // 'A' o 'B'

// --- COMPUTED ---
const filteredPlayers = computed(() => {
  const term = playerSearch.value.toLowerCase()
  const assignedIds = [...props.modelValue.team_a_roster, ...props.modelValue.team_b_roster].map(p => p.id)
  return props.playersPool.filter(p => 
    !assignedIds.includes(p.id) && 
    (p.nombres?.toLowerCase().includes(term) || p.cedula?.includes(term))
  )
})

const currentTeamRoster = computed(() => {
  return currentTeamStep.value === 'A' 
    ? props.modelValue.team_a_roster 
    : props.modelValue.team_b_roster
})

const currentTeamName = computed(() => {
  return currentTeamStep.value === 'A' 
    ? props.modelValue.team_a_name 
    : props.modelValue.team_b_name
})

const canContinueToTeamB = computed(() => {
  return props.modelValue.team_a_roster.length === LIMIT
})

// --- ACCIONES ---
function assignPlayerToCurrentTeam(player) {
  const team = currentTeamStep.value
  const isTeamA = team === 'A'
  const roster = isTeamA ? props.modelValue.team_a_roster : props.modelValue.team_b_roster
  
  if (roster.length >= LIMIT) {
    emit('notify', { text: `Límite alcanzado (${LIMIT} jugadores)`, color: 'warning' })
    return
  }
  
  const newRoster = [...roster, { 
    ...player, 
    fieldX: 50, 
    fieldY: isTeamA ? 70 : 30 // Posición inicial
  }]
  
  emit('update:modelValue', { 
    ...props.modelValue, 
    [isTeamA ? 'team_a_roster' : 'team_b_roster']: newRoster 
  })
  
  playerSearch.value = ''
}

function updateCurrentTeamRoster(newRoster) {
  const key = currentTeamStep.value === 'A' ? 'team_a_roster' : 'team_b_roster'
  emit('update:modelValue', { ...props.modelValue, [key]: newRoster })
}

function removePlayer(playerId) {
  const team = currentTeamStep.value
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

// Drop en campo
function dropOnField(event) {
  event.preventDefault()
  const playerData = event.dataTransfer.getData('player')
  if (playerData) {
    const player = JSON.parse(playerData)
    assignPlayerToCurrentTeam(player)
  }
}

function allowDrop(event) {
  event.preventDefault()
}

function goToTeamB() {
  if (canContinueToTeamB.value) {
    currentTeamStep.value = 'B'
  }
}

function backToTeamA() {
  currentTeamStep.value = 'A'
}
</script>

<template>
  <div class="roster-step-container">
    
    <!-- INDICADOR DE PROGRESO -->
    <div class="progress-indicator">
      <div class="step-badge" :class="{ active: currentTeamStep === 'A', completed: canContinueToTeamB }">
        <v-icon v-if="canContinueToTeamB" color="white" size="20">mdi-check</v-icon>
        <span v-else class="step-number">1</span>
      </div>
      <div class="step-info">
        <span class="step-label">{{ currentTeamStep === 'A' ? 'CONFIGURANDO' : 'COMPLETADO' }}</span>
        <span class="step-title">{{ modelValue.team_a_name || 'Equipo Local' }}</span>
      </div>

      <div class="step-divider"></div>

      <div class="step-badge" :class="{ active: currentTeamStep === 'B', disabled: !canContinueToTeamB }">
        <span class="step-number">2</span>
      </div>
      <div class="step-info">
        <span class="step-label">{{ currentTeamStep === 'B' ? 'CONFIGURANDO' : 'PENDIENTE' }}</span>
        <span class="step-title">{{ modelValue.team_b_name || 'Equipo Visitante' }}</span>
      </div>
    </div>

    <div class="content-wrapper">
      
      <!-- POOL DE JUGADORES (IZQUIERDA) -->
      <div class="players-pool-section">
        <div class="pool-header">
          <div class="text-center mb-3">
            <v-icon size="40" color="grey-lighten-1" class="mb-2">mdi-account-group</v-icon>
            <h4 class="text-h6 font-weight-bold text-white mb-1">Jugadores Disponibles</h4>
            <p class="text-caption text-grey mb-0">{{ filteredPlayers.length }} en pool</p>
          </div>
          
          <v-text-field 
            v-model="playerSearch" 
            placeholder="Buscar por nombre o cédula..." 
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
              <v-avatar color="grey-darken-3" size="40" class="mr-3">
                <span class="text-body-2 font-weight-bold text-white">{{ p.nombres?.charAt(0) }}</span>
              </v-avatar>
            </template>
            
            <v-list-item-title class="text-body-2 font-weight-medium text-white">
              {{ p.nombres }}
            </v-list-item-title>
            <v-list-item-subtitle class="text-caption text-grey">
              CI: {{ p.cedula }}
            </v-list-item-subtitle>

            <template v-slot:append>
              <v-btn 
                icon="mdi-plus" 
                size="small" 
                :color="currentTeamStep === 'A' ? 'blue-lighten-2' : 'orange-lighten-2'" 
                variant="tonal"
                @click="assignPlayerToCurrentTeam(p)"
                :title="`Agregar a ${currentTeamName}`"
              ></v-btn>
            </template>
          </v-list-item>

          <v-list-item v-if="filteredPlayers.length === 0" class="text-center py-8">
            <v-list-item-title class="text-grey-darken-1">
              No hay jugadores disponibles
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </div>

      <!-- CAMPO TÁCTICO (DERECHA) -->
      <div class="tactical-section">
        
        <!-- CAMPO DEL EQUIPO A -->
        <div 
          v-show="currentTeamStep === 'A'"
          class="field-wrapper"
          @drop="dropOnField"
          @dragover="allowDrop"
        >
          <MatchFieldTactical
            :team-name="modelValue.team_a_name || 'EQUIPO LOCAL'"
            :roster="modelValue.team_a_roster"
            team-side="A"
            @update:roster="updateCurrentTeamRoster"
            @remove-player="removePlayer"
          />

          <!-- Botón para continuar -->
          <div class="navigation-footer">
            <v-btn
              block
              color="white"
              size="large"
              height="56"
              :disabled="!canContinueToTeamB"
              @click="goToTeamB"
              class="text-black font-weight-bold"
              append-icon="mdi-arrow-right"
            >
              Continuar a {{ modelValue.team_b_name || 'Equipo Visitante' }}
            </v-btn>
            <p v-if="!canContinueToTeamB" class="text-caption text-orange-darken-1 text-center mt-2 mb-0">
              Debes seleccionar exactamente 11 jugadores ({{ modelValue.team_a_roster.length }}/11)
            </p>
          </div>
        </div>

        <!-- CAMPO DEL EQUIPO B -->
        <div 
          v-show="currentTeamStep === 'B'"
          class="field-wrapper"
          @drop="dropOnField"
          @dragover="allowDrop"
        >
          <MatchFieldTactical
            :team-name="modelValue.team_b_name || 'EQUIPO VISITANTE'"
            :roster="modelValue.team_b_roster"
            team-side="B"
            @update:roster="updateCurrentTeamRoster"
            @remove-player="removePlayer"
          />

          <!-- Botón para volver -->
          <div class="navigation-footer">
            <v-btn
              variant="outlined"
              color="white"
              size="large"
              height="48"
              @click="backToTeamA"
              prepend-icon="mdi-arrow-left"
              class="font-weight-bold"
            >
              Volver a {{ modelValue.team_a_name || 'Equipo Local' }}
            </v-btn>
          </div>
        </div>

      </div>

    </div>

  </div>
</template>

<style scoped>
.roster-step-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  padding: 20px;
}

/* INDICADOR DE PROGRESO */
.progress-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.step-badge {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.step-badge.active {
  background: white;
  border-color: white;
  transform: scale(1.1);
}

.step-badge.completed {
  background: #4CAF50;
  border-color: #4CAF50;
}

.step-badge.disabled {
  opacity: 0.3;
}

.step-number {
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
}

.step-badge.active .step-number {
  color: black;
}

.step-info {
  display: flex;
  flex-direction: column;
  margin-left: 12px;
  margin-right: 20px;
}

.step-label {
  font-size: 0.65rem;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 1px;
}

.step-title {
  font-size: 0.9rem;
  font-weight: bold;
  color: white;
}

.step-divider {
  width: 60px;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  margin: 0 16px;
}

/* CONTENEDOR PRINCIPAL */
.content-wrapper {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 20px;
  flex: 1;
  overflow: hidden;
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

/* SECCIÓN TÁCTICA */
.tactical-section {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.field-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.navigation-footer {
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

/* RESPONSIVE */
@media (max-width: 1400px) {
  .content-wrapper {
    grid-template-columns: 300px 1fr;
  }
}

@media (max-width: 1200px) {
  .content-wrapper {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }

  .players-pool-section {
    max-height: 300px;
  }
}
</style>