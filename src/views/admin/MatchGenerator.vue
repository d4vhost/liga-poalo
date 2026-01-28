<script setup>
import { ref } from 'vue'
import MatchSheet from '../../components/admin/MatchSheet.vue'

const matchData = ref({
  date: new Date().toISOString().substr(0, 10),
  time: '14:00',
  category: 'Máxima Categoría',
  championship: 'Campeonato Apertura 2026',
  homeTeam: '',
  awayTeam: ''
})

const showPreview = ref(false)

const handlePrint = () => {
  window.print()
}
</script>

<template>
  <div>
    <v-row class="d-print-none">
      <v-col cols="12" md="5">
        <v-card elevation="2">
          <v-card-title class="bg-blue-grey-darken-3">Nuevo Partido</v-card-title>
          <v-card-text class="pa-4">
            <v-text-field v-model="matchData.championship" label="Campeonato" density="compact" variant="outlined" class="mb-2"></v-text-field>
            <v-text-field v-model="matchData.category" label="Categoría" density="compact" variant="outlined" class="mb-2"></v-text-field>
            <v-row>
              <v-col cols="6"><v-text-field v-model="matchData.date" type="date" label="Fecha" density="compact" variant="outlined"></v-text-field></v-col>
              <v-col cols="6"><v-text-field v-model="matchData.time" type="time" label="Hora" density="compact" variant="outlined"></v-text-field></v-col>
            </v-row>
            <v-divider class="mb-4"></v-divider>
            <v-text-field v-model="matchData.homeTeam" label="Equipo LOCAL" prepend-inner-icon="mdi-home" variant="outlined"></v-text-field>
            <v-text-field v-model="matchData.awayTeam" label="Equipo VISITANTE" prepend-inner-icon="mdi-airplane" variant="outlined"></v-text-field>
            
            <v-btn block color="success" size="large" class="mt-4" @click="showPreview = true">
              <v-icon start>mdi-file-document-outline</v-icon> Generar Acta
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="7" class="d-flex justify-center bg-grey-lighten-3 pa-4 rounded">
         <div style="transform: scale(0.6); transform-origin: top center;">
            <MatchSheet :match="matchData" />
         </div>
      </v-col>
    </v-row>

    <v-dialog v-model="showPreview" fullscreen transition="dialog-bottom-transition" class="d-print-none">
      <v-card color="grey-lighten-4">
        <v-toolbar color="blue-darken-3">
          <v-btn icon @click="showPreview = false"><v-icon>mdi-close</v-icon></v-btn>
          <v-toolbar-title>Vista de Impresión</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn variant="elevated" color="white" class="text-black" @click="handlePrint">
            <v-icon start>mdi-printer</v-icon> IMPRIMIR
          </v-btn>
        </v-toolbar>
        <div class="d-flex justify-center pa-4">
          <div class="elevation-5 bg-white">
            <MatchSheet :match="matchData" />
          </div>
        </div>
      </v-card>
    </v-dialog>

    <div class="print-only">
      <MatchSheet :match="matchData" />
    </div>
  </div>
</template>

<style>
/* Lógica de Impresión */
.print-only { display: none; }
@media print {
  .d-print-none { display: none !important; }
  .v-application { display: none !important; } /* Oculta Vuetify base */
  .print-only { 
    display: block !important; 
    position: absolute; top: 0; left: 0; width: 100%;
  }
}
</style>