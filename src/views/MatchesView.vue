<script setup>
import { ref, onMounted, computed } from 'vue'
// Importamos el composable de lógica (Asegúrate de haber creado este archivo según el paso anterior)
import { useMatches } from '../../composables/useMatches' 

// Importamos los componentes hijos (Asegúrate de haber creado la carpeta components/admin/matches/)
import MatchesTable from '../../components/admin/matches/MatchesTable.vue'
import MatchInfoForm from '../../components/admin/matches/MatchInfoForm.vue'
import MatchRosterEditor from '../../components/admin/matches/MatchRosterEditor.vue'

// --- ESTADO Y LOGICA ---
// Extraemos todo lo necesario del composable para mantener esta vista limpia
const { 
  matches, 
  players, 
  loading, 
  saving, 
  fetchMatches, 
  fetchPlayers, 
  saveMatch 
} = useMatches()

const dialog = ref(false)
const step = ref(1) // Control del Wizard: 1 = Datos, 2 = Alineaciones
const snackbar = ref({ show: false, text: '', color: 'success' })

// Modelo inicial para un nuevo partido
const defaultMatch = {
  id: null,
  date: new Date().toISOString().substr(0, 10),
  time: '14:00',
  location: 'Cancha Principal',
  team_a_name: '',
  team_b_name: '',
  status: 'programado',
  game_type: '8v8',
  team_a_roster: [],
  team_b_roster: []
}

// Objeto reactivo para el partido que estamos editando o creando
const editedItem = ref({ ...defaultMatch })

// --- COMPUTED ---
// Validación simple para permitir pasar al paso 2
const canProceedToStep2 = computed(() => {
  return editedItem.value.team_a_name && 
         editedItem.value.team_b_name && 
         editedItem.value.date &&
         editedItem.value.time &&
         editedItem.value.location
})

// --- MÉTODOS UI ---

// Abrir modal (Edición o Creación)
function openDialog(item) {
  if (item) {
    // Clonamos el objeto para no mutar directamente la tabla hasta guardar
    editedItem.value = JSON.parse(JSON.stringify(item))
    // Aseguramos que tenga un tipo de juego por defecto si falta
    if (!editedItem.value.game_type) editedItem.value.game_type = '8v8'
  } else {
    // Reseteamos a valores por defecto para nuevo partido
    editedItem.value = JSON.parse(JSON.stringify(defaultMatch))
  }
  step.value = 1
  dialog.value = true
}

// Guardar cambios usando la lógica del composable
async function handleSave() {
  try {
    await saveMatch(editedItem.value)
    showSnackbar('Partido guardado correctamente', 'success')
    dialog.value = false
    // Recargamos la lista para ver los cambios reflejados
    fetchMatches()
  } catch (error) {
    console.error(error)
    showSnackbar('Error al guardar: ' + error.message, 'error')
  }
}

function showSnackbar(text, color) {
  snackbar.value = { show: true, text, color }
}

// Inicialización: Cargar datos al montar la vista
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
          <p class="text-caption text-grey-lighten-1 mt-1">Programa partidos y gestiona las alineaciones tácticas</p>
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
      <MatchesTable 
        :matches="matches" 
        :loading="loading" 
        @edit="openDialog" 
      />
    </v-card>

    <v-dialog 
      v-model="dialog" 
      fullscreen 
      transition="dialog-bottom-transition" 
      :scrim="false"
    >
      <v-card theme="dark" class="bg-dark-elevated">
        
        <v-toolbar color="transparent" class="border-bottom-subtle px-4" height="70">
          <v-btn icon="mdi-close" @click="dialog = false" variant="text"></v-btn>
          
          <v-toolbar-title class="font-weight-bold text-h6">
            {{ editedItem.id ? 'Editar Encuentro' : 'Programar Nuevo Encuentro' }}
          </v-toolbar-title>

          <v-spacer></v-spacer>

          <div class="stepper-indicator mr-6 d-none d-md-flex">
            <div class="step-item" :class="{ active: step === 1 }">
              <div class="step-number">1</div>
              <span class="step-label">Datos Generales</span>
            </div>
            <div class="step-divider"></div>
            <div class="step-item" :class="{ active: step === 2 }">
              <div class="step-number">2</div>
              <span class="step-label">Alineaciones</span>
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

        <v-card-text class="pa-0 fill-height overflow-auto">
          
          <div v-show="step === 1" class="fill-height">
             <MatchInfoForm v-model="editedItem" />
             
             <div class="text-center mt-8 pb-8">
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
                <p v-if="!canProceedToStep2" class="text-caption text-orange-darken-1 mt-3">
                  Complete los campos obligatorios para continuar
                </p>
             </div>
          </div>

          <div v-show="step === 2" class="fill-height d-flex flex-column">
             <div class="flex-grow-1" style="min-height: 0;">
                <MatchRosterEditor 
                    v-model="editedItem" 
                    :playersPool="players" 
                    @notify="(msg) => showSnackbar(msg.text, msg.color)"
                />
             </div>
             
             <div class="back-button-container py-4 text-center bg-dark-elevated border-top-subtle">
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
        <v-btn variant="text" @click="snackbar.show = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<style scoped>
/* Estilos contenedores generales de la vista */
.bg-dark-elevated { background: #0a0b0d !important; }

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

.border-bottom-subtle { border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
.border-top-subtle { border-top: 1px solid rgba(255, 255, 255, 0.08); }
.tracking-wider { letter-spacing: 1.5px; }

/* Estilos del Stepper del Header */
.stepper-indicator { display: flex; align-items: center; gap: 16px; }

.step-item { display: flex; align-items: center; gap: 8px; opacity: 0.4; transition: opacity 0.3s; }
.step-item.active { opacity: 1; }

.step-number {
  width: 28px; height: 28px; border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex; align-items: center; justify-content: center;
  font-weight: bold; font-size: 0.75rem; color: white;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.step-item.active .step-number { background: white; color: black; border-color: white; }

.step-label { font-size: 0.8rem; font-weight: 600; color: rgba(255, 255, 255, 0.7); }
.step-item.active .step-label { color: white; }

.step-divider { width: 40px; height: 2px; background: rgba(255, 255, 255, 0.1); }
</style>