<script setup>
import { ref, onMounted, computed } from 'vue'
import { useMatches } from '../../composables/useMatches' 
import MatchesTable from '../../components/admin/matches/MatchesTable.vue'
import MatchInfoForm from '../../components/admin/matches/MatchInfoForm.vue'
import MatchRosterDragDrop from '../../components/admin/matches/MatchRosterDragDrop.vue'

// --- LÓGICA ---
const { matches, players, loading, saving, fetchMatches, fetchPlayers, saveMatch } = useMatches()
const dialog = ref(false)
const step = ref(1)
const snackbar = ref({ show: false, text: '', color: 'success' })

// HORA ECUADOR
function getEcuadorTime() {
  return new Date().toLocaleTimeString('es-EC', {
    timeZone: 'America/Guayaquil',
    hour: '2-digit', minute: '2-digit', hour12: false
  })
}

// MODELO
const defaultMatch = {
  id: null,
  date: new Date().toISOString().substr(0, 10),
  time: '', 
  location: 'Cancha Principal',
  team_a_name: '', team_b_name: '',
  status: 'programado',
  game_type: '11v11',
  team_a_roster: [], team_b_roster: []
}
const editedItem = ref({ ...defaultMatch })

// VALIDACIÓN
const canProceedToStep2 = computed(() => {
  return editedItem.value.team_a_name && 
         editedItem.value.team_b_name && 
         editedItem.value.date && 
         editedItem.value.time && 
         editedItem.value.location
})

function openDialog(item) {
  if (item) {
    editedItem.value = JSON.parse(JSON.stringify(item))
    if (!editedItem.value.game_type) editedItem.value.game_type = '11v11'
  } else {
    editedItem.value = JSON.parse(JSON.stringify(defaultMatch))
    editedItem.value.time = getEcuadorTime()
  }
  step.value = 1
  dialog.value = true
}

async function handleSave() {
  try {
    await saveMatch(editedItem.value)
    showSnackbar('Partido guardado correctamente', 'success')
    dialog.value = false
    fetchMatches()
  } catch (error) {
    showSnackbar('Error: ' + error.message, 'error')
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
    
    <div class="header-section mb-6">
      <div class="d-flex align-center justify-space-between">
        <div>
          <div class="d-flex align-center mb-1">
            <v-icon color="green-lighten-2" class="mr-2" size="small">mdi-soccer-field</v-icon>
            <span class="text-overline font-weight-bold text-green-lighten-2 tracking-wider">
              GESTIÓN DEPORTIVA
            </span>
          </div>
          <h2 class="text-h4 font-weight-black text-white">Calendario de Encuentros</h2>
          <p class="text-caption text-grey-lighten-1 mt-1">Programa partidos oficiales y asigna plantillas</p>
        </div>
        <v-btn 
          color="white" 
          prepend-icon="mdi-plus-circle" 
          rounded="lg" 
          @click="openDialog(null)" 
          elevation="4"
          class="text-black font-weight-bold px-6"
          height="48"
        >
          Nuevo Partido
        </v-btn>
      </div>
    </div>

    <v-card class="card-dark-outline flex-grow-1" elevation="0">
      <MatchesTable :matches="matches" :loading="loading" @edit="openDialog" />
    </v-card>

    <!-- DIALOG FULLSCREEN CON PASOS SEPARADOS -->
    <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition" :scrim="false">
      <v-card theme="dark" class="bg-dark-elevated">
        
        <v-toolbar color="transparent" class="border-bottom-subtle px-4" height="70">
          <v-btn icon="mdi-close" @click="dialog = false" variant="text"></v-btn>
          <v-toolbar-title class="font-weight-bold text-h6">
            {{ editedItem.id ? 'Editar Encuentro' : 'Programar Nuevo Encuentro' }}
          </v-toolbar-title>
          <v-spacer></v-spacer>

          <div class="stepper-indicator mr-6 d-none d-md-flex">
            <div class="step-item" :class="{ active: step === 1 }">
              <div class="step-number">1</div><span class="step-label">Datos del Partido</span>
            </div>
            <div class="step-divider"></div>
            <div class="step-item" :class="{ active: step === 2, disabled: !canProceedToStep2 }">
              <div class="step-number">2</div><span class="step-label">Convocatorias</span>
            </div>
          </div>

          <v-btn 
            v-if="step === 2" 
            color="white" 
            variant="flat" 
            :loading="saving" 
            @click="handleSave" 
            class="font-weight-bold text-black px-6" 
            prepend-icon="mdi-content-save-check"
          >
            Guardar Partido
          </v-btn>
        </v-toolbar>

        <!-- CONTENIDO: SOLO SE MUESTRA EL PASO ACTIVO -->
        <v-card-text class="pa-0 fill-height">
          
          <!-- PASO 1: INFORMACIÓN DEL PARTIDO -->
          <div v-if="step === 1" class="step-container fill-height">
            <MatchInfoForm v-model="editedItem" />
            
            <div class="action-footer">
              <v-btn 
                color="white" 
                variant="flat" 
                size="large" 
                :disabled="!canProceedToStep2" 
                @click="step = 2" 
                class="text-black font-weight-bold px-12" 
                append-icon="mdi-arrow-right" 
                rounded="lg" 
                height="52"
              >
                Continuar a Convocatorias
              </v-btn>
              <p v-if="!canProceedToStep2" class="text-caption text-orange-darken-1 mt-3 mb-0">
                Complete todos los campos para continuar
              </p>
            </div>
          </div>

          <!-- PASO 2: CONVOCATORIAS CON DRAG & DROP -->
          <div v-if="step === 2" class="step-container fill-height">
            <MatchRosterDragDrop 
              v-model="editedItem" 
              :playersPool="players" 
              @notify="(msg) => showSnackbar(msg.text, msg.color)"
            />
            
            <div class="action-footer border-top-subtle">
              <v-btn 
                variant="outlined" 
                color="white" 
                @click="step = 1" 
                prepend-icon="mdi-arrow-left" 
                class="font-weight-bold" 
                rounded="lg"
              >
                Volver a Datos del Partido
              </v-btn>
            </div>
          </div>

        </v-card-text>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000" location="top">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">
          Cerrar</v-btn> </template> </v-snackbar>
 </div>
</template>
<style
  scoped>
  .bg-dark-elevated {
    background: #0a0b0d !important;
  }

  .card-dark-outline {
    background-color: transparent !important;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
  }

  .header-section {
    background: rgba(255, 255, 255, 0.02);
    padding: 20px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .border-bottom-subtle {
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .border-top-subtle {
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .tracking-wider {
    letter-spacing: 1.5px;
  }

  .step-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
  }

  .action-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(0, 0, 0, 0.2);
    margin-top: auto;
    flex-shrink: 0;
  }

  .stepper-indicator {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .step-item {
    display: flex;
    align-items: center;
    gap: 8px;
    opacity: 0.4;
    transition: opacity 0.3s;
  }

  .step-item.active {
    opacity: 1;
  }

  .step-item.disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }

  .step-number {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.75rem;
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.2);
  }

  .step-item.active .step-number {
    background: white;
    color: black;
    border-color: white;
  }

  .step-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.7);
  }

  .step-item.active .step-label {
    color: white;
  }

  .step-divider {
    width: 40px;
    height: 2px;
    background: rgba(255, 255, 255, 0.1);
  }
</style>
