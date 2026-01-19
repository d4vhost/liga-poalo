<script setup>
defineProps(['matches', 'loading'])
defineEmits(['edit'])

const getStatusColor = (status) => {
  return { programado: 'blue', en_juego: 'green', finalizado: 'grey' }[status] || 'grey'
}
</script>

<template>
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
        <v-chip size="small" :color="item.team_a_roster.length === 11 ? 'green-darken-2' : 'grey-darken-3'" variant="flat" class="mr-1">
          {{ item.team_a_roster.length }}
        </v-chip>
        <span class="text-caption text-grey mx-1">|</span>
        <v-chip size="small" :color="item.team_b_roster.length === 11 ? 'green-darken-2' : 'grey-darken-3'" variant="flat">
          {{ item.team_b_roster.length }}
        </v-chip>
      </div>
    </template>

    <template v-slot:item.game_type="{ item }">
      <v-chip size="small" variant="tonal" color="blue-grey" class="font-weight-bold">
        {{ item.game_type || '11v11' }}
      </v-chip>
    </template>

    <template v-slot:item.status="{ item }">
      <v-chip :color="getStatusColor(item.status)" size="small" variant="outlined" class="text-uppercase font-weight-bold border-subtle">
        {{ item.status.replace('_', ' ') }}
      </v-chip>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-btn icon size="small" variant="text" color="white" @click="$emit('edit', item)">
        <v-icon>mdi-pencil-outline</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<style scoped>
/* ESTILOS EXACTOS DE LA TABLA ORIGINAL */
.teams-cell { padding: 8px 0; }
.team-block { display: flex; align-items: center; }
.vs-divider { display: flex; justify-content: center; align-items: center; }
.info-cell, .rosters-cell { padding: 4px 0; }
.border-subtle { border: 1px solid rgba(255, 255, 255, 0.3); }
</style>