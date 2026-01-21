<script setup>
import { ref, computed } from 'vue'
import estadioImage from '../../../images/estadio_alineacion.jpg'

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

  const field = event.currentTarget.querySelector('.field-content')
  if (!field) return
  
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
  <div class="tactical-board-single">
    <!-- Header -->
    <div class="board-header">
      <div class="d-flex align-center">
        <v-icon :color="teamColor" class="mr-2" size="28">mdi-shield-outline</v-icon>
        <span class="text-h6 font-weight-bold text-white">{{ teamName }}</span>
      </div>
      <v-chip size="small" :color="playersOnField.length === 11 ? 'green' : 'grey'" variant="flat">
        {{ playersOnField.length }}/11 Jugadores
      </v-chip>
    </div>

    <!-- Campo de Fútbol con Imagen Real -->
    <div 
      class="football-field-real" 
      :style="{ backgroundImage: `url(${estadioImage})` }"
      @drop="onFieldDrop"
      @dragover="allowDrop"
    >
      <!-- Contenedor interno para mantener proporción -->
      <div class="field-content">
        
        <!-- Overlay oscuro para mejor contraste -->
        <div class="field-overlay"></div>

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
            <span class="player-initial">{{ player.nombres?.split(' ')[0]?.charAt(0) || '?' }}</span>
          </div>
          <div class="player-name-tag">{{ player.nombres?.split(' ')[0] || 'Sin nombre' }}</div>
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
          <div class="empty-content">
            <v-icon size="56" color="white" class="mb-3">mdi-drag</v-icon>
            <p class="text-h6 font-weight-bold text-white mb-1">Arrastra jugadores aquí</p>
            <p class="text-body-2 text-grey-lighten-2">Posiciona a los 11 jugadores en el campo</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Instrucciones -->
    <div class="instructions">
      <v-icon size="small" color="blue-lighten-2" class="mr-2">mdi-information-outline</v-icon>
      <span class="text-caption text-grey-lighten-1">Arrastra y suelta los jugadores para posicionarlos estratégicamente</span>
    </div>
  </div>
</template>

<style scoped>
.tactical-board-single {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: rgba(0, 0, 0, 0.6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.football-field-real {
  flex: 1;
  position: relative;
  background-color: #1a1a1a;
  margin: 0;
  overflow: hidden;
  min-height: 850px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.field-content {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 700px;
  max-height: 1000px;
  background-image: inherit;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.field-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.15);
  pointer-events: none;
}

/* Jugadores en el campo */
.player-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: move;
  user-select: none;
  z-index: 10;
  transition: transform 0.1s ease;
}

.player-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--team-color);
  border: 4px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
  transition: all 0.2s;
  position: relative;
}

.player-marker:hover .player-circle {
  transform: scale(1.15);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.8);
}

.player-initial {
  font-size: 1.4rem;
  font-weight: 900;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.player-name-tag {
  position: absolute;
  top: 66px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: bold;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.remove-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  background: rgba(244, 67, 54, 0.95) !important;
  opacity: 0;
  transition: opacity 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
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
  z-index: 5;
}

.empty-content {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  padding: 40px 60px;
  border-radius: 20px;
  border: 2px dashed rgba(255, 255, 255, 0.3);
}

.instructions {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px;
  background: rgba(0, 0, 0, 0.5);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
</style>