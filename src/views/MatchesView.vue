<template>
  <div class="matches-page">

    <!-- HERO SECTION -->
    <div class="hero-matches position-relative">
      <v-img
        src="https://unsplash.com/es/fotos/balon-de-futbol-blanco-y-azul-en-campo-de-hierba-verde-OgqWLzWRSaI"
        cover
        class="hero-image"
      >
        <div class="hero-overlay"></div>
      </v-img>
      <v-container class="hero-content">
        <div class="text-center fade-in-up">
          <h1 class="text-h2 text-md-h1 font-weight-black text-white text-uppercase mb-4 text-shadow-heavy" style="line-height: 1; letter-spacing: -2px;">
            Resultados y Calendario
          </h1>
          <p class="text-h6 font-weight-regular text-grey-lighten-3 mx-auto" style="max-width: 700px; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">
            Liga Deportiva San José de Poaló — Temporada 2026
          </p>
        </div>
      </v-container>
      <div class="hero-gradient"></div>
    </div>

    <!-- CONTENIDO PRINCIPAL -->
    <section class="matches-content py-12">
      <v-container>
        <v-row class="align-stretch">

          <!-- COLUMNA IZQUIERDA: CALENDARIO -->
          <v-col cols="12" md="4" class="d-flex flex-column">
            <div class="sticky-calendar">
              <v-card class="calendar-card pa-4 d-flex flex-column" elevation="0">
                <div class="d-flex align-center mb-3">
                  <v-icon color="white" class="mr-2" size="22">mdi-calendar-month</v-icon>
                  <h3 class="text-body-1 font-weight-bold text-white mb-0">Calendario Oficial</h3>
                </div>
                <v-date-picker
                  v-model="date"
                  elevation="0"
                  class="w-100 calendar-transparent"
                  color="blue-grey-lighten-2"
                ></v-date-picker>
                <v-divider class="my-3 border-opacity-25"></v-divider>
                <div>
                  <p class="text-caption font-weight-bold text-grey-lighten-1 mb-2 text-uppercase">
                    Jornada Actual
                  </p>
                  <v-list density="compact" bg-color="transparent" theme="dark" class="pa-0">
                    <v-list-item class="px-0">
                      <template v-slot:prepend>
                        <v-icon size="small" color="green-lighten-2" class="mr-2">mdi-check-circle</v-icon>
                      </template>
                      <v-list-item-title class="text-caption font-weight-bold text-white">
                        Jornada 5 — Finalizada
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item class="px-0 mt-1">
                      <template v-slot:prepend>
                        <v-icon size="small" color="blue-lighten-2" class="mr-2">mdi-clock-outline</v-icon>
                      </template>
                      <v-list-item-title class="text-caption font-weight-medium text-grey-lighten-2">
                        Jornada 6 — 1 Mar 2026
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </div>
              </v-card>

              <!-- ESTADÍSTICAS RÁPIDAS -->
              <div class="mt-4">
                <v-row dense>
                  <v-col cols="6" v-for="(stat, i) in quickStats" :key="i">
                    <v-card class="stat-mini-card pa-4 text-center" elevation="0">
                      <v-icon :color="stat.color" size="28" class="mb-2">{{ stat.icon }}</v-icon>
                      <p class="text-h5 font-weight-black text-white mb-0">{{ stat.value }}</p>
                      <p class="text-caption text-grey-lighten-2">{{ stat.label }}</p>
                    </v-card>
                  </v-col>
                </v-row>
              </div>
            </div>
          </v-col>

          <!-- COLUMNA DERECHA: PARTIDOS -->
          <v-col cols="12" md="8">
            <div class="d-flex justify-space-between align-center mb-6 pl-1">
              <h2 class="text-h5 font-weight-bold text-white">Resultados Recientes</h2>
              <v-btn
                to="/login"
                variant="text"
                class="btn-glass-nav text-caption font-weight-bold"
                rounded="pill"
                height="36"
                prepend-icon="mdi-bell-ring"
              >
                Notificaciones
              </v-btn>
            </div>

            <v-row dense>
              <v-col
                v-for="(match, i) in recentMatches"
                :key="i"
                cols="12"
                md="6"
                class="pb-3"
              >
                <v-card class="match-card h-100 d-flex flex-column" elevation="0">
                  <div class="card-header d-flex justify-space-between align-center px-4 py-2">
                    <div class="d-flex align-center text-caption text-grey-lighten-2 font-weight-medium">
                      <v-icon size="13" class="mr-1" color="grey-lighten-1">mdi-calendar</v-icon>
                      {{ match.date }}
                    </div>
                    <v-chip
                      :color="match.status === 'Finalizado' ? 'green-darken-3' : 'blue-grey-darken-3'"
                      variant="flat"
                      size="x-small"
                      class="font-weight-bold px-2"
                    >
                      {{ match.status }}
                    </v-chip>
                  </div>

                  <v-divider class="border-opacity-10"></v-divider>

                  <div class="card-body pa-4 d-flex align-center justify-space-between flex-grow-1">
                    <div class="team-block text-center" style="width: 35%;">
                      <v-icon size="48" color="white" class="mb-2">mdi-shield</v-icon>
                      <p class="text-body-1 font-weight-bold text-white mb-0">{{ match.team1 }}</p>
                    </div>

                    <div class="score-board text-center mx-2" style="width: 30%;">
                      <div class="d-flex justify-center align-center gap-score">
                        <span class="text-h4 font-weight-black text-white">{{ match.score1 }}</span>
                        <span class="text-body-2 text-grey mx-1">—</span>
                        <span class="text-h4 font-weight-black text-white">{{ match.score2 }}</span>
                      </div>
                      <p class="text-caption text-grey-lighten-2 mt-1">
                        <v-icon size="11" class="mr-1">mdi-clock-outline</v-icon>{{ match.time }}
                      </p>
                    </div>

                    <div class="team-block text-center" style="width: 35%;">
                      <v-icon size="48" color="white" class="mb-2">mdi-shield</v-icon>
                      <p class="text-body-1 font-weight-bold text-white mb-0">{{ match.team2 }}</p>
                    </div>
                  </div>

                  <div class="card-footer px-4 py-2">
                    <div class="d-flex align-center text-caption text-grey-lighten-2">
                      <v-icon size="13" class="mr-1" color="grey-lighten-1">mdi-stadium</v-icon>
                      {{ match.venue }}
                    </div>
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <!-- PRÓXIMOS PARTIDOS -->
            <div class="d-flex align-center mt-8 mb-5 pl-1">
              <h2 class="text-h5 font-weight-bold text-white">Próximos Encuentros</h2>
            </div>

            <v-row dense>
              <v-col
                v-for="(match, i) in upcomingMatches"
                :key="i"
                cols="12"
                class="pb-3"
              >
                <v-card class="upcoming-card pa-4" elevation="0">
                  <v-row align="center" no-gutters>
                    <v-col cols="12" sm="5">
                      <div class="d-flex align-center justify-space-between justify-sm-start gap-teams">
                        <div class="text-center" style="min-width: 80px;">
                          <v-icon size="40" color="white" class="mb-1">mdi-shield</v-icon>
                          <p class="text-caption font-weight-bold text-white mb-0">{{ match.team1 }}</p>
                        </div>
                        <span class="text-body-2 font-weight-bold text-grey mx-3">VS</span>
                        <div class="text-center" style="min-width: 80px;">
                          <v-icon size="40" color="white" class="mb-1">mdi-shield</v-icon>
                          <p class="text-caption font-weight-bold text-white mb-0">{{ match.team2 }}</p>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="7" class="mt-3 mt-sm-0">
                      <v-row dense class="justify-sm-end">
                        <v-col cols="auto">
                          <div class="upcoming-detail-chip">
                            <v-icon size="14" color="blue-lighten-2" class="mr-1">mdi-calendar</v-icon>
                            <span class="text-caption text-white font-weight-medium">{{ match.date }}</span>
                          </div>
                        </v-col>
                        <v-col cols="auto">
                          <div class="upcoming-detail-chip">
                            <v-icon size="14" color="cyan-lighten-2" class="mr-1">mdi-clock-outline</v-icon>
                            <span class="text-caption text-white font-weight-medium">{{ match.time }}</span>
                          </div>
                        </v-col>
                        <v-col cols="auto">
                          <div class="upcoming-detail-chip">
                            <v-icon size="14" color="blue-grey-lighten-2" class="mr-1">mdi-stadium</v-icon>
                            <span class="text-caption text-white font-weight-medium">{{ match.venue }}</span>
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- SECCIÓN INFORMACIÓN DE LA LIGA -->
    <section class="section-quick-info py-16">
      <v-container>
        <div class="text-center mb-12 scroll-reveal">
          <h2 class="text-h3 text-md-h2 font-weight-black text-white mb-4" style="letter-spacing: -1px;">
            Información de la Liga
          </h2>
          <p class="text-h6 font-weight-regular text-grey-lighten-1 mx-auto" style="max-width: 650px;">
            Datos clave sobre el desarrollo del campeonato actual.
          </p>
        </div>

        <v-row class="justify-center">
          <v-col cols="12" md="4" v-for="(info, i) in quickInfoItems" :key="i" class="scroll-reveal" :style="`transition-delay: ${i * 0.15}s`">
            <v-card class="info-card pa-8 h-100" elevation="0">
              <div class="icon-circle mb-5">
                <v-icon color="white" size="32">{{ info.icon }}</v-icon>
              </div>
              <h3 class="text-h5 font-weight-bold text-white mb-3">{{ info.title }}</h3>
              <p class="text-body-1 text-grey-lighten-2 mb-5" style="line-height: 1.7;">{{ info.description }}</p>
              <div class="info-details pt-4">
                <div v-for="(detail, idx) in info.details" :key="idx" class="d-flex align-center mb-3">
                  <v-icon size="16" color="blue-grey-lighten-3" class="mr-2">mdi-check-circle</v-icon>
                  <span class="text-body-2 text-grey-lighten-1">{{ detail }}</span>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const date = ref(new Date());

