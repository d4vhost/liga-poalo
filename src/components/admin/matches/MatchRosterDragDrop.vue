<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../../../services/supabase'; 
import MatchFieldTactical from './MatchFieldTactical.vue';

// --- ESTADO ---
const availablePlayers = ref([]);
const loading = ref(true);
const showPositionModal = ref(false);
const selectedPlayerForAssignment = ref(null);

// --- FORMACIÓN FIJA 4-3-3 ---
const formationSlots = ref([
  // PORTERO
  { id: 'gk', type: 'gk', label: 'POR', x: 50, y: 88, player: null },
  // DEFENSAS
  { id: 'df1', type: 'df', label: 'LI', x: 15, y: 72, player: null },
  { id: 'df2', type: 'df', label: 'DFC', x: 38, y: 75, player: null },
  { id: 'df3', type: 'df', label: 'DFC', x: 62, y: 75, player: null },
  { id: 'df4', type: 'df', label: 'LD', x: 85, y: 72, player: null },
  // MEDIOS
  { id: 'mf1', type: 'mf', label: 'MC', x: 30, y: 50, player: null },
  { id: 'mf2', type: 'mf', label: 'MCO', x: 50, y: 40, player: null },
  { id: 'mf3', type: 'mf', label: 'MC', x: 70, y: 50, player: null },
  // DELANTEROS
  { id: 'fw1', type: 'fw', label: 'EI', x: 20, y: 20, player: null },
  { id: 'fw2', type: 'fw', label: 'DC', x: 50, y: 15, player: null },
  { id: 'fw3', type: 'fw', label: 'ED', x: 80, y: 20, player: null },
]);

// --- CARGA ---
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
    console.error('Error:', error);
  } finally {
    loading.value = false;
  }
});

// --- HELPERS ---
const getDisplayName = (player) => player.nombres || player.email?.split('@')[0] || 'Jugador';
const getDisplayNumber = (player) => player.numero || '0'; 

// --- MODAL & ASIGNACIÓN ---
const promptPositionSelection = (player) => {
  selectedPlayerForAssignment.value = player;
  showPositionModal.value = true;
};

const assignToPosition = (type) => {
  if (!selectedPlayerForAssignment.value) return;
  const targetSlot = formationSlots.value.find(slot => slot.type === type && slot.player === null);

  if (targetSlot) {
    targetSlot.player = { ...selectedPlayerForAssignment.value };
    availablePlayers.value = availablePlayers.value.filter(p => p.id !== selectedPlayerForAssignment.value.id);
    closeModal();
  } else {
    alert(`No hay hueco libre para esa posición. Libera uno primero.`);
  }
};

const closeModal = () => {
  showPositionModal.value = false;
  selectedPlayerForAssignment.value = null;
};

const removePlayerFromSlot = (index) => {
  const slot = formationSlots.value[index];
  if (!slot.player) return;
  availablePlayers.value.push(slot.player);
  slot.player = null;
};

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
  console.log("Guardando:", lineup);
  alert("Alineación lista (ver consola)");
};
</script>

<template>
  <div class="roster-layout dark-theme">
    
    <Transition name="fade">
      <div v-if="showPositionModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-card">
          <div class="modal-header">
            <h3>Asignar Posición</h3>
            <p>Jugador: <strong>{{ getDisplayName(selectedPlayerForAssignment) }}</strong></p>
          </div>
          
          <div class="position-grid">
            <button class="pos-btn fw" @click="assignToPosition('fw')">
              <span class="icon">⚽</span>
              <span class="label">Delantero</span>
            </button>

            <button class="pos-btn mf" @click="assignToPosition('mf')">
              <span class="icon">👟</span>
              <span class="label">Medio</span>
            </button>

            <button class="pos-btn df" @click="assignToPosition('df')">
              <span class="icon">🛡️</span>
              <span class="label">Defensa</span>
            </button>

            <button class="pos-btn gk" @click="assignToPosition('gk')">
              <span class="icon">🧤</span>
              <span class="label">Portero</span>
            </button>
          </div>

          <button class="btn-cancel" @click="closeModal">Cancelar</button>
        </div>
      </div>
    </Transition>

    <div class="sidebar">
      <div class="sidebar-header">
        <h3>Plantilla</h3>
        <span class="badge">{{ availablePlayers.length }}</span>
      </div>
      
      <div class="players-scroll">
        <div v-if="availablePlayers.length === 0" class="empty-msg">Sin jugadores disponibles</div>
        
        <div 
          v-for="player in availablePlayers" 
          :key="player.id" 
          class="player-item"
        >
          <div class="player-info">
            <div class="p-avatar">{{ getDisplayNumber(player) }}</div>
            <span class="p-name">{{ getDisplayName(player) }}</span>
          </div>
          <button class="btn-icon-add" @click="promptPositionSelection(player)">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        </div>
      </div>
    </div>

    <div class="field-area">
      <div class="field-header">
        <h3>Alineación 4-3-3</h3>
        <button class="btn-save" @click="saveLineup">
          Guardar Alineación
        </button>
      </div>

      <MatchFieldTactical>
        <div
          v-for="(slot, index) in formationSlots"
          :key="slot.id"
          class="tactical-slot"
          :class="{ 'occupied': slot.player }"
          :style="{ left: slot.x + '%', top: slot.y + '%' }"
        >
          <div v-if="!slot.player" class="slot-empty">
            <span class="slot-label">{{ slot.label }}</span>
          </div>

          <div v-else class="player-token">
            <div class="token-avatar">
              <span class="t-num">{{ getDisplayNumber(slot.player) }}</span>
            </div>
            <span class="t-name">{{ getDisplayName(slot.player).split(' ')[0] }}</span>
            <button class="btn-remove" @click="removePlayerFromSlot(index)">✕</button>
          </div>
        </div>
      </MatchFieldTactical>
    </div>

  </div>
