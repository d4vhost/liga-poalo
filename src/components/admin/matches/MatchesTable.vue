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
      { title: 'DETALLES', key: 'info' },
      { title: 'ALINEACIONES', key: 'rosters', align: 'center' },
      { title: 'MODO', key: 'game_type', align: 'center' },
      { title: 'ESTADO', key: 'status', align: 'center' },
      { title: '', key: 'actions', align: 'end' },
    ]"
    :items="matches"
    :loading="loading"
    theme="dark"
    class="bg-transparent h-100"
    hover
  >
    <template v-slot:item.teams="{ item }">
      <div class="d-flex align-center py-2">
        <div>
          <div class="text-body-2 font-weight-bold">{{ item.team_a_name }}</div>
          <div class="text-caption text-blue-grey">Local</div>
        </div>
        <v-chip size="x-small" class="mx-3 font-weight-black">VS</v-chip>
        <div>
          <div class="text-body-2 font-weight-bold">{{ item.team_b_name }}</div>
          <div class="text-caption text-blue-grey">Visitante</div>
        </div>
      </div>
    </template>

    <template v-slot:item.info="{ item }">
        <div class="text-caption">
            <div><v-icon size="small" class="mr-1">mdi-calendar</v-icon>{{ item.date }}</div>
            <div><v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>{{ item.time?.substring(0,5) }}</div>
        </div>
    </template>

    <template v-slot:item.rosters="{ item }">
       <span class="text-caption">{{ item.team_a_roster.length }} - {{ item.team_b_roster.length }}</span>
    </template>

    <template v-slot:item.status="{ item }">
       <v-chip :color="getStatusColor(item.status)" size="small" variant="outlined" class="text-uppercase">
         {{ item.status.replace('_', ' ') }}
       </v-chip>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-btn icon="mdi-pencil" size="small" variant="text" @click="$emit('edit', item)"></v-btn>
    </template>
  </v-data-table>
</template>