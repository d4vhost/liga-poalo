<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: Object, // El objeto del partido
  playersPool: Array  // Todos los jugadores disponibles
})
const emit = defineEmits(['update:modelValue', 'notify'])

// Constantes tácticas locales
const POSITIONS = {
  arquero:   { label: 'Arquero',   icon: 'mdi-hand-back-left', color: 'yellow-accent-4', order: 1, abbr: 'ARQ' },
  defensa:   { label: 'Defensa',   icon: 'mdi-shield',         color: 'blue-accent-3',   order: 2, abbr: 'DEF' },
  medio:     { label: 'Medio',     icon: 'mdi-circle-slice-8', color: 'green-accent-3',  order: 3, abbr: 'MED' },
  delantero: { label: 'Delantero', icon: 'mdi-soccer',         color: 'red-accent-2',    order: 4, abbr: 'DEL' }
}

const GAME_MODES = { '6v6': 6, '8v8': 8 }
const playerSearch = ref('')

// Computed Helpers
const currentLimit = computed(() => GAME_MODES[props.modelValue.game_type] || 8)

const filteredPlayers = computed(() => {
  const term = playerSearch.value.toLowerCase()
  const assignedIds = [...props.modelValue.team_a_roster, ...props.modelValue.team_b_roster].map(p => p.id)
  
  return props.playersPool.filter(p => 
    !assignedIds.includes(p.id) && 
    (p.nombres?.toLowerCase().includes(term) || p.cedula?.includes(term))
  )
})

// Acciones
function assignPlayer(player, team, position) {
  const isTeamA = team === 'A'
  const roster = isTeamA ? props.modelValue.team_a_roster : props.modelValue.team_b_roster
  
  if (roster.length >= currentLimit.value) {
    emit('notify', { text: 'Límite de jugadores alcanzado', color: 'warning' })
    return
  }

  // Clonamos y actualizamos
  const newRoster = [...roster, { ...player, position }]
  updateRoster(isTeamA ? 'team_a_roster' : 'team_b_roster', newRoster)
  playerSearch.value = ''
}

function removePlayer(playerId, team) {
  const isTeamA = team === 'A'
  const roster = isTeamA ? props.modelValue.team_a_roster : props.modelValue.team_b_roster
  const newRoster = roster.filter(p => p.id !== playerId)
  updateRoster(isTeamA ? 'team_a_roster' : 'team_b_roster', newRoster)
}

function updateRoster(key, value) {
  // Emitimos el cambio hacia arriba
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>

<template>
  <div class="d-flex fill-height">
    <div class="team-panel border-r">
      <div class="panel-header bg-grey-darken-4 pa-3">
        <h4 class="text-subtitle-2 font-weight-bold text-blue-lighten-2">{{ modelValue.team_a_name || 'LOCAL' }}</h4>
        <div class="text-caption text-grey">{{ modelValue.team_a_roster.length }} / {{ currentLimit }}</div>
      </div>
      <v-list class="overflow-y-auto fill-height bg-transparent">
        <v-list-item v-for="p in modelValue.team_a_roster" :key="p.id">
          <template v-slot:prepend>
            <v-icon :color="POSITIONS[p.position]?.color" size="small">{{ POSITIONS[p.position]?.icon }}</v-icon>
          </template>
          <v-list-item-title class="text-caption">{{ p.nombres }}</v-list-item-title>
          <template v-slot:append>
             <v-btn icon="mdi-close" size="x-small" variant="text" color="red" @click="removePlayer(p.id, 'A')"></v-btn>
          </template>
        </v-list-item>
      </v-list>
    </div>

    <div class="pool-panel flex-grow-1 px-4">
      <v-text-field 
        v-model="playerSearch" 
        placeholder="Buscar jugador..." 
        prepend-inner-icon="mdi-magnify" 
        density="compact" 
        variant="solo-filled" 
        class="mt-4"
      ></v-text-field>
      
      <v-list class="bg-transparent overflow-y-auto" style="height: calc(100% - 80px)">
        <v-list-item v-for="p in filteredPlayers" :key="p.id" class="mb-1 rounded bg-grey-darken-3">
          <v-list-item-title class="text-body-2">{{ p.nombres }}</v-list-item-title>
          <template v-slot:append>
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon="mdi-chevron-left" size="small" color="blue"></v-btn>
              </template>
              <v-list density="compact">
                <v-list-item v-for="(v, k) in POSITIONS" :key="k" @click="assignPlayer(p, 'A', k)" :title="v.label">
                   <template v-slot:prepend><v-icon :color="v.color">{{ v.icon }}</v-icon></template>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon="mdi-chevron-right" size="small" color="orange"></v-btn>
              </template>
              <v-list density="compact">
                <v-list-item v-for="(v, k) in POSITIONS" :key="k" @click="assignPlayer(p, 'B', k)" :title="v.label">
                   <template v-slot:prepend><v-icon :color="v.color">{{ v.icon }}</v-icon></template>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-list-item>
      </v-list>
    </div>

    <div class="team-panel border-l">
      <div class="panel-header bg-grey-darken-4 pa-3 text-right">
        <h4 class="text-subtitle-2 font-weight-bold text-orange-lighten-2">{{ modelValue.team_b_name || 'VISITANTE' }}</h4>
        <div class="text-caption text-grey">{{ modelValue.team_b_roster.length }} / {{ currentLimit }}</div>
      </div>
      <v-list class="overflow-y-auto fill-height bg-transparent">
        <v-list-item v-for="p in modelValue.team_b_roster" :key="p.id">
          <template v-slot:append>
            <v-icon :color="POSITIONS[p.position]?.color" size="small">{{ POSITIONS[p.position]?.icon }}</v-icon>
          </template>
          <v-list-item-title class="text-caption text-right">{{ p.nombres }}</v-list-item-title>
          <template v-slot:prepend>
             <v-btn icon="mdi-close" size="x-small" variant="text" color="red" @click="removePlayer(p.id, 'B')"></v-btn>
          </template>
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>

<style scoped>
.team-panel { width: 25%; display: flex; flex-direction: column; background: rgba(0,0,0,0.2); }
.border-r { border-right: 1px solid rgba(255,255,255,0.1); }
.border-l { border-left: 1px solid rgba(255,255,255,0.1); }
</style>