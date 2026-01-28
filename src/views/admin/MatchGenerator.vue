<script setup>
import { ref } from 'vue'
import MatchSheet from '../../components/admin/MatchSheet.vue'

const matchData = ref({
  date: new Date().toISOString().substr(0, 10),
  time: '14:00',
  category: 'A',
  championship: 'COPA EVOLUCIÓN 2025',
  homeTeam: '',
  awayTeam: '',
  stadium: 'ESTADIO PRINCIPAL',
  location: 'ESTADIO PRINCIPAL',
  matchNumber: 'DÉCIMA SEGUNDA',
  referee: '',
  fireman: ''
})

const showPreview = ref(false)

const handlePrint = () => {
  window.print()
}

const categories = ['A', 'B', 'C', 'MÁXIMA', 'PRIMERA', 'SEGUNDA']
const championships = [
  'COPA EVOLUCIÓN 2025',
  'CAMPEONATO APERTURA 2025',
  'CAMPEONATO CLAUSURA 2025',
  'TORNEO RELÁMPAGO 2025'
]
</script>

<template>
  <div class="match-generator-container">
    <!-- HEADER -->
    <div class="page-header mb-8">
      <div class="d-flex align-center mb-2">
        <v-icon size="36" color="primary" class="mr-3">mdi-soccer-field</v-icon>
        <div>
          <h1 class="text-h4 font-weight-bold">Generador de Actas</h1>
          <p class="text-subtitle-1 text-grey-darken-1">
            Crea e imprime actas oficiales de partidos
          </p>
        </div>
      </div>
    </div>

    <v-row class="d-print-none">
      <!-- FORMULARIO -->
      <v-col cols="12" lg="4">
        <v-card elevation="3" class="form-card">
          <v-card-title class="bg-primary text-white py-4">
            <v-icon class="mr-2">mdi-file-document-edit</v-icon>
            Información del Partido
          </v-card-title>
          
          <v-card-text class="pa-6">
            <!-- CAMPEONATO -->
            <div class="mb-4">
              <label class="form-label">Campeonato</label>
              <v-select
                v-model="matchData.championship"
                :items="championships"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-trophy"
              ></v-select>
            </div>

            <!-- NÚMERO DE PARTIDO -->
            <div class="mb-4">
              <label class="form-label">Número de Partido</label>
              <v-text-field
                v-model="matchData.matchNumber"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-numeric"
                placeholder="Ej: DÉCIMA SEGUNDA"
              ></v-text-field>
            </div>

            <!-- ESTADIO -->
            <div class="mb-4">
              <label class="form-label">Estadio</label>
              <v-text-field
                v-model="matchData.stadium"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-stadium"
                placeholder="Nombre del estadio"
              ></v-text-field>
            </div>

            <v-divider class="my-4"></v-divider>

            <!-- FECHA Y HORA -->
            <v-row>
              <v-col cols="7">
                <label class="form-label">Fecha</label>
                <v-text-field
                  v-model="matchData.date"
                  type="date"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-calendar"
                ></v-text-field>
              </v-col>
              <v-col cols="5">
                <label class="form-label">Hora</label>
                <v-text-field
                  v-model="matchData.time"
                  type="time"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-clock"
                ></v-text-field>
              </v-col>
            </v-row>

            <!-- CATEGORÍA -->
            <div class="mb-4">
              <label class="form-label">Categoría</label>
              <v-select
                v-model="matchData.category"
                :items="categories"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-trophy-award"
              ></v-select>
            </div>

            <v-divider class="my-4"></v-divider>

            <!-- ÁRBITRO -->
            <div class="mb-4">
              <label class="form-label">Árbitro</label>
              <v-text-field
                v-model="matchData.referee"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-whistle"
                placeholder="Nombre del árbitro"
              ></v-text-field>
            </div>

            <!-- BOMBERO/LIRA -->
            <div class="mb-4">
              <label class="form-label">Bombero / Lira</label>
              <v-text-field
                v-model="matchData.fireman"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-fire-truck"
                placeholder="Nombre"
              ></v-text-field>
            </div>

            <v-divider class="my-4"></v-divider>

            <!-- EQUIPOS -->
            <div class="teams-section">
              <div class="mb-4">
                <label class="form-label">
                  <v-icon size="small" class="mr-1">mdi-home</v-icon>
                  Equipo Local
                </label>
                <v-text-field
                  v-model="matchData.homeTeam"
                  variant="outlined"
                  density="comfortable"
                  placeholder="Nombre del equipo local"
                  prepend-inner-icon="mdi-shield"
                  color="success"
                ></v-text-field>
              </div>

              <div class="mb-4">
                <label class="form-label">
                  <v-icon size="small" class="mr-1">mdi-airplane</v-icon>
                  Equipo Visitante
                </label>
                <v-text-field
                  v-model="matchData.awayTeam"
                  variant="outlined"
                  density="comfortable"
                  placeholder="Nombre del equipo visitante"
                  prepend-inner-icon="mdi-shield-outline"
                  color="info"
                ></v-text-field>
              </div>
            </div>

            <!-- BOTONES DE ACCIÓN -->
            <v-btn
              block
              color="primary"
              size="large"
              class="mb-3"
              @click="showPreview = true"
              prepend-icon="mdi-eye"
              :disabled="!matchData.homeTeam || !matchData.awayTeam"
            >
              Vista Previa e Imprimir
            </v-btn>

            <v-btn
              block
              variant="outlined"
              color="grey-darken-1"
              @click="matchData = {
                date: new Date().toISOString().substr(0, 10),
                time: '14:00',
                category: 'A',
                championship: 'COPA EVOLUCIÓN 2025',
                homeTeam: '',
                awayTeam: '',
                stadium: 'ESTADIO PRINCIPAL',
                location: 'ESTADIO PRINCIPAL',
                matchNumber: 'DÉCIMA SEGUNDA',
                referee: '',
                fireman: ''
              }"
              prepend-icon="mdi-refresh"
            >
              Limpiar Formulario
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- GUÍA RÁPIDA -->
        <v-card elevation="2" class="mt-4">
          <v-card-title class="text-body-1 font-weight-bold">
            <v-icon class="mr-2" color="info">mdi-information</v-icon>
            Guía Rápida
          </v-card-title>
          <v-card-text class="pa-4">
            <div class="tip-item mb-3">
              <v-icon size="small" color="success" class="mr-2">mdi-check-circle</v-icon>
              <span class="text-caption">Completa todos los campos obligatorios</span>
            </div>
            <div class="tip-item mb-3">
              <v-icon size="small" color="info" class="mr-2">mdi-printer</v-icon>
              <span class="text-caption">El acta se imprimirá en formato horizontal A4</span>
            </div>
            <div class="tip-item">
              <v-icon size="small" color="warning" class="mr-2">mdi-content-save</v-icon>
              <span class="text-caption">Guarda el PDF para tener registro digital</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- VISTA PREVIA EN MINIATURA -->
      <v-col cols="12" lg="8">
        <v-card elevation="3" class="preview-card">
          <v-card-title class="bg-grey-lighten-4 py-4">
            <v-icon class="mr-2">mdi-file-eye</v-icon>
            Vista Previa del Acta
          </v-card-title>
          <v-card-text class="pa-6 d-flex justify-center align-center bg-grey-lighten-5" style="min-height: 600px;">
            <div class="preview-container">
              <div class="preview-zoom">
                <MatchSheet :match="matchData" />
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- MODAL DE VISTA PREVIA E IMPRESIÓN -->
    <v-dialog v-model="showPreview" fullscreen transition="dialog-bottom-transition" class="d-print-none">
      <v-card>
        <v-toolbar color="primary" theme="dark">
          <v-btn icon @click="showPreview = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title class="text-h6">Vista de Impresión</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn variant="elevated" color="white" class="text-primary mr-2" @click="handlePrint" prepend-icon="mdi-printer">
            IMPRIMIR
          </v-btn>
        </v-toolbar>
        
        <v-card-text class="pa-0 bg-grey-lighten-3 d-flex justify-center align-center" style="min-height: calc(100vh - 64px);">
          <div class="print-preview-wrapper elevation-8">
            <MatchSheet :match="matchData" />
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- CONTENIDO PARA IMPRESIÓN -->
    <div class="print-only">
      <MatchSheet :match="matchData" />
    </div>
  </div>
