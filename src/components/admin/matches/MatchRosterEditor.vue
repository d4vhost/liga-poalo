<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ modelValue: Object, playersPool: Array })
const emit = defineEmits(['update:modelValue', 'notify'])

// --- CONSTANTES ---
const LIMIT = 11
const POSITIONS = {
  arquero:   { label: 'Arquero',   icon: 'mdi-hand-back-left', color: 'yellow-accent-4', abbr: 'ARQ' },
  defensa:   { label: 'Defensa',   icon: 'mdi-shield',         color: 'blue-accent-3',   abbr: 'DEF' },
  medio:     { label: 'Medio',     icon: 'mdi-circle-slice-8', color: 'green-accent-3',  abbr: 'MED' },
  delantero: { label: 'Delantero', icon: 'mdi-soccer',         color: 'red-accent-2',    abbr: 'DEL' }
}

const playerSearch = ref('')

// --- COMPUTED ---
const filteredPlayers = computed(() => {
  const term = playerSearch.value.toLowerCase()
  const assignedIds = [...props.modelValue.team_a_roster, ...props.modelValue.team_b_roster].map(p => p.id)
  return props.playersPool.filter(p => !assignedIds.includes(p.id) && (p.nombres?.toLowerCase().includes(term) || p.cedula?.includes(term)))
})

// --- ACCIONES ---
function assignPlayer(player, team, position) {
  const isTeamA = team === 'A'
  const roster = isTeamA ? props.modelValue.team_a_roster : props.modelValue.team_b_roster
  if (roster.length >= LIMIT) {
    emit('notify', { text: `Límite alcanzado (${LIMIT} jugadores)`, color: 'warning' })
    return
  }
  const newRoster = [...roster, { ...player, position }]
  emit('update:modelValue', { ...props.modelValue, [isTeamA ? 'team_a_roster' : 'team_b_roster']: newRoster })
  playerSearch.value = ''
}

function removePlayer(playerId, team) {
  const isTeamA = team === 'A'
  const roster = isTeamA ? props.modelValue.team_a_roster : props.modelValue.team_b_roster
  const newRoster = roster.filter(p => p.id !== playerId)
  emit('update:modelValue', { ...props.modelValue, [isTeamA ? 'team_a_roster' : 'team_b_roster']: newRoster })
}
</script>

