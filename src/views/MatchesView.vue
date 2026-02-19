<template>
  <div class="matches-page">
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
          <h1 class="text-h3 text-md-h2 font-weight-black text-white text-uppercase mb-2">
            Resultados y Calendario
          </h1>
          <p class="text-subtitle-1 text-grey-lighten-3 mx-auto">
            Liga Deportiva San José de Poaló
          </p>
        </div>
      </v-container>
      <div class="hero-gradient"></div>
    </div>

    <section class="matches-content py-8">
      <v-container>
        <v-row class="fill-height align-stretch">
          
          <v-col cols="12" md="4" class="d-flex flex-column">
            <div class="sticky-calendar flex-grow-1">
              <v-card class="calendar-card pa-4 h-100 d-flex flex-column" elevation="4">
                <div class="d-flex align-center mb-3">
                  <v-icon color="white" class="mr-2" size="24">mdi-calendar-month</v-icon>
                  <h3 class="text-h6 font-weight-bold text-white mb-0">Calendario Oficial</h3>
                </div>
                
                <v-date-picker 
                  v-model="date" 
                  elevation="0" 
                  class="w-100 calendar-transparent flex-grow-1"
                  color="blue-grey-lighten-2"
                ></v-date-picker>

                <v-divider class="my-3 border-opacity-25"></v-divider>
                
                <div class="events-list">
                  <p class="text-caption font-weight-bold text-grey-lighten-1 mb-2 text-uppercase">
                    Jornada Actual
                  </p>
                  <v-list density="compact" bg-color="transparent" theme="dark" class="pa-0">
                    <v-list-item class="px-0">
                      <template v-slot:prepend>
                        <v-icon size="small" color="white" class="mr-2">mdi-check-circle</v-icon>
                      </template>
                      <v-list-item-title class="text-caption font-weight-bold text-white">Jornada 5 - Finalizada</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </div>
              </v-card>
            </div>
          </v-col>

          <v-col cols="12" md="8" class="d-flex flex-column">
            <div class="d-flex justify-space-between align-center mb-4 pl-1">
              <h2 class="text-h5 font-weight-bold text-white">Resultados Recientes</h2>
            </div>

            <v-row dense class="flex-grow-1 align-content-stretch">
              <v-col 
                v-for="i in 4" 
                :key="i" 
                cols="12" 
                md="6" 
                class="pb-3 pr-md-2"
              >
                <v-card class="match-card h-100 d-flex flex-column" elevation="0">
                  <div class="card-header d-flex justify-space-between align-center px-3 py-2">
                    <div class="text-caption text-grey-lighten-2 font-weight-medium">
                      <v-icon size="12" class="mr-1" color="white">mdi-calendar</v-icon>
                      15 Feb 2026
                    </div>
                    <div class="text-caption text-grey-lighten-2 font-weight-medium text-truncate" style="max-width: 120px;">
                      <v-icon size="12" class="mr-1" color="white">mdi-stadium</v-icon>
                      Estadio Central
                    </div>
                  </div>

                  <v-divider class="border-opacity-10"></v-divider>

                  <div class="card-body pa-3 d-flex align-center justify-space-between flex-grow-1">
                    <div class="team-block text-center" style="width: 30%;">
                      <v-avatar size="42" color="grey-darken-4" class="mb-2 elevation-2 border-subtle">
                        <span class="text-h6 font-weight-bold text-white">T</span>
                      </v-avatar>
                      <div class="text-caption font-weight-bold text-white text-truncate">Tigres</div>
                    </div>

                    <div class="score-board text-center mx-1" style="width: 40%;">
                      <div class="d-flex justify-center align-center mb-1">
                        <span class="text-h4 font-weight-bold text-white">2</span>
                        <span class="text-h6 text-grey mx-2">-</span>
                        <span class="text-h4 font-weight-bold text-white">1</span>
                      </div>
                      <v-chip color="white" variant="outlined" size="x-small" class="font-weight-bold px-2 text-white" style="border-color: rgba(255,255,255,0.3);">
                        Finalizado
                      </v-chip>
                    </div>

                    <div class="team-block text-center" style="width: 30%;">
                      <v-avatar size="42" color="grey-darken-4" class="mb-2 elevation-2 border-subtle">
                        <span class="text-h6 font-weight-bold text-white">A</span>
                      </v-avatar>
                      <div class="text-caption font-weight-bold text-white text-truncate">Águilas</div>
                    </div>
                  </div>

                  <div class="card-footer px-3 py-2 mt-auto">
                    <div class="d-flex justify-space-between">
                      <span class="text-caption text-grey-lighten-1">
                        Inicio: <span class="text-white">14:00</span>
                      </span>
                      <span class="text-caption text-grey-lighten-1">
                        Fin: <span class="text-white">15:45</span>
                      </span>
                    </div>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section class="section-quick-info py-12" ref="quickInfoSection">
      <v-container>
        <div class="text-center mb-10 scroll-reveal">
          <h2 class="text-h4 font-weight-black text-white mb-2">
            Información de la Liga
          </h2>
          <p class="text-body-1 text-grey-lighten-2 mx-auto" style="max-width: 650px;">
            Datos clave sobre el desarrollo del campeonato actual.
          </p>
        </div>

        <v-row class="justify-center">
          <v-col cols="12" md="4" v-for="(info, i) in quickInfoItems" :key="i" class="scroll-reveal">
            <v-card class="info-card pa-6 h-100" elevation="0">
              <div class="icon-circle mb-4">
                <v-icon color="white" size="32">{{ info.icon }}</v-icon>
              </div>
              <h3 class="text-h6 font-weight-bold text-white mb-3">{{ info.title }}</h3>
              <p class="text-body-2 text-grey-lighten-2 mb-4" style="line-height: 1.6;">{{ info.description }}</p>
              
              <div class="info-details pt-3">
                <div v-for="(detail, idx) in info.details" :key="idx" class="d-flex align-center mb-2">
                  <v-icon size="16" color="blue-grey-lighten-3" class="mr-2">mdi-check-circle</v-icon>
                  <span class="text-caption text-grey-lighten-1">{{ detail }}</span>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <div class="text-center mt-12 scroll-reveal">
          <v-card class="cta-card pa-8 mx-auto position-relative overflow-hidden" max-width="700" elevation="0">
            <div class="d-flex align-center justify-space-between flex-column flex-sm-row position-relative z-1">
              <div class="text-center text-sm-left mr-sm-8 mb-6 mb-sm-0">
                <h3 class="text-h5 font-weight-bold text-white mb-2">
                  ¿Quieres recibir notificaciones?
                </h3>
                <p class="text-body-2 text-grey-lighten-2">
                  Suscríbete para recibir alertas de cambios de horario y resultados al instante.
                </p>
              </div>
              <v-btn 
                class="btn-glass px-8"
                height="48"
                rounded="pill"
                to="/login"
              >
                <span class="font-weight-bold">Suscribirse</span>
                <v-icon right class="ml-2">mdi-bell-ring</v-icon>
              </v-btn>
            </div>
          </v-card>
        </div>
      </v-container>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const date = ref(new Date());