</template>

<style scoped>
.match-generator-container {
  max-width: 1800px;
  margin: 0 auto;
}

.page-header {
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 16px;
}

.form-card {
  border-radius: 12px !important;
  overflow: hidden;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #424242;
  margin-bottom: 6px;
}

.teams-section {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.tip-item {
  display: flex;
  align-items: center;
}

.preview-card {
  border-radius: 12px !important;
  overflow: hidden;
  height: 100%;
}

.preview-container {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.preview-zoom {
  transform: scale(0.45);
  transform-origin: top center;
  width: 222%;
  margin-left: -61%;
}

.print-preview-wrapper {
  background: white;
  margin: 20px;
}

/* ESTILOS DE IMPRESIÓN */
.print-only {
  display: none;
}

@media print {
  .d-print-none {
    display: none !important;
  }
  
  .v-application {
    display: none !important;
  }
  
  body {
    margin: 0;
    padding: 0;
  }
  
  .print-only {
    display: block !important;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  
  @page {
    size: A4 landscape;
    margin: 0;
  }
}

/* RESPONSIVE */
@media (max-width: 1280px) {
  .preview-zoom {
    transform: scale(0.35);
    width: 286%;
    margin-left: -93%;
  }
}

@media (max-width: 960px) {
  .preview-zoom {
    transform: scale(0.3);
    width: 333%;
    margin-left: -116%;
  }
}
</style>