</template>

<style scoped>
/* --- TEMA OSCURO GENERAL --- */
.roster-layout {
  display: flex;
  gap: 20px;
  height: 85vh;
  padding: 20px;
  background-color: #000000; /* NEGRO PURO */
  color: #e2e8f0;
  font-family: 'Inter', sans-serif;
}

/* --- MODAL DE LUJO --- */
.modal-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.85); /* Más oscuro */
  backdrop-filter: blur(5px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-card {
  background: #1a1a1a; /* Gris muy oscuro */
  border: 1px solid #333;
  padding: 25px;
  border-radius: 16px;
  width: 320px;
  text-align: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.7);
  animation: modalPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.modal-header h3 { margin: 0 0 5px 0; color: white; }
.modal-header p { color: #94a3b8; font-size: 0.9rem; margin-bottom: 20px; }

.position-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.pos-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  background: #2a2a2a;
  color: white;
}

.pos-btn:hover { transform: translateY(-3px); filter: brightness(1.2); }
.pos-btn .icon { font-size: 1.5rem; margin-bottom: 5px; }
.pos-btn .label { font-size: 0.8rem; font-weight: bold; text-transform: uppercase;}

/* Colores específicos para botones del modal */
.pos-btn.fw { background: linear-gradient(135deg, #ef4444, #b91c1c); }
.pos-btn.mf { background: linear-gradient(135deg, #22c55e, #15803d); }
.pos-btn.df { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
.pos-btn.gk { background: linear-gradient(135deg, #eab308, #a16207); color: #000; }

.btn-cancel {
  background: transparent;
  color: #94a3b8;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.9rem;
}
.btn-cancel:hover { color: white; }

/* --- SIDEBAR LISTA --- */
.sidebar {
  width: 300px;
  background: #0a0a0a; /* Casi negro */
  border-radius: 12px;
  border: 1px solid #222;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #222;
  display: flex; justify-content: space-between; align-items: center;
}
.sidebar-header h3 { margin: 0; color: #f8fafc; font-size: 1.1rem; }
.badge { background: #3b82f6; color: white; padding: 2px 8px; border-radius: 99px; font-size: 0.75rem; font-weight: bold; }

.players-scroll {
  flex: 1; overflow-y: auto; padding: 15px;
}
.players-scroll::-webkit-scrollbar { width: 6px; }
.players-scroll::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }

.player-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px; margin-bottom: 8px;
  background: #141414;
  border: 1px solid #222;
  border-radius: 8px;
  transition: all 0.2s;
}
.player-item:hover { border-color: #3b82f6; transform: translateX(5px); }

.player-info { display: flex; align-items: center; gap: 12px; }
.p-avatar {
  width: 32px; height: 32px;
  background: #2a2a2a; color: #94a3b8;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: bold; font-size: 0.8rem;
}
.p-name { font-weight: 500; font-size: 0.9rem; color: #f1f5f9; }

.btn-icon-add {
  background: #22c55e; color: #000;
  border: none; width: 30px; height: 30px;
  border-radius: 8px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: bg 0.2s;
}
.btn-icon-add:hover { background: #4ade80; }

/* --- ÁREA DE CANCHA --- */
.field-area {
  flex: 1;
  background: #0a0a0a;
  border-radius: 12px;
  border: 1px solid #222;
  padding: 20px;
  display: flex; flex-direction: column; align-items: center;
}
.field-header {
  width: 100%; display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 20px;
}
.field-header h3 { color: white; margin: 0; }

.btn-save {
  background: #3b82f6; color: white;
  border: none; padding: 10px 24px;
  border-radius: 8px; font-weight: bold; cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.5);
}
.btn-save:hover { background: #2563eb; }

/* --- SLOTS EN CANCHA --- */
.tactical-slot {
  position: absolute; width: 50px; height: 50px;
  transform: translate(-50%, -50%);
  z-index: 10;
}

/* Slot Vacío (Estilo Glass) */
.slot-empty {
  width: 100%; height: 100%;
  border-radius: 50%;
  border: 2px dashed rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(2px);
  display: flex; align-items: center; justify-content: center;
}
.slot-label { color: rgba(255,255,255,0.8); font-weight: bold; font-size: 0.7rem; }

/* Token de Jugador (Lleno) */
.player-token {
  position: relative; width: 100%; height: 100%;
  display: flex; flex-direction: column; align-items: center;
  animation: dropIn 0.3s ease-out;
}

.token-avatar {
  width: 44px; height: 44px;
  background: white;
  border: 3px solid #0a0a0a;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.5);
}
.t-num { font-weight: 900; color: #0a0a0a; }

.t-name {
  position: absolute; bottom: -20px;
  background: rgba(0,0,0,0.9); color: white;
  padding: 2px 8px; border-radius: 4px;
  font-size: 0.75rem; white-space: nowrap;
}

.btn-remove {
  position: absolute; top: -5px; right: -5px;
  background: #ef4444; color: white;
  width: 18px; height: 18px; border-radius: 50%;
  border: 2px solid #0a0a0a;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  font-size: 10px;
}

/* ANIMACIONES */
@keyframes modalPop {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes dropIn {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>