const quickStats = ref([
  { icon: 'mdi-soccer', color: 'blue-lighten-2', value: '47', label: 'Goles Jornada' },
  { icon: 'mdi-shield-check', color: 'blue-lighten-2', value: '8', label: 'Equipos' },
  { icon: 'mdi-trophy', color: 'cyan-lighten-2', value: '5', label: 'Jornadas' },
  { icon: 'mdi-account-group', color: 'blue-grey-lighten-2', value: '120', label: 'Jugadores' },
]);

const recentMatches = ref([
  {
    team1: 'Los Tigres', team2: 'Águilas FC',
    score1: 2, score2: 1, date: '15 Feb 2026', time: '14:00 – 15:45',
    status: 'Finalizado', venue: 'Estadio Central',
    color1: 'blue-grey-darken-3', color2: 'blue-grey-darken-2'
  },
  {
    team1: 'Real Poaló', team2: 'Deportivo Sur',
    score1: 0, score2: 0, date: '15 Feb 2026', time: '16:00 – 17:45',
    status: 'Finalizado', venue: 'Estadio Central',
    color1: 'blue-darken-3', color2: 'blue-darken-2'
  },
  {
    team1: 'Unidos FC', team2: 'Los Leones',
    score1: 3, score2: 2, date: '16 Feb 2026', time: '10:00 – 11:50',
    status: 'Finalizado', venue: 'Cancha Norte',
    color1: 'cyan-darken-3', color2: 'blue-grey-darken-3'
  },
  {
    team1: 'Estrellas', team2: 'Cóndores',
    score1: 1, score2: 3, date: '16 Feb 2026', time: '12:00 – 13:45',
    status: 'Finalizado', venue: 'Cancha Norte',
    color1: 'blue-darken-2', color2: 'blue-grey-darken-2'
  },
]);

