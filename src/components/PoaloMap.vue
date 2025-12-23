<template>
  <div id="map" class="map-container"></div>
</template>

<script setup>
import { onMounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Importante para que se vea bien

onMounted(() => {
  // Coordenadas aproximadas de San José de Poaló / Píllaro
  const lat = -1.145; 
  const lng = -78.550; 

  // Inicialización del mapa con interacciones DESACTIVADAS para que sea estático
  const map = L.map('map', {
    center: [lat, lng],
    zoom: 15,
    dragging: false,        // Desactiva arrastrar el mapa
    zoomControl: false,     // Desactiva botones de zoom (+/-)
    scrollWheelZoom: false, // Desactiva zoom con rueda del ratón
    doubleClickZoom: false, // Desactiva zoom con doble clic
    boxZoom: false,         // Desactiva zoom de caja
    touchZoom: false,       // Desactiva zoom táctil
    keyboard: false         // Desactiva control por teclado
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  L.marker([lat, lng]).addTo(map)
    .bindPopup('Estadio San José de Poaló<br>Liga Barrial.')
    .openPopup();
});
</script>

<style scoped>
.map-container {
  height: 100%; 
  width: 100%;
  min-height: 400px; 
  z-index: 1;
}
</style>