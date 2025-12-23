// src/views/HomeView.vue
<template>
  <div class="bg-blue-grey-darken-4 overflow-hidden">
    
    <!-- HERO SECTION -->
    <div class="position-relative hero-section">
      <v-img
        :src="bgImage"
        cover
        height="100vh"
        class="hero-image-zoom"
      >
        <div class="fill-height d-flex flex-column justify-center align-center overlay-premium px-4 text-center">
          
          <h1 class="text-h3 text-md-h1 font-weight-black text-uppercase mb-6 text-white text-shadow-heavy fade-in-up" style="line-height: 1; letter-spacing: -2px;">
            SAN JOSÉ DE POALÓ
          </h1>
          
          <div class="text-container mb-10 fade-in-up delay-1">
            <p class="text-h5 font-weight-regular text-grey-lighten-3" style="max-width: 700px; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">
              Cuna de grandes deportistas y pasión inagotable. <br>
              La liga donde se juega el verdadero fútbol.
            </p>
          </div>
          
          <div class="d-flex flex-wrap justify-center align-center gap-buttons fade-in-up delay-2">
            <v-btn 
              class="text-white font-weight-bold px-10 btn-glass" 
              rounded="pill"
              to="/partidos"
              height="55"
              min-width="280" 
            >
              Ver la Jornada
            </v-btn>
          </div>

        </div>
      </v-img>

      <div class="position-absolute bottom-0 w-100 text-center mb-8 animate-bounce" style="z-index: 2; opacity: 0.8;">
        <span class="text-caption text-white d-block mb-2 font-weight-bold">Scroll para vivir la pasión</span>
        <v-icon color="white" size="30">mdi-arrow-down-thin-circle-outline</v-icon>
      </div>
    </div>

    <!-- SECCIÓN: PRÓXIMOS PARTIDOS -->
    <section class="section-upcoming-matches py-16" ref="upcomingSection">
      <v-container>
        <div class="text-center mb-12 scroll-reveal">
          <h2 class="text-h3 text-md-h2 font-weight-black text-white mb-4" style="letter-spacing: -1px;">
            Próximos Partidos
          </h2>
          <p class="text-h6 text-grey-lighten-1 mx-auto" style="max-width: 600px;">
            Mantente al día con el calendario de la liga. Consulta las fechas programadas y no te pierdas ningún encuentro.
          </p>
        </div>

        <v-row class="justify-center">
          <v-col cols="12" md="4" v-for="(match, i) in upcomingMatches" :key="i" class="scroll-reveal" :style="`transition-delay: ${i * 0.1}s`">
            <v-card class="match-card pa-6 text-center" elevation="0">
              <div class="d-flex justify-space-between align-center mb-4">
                <div class="team-info">
                  <v-icon size="48" color="white" class="mb-2">mdi-shield</v-icon>
                  <p class="text-body-1 font-weight-bold text-white">{{ match.team1 }}</p>
                </div>
                <div class="vs-badge">
                  <span class="text-h5 font-weight-black text-white">VS</span>
                </div>
                <div class="team-info">
                  <v-icon size="48" color="white" class="mb-2">mdi-shield</v-icon>
                  <p class="text-body-1 font-weight-bold text-white">{{ match.team2 }}</p>
                </div>
              </div>
              <v-divider class="my-4 border-opacity-25"></v-divider>
              <div class="match-details">
                <p class="text-body-2 text-grey-lighten-2 mb-1">
                  <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                  {{ match.date }}
                </p>
                <p class="text-body-2 text-grey-lighten-2">
                  <v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>
                  {{ match.time }}
                </p>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <div class="text-center mt-10 scroll-reveal">
          <v-btn 
            class="btn-glass-alt text-white font-weight-bold px-8" 
            rounded="pill"
            to="/partidos"
            height="50"
          >
            Ver Calendario Completo
          </v-btn>
        </div>
      </v-container>
    </section>

    <!-- SECCIÓN: BENEFICIOS DE REGISTRO -->
    <section class="section-benefits py-16 bg-benefits" ref="benefitsSection">
      <v-container>
        <div class="text-center mb-12 scroll-reveal">
          <h2 class="text-h3 text-md-h2 font-weight-black text-white mb-4" style="letter-spacing: -1px;">
            Regístrate y Recibe Actualizaciones
          </h2>
          <p class="text-h6 text-grey-lighten-1 mx-auto" style="max-width: 650px;">
            Crea tu cuenta y mantente informado al instante sobre todos los cambios en la liga.
          </p>
        </div>

        <v-row class="justify-center align-stretch">
          <v-col cols="12" md="4" v-for="(benefit, i) in benefits" :key="i" class="d-flex scroll-reveal" :style="`transition-delay: ${i * 0.15}s`">
            <v-card class="benefit-card flex-grow-1 pa-8 text-center" elevation="0">
              <div class="benefit-icon-wrapper mb-4">
                <v-icon :color="benefit.color" size="56">{{ benefit.icon }}</v-icon>
              </div>
              <h3 class="text-h5 font-weight-bold text-white mb-3">{{ benefit.title }}</h3>
              <p class="text-body-1 text-grey-lighten-2 mb-0">{{ benefit.description }}</p>
            </v-card>
          </v-col>
        </v-row>

        <div class="text-center mt-12 scroll-reveal">
          <v-btn 
            class="btn-glass-alt text-white font-weight-bold px-12" 
            rounded="pill"
            to="/login"
            height="56"
            size="large"
          >
            Regístrate sin ningún costo
          </v-btn>
        </div>
      </v-container>
    </section>

    <!-- SECCIÓN: ÁREA DE JUGADORES -->
    <section class="section-players py-16" ref="playersSection">
      <v-container>
        <div class="text-center mb-12 scroll-reveal">
          <h2 class="text-h3 text-md-h2 font-weight-black text-white mb-4" style="letter-spacing: -1px;">
            Portal del Jugador
          </h2>
          <p class="text-h6 text-grey-lighten-1 mx-auto" style="max-width: 700px;">
            ¿Eres jugador del campeonato? Inicia sesión y accede a toda tu información personal y estadísticas.
          </p>
        </div>

        <v-row class="justify-center">
          <v-col cols="12" lg="10">
            <v-card class="player-portal-card pa-8 pa-md-12" elevation="0">
              <v-row>
                <v-col cols="12" md="6" class="scroll-reveal">
                  <h3 class="text-h4 font-weight-bold text-white mb-6">Accede a tu Dashboard</h3>
                  <v-list class="bg-transparent" density="comfortable">
                    <v-list-item v-for="(feature, i) in playerFeatures" :key="i" class="px-0 mb-3">
                      <template v-slot:prepend>
                        <v-icon :color="feature.color" class="mr-3">{{ feature.icon }}</v-icon>
                      </template>
                      <v-list-item-title class="text-white font-weight-medium text-body-1">
                        {{ feature.title }}
                      </v-list-item-title>
                      <v-list-item-subtitle class="text-grey-lighten-1">
                        {{ feature.subtitle }}
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-col>

                <v-col cols="12" md="6" class="d-flex flex-column justify-center align-center scroll-reveal" style="transition-delay: 0.2s">
                  <div class="stats-preview pa-6 w-100">
                    <div class="text-center mb-4">
                      <v-icon size="80" color="green-lighten-2">mdi-account-star</v-icon>
                    </div>
                    <h4 class="text-h6 font-weight-bold text-white text-center mb-4">Tu Perfil de Jugador</h4>
                    <div class="stat-row">
                      <span class="text-grey-lighten-1">Goles Anotados</span>
                      <span class="text-white font-weight-bold">12</span>
                    </div>
                    <v-divider class="my-3 border-opacity-25"></v-divider>
                    <div class="stat-row">
                      <span class="text-grey-lighten-1">Tarjetas</span>
                      <span class="text-white font-weight-bold">3 Amarillas</span>
                    </div>
                    <v-divider class="my-3 border-opacity-25"></v-divider>
                    <div class="stat-row">
                      <span class="text-grey-lighten-1">Pagos Pendientes</span>
                      <span class="text-green-lighten-2 font-weight-bold">$0.00</span>
                    </div>
                    <v-btn 
                      class="btn-glass-alt text-white font-weight-bold mt-6 w-100" 
                      rounded="pill"
                      to="/login"
                      height="48"
                    >
                      Iniciar Sesión
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- SECCIÓN: CALL TO ACTION FINAL -->
    <section class="section-cta py-16 text-center" ref="ctaSection">
      <v-container>
        <div class="scroll-reveal">
          <h2 class="text-h3 text-md-h2 font-weight-black text-white mb-4" style="letter-spacing: -1px;">
            ¿Listo para Ser Parte?
          </h2>
          <p class="text-h6 text-grey-lighten-1 mb-10 mx-auto" style="max-width: 600px;">
            Únete a la comunidad de la Liga San José de Poaló y vive cada partido como nunca antes.
          </p>
        </div>
      </v-container>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import bgImage from '../images/background.avif';