const quickInfoItems = ref([
  {
    icon: 'mdi-trophy-outline',
    title: 'Resultados en Vivo',
    description: 'Sigue los marcadores minuto a minuto. Actualizaciones instantáneas desde el campo de juego.',
    details: ['Goleadores en tiempo real', 'Tarjetas y sanciones', 'Cambios de jugadores']
  },
  {
    icon: 'mdi-chart-bar',
    title: 'Tabla de Posiciones',
    description: 'Clasificación oficial actualizada automáticamente al finalizar cada jornada.',
    details: ['Puntos acumulados', 'Diferencia de gol', 'Partidos jugados']
  },
  {
    icon: 'mdi-book-open-variant',
    title: 'Reglamento Oficial',
    description: 'Consulta la normativa vigente para la temporada 2026 y evita sanciones.',
    details: ['Código de disciplina', 'Reglas de inscripción', 'Protocolos de arbitraje']
  }
]);

// Animaciones
let observer;
onMounted(() => {
  const options = { threshold: 0.15 };
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, options);
  document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
});
</script>

<style scoped>
/* DEGRADADO EXACTO DEL HOME (Próximos Partidos) */
.matches-page {
  /* Fondo base para prevenir parpadeos */
  background-color: #1a1a1a;
  min-height: 100vh;
  /* El degradado exacto que pediste: #263238 (Blue Grey Darken-4) -> #1a1a1a */
  background: linear-gradient(180deg, #263238 0%, #1a1a1a 100%);
}

/* HERO SECTION */
.hero-matches {
  height: 35vh;
  min-height: 250px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  margin-top: 0;
  padding-top: 64px;
}
.hero-image { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
.hero-overlay {
  position: absolute; inset: 0;
  /* Overlay oscuro con el tono base #263238 para mezclar imagen y fondo */
  background: linear-gradient(to bottom, rgba(38, 50, 56, 0.5) 0%, #263238 100%);
}
.hero-content { position: relative; z-index: 2; }
.hero-gradient {
  position: absolute; bottom: 0; left: 0; right: 0; height: 100px;
  /* Transición suave hacia el color de inicio de la página (#263238) */
  background: linear-gradient(to bottom, transparent, #263238);
  z-index: 1;
}

/* CONTENIDO PRINCIPAL */
.matches-content {
  background: transparent;
}

/* CALENDARIO */
.calendar-card {
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}
.sticky-calendar { 
  position: sticky; 
  top: 80px; 
  z-index: 10;
  height: calc(100vh - 100px); /* Ajuste para que cuadre con la pantalla si es necesario */
  max-height: 600px; /* Altura máxima controlada */
}
:deep(.v-date-picker-month) { padding: 0; }
:deep(.v-picker-title) { display: none; }

/* TARJETAS DE PARTIDO */
.match-card {
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px !important;
  transition: all 0.3s ease;
  min-height: 160px; 
}
.match-card:hover {
  background: rgba(255, 255, 255, 0.08) !important;
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.2);
}
.card-header {
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.card-footer {
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.border-subtle {
  border: 1px solid rgba(255,255,255,0.1);
}

/* SECCIÓN INFORMACIÓN */
.section-quick-info {
  background: transparent;
  position: relative;
  /* Línea divisoria muy sutil */
  border-top: 1px solid rgba(255,255,255,0.05);
}

.info-card {
  background: rgba(255, 255, 255, 0.03) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px !important;
  transition: all 0.4s ease;
}
.info-card:hover {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.06) !important;
  border-color: rgba(255, 255, 255, 0.15);
}
.icon-circle {
  width: 60px; height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  display: flex; align-items: center; justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.info-details {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

/* CTA Card */
.cta-card {
  background: rgba(30, 30, 30, 0.6) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px !important;
}
.z-1 { position: relative; z-index: 1; }

/* Botones Glass */
.btn-glass {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white !important;
  transition: all 0.3s ease;
}
.btn-glass:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  transform: translateY(-2px);
}

/* ANIMACIONES */
.scroll-reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s ease; }
.scroll-reveal.visible { opacity: 1; transform: translateY(0); }
</style>