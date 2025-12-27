// src/views/ContactView.vue
<template>
  <div class="contact-page">
    <!-- HERO SECTION -->
    <div class="hero-contact position-relative">
      <v-img
        src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2074&auto=format&fit=crop"
        cover
        class="hero-image"
      >
        <div class="hero-overlay"></div>
      </v-img>
      <v-container class="hero-content">
        <div class="text-center fade-in-up">
          <h1 class="text-h2 text-md-h1 font-weight-black text-white text-uppercase mb-4 text-shadow-heavy" style="line-height: 1; letter-spacing: -2px;">
            Contáctanos
          </h1>
          <p class="text-h6 font-weight-regular text-grey-lighten-3 mx-auto" style="max-width: 700px; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">
            ¿Quieres ser parte del equipo o tienes alguna duda? Estamos aquí para ayudarte.
          </p>
        </div>
      </v-container>
      <div class="hero-gradient"></div>
    </div>

    <!-- SECCIÓN DE INFORMACIÓN DE CONTACTO -->
    <section class="section-contact-info py-16">
      <v-container>
        <div class="text-center mb-12 scroll-reveal">
          <h2 class="text-h3 text-md-h2 font-weight-black text-white mb-4" style="letter-spacing: -1px;">
            Formas de Contacto
          </h2>
          <p class="text-h6 font-weight-regular text-grey-lighten-1 mx-auto" style="max-width: 650px;">
            Comunícate con nosotros a través de cualquiera de estos medios. Responderemos a la brevedad posible.
          </p>
        </div>

        <v-row class="justify-center">
          <!-- TARJETA: ÚNETE AL EQUIPO -->
          <v-col cols="12" lg="5" class="scroll-reveal d-flex">
            <v-card class="contact-card pa-8 flex-fill" elevation="0">
              <div class="icon-wrapper-large mb-5">
                <v-icon color="green-lighten-2" size="64">mdi-account-multiple-plus</v-icon>
              </div>
              <h3 class="text-h4 font-weight-bold text-white mb-4">
                ¿Quieres Ser Parte del Equipo?
              </h3>
              <p class="text-body-1 text-grey-lighten-2 mb-6">
                Si deseas unirte a la Liga Parroquial San José de Poaló como jugador, árbitro o staff, contáctanos. 
                Te brindaremos toda la información sobre inscripciones, requisitos y fechas disponibles.
              </p>
              
              <div class="info-section mb-4">
                <div class="info-item mb-3">
                  <v-icon color="blue-lighten-2" size="24" class="mr-3">mdi-phone</v-icon>
                  <div>
                    <p class="text-caption text-grey-lighten-1 mb-1">Teléfono de Contacto</p>
                    <p class="text-h6 font-weight-bold text-white">+593 98 765 4321</p>
                  </div>
                </div>
                
                <div class="info-item mb-3">
                  <v-icon color="orange-lighten-2" size="24" class="mr-3">mdi-email</v-icon>
                  <div>
                    <p class="text-caption text-grey-lighten-1 mb-1">Correo Electrónico</p>
                    <p class="text-body-1 font-weight-medium text-white">liga@sanjosépoalo.ec</p>
                  </div>
                </div>

                <div class="info-item">
                  <v-icon color="purple-lighten-2" size="24" class="mr-3">mdi-clock-outline</v-icon>
                  <div>
                    <p class="text-caption text-grey-lighten-1 mb-1">Horario de Atención</p>
                    <p class="text-body-1 font-weight-medium text-white">Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>

              <v-btn
                class="btn-glass-contact w-100"
                rounded="pill"
                height="50"
                prepend-icon="mdi-whatsapp"
                href="https://wa.me/593987654321"
                target="_blank"
              >
                <span class="font-weight-bold">Escribir por WhatsApp</span>
              </v-btn>
            </v-card>
          </v-col>

          <!-- TARJETA: CONSULTAS Y DUDAS -->
          <v-col cols="12" lg="5" class="scroll-reveal d-flex" style="transition-delay: 0.2s">
            <v-card class="contact-card pa-8 flex-fill" elevation="0">
              <div class="icon-wrapper-large mb-5">
                <v-icon color="yellow-lighten-2" size="64">mdi-help-circle</v-icon>
              </div>
              <h3 class="text-h4 font-weight-bold text-white mb-4">
                ¿Tienes Alguna Duda?
              </h3>
              <p class="text-body-1 text-grey-lighten-2 mb-6">
                Si tienes preguntas sobre horarios de partidos, inscripciones, reglamentos o cualquier 
                información relacionada con la liga, no dudes en contactarnos. Estamos para servirte.
              </p>

              <div class="faq-list">
                <v-expansion-panels theme="dark" class="mb-4">
                  <v-expansion-panel
                    v-for="(faq, i) in faqs"
                    :key="i"
                    class="faq-panel"
                  >
                    <v-expansion-panel-title class="text-body-1 font-weight-medium">
                      <v-icon :color="faq.color" size="20" class="mr-3">{{ faq.icon }}</v-icon>
                      {{ faq.question }}
                    </v-expansion-panel-title>
                    <v-expansion-panel-text class="text-body-2 text-grey-lighten-2">
                      {{ faq.answer }}
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </div>

              <v-btn
                class="btn-glass-contact-alt w-100"
                rounded="pill"
                height="50"
                prepend-icon="mdi-email-outline"
                href="mailto:liga@sanjosépoalo.ec"
              >
                <span class="font-weight-bold">Enviar Correo</span>
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- SECCIÓN DEL MAPA -->
    <section class="section-map py-16">
      <v-container>
        <div class="text-center mb-12 scroll-reveal">
          <h2 class="text-h3 text-md-h2 font-weight-black text-white mb-4" style="letter-spacing: -1px;">
            Encuéntranos
          </h2>
          <p class="text-h6 font-weight-regular text-grey-lighten-1 mx-auto" style="max-width: 650px;">
            Ubicación del Estadio Principal de San José de Poaló
          </p>
        </div>

        <v-row class="justify-center">
          <v-col cols="12" lg="10" class="scroll-reveal" style="transition-delay: 0.2s">
            <v-card class="map-card pa-0" elevation="0">
              <!-- Información de Distancia (Solo si ya se activó la ubicación) -->
              <div v-if="showDistance && userLocation && distance" class="distance-banner pa-4">
                <div class="d-flex align-center justify-space-between flex-wrap gap-3">
                  <div class="d-flex align-center">
                    <v-icon color="green-lighten-2" size="32" class="mr-3">mdi-map-marker-distance</v-icon>
                    <div>
                      <p class="text-caption text-grey-lighten-1 mb-0">Distancia desde tu ubicación</p>
                      <p class="text-h6 font-weight-bold text-white mb-0">{{ distance }}</p>
                    </div>
                  </div>
                  <v-btn
                    color="blue-lighten-2"
                    variant="flat"
                    rounded="pill"
                    size="small"
                    @click="openDirections"
                    prepend-icon="mdi-directions"
                  >
                    Ver Ruta en Google Maps
                  </v-btn>
                </div>
              </div>

              <!-- Contenedor del Mapa -->
              <div id="map" class="map-container"></div>

              <!-- Botón para activar ubicación del usuario -->
              <div v-if="!showDistance" class="location-button-overlay">
                <v-btn
                  color="blue-lighten-2"
                  variant="flat"
                  rounded="pill"
                  size="small"
                  @click="getUserLocationAndShowRoute"
                  prepend-icon="mdi-crosshairs-gps"
                  class="elevation-6"
                >
                  <span class="text-caption font-weight-medium">Ver Ubicación</span>
                </v-btn>
              </div>

              <!-- Información Adicional -->
              <div class="map-info pa-6">
                <v-row>
                  <v-col cols="12" md="4">
                    <div class="d-flex align-center mb-2">
                      <v-icon color="blue-lighten-2" size="20" class="mr-2">mdi-map-marker</v-icon>
                      <span class="text-caption text-grey-lighten-1">Dirección</span>
                    </div>
                    <p class="text-body-2 font-weight-medium text-white">
                      San José de Poaló, Píllaro, Tungurahua
                    </p>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="d-flex align-center mb-2">
                      <v-icon color="green-lighten-2" size="20" class="mr-2">mdi-stadium</v-icon>
                      <span class="text-caption text-grey-lighten-1">Capacidad</span>
                    </div>
                    <p class="text-body-2 font-weight-medium text-white">
                      500 Espectadores
                    </p>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="d-flex align-center mb-2">
                      <v-icon color="orange-lighten-2" size="20" class="mr-2">mdi-parking</v-icon>
                      <span class="text-caption text-grey-lighten-1">Estacionamiento</span>
                    </div>
                    <p class="text-body-2 font-weight-medium text-white">
                      Disponible
                    </p>
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Inyectar el tema desde App o usar local
const isDarkMode = inject('isDarkMode', ref(true));