// Datos de ejemplo
const upcomingMatches = ref([
  { team1: 'Los Tigres', team2: 'Águilas FC', date: '15 Enero 2025', time: '15:00' },
  { team1: 'Real Poaló', team2: 'Deportivo Sur', date: '18 Enero 2025', time: '16:30' },
  { team1: 'Unidos FC', team2: 'Los Leones', date: '22 Enero 2025', time: '14:00' }
]);

const benefits = ref([
  {
    icon: 'mdi-email-fast',
    color: 'blue-lighten-2',
    title: 'Notificaciones Instantáneas',
    description: 'Recibe alertas por correo sobre cambios de horario, cancelaciones y reprogramaciones de partidos.'
  },
  {
    icon: 'mdi-calendar-alert',
    color: 'orange-lighten-2',
    title: 'Calendario Actualizado',
    description: 'Consulta las fechas programadas y mantente informado sobre todos los encuentros de la temporada.'
  },
  {
    icon: 'mdi-bell-ring',
    color: 'purple-lighten-2',
    title: 'Avisos Importantes',
    description: 'Entérate de primera mano sobre comunicados oficiales, eventos especiales y noticias de la liga.'
  }
]);

const playerFeatures = ref([
  {
    icon: 'mdi-chart-line',
    color: 'green-lighten-2',
    title: 'Estadísticas Completas',
    subtitle: 'Goles, asistencias, minutos jugados y más'
  },
  {
    icon: 'mdi-card-account-details',
    color: 'yellow-lighten-2',
    title: 'Tarjetas y Sanciones',
    subtitle: 'Visualiza tarjetas amarillas y rojas recibidas'
  },
  {
    icon: 'mdi-cash-multiple',
    color: 'blue-lighten-2',
    title: 'Estado de Pagos',
    subtitle: 'Revisa tus cuotas y pagos pendientes'
  },
  {
    icon: 'mdi-trophy',
    color: 'orange-lighten-2',
    title: 'Rendimiento Personal',
    subtitle: 'Sigue tu progreso a lo largo de la temporada'
  }
]);

