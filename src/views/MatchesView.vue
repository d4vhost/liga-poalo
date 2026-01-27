<template>
  <div class="matches-page">
    <!-- HERO SECTION CON IMAGEN DE FONDO -->
    <div class="hero-matches position-relative">
      <v-img
        src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1993&auto=format&fit=crop"
        cover
        class="hero-image"
      >
        <div class="hero-overlay"></div>
      </v-img>
      <v-container class="hero-content">
        <div class="text-center fade-in-up">
          <h1 class="text-h2 text-md-h1 font-weight-black text-white text-uppercase mb-4 text-shadow-heavy" style="line-height: 1; letter-spacing: -2px;">
            Partidos Programados
          </h1>
          <p class="text-h6 font-weight-regular text-grey-lighten-3 mx-auto" style="max-width: 700px; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">
            Consulta las fechas, horarios y resultados de la Liga San José de Poaló.
          </p>
        </div>
      </v-container>
      
      <!-- Gradiente de transición -->
      <div class="hero-gradient"></div>
    </div>

    <!-- CONTENIDO PRINCIPAL -->
    <section class="matches-content py-12">
      <v-container>
        <v-row class="align-stretch">
          <!-- CALENDARIO LATERAL - MÁS A LA IZQUIERDA -->
          <v-col cols="12" md="4" lg="4" class="scroll-reveal d-flex">
            <MatchCalendar class="flex-fill" />
          </v-col>

          <!-- LISTA DE PARTIDOS - MÁS ANCHO A LA DERECHA -->
          <v-col cols="12" md="8" lg="8" class="scroll-reveal d-flex" style="transition-delay: 0.2s">
            <MatchList class="flex-fill" />
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- SECCIÓN: INFORMACIÓN RÁPIDA SIN REGISTRO -->
    <section class="section-quick-info py-16" ref="quickInfoSection">
      <v-container>
        <div class="text-center mb-12 scroll-reveal">
          <h2 class="text-h3 text-md-h2 font-weight-black text-white mb-4" style="letter-spacing: -1px;">
            Mantente Informado sin Registro
          </h2>
          <p class="text-h6 font-weight-regular text-grey-lighten-1 mx-auto" style="max-width: 650px;">
            Consulta toda la información de la liga en tiempo real. No necesitas crear una cuenta para estar al día.
          </p>
        </div>

        <v-row class="justify-center">
          <v-col cols="12" md="6" lg="4" v-for="(info, i) in quickInfoItems" :key="i" class="scroll-reveal d-flex" :style="`transition-delay: ${i * 0.1}s`">
            <v-card class="info-card pa-6" elevation="0">
              <div class="icon-container mb-4">
                <v-icon :color="info.color" size="48">{{ info.icon }}</v-icon>
              </div>
              <h3 class="text-h6 font-weight-bold text-white mb-3">{{ info.title }}</h3>
              <p class="text-body-2 text-grey-lighten-2 mb-4">{{ info.description }}</p>
              
              <div class="info-details">
                <div v-for="(detail, idx) in info.details" :key="idx" class="detail-item mb-2">
                  <v-icon size="16" :color="info.color" class="mr-2">mdi-check-circle</v-icon>
                  <span class="text-caption text-grey-lighten-1">{{ detail }}</span>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- CALL TO ACTION -->
        <div class="text-center mt-12 scroll-reveal">
          <v-card class="cta-card pa-8 mx-auto" max-width="700" elevation="0">
            <v-icon color="blue-lighten-2" size="56" class="mb-4">mdi-bell-ring</v-icon>
            <h3 class="text-h5 font-weight-bold text-white mb-3">
              ¿Quieres Recibir Notificaciones?
            </h3>
            <p class="text-body-1 text-grey-lighten-2 mb-6">
              Regístrate gratis y recibe alertas por correo sobre cambios de horario, cancelaciones y actualizaciones importantes.
            </p>
            <v-btn 
              class="btn-glass-alt text-white font-weight-bold px-10" 
              rounded="pill"
              to="/login"
              height="52"
              size="large"
            >
              Crear Cuenta Gratis
            </v-btn>
          </v-card>
        </div>
      </v-container>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import MatchCalendar from '../components/matches/MatchCalendar.vue';