// Coordenadas del Estadio San José de Poaló
const stadiumCoords = [-1.1847, -78.5453];
const userLocation = ref(null);
const distance = ref(null);
const showDistance = ref(false);
let map = null;
let userMarker = null;
let stadiumMarker = null;
let routeLine = null;

// FAQs
const faqs = ref([
  {
    icon: 'mdi-calendar',
    color: 'blue-lighten-2',
    question: '¿Cuándo son los partidos?',
    answer: 'Los partidos se realizan principalmente los fines de semana. Puedes consultar el calendario completo en la sección de Partidos.'
  },
  {
    icon: 'mdi-cash',
    color: 'green-lighten-2',
    question: '¿Cuál es el costo de inscripción?',
    answer: 'El costo de inscripción varía según la categoría. Contáctanos para obtener información detallada sobre las tarifas actuales.'
  },
  {
    icon: 'mdi-file-document',
    color: 'orange-lighten-2',
    question: '¿Qué documentos necesito?',
    answer: 'Necesitas cédula de identidad, certificado médico reciente y una foto tamaño carnet. Para menores de edad se requiere autorización de los padres.'
  }
]);

// Calcular distancia entre dos puntos
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c;
  
  if (d < 1) {
    return `${Math.round(d * 1000)} metros`;
  } else {
    return `${d.toFixed(2)} km`;
  }
};