// Intersection Observer para animaciones al scroll
let observer;

onMounted(() => {
  const options = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
  };

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, options);

  // Observar todos los elementos con clase scroll-reveal
  document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el);
  });
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped>
/* --- GENERAL UTILS --- */
.text-shadow-heavy { text-shadow: 2px 2px 4px rgba(0,0,0,0.9); }

/* --- HERO SECTION --- */
.hero-section {
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.hero-image-zoom .v-img__img {
  animation: slowZoom 20s infinite alternate;
}
@keyframes slowZoom {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}

.overlay-premium {
  background: linear-gradient(
    to bottom,
    rgba(15, 23, 42, 0.2) 0%,
    rgba(10, 10, 10, 0.8) 100%
  );
}

.text-container {
  display: flex;
  justify-content: center;
}

/* --- SCROLL REVEAL ANIMATION --- */
.scroll-reveal {
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.scroll-reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* --- SECTIONS --- */
.section-upcoming-matches {
  background: linear-gradient(180deg, #263238 0%, #1a1a1a 100%);
}

.section-benefits {
  background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%);
  position: relative;
}

.section-benefits::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
}

.section-players {
  background: linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 100%);
}

.section-cta {
  background: linear-gradient(180deg, #1a1a1a 0%, #000 100%);
}

/* --- MATCH CARDS --- */
.match-card {
  background: rgba(255, 255, 255, 0.03) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px !important;
  transition: all 0.3s ease;
}

.match-card:hover {
  transform: translateY(-8px);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.team-info {
  flex: 1;
}

.vs-badge {
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.match-details {
  background: rgba(0, 0, 0, 0.2);
  padding: 12px;
  border-radius: 8px;
}

/* --- BENEFIT CARDS --- */
.benefit-card {
  background: rgba(255, 255, 255, 0.04) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px !important;
  transition: all 0.4s ease;
}

.benefit-card:hover {
  transform: translateY(-10px);
  border-color: rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.06) !important;
}

.benefit-icon-wrapper {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* --- PLAYER PORTAL CARD --- */
.player-portal-card {
  background: rgba(255, 255, 255, 0.04) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px !important;
}

.stats-preview {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* --- BUTTONS --- */
.btn-glass {
  background: rgba(0, 0, 0, 0.5) !important;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: none;
  transition: all 0.3s ease;
  letter-spacing: 1px;
  font-size: 1rem;
}

.btn-glass:hover {
  background: rgba(0, 0, 0, 0.7) !important;
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
}

.btn-glass-alt {
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
}

.btn-glass-alt:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.btn-register {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-register:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
}

.btn-glass-outline {
  background: transparent !important;
  border: 2px solid rgba(255, 255, 255, 0.3) !important;
  transition: all 0.3s ease;
}

.btn-glass-outline:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.6) !important;
  transform: translateY(-2px);
}

/* --- ANIMATIONS --- */
.fade-in-up {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 1s ease forwards;
}

.delay-1 { animation-delay: 0.3s; }
.delay-2 { animation-delay: 0.6s; }

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(10px); }
}
.animate-bounce {
  animation: bounce 2s infinite;
}

.gap-buttons {
  gap: 16px;
}

/* Responsive */
@media (max-width: 960px) {
  .hero-section h1 {
    font-size: 2.5rem !important;
  }
  
  .stats-preview {
    margin-top: 24px;
  }
}
</style>