const upcomingMatches = ref([
  {
    team1: 'Los Tigres', team2: 'Real Poaló',
    date: '1 Mar 2026', time: '14:00',
    venue: 'Estadio Central',
    color1: 'blue-grey-darken-3', color2: 'blue-darken-3'
  },
  {
    team1: 'Águilas FC', team2: 'Unidos FC',
    date: '1 Mar 2026', time: '16:00',
    venue: 'Estadio Central',
    color1: 'blue-grey-darken-2', color2: 'cyan-darken-3'
  },
  {
    team1: 'Los Leones', team2: 'Cóndores',
    date: '2 Mar 2026', time: '10:00',
    venue: 'Cancha Norte',
    color1: 'blue-darken-2', color2: 'blue-grey-darken-3'
  },
]);

const quickInfoItems = ref([
  {
    icon: 'mdi-trophy-outline',
    title: 'Resultados en Tiempo Real',
    description: 'Sigue los marcadores minuto a minuto con actualizaciones instantáneas desde el campo de juego.',
    details: ['Goleadores en tiempo real', 'Tarjetas y sanciones', 'Cambios de jugadores']
  },
  {
    icon: 'mdi-chart-bar',
    title: 'Tabla de Posiciones',
    description: 'Clasificación oficial actualizada automáticamente al finalizar cada jornada del campeonato.',
    details: ['Puntos acumulados', 'Diferencia de gol', 'Partidos jugados']
  },
  {
    icon: 'mdi-book-open-variant',
    title: 'Reglamento Oficial',
    description: 'Consulta la normativa vigente para la temporada 2026 y mantente al día con las reglas.',
    details: ['Código de disciplina', 'Reglas de inscripción', 'Protocolos de arbitraje']
  }
]);