<template>
  <div class="d-flex fill-height">
    <div class="lineup-panel border-right-subtle" style="width: 25%;">
      <div class="panel-header">
        <div class="d-flex align-center justify-space-between mb-2">
          <div class="d-flex align-center">
            <v-icon color="blue-lighten-2" class="mr-2">mdi-shield-home</v-icon>
            <span class="text-subtitle-2 font-weight-bold text-white text-truncate" style="max-width: 120px;">
              {{ modelValue.team_a_name || 'LOCAL' }}
            </span>
          </div>
          <v-chip size="x-small" :color="modelValue.team_a_roster.length === LIMIT ? 'green' : 'grey'" variant="flat">
            {{ modelValue.team_a_roster.length }}/{{ LIMIT }}
          </v-chip>
        </div>
        <v-progress-linear :model-value="(modelValue.team_a_roster.length / LIMIT) * 100" color="blue-lighten-2" height="3" rounded></v-progress-linear>
      </div>

      <v-list bg-color="transparent" class="roster-list">
        <v-card v-for="p in modelValue.team_a_roster" :key="p.id" class="player-card mb-2" flat>
          <div class="d-flex align-center pa-3">
            <v-avatar size="36" :color="POSITIONS[p.position]?.color" variant="tonal" class="mr-3">
              <span class="text-caption font-weight-bold">{{ POSITIONS[p.position]?.abbr }}</span>
            </v-avatar>
            <div class="flex-grow-1 player-info">
              <div class="text-body-2 font-weight-bold text-white text-truncate">{{ p.nombres }}</div>
              <div class="text-caption text-grey text-uppercase">{{ POSITIONS[p.position]?.label }}</div>
            </div>
            <v-btn icon="mdi-close" size="x-small" variant="text" color="red" @click="removePlayer(p.id, 'A')"></v-btn>
          </div>
        </v-card>
      </v-list>
    </div>

    <div class="players-pool flex-grow-1">
      <div class="pool-header">
        <div class="text-center mb-2">
          <h4 class="text-h6 font-weight-bold text-white">Pool de Jugadores</h4>
          <p class="text-caption text-grey">{{ filteredPlayers.length }} disponibles</p>
        </div>
        <v-text-field 
          v-model="playerSearch" placeholder="Buscar..." prepend-inner-icon="mdi-magnify" 
          density="compact" variant="solo-filled" bg-color="rgba(255,255,255,0.05)" 
          class="search-input" hide-details clearable
        ></v-text-field>
      </div>

      <v-list bg-color="transparent" class="players-list">
        <v-list-item v-for="p in filteredPlayers" :key="p.id" class="player-item mb-2">
          <template v-slot:prepend>
            <v-avatar color="grey-darken-3" size="36" class="mr-3">
              <span class="text-caption font-weight-bold text-white">{{ p.nombres?.charAt(0) }}</span>
            </v-avatar>
          </template>
          <v-list-item-title class="text-body-2 font-weight-medium text-white">{{ p.nombres }}</v-list-item-title>
          <template v-slot:append>
             <div class="d-flex gap-2">
                <v-menu location="start">
                  <template v-slot:activator="{ props }"><v-btn v-bind="props" icon="mdi-chevron-left" size="small" color="blue-lighten-2" variant="tonal"></v-btn></template>
                  <v-list density="compact" nav bg-color="grey-darken-3"><v-list-item v-for="(v, k) in POSITIONS" :key="k" @click="assignPlayer(p, 'A', k)" :title="v.label"><template v-slot:prepend><v-icon :color="v.color" size="18">{{ v.icon }}</v-icon></template></v-list-item></v-list>
                </v-menu>
                <v-menu location="end">
                  <template v-slot:activator="{ props }"><v-btn v-bind="props" icon="mdi-chevron-right" size="small" color="orange-lighten-2" variant="tonal"></v-btn></template>
                  <v-list density="compact" nav bg-color="grey-darken-3"><v-list-item v-for="(v, k) in POSITIONS" :key="k" @click="assignPlayer(p, 'B', k)" :title="v.label"><template v-slot:prepend><v-icon :color="v.color" size="18">{{ v.icon }}</v-icon></template></v-list-item></v-list>
                </v-menu>
             </div>
          </template>
        </v-list-item>
      </v-list>
    </div>

    <div class="lineup-panel border-left-subtle" style="width: 25%;">
      <div class="panel-header">
        <div class="d-flex align-center justify-space-between mb-2">
          <div class="d-flex align-center">
            <v-icon color="orange-lighten-2" class="mr-2">mdi-shield-airplane</v-icon>
            <span class="text-subtitle-2 font-weight-bold text-white text-truncate" style="max-width: 120px;">
              {{ modelValue.team_b_name || 'VISITANTE' }}
            </span>
          </div>
          <v-chip size="x-small" :color="modelValue.team_b_roster.length === LIMIT ? 'green' : 'grey'" variant="flat">
            {{ modelValue.team_b_roster.length }}/{{ LIMIT }}
          </v-chip>
        </div>
        <v-progress-linear :model-value="(modelValue.team_b_roster.length / LIMIT) * 100" color="orange-lighten-2" height="3" rounded></v-progress-linear>
      </div>

      <v-list bg-color="transparent" class="roster-list">
        <v-card v-for="p in modelValue.team_b_roster" :key="p.id" class="player-card mb-2" flat>
          <div class="d-flex align-center pa-3 flex-row-reverse text-right">
            <v-avatar size="36" :color="POSITIONS[p.position]?.color" variant="tonal" class="ml-3">
              <span class="text-caption font-weight-bold">{{ POSITIONS[p.position]?.abbr }}</span>
            </v-avatar>
            <div class="flex-grow-1 player-info">
              <div class="text-body-2 font-weight-bold text-white text-truncate">{{ p.nombres }}</div>
              <div class="text-caption text-grey text-uppercase">{{ POSITIONS[p.position]?.label }}</div>
            </div>
            <v-btn icon="mdi-close" size="x-small" variant="text" color="red" @click="removePlayer(p.id, 'B')"></v-btn>
          </div>
        </v-card>
      </v-list>
    </div>
  </div>
</template>

<style scoped>
/* ESTILOS ORIGINALES DEL EDITOR */
.lineup-panel { background: rgba(255, 255, 255, 0.02); display: flex; flex-direction: column; }
.panel-header { padding: 16px; background: rgba(0, 0, 0, 0.3); border-bottom: 1px solid rgba(255, 255, 255, 0.05); flex-shrink: 0; }
.roster-list { flex: 1; overflow-y: auto; padding: 12px; }
.roster-list::-webkit-scrollbar { width: 4px; }
.roster-list::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 2px; }
.player-card { background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; transition: all 0.2s; }
.player-card:hover { background: rgba(255, 255, 255, 0.08); border-color: rgba(255, 255, 255, 0.15); }

.players-pool { display: flex; flex-direction: column; background: rgba(255, 255, 255, 0.01); }
.pool-header { padding: 20px; background: rgba(0, 0, 0, 0.2); border-bottom: 1px solid rgba(255, 255, 255, 0.05); flex-shrink: 0; }
.players-list { flex: 1; overflow-y: auto; padding: 12px 20px; }
.player-item { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; transition: all 0.2s; }
.player-item:hover { background: rgba(255, 255, 255, 0.06); }

.border-right-subtle { border-right: 1px solid rgba(255, 255, 255, 0.08); }
.border-left-subtle { border-left: 1px solid rgba(255, 255, 255, 0.08); }
.gap-2 { gap: 8px; }
</style>