import MatchList from '../components/matches/MatchList.vue';

// Datos de información rápida
const quickInfoItems = ref([
  {
    icon: 'mdi-calendar-clock',
    color: 'green-lighten-2',
    title: 'Calendario Completo',
    description: 'Consulta todos los partidos programados de la temporada actual.',
    details: [
      'Fechas y horarios actualizados',
      'Ubicación de cada encuentro',
      'Estado del partido (Confirmado/Próximo)'
    ]
  },
  {
    icon: 'mdi-trophy-variant',
    color: 'yellow-lighten-2',
    title: 'Resultados en Vivo',
    description: 'Sigue los marcadores y resultados de los partidos en tiempo real.',
    details: [
      'Marcadores actualizados',
      'Estadísticas del partido',
      'Goleadores destacados'
    ]
  },
  {
    icon: 'mdi-table',
    color: 'blue-lighten-2',
    title: 'Tabla de Posiciones',
    description: 'Revisa la clasificación actualizada de todos los equipos.',
    details: [
      'Puntos y partidos jugados',
      'Diferencia de goles',
      'Racha de victorias/derrotas'
    ]
  }
]);

// Intersection Observer para animaciones al scroll
let observer;

onMounted(() => {
  const options = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
  };

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, options);

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
.matches-page {
  background: linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
  min-height: 100vh;
  padding-top: 0 !important;
  margin-top: 0 !important;
}

/* HERO SECTION */
.hero-matches {
  height: 50vh;
  min-height: 400px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  margin-top: 0 !important;
  padding-top: 90px;
}

.hero-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.hero-matches::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.02) 0%, transparent 50%);
  animation: pulseGlow 8s ease-in-out infinite;
  z-index: 1;
}

@keyframes pulseGlow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(10, 10, 10, 0.6) 0%,
    rgba(10, 10, 10, 0.85) 100%
  );
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(to bottom, transparent, #0a0a0a);
  z-index: 2;
}

/* SECCIÓN DE CONTENIDO */
.matches-content {
  background: transparent;
  position: relative;
  z-index: 3;
}

/* ALINEACIÓN DE ALTURA */
.align-stretch {
  align-items: stretch !important;
}

.d-flex {
  display: flex;
}

.flex-fill {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* ANIMACIONES */
.text-shadow-heavy { 
  text-shadow: 2px 2px 4px rgba(0,0,0,0.9); 
}

.fade-in-up {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 1s ease forwards;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  .hero-matches {
    height: 40vh;
    min-height: 320px;
  }
  
  .hero-matches h1 {
    font-size: 2rem !important;
  }
  
  .hero-matches p {
    font-size: 1rem !important;
  }
}

@media (max-width: 600px) {
  .hero-matches {
    height: 35vh;
    min-height: 280px;
    padding-top: 80px;
  }
}

/* SECCIÓN DE INFORMACIÓN RÁPIDA */
.section-quick-info {
  background: linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 100%);
  position: relative;
}

.section-quick-info::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
}

.info-card {
  background: rgba(255, 255, 255, 0.04) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px !important;
  transition: all 0.4s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.info-card:hover {
  transform: translateY(-8px);
  border-color: rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.06) !important;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

.icon-container {
  background: rgba(255, 255, 255, 0.05);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.info-card:hover .icon-container {
  background: rgba(255, 255, 255, 0.08);
  transform: scale(1.05);
  border-color: rgba(255, 255, 255, 0.2);
}

.info-details {
  background: rgba(0, 0, 0, 0.2);
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.detail-item {
  display: flex;
  align-items: center;
}

.cta-card {
  background: rgba(255, 255, 255, 0.04) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px !important;
  transition: all 0.4s ease;
}

.cta-card:hover {
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
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
</style>