// Inicializar mapa (solo con el marcador del estadio)
const initMap = () => {
  map = L.map('map', {
    center: stadiumCoords,
    zoom: 15,
    zoomControl: true,
    scrollWheelZoom: false,
    dragging: true,
    touchZoom: true,
    doubleClickZoom: true
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map);

  // Icono personalizado para el estadio (pelota de fútbol emoji)
  const stadiumIcon = L.divIcon({
    className: 'custom-stadium-marker',
    html: '<span style="font-size: 25px;">⚽</span>',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });

  stadiumMarker = L.marker(stadiumCoords, { icon: stadiumIcon })
    .addTo(map)
    .bindPopup('<b>Estadio San José de Poaló</b><br>Ubicación del estadio principal');
};

// Obtener ubicación del usuario y mostrar ruta
const getUserLocationAndShowRoute = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoords = [position.coords.latitude, position.coords.longitude];
        userLocation.value = userCoords;

        // Icono personalizado para usuario
        const userIcon = L.divIcon({
          className: 'custom-user-marker',
          html: '<svg viewBox="0 0 24 24" width="36" height="36"><path fill="#2196F3" d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/></svg>',
          iconSize: [36, 36],
          iconAnchor: [18, 36]
        });

        userMarker = L.marker(userCoords, { icon: userIcon })
          .addTo(map)
          .bindPopup('<b>Tu ubicación</b>');

        // Dibujar línea de ruta (negra, fina y punteada)
        routeLine = L.polyline([userCoords, stadiumCoords], {
          color: '#000000',
          weight: 2,
          opacity: 0.6,
          dashArray: '5, 8'
        }).addTo(map);

        // Ajustar vista para mostrar ambos marcadores
        const bounds = L.latLngBounds([userCoords, stadiumCoords]);
        map.fitBounds(bounds, { padding: [50, 50] });

        // Calcular distancia
        distance.value = calculateDistance(
          userCoords[0], userCoords[1],
          stadiumCoords[0], stadiumCoords[1]
        );

        showDistance.value = true;
      },
      (error) => {
        console.log('No se pudo obtener la ubicación:', error);
        alert('No pudimos obtener tu ubicación. Verifica que hayas dado permisos de ubicación.');
      }
    );
  } else {
    alert('Tu navegador no soporta geolocalización.');
  }
};

// Abrir direcciones en Google Maps
const openDirections = () => {
  if (userLocation.value) {
    const url = `https://www.google.com/maps/dir/${userLocation.value[0]},${userLocation.value[1]}/${stadiumCoords[0]},${stadiumCoords[1]}`;
    window.open(url, '_blank');
  }
};

// Intersection Observer
let observer;

onMounted(() => {
  setTimeout(() => {
    initMap();
  }, 100);

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
  if (map) {
    map.remove();
  }
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped>
.contact-page {
  background: linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
  min-height: 100vh;
}

/* HERO SECTION */
.hero-contact {
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

.text-shadow-heavy {
  text-shadow: 2px 2px 4px rgba(0,0,0,0.9);
}

/* SECCIONES */
.section-contact-info {
  background: linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%);
  position: relative;
}

.section-map {
  background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%);
  position: relative;
}

.section-map::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
}

/* CONTACT CARDS - SIN MOVIMIENTO EN HOVER */
.contact-card {
  background: rgba(255, 255, 255, 0.04) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px !important;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
}

.contact-card:hover {
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

.icon-wrapper-large {
  background: rgba(255, 255, 255, 0.05);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.info-section {
  background: rgba(0, 0, 0, 0.2);
  padding: 20px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.info-item {
  display: flex;
  align-items: flex-start;
}

.faq-list :deep(.v-expansion-panel) {
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 8px;
  border-radius: 12px !important;
}

.faq-list :deep(.v-expansion-panel-title) {
  padding: 16px;
}

.faq-list :deep(.v-expansion-panel-text__wrapper) {
  padding: 16px;
}

/* BUTTONS */
.btn-glass-contact {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%) !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  color: white !important;
}

.btn-glass-contact:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.4);
}

.btn-glass-contact-alt {
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
  color: white !important;
}

.btn-glass-contact-alt:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

/* MAP CARD */
.map-card {
  background: rgba(255, 255, 255, 0.04) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px !important;
  overflow: hidden;
  position: relative;
}

.distance-banner {
  background: rgba(76, 175, 80, 0.1);
  border-bottom: 1px solid rgba(76, 175, 80, 0.3);
}

.map-container {
  width: 100%;
  height: 500px;
  position: relative;
  z-index: 1;
}

.location-button-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  pointer-events: none;
}

.location-button-overlay .v-btn {
  pointer-events: all;
}

.map-info {
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

/* ANIMATIONS */
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
  .hero-contact {
    height: 40vh;
    min-height: 320px;
  }
  
  .hero-contact h1 {
    font-size: 2rem !important;
  }
  
  .map-container {
    height: 400px;
  }
}

@media (max-width: 600px) {
  .hero-contact {
    height: 35vh;
    min-height: 280px;
    padding-top: 80px;
  }
  
  .map-container {
    height: 350px;
  }
}
</style>