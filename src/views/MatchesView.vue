<template>
  <div class="bg-blue-grey-darken-4 min-vh-100 pb-16">
    <v-container class="pt-16 mt-10">
      <div class="text-center mb-8">
        <h1 class="text-h3 font-weight-black text-white text-uppercase mb-2">
          Calendario de Juegos
        </h1>
        <p class="text-grey-lighten-1">
          Consulta las fechas, horarios y resultados de la Liga San José de Poaló.
        </p>
      </div>

      <v-row>
        <v-col cols="12" md="4">
          <MatchCalendar />
        </v-col>

        <v-col cols="12" md="8">
          <MatchList />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import MatchCalendar from '../components/matches/MatchCalendar.vue';
import MatchList from '../components/matches/MatchList.vue';
</script>

<style scoped>
.min-vh-100 {
  min-height: 100vh;
}
</style>