let observer;
onMounted(() => {
  const options = { threshold: 0.15, rootMargin: '0px 0px -80px 0px' };
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, options);
  document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});
</script>

<style scoped>
/* BASE */
.matches-page {
  background: linear-gradient(180deg, #263238 0%, #1a1a1a 50%, #0a0a0a 100%);
  min-height: 100vh;
}

/* HERO */
.hero-matches {
  height: 50vh;
  min-height: 380px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding-top: 90px;
}
.hero-image { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
.hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.88) 100%);
}
.hero-content { position: relative; z-index: 2; }
.hero-gradient {
  position: absolute; bottom: 0; left: 0; right: 0; height: 200px;
  background: linear-gradient(to bottom, transparent 0%, rgba(10,10,10,0.3) 30%, rgba(10,10,10,0.7) 70%, #0a0a0a 100%);
  z-index: 2;
  filter: blur(0.5px);
}
.text-shadow-heavy { text-shadow: 2px 2px 4px rgba(0,0,0,0.9); }

/* CONTENIDO */
.matches-content { background: transparent; }

/* STICKY CALENDAR */
.sticky-calendar {
  position: sticky;
  top: 80px;
}

/* CALENDAR CARD */
.calendar-card {
  background: rgba(255, 255, 255, 0.03) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px !important;
}
:deep(.v-picker-title) { display: none; }
:deep(.v-date-picker-month) { padding: 0; }

/* MINI STATS */
.stat-mini-card {
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px !important;
  transition: all 0.3s ease;
}
.stat-mini-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255,255,255,0.15);
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}

/* MATCH CARDS */
.match-card {
  background: rgba(255, 255, 255, 0.03) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px !important;
  transition: all 0.3s ease;
  min-height: 170px;
}
.match-card:hover {
  transform: translateY(-8px);
  border-color: rgba(255,255,255,0.2);
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}
.card-header {
  background: rgba(0,0,0,0.2);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.card-footer {
  background: rgba(0,0,0,0.15);
  border-top: 1px solid rgba(255,255,255,0.05);
}
.gap-score { gap: 4px; }

/* UPCOMING CARDS */
.upcoming-card {
  background: rgba(255, 255, 255, 0.03) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px !important;
  transition: all 0.3s ease;
}
.upcoming-card:hover {
  transform: translateX(6px);
  border-color: rgba(255,255,255,0.2);
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}
.upcoming-detail-chip {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 4px 10px;
}
.gap-teams { gap: 8px; }

/* BTN NAV */
.btn-glass-nav {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.8) !important;
  transition: all 0.3s ease;
}
.btn-glass-nav:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255,255,255,0.3);
  color: white !important;
}

/* SECCIÓN INFO */
.section-quick-info {
  background: linear-gradient(180deg, #0a0a0a 0%, #050505 100%);
  border-top: 1px solid rgba(255,255,255,0.05);
}
.info-card {
  background: rgba(255, 255, 255, 0.03) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px !important;
  transition: all 0.4s ease;
}
.info-card:hover {
  transform: translateY(-10px);
  border-color: rgba(255,255,255,0.15);
  box-shadow: 0 15px 40px rgba(0,0,0,0.3);
}
.icon-circle {
  width: 64px; height: 64px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  display: flex; align-items: center; justify-content: center;
  border: 1px solid rgba(255,255,255,0.1);
}
.info-details { border-top: 1px solid rgba(255,255,255,0.06); }

/* ANIMACIONES */
.fade-in-up {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 1s ease forwards;
}
@keyframes fadeInUp {
  to { opacity: 1; transform: translateY(0); }
}
.scroll-reveal {
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.scroll-reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* RESPONSIVE */
@media (max-width: 960px) {
  .hero-matches { height: 40vh; min-height: 300px; }
  .sticky-calendar { position: static; }
}
@media (max-width: 600px) {
  .hero-matches { height: 35vh; min-height: 260px; padding-top: 80px; }
}
</style>