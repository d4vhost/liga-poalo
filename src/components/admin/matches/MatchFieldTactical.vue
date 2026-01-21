<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  teamName: String,
  roster: Array,
  teamSide: String // 'A' o 'B'
})

const emit = defineEmits(['update:roster', 'remove-player'])

const draggedPlayer = ref(null)

// Jugadores posicionados en el campo
const playersOnField = computed(() => {
  return props.roster.map(player => ({
    ...player,
    x: player.fieldX || 50,
    y: player.fieldY || 50
  }))
})

function startDrag(event, player) {
  draggedPlayer.value = player
  event.dataTransfer.effectAllowed = 'move'
}

function onFieldDrop(event) {
  event.preventDefault()
  if (!draggedPlayer.value) return

  const field = event.currentTarget
  const rect = field.getBoundingClientRect()
  
  // Calcular posición en porcentaje
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100

  // Actualizar posición del jugador
  const updatedRoster = props.roster.map(p => 
    p.id === draggedPlayer.value.id 
      ? { ...p, fieldX: Math.max(5, Math.min(95, x)), fieldY: Math.max(5, Math.min(95, y)) }
      : p
  )
  
  emit('update:roster', updatedRoster)
  draggedPlayer.value = null
}

function allowDrop(event) {
  event.preventDefault()
}

function removeFromField(player) {
  emit('remove-player', player.id)
}

// Color del equipo
const teamColor = computed(() => props.teamSide === 'A' ? '#42A5F5' : '#FF7043')
</script>

<template>
  <div class="tactical-board">
    <!-- Header -->
    <div class="board-header">
      <div class="d-flex align-center">
        <v-icon :color="teamColor" class="mr-2">mdi-shield-outline</v-icon>
        <span class="text-subtitle-1 font-weight-bold text-white">{{ teamName }}</span>
      </div>
      <v-chip size="small" :color="playersOnField.length === 11 ? 'green' : 'grey'" variant="flat">
        {{ playersOnField.length }}/11
      </v-chip>
    </div>

    <!-- Campo de Fútbol -->
    <div 
      class="football-field" 
      @drop="onFieldDrop"
      @dragover="allowDrop"
    >
      <!-- Líneas del campo -->
      <div class="field-lines">
        <!-- Área grande superior -->
        <div class="penalty-box top">
          <div class="goal-box top"></div>
          <div class="goal top"></div>
        </div>
        
        <!-- Círculo central -->
        <div class="center-circle">
          <div class="center-spot"></div>
        </div>
        <div class="center-line"></div>
        
        <!-- Área grande inferior -->
        <div class="penalty-box bottom">
          <div class="goal-box bottom"></div>
          <div class="goal bottom"></div>
        </div>
      </div>

      <!-- Jugadores en el campo -->
      <div 
        v-for="player in playersOnField" 
        :key="player.id"
        class="player-marker"
        :style="{ 
          left: `${player.fieldX}%`, 
          top: `${player.fieldY}%`,
          '--team-color': teamColor
        }"
        draggable="true"
        @dragstart="startDrag($event, player)"
      >
        <div class="player-circle">
          <span class="player-number">{{ player.nombres?.split(' ')[0]?.charAt(0) || '?' }}</span>
        </div>
        <div class="player-name">{{ player.nombres?.split(' ')[0] || 'Sin nombre' }}</div>
        <v-btn 
          icon="mdi-close" 
          size="x-small" 
          variant="text" 
          color="red" 
          class="remove-btn"
          @click.stop="removeFromField(player)"
        ></v-btn>
      </div>

      <!-- Mensaje cuando está vacío -->
      <div v-if="playersOnField.length === 0" class="empty-field-message">
        <v-icon size="40" color="grey-darken-1" class="mb-2">mdi-drag</v-icon>
        <p class="text-body-2 text-grey-darken-1">Arrastra jugadores aquí</p>
      </div>
    </div>

    <!-- Instrucciones -->
    <div class="instructions">
      <v-icon size="small" color="blue-grey-lighten-2" class="mr-2">mdi-information-outline</v-icon>
      <span class="text-caption text-grey-lighten-1">Arrastra jugadores desde el pool para posicionarlos en el campo</span>
    </div>
  </div>
</template>

<style scoped>
.tactical-board {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  overflow: hidden;
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.football-field {
  flex: 1;
  position: relative;
  background: 
    linear-gradient(90deg, rgba(34, 139, 34, 0.9) 0%, rgba(50, 205, 50, 0.8) 50%, rgba(34, 139, 34, 0.9) 100%),
    repeating-linear-gradient(0deg, transparent, transparent 10%, rgba(255, 255, 255, 0.03) 10%, rgba(255, 255, 255, 0.03) 20%);
  margin: 12px;
  border-radius: 8px;
  overflow: hidden;
  min-height: 600px;
}

/* Líneas del campo */
.field-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.center-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255, 255, 255, 0.4);
  transform: translateY(-50%);
}

.center-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  height: 120px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.center-spot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.penalty-box {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 20%;
  border: 2px solid rgba(255, 255, 255, 0.4);
}

.penalty-box.top {
  top: 0;
  border-top: none;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.penalty-box.bottom {
  bottom: 0;
  border-bottom: none;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.goal-box {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 50%;
  height: 50%;
  border: 2px solid rgba(255, 255, 255, 0.4);
}

.goal-box.top {
  top: 0;
  border-top: none;
}

.goal-box.bottom {
  bottom: 0;
  border-bottom: none;
}

.goal {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 30%;
  height: 30px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.goal.top {
  top: -30px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom: none;
}

.goal.bottom {
  bottom: -30px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-top: none;
}

/* Jugadores en el campo */
.player-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: move;
  user-select: none;
  z-index: 10;
}

.player-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--team-color);
  border: 3px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s;
}

.player-marker:hover .player-circle {
  transform: scale(1.1);
}

.player-number {
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.player-name {
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: bold;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.remove-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  background: rgba(0, 0, 0, 0.7) !important;
  opacity: 0;
  transition: opacity 0.2s;
}

.player-marker:hover .remove-btn {
  opacity: 1;
}

.empty-field-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

.instructions {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}
</style>