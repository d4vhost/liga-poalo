<script setup>
// Importamos la imagen usando la ruta relativa correcta
import fieldImage from '../../../images/estadio_alineacion.jpg';

const props = defineProps({
  editable: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['drop-on-field']);

const handleDrop = (event) => {
    emit('drop-on-field', event);
};
</script>

<template>
  <div class="field-wrapper">
    <div 
      class="field-container"
      @dragover.prevent
      @drop="handleDrop"
      :style="{ backgroundImage: `url(${fieldImage})` }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.field-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e0e0e0; /* Fondo gris para diferenciar del fondo blanco */
  padding: 20px;
  border-radius: 8px;
  overflow: hidden; 
}

.field-container {
  /* Hacemos la cancha responsiva pero respetando proporciones */
  width: 100%;
  max-width: 450px; /* Ancho máximo para que no se vea gigante */
  aspect-ratio: 3/4.5; /* Proporción vertical de cancha */
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5); /* Sombra fuerte para resaltar */
  border: 4px solid white;
  border-radius: 4px;
}
</style>