<script setup>
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
      <div class="field-overlay"></div>
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
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  padding: 10px; /* Reduje padding para ganar espacio */
  border-radius: 12px;
  overflow: hidden; 
  border: 1px solid #334155;
}

.field-container {
  width: 100%;
  max-width: 480px; 
  /* CAMBIO: Hacemos la cancha un poco menos alta para que se vea mejor */
  aspect-ratio: 3/4; 
  max-height: 75vh; /* Limitamos la altura máxima */
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  box-shadow: 0 20px 50px rgba(0,0,0,0.7); 
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden; /* Mantiene todo dentro, pero con margen interno para nombres */
}

.field-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.1); 
  pointer-events: none;
}
</style>