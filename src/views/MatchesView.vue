<template>
  <div class="matches-page">
    <!-- HERO SECTION CON IMAGEN DE FONDO -->
    <div class="hero-matches position-relative">
      <div class="hero-overlay"></div>
      <v-container class="hero-content">
        <div class="text-center fade-in-up">
          <h1 class="text-h2 text-md-h1 font-weight-black text-white text-uppercase mb-4" style="letter-spacing: -2px; text-shadow: 3px 3px 6px rgba(0,0,0,0.9);">
            Calendario de Juegos
          </h1>
          <p class="text-h6 text-grey-lighten-2 mx-auto" style="max-width: 700px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
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
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import MatchCalendar from '../components/matches/MatchCalendar.vue';
import MatchList from '../components/matches/MatchList.vue';

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
  background: linear-gradient(135deg, #263238 0%, #1a1a1a 50%, #0f0f0f 100%);
  position: relative;
  overflow: hidden;
  margin-top: 0 !important;
  padding-top: 90px;
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
  background: rgba(0, 0, 0, 0.3);
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
</style>