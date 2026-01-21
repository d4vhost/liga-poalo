<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../../../services/supabase'; 
import MatchFieldTactical from './MatchFieldTactical.vue';

// --- ESTADO ---
const availablePlayers = ref([]);
const loading = ref(true);
const showPositionModal = ref(false);
const selectedPlayerForAssignment = ref(null); // Jugador esperando posición

// --- FORMACIÓN FIJA 4-3-3 (COORDENADAS ALINEADAS) ---
// type: Define el grupo para la asignación automática
const formationSlots = ref([
  // PORTERO (Centrado abajo)
  { id: 'gk', type: 'gk', label: 'POR', x: 50, y: 88, player: null },
  
  // DEFENSAS (Línea recta Y=72, distribuidos equitativamente X=20,40,60,80)
  { id: 'df1', type: 'df', label: 'DEF', x: 20, y: 72, player: null },
  { id: 'df2', type: 'df', label: 'DEF', x: 40, y: 72, player: null },
  { id: 'df3', type: 'df', label: 'DEF', x: 60, y: 72, player: null },
  { id: 'df4', type: 'df', label: 'DEF', x: 80, y: 72, player: null },

  // MEDIOS (Línea recta Y=48, centrados X=30,50,70)
  { id: 'mf1', type: 'mf', label: 'MED', x: 30, y: 48, player: null },
  { id: 'mf2', type: 'mf', label: 'MED', x: 50, y: 48, player: null },
  { id: 'mf3', type: 'mf', label: 'MED', x: 70, y: 48, player: null },

  // DELANTEROS (Línea recta Y=20, centrados X=30,50,70)
  { id: 'fw1', type: 'fw', label: 'DEL', x: 30, y: 20, player: null },
  { id: 'fw2', type: 'fw', label: 'DEL', x: 50, y: 20, player: null },
  { id: 'fw3', type: 'fw', label: 'DEL', x: 70, y: 20, player: null },
]);

// --- CARGA DE DATOS ---
onMounted(async () => {
  try {
    loading.value = true;
    const { data, error } = await supabase
      .from('profiles') 
      .select('*')
      .order('nombres', { ascending: true });

    if (error) throw error;
    if (data) availablePlayers.value = data;
  } catch (error) {
    console.error('Error cargando jugadores:', error);
  } finally {
    loading.value = false;
  }
});

// --- HELPERS ---
const getDisplayName = (player) => player.nombres || player.email?.split('@')[0] || 'Jugador';
const getDisplayNumber = (player) => player.numero || '0'; // Cambiar si tienes columna numero

// --- LÓGICA DE ASIGNACIÓN (MODAL) ---

// 1. Abrir modal al hacer clic en "+"
const promptPositionSelection = (player) => {
  selectedPlayerForAssignment.value = player;
  showPositionModal.value = true;
};

// 2. Asignar a la primera ranura vacía del tipo seleccionado
const assignToPosition = (type) => {
  if (!selectedPlayerForAssignment.value) return;

  // Buscar slots del tipo seleccionado (ej: 'df') que estén vacíos
  const targetSlot = formationSlots.value.find(slot => slot.type === type && slot.player === null);

  if (targetSlot) {
    // Asignar jugador
    targetSlot.player = { ...selectedPlayerForAssignment.value };
    
    // Quitar de la lista de disponibles
    availablePlayers.value = availablePlayers.value.filter(p => p.id !== selectedPlayerForAssignment.value.id);
    
    // Cerrar modal
    closeModal();
  } else {
    alert(`No hay espacios disponibles para ${type.toUpperCase()}. Libera una posición primero.`);
  }
};

const closeModal = () => {
  showPositionModal.value = false;
  selectedPlayerForAssignment.value = null;
};

// --- QUITAR JUGADOR DE CANCHA ---
const removePlayerFromSlot = (index) => {
  const slot = formationSlots.value[index];
  if (!slot.player) return;

  // Devolver a lista
  availablePlayers.value.push(slot.player);
  // Limpiar slot
  slot.player = null;
};

// --- GUARDAR ---
const saveLineup = () => {
  const lineup = formationSlots.value
    .filter(slot => slot.player !== null)
    .map(slot => ({
      position_label: slot.label,
      player_id: slot.player.id,
      player_name: getDisplayName(slot.player),
      x: slot.x,
      y: slot.y
    }));
  
  console.log("Alineación:", lineup);
  alert("Alineación guardada en consola.");
};
</script>

<template>
  <div class="roster-layout">
    
    <div v-if="showPositionModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3>¿Posición para {{ getDisplayName(selectedPlayerForAssignment) }}?</h3>
        <div class="position-options">
          <button class="btn-pos gk" @click="assignToPosition('gk')">Portero</button>
          <button class="btn-pos df" @click="assignToPosition('df')">Defensa</button>
          <button class="btn-pos mf" @click="assignToPosition('mf')">Medio</button>
          <button class="btn-pos fw" @click="assignToPosition('fw')">Delantero</button>
        </div>
        <button class="btn-cancel" @click="closeModal">Cancelar</button>
      </div>
    </div>

    <div class="sidebar">
      <div class="sidebar-header">
        <h3>Plantilla</h3>
        <span class="badge">{{ availablePlayers.length }}</span>
      </div>
      
      <div class="players-scroll">
        <div 
          v-for="player in availablePlayers" 
          :key="player.id" 
          class="player-item"
        >
          <div class="player-info">
            <span class="p-num">{{ getDisplayNumber(player) }}</span>
            <span class="p-name">{{ getDisplayName(player) }}</span>
          </div>
          <button class="btn-add" @click="promptPositionSelection(player)">+</button>
        </div>
      </div>
    </div>

    <div class="field-area">
      <div class="field-header">
        <h3>Alineación 4-3-3</h3>
        <button class="btn-save" @click="saveLineup">Guardar</button>
      </div>

      <MatchFieldTactical>
        <div
          v-for="(slot, index) in formationSlots"
          :key="slot.id"
          class="tactical-slot"
          :class="{ 'occupied': slot.player }"
          :style="{ left: slot.x + '%', top: slot.y + '%' }"
        >
          <div v-if="!slot.player" class="empty-slot-content">
            <span class="slot-label">{{ slot.label }}</span>
          </div>

          <div v-else class="player-token">
            <div class="token-circle">
              <span class="t-num">{{ getDisplayNumber(slot.player) }}</span>
            </div>
            <span class="t-name">{{ getDisplayName(slot.player).split(' ')[0] }}</span>
            
            <button class="btn-remove" @click="removePlayerFromSlot(index)">×</button>
          </div>
        </div>
      </MatchFieldTactical>
    </div>

  </div>
</template>

<style scoped>
.roster-layout {
  display: flex;
  gap: 20px;
  height: 85vh;
  padding: 10px;
  background-color: #f4f6f8;
  position: relative;
}

/* --- MODAL --- */
.modal-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  width: 300px;
}
.position-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 20px 0;
}
.btn-pos {
  padding: 15px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  color: white;
  transition: transform 0.1s;
}
.btn-pos:hover { transform: scale(1.05); }
.btn-pos.gk { background-color: #f1c40f; color: #333; }
.btn-pos.df { background-color: #3498db; }
.btn-pos.mf { background-color: #2ecc71; }
.btn-pos.fw { background-color: #e74c3c; }

.btn-cancel {
  background: transparent;
  border: 1px solid #ccc;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

/* --- SIDEBAR --- */
.sidebar {
  width: 280px;
  background: white;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  border: 1px solid #ddd;
}
.sidebar-header {
  padding: 15px;
  background: #2c3e50;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.players-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}
.player-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  margin-bottom: 5px;
  background: #fff;
  border-bottom: 1px solid #eee;
}
.player-info { display: flex; gap: 8px; align-items: center; }
.p-num { font-weight: bold; color: #7f8c8d; width: 25px; }
.p-name { font-weight: 600; font-size: 0.9rem; color: #2c3e50; }

.btn-add {
  background: #27ae60;
  color: white;
  border: none;
  width: 28px; height: 28px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex; align-items: center; justify-content: center;
}
.btn-add:hover { background: #219653; }

/* --- CANCHA --- */
.field-area {
  flex: 1;
  background: white;
  padding: 10px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.field-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.btn-save {
  background: #2980b9;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
}

/* --- SLOTS --- */
.tactical-slot {
  position: absolute;
  width: 50px;
  height: 50px;
  transform: translate(-50%, -50%); /* Centrado perfecto en la coordenada */
  z-index: 10;
}
.empty-slot-content {
  width: 100%; height: 100%;
  border: 2px dashed rgba(255,255,255,0.7);
  background: rgba(0,0,0,0.3);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}
.slot-label { color: white; font-weight: bold; font-size: 0.7rem; }

/* --- PLAYER TOKEN (Estilo Visual) --- */
.player-token {
  width: 100%; height: 100%;
  position: relative;
  display: flex; flex-direction: column; align-items: center;
}
.token-circle {
  width: 45px; height: 45px;
  background: radial-gradient(circle at 30% 30%, #fff, #ecf0f1);
  border: 3px solid #2c3e50;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 3px 6px rgba(0,0,0,0.4);
}
.t-num { font-weight: 900; color: #333; }
.t-name {
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 2px 5px;
  border-radius: 3px;
  font-size: 0.7rem;
  white-space: nowrap;
  position: absolute;
  bottom: -18px;
}
.btn-remove {
  position: absolute;
  top: -5px; right: -5px;
  background: #c0392b;
  color: white;
  border: none;
  width: 18px; height: 18px;
  border-radius: 50%;
  cursor: pointer;
  display: none;
}
.player-token:hover .btn-remove { display: flex; align-items: center; justify-content: center; }
</style>