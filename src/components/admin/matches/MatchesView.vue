<script setup>
import { ref, onMounted, computed } from 'vue'
import { useMatches } from '../../composables/useMatches' // El composable que creamos
import MatchesTable from '../../components/admin/matches/MatchesTable.vue'
import MatchInfoForm from '../../components/admin/matches/MatchInfoForm.vue'
import MatchRosterEditor from '../../components/admin/matches/MatchRosterEditor.vue'

// --- ESTADO ---
const { matches, players, loading, saving, fetchMatches, fetchPlayers, saveMatch } = useMatches()
const dialog = ref(false)
const step = ref(1)
const snackbar = ref({ show: false, text: '', color: 'success' })

// Modelo por defecto
const defaultMatch = {
  id: null,
  date: new Date().toISOString().substr(0, 10),
  time: '14:00',
  location: 'Cancha Principal',
  team_a_name: '', team_b_name: '',
  status: 'programado', game_type: '8v8',
  team_a_roster: [], team_b_roster: []
}
const editedItem = ref({ ...defaultMatch })

// --- LOGICA UI ---
const canProceed = computed(() => {
  return editedItem.value.team_a_name && editedItem.value.team_b_name && editedItem.value.date
})

function openDialog(item) {
  editedItem.value = item ? JSON.parse(JSON.stringify(item)) : JSON.parse(JSON.stringify(defaultMatch))
  step.value = 1
  dialog.value = true
}

async function handleSave() {
  try {
    await saveMatch(editedItem.value)
    showSnackbar('Partido guardado correctamente', 'success')
    dialog.value = false
    fetchMatches()
  } catch (e) {
    showSnackbar('Error al guardar: ' + e.message, 'error')
  }
}

function showSnackbar(text, color) {
  snackbar.value = { show: true, text, color }
}

onMounted(() => {
  fetchMatches()
  fetchPlayers()
})
</script>

<template>
  <div class="h-100 d-flex flex-column">
    <div class="d-flex align-center justify-space-between mb-4 px-4 pt-4">
      <h2 class="text-h4 font-weight-black text-white">Calendario</h2>
      <v-btn color="white" prepend-icon="mdi-plus" @click="openDialog(null)">Nuevo Partido</v-btn>
    </div>

    <v-card class="flex-grow-1 bg-transparent" elevation="0">
        <MatchesTable :matches="matches" :loading="loading" @edit="openDialog" />
    </v-card>

    <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition">
      <v-card theme="dark" class="bg-black">
        <v-toolbar color="transparent">
            <v-btn icon="mdi-close" @click="dialog = false"></v-btn>
            <v-toolbar-title>{{ editedItem.id ? 'Editar' : 'Nuevo' }} Encuentro</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn v-if="step === 2" color="white" variant="flat" :loading="saving" @click="handleSave">Guardar</v-btn>
        </v-toolbar>

        <v-card-text class="pa-0 fill-height">
            <MatchInfoForm v-if="step === 1" v-model="editedItem" />
            
            <MatchRosterEditor 
                v-if="step === 2" 
                v-model="editedItem" 
                :playersPool="players" 
                @notify="(msg) => showSnackbar(msg.text, msg.color)"
            />

            <div v-if="step === 1" class="text-center mt-4">
                <v-btn 
                    color="white" variant="flat" size="large" 
                    :disabled="!canProceed" @click="step = 2"
                >
                    Continuar a Convocatorias
                </v-btn>
            </div>
             <div v-if="step === 2" class="text-center mt-4 pb-4">
                <v-btn variant="text" @click="step = 1" prepend-icon="mdi-arrow-left">Volver</v-btn>
            </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color">{{ snackbar.text }}</v-snackbar>
  </div>
</template>