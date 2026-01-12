<template>
  <div class="d-flex flex-column h-100 w-100">
    <div class="mb-6 fade-in-up">
      <h1 class="text-h5 text-md-h4 font-weight-black text-white text-uppercase mb-1">Usuarios & Socios</h1>
      <p class="text-body-2 text-grey-lighten-1">Gestiona permisos y activa nuevos jugadores.</p>
    </div>

    <v-row class="mb-4 flex-grow-0 fade-in-up delay-1">
      <v-col cols="12" md="4">
        <v-card class="stats-card gradient-orange pa-4" elevation="0">
          <div class="d-flex justify-space-between align-start">
            <div>
              <div class="text-caption font-weight-bold text-white mb-1 opacity-80">VIEWERS</div>
              <div class="text-h4 font-weight-black text-white">{{ viewerCount }}</div>
            </div>
            <v-icon size="32" color="white" class="opacity-50">mdi-eye</v-icon>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="stats-card gradient-green pa-4" elevation="0">
          <div class="d-flex justify-space-between align-start">
            <div>
              <div class="text-caption font-weight-bold text-white mb-1 opacity-80">ACTIVOS</div>
              <div class="text-h4 font-weight-black text-white">{{ activeCount }}</div>
            </div>
            <v-icon size="32" color="white" class="opacity-50">mdi-soccer</v-icon>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="stats-card gradient-blue pa-4" elevation="0">
          <div class="d-flex justify-space-between align-start">
            <div>
              <div class="text-caption font-weight-bold text-white mb-1 opacity-80">TOTAL</div>
              <div class="text-h4 font-weight-black text-white">{{ totalUsers }}</div>
            </div>
            <v-icon size="32" color="white" class="opacity-50">mdi-account-group</v-icon>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="glass-card pa-1 flex-grow-1 d-flex flex-column overflow-hidden fade-in-up delay-2" elevation="0">
      <v-toolbar color="transparent" class="px-4 pt-2 flex-grow-0">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar..."
          single-line
          hide-details
          variant="outlined"
          density="compact"
          class="search-input"
          theme="dark"
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-refresh" variant="text" color="white" @click="fetchUsers">
          Actualizar
        </v-btn>
      </v-toolbar>

      <v-data-table
        :headers="headers"
        :items="displayUsers"
        :search="search"
        :loading="isLoading"
        theme="dark"
        class="bg-transparent mt-2 user-table flex-grow-1"
        :items-per-page="6"
        fixed-header
      >
        <template v-slot:item.nombres="{ item }">
            <div class="d-flex align-center py-2" v-if="item.id">
                <v-avatar color="grey-darken-3" size="36" class="mr-3">
                <span class="text-white font-weight-bold">{{ getInitials(item.nombres) }}</span>
                </v-avatar>
                <div class="d-flex flex-column">
                <span class="font-weight-bold text-white text-body-2">{{ item.nombres }}</span>
                <span class="text-caption text-grey-lighten-1">{{ item.email }}</span>
                </div>
            </div>
        </template>

        <template v-slot:item.role="{ item }">
             <span v-if="item.id" class="text-body-2 font-weight-medium text-grey-lighten-1">
                  {{ item.role ? item.role.charAt(0).toUpperCase() + item.role.slice(1) : 'No Asignado' }}
            </span>
        </template>
        
        <template v-slot:item.status="{ item }">
            <v-chip v-if="item.id" :color="getStatusColor(item.status)" size="x-small" class="font-weight-bold text-uppercase" variant="flat">
                {{ item.status === 'pendiente' ? 'Viewer' : item.status }}
            </v-chip>
        </template>

        <template v-slot:item.contacto="{ item }">
            <div class="d-flex flex-column" v-if="item.id">
                  <span class="text-caption text-grey-lighten-2">
                    <v-icon size="x-small" class="mr-1">mdi-card-account-details</v-icon>
                    {{ item.cedula || 'N/A' }}
                  </span>
                  <span class="text-caption text-grey-lighten-2">
                    <v-icon size="x-small" class="mr-1">mdi-phone</v-icon>
                    {{ item.celular || 'N/A' }}
                  </span>
             </div>
        </template>

        <template v-slot:item.actions="{ item }">
            <div v-if="item.status === 'pendiente' && item.id" class="d-flex gap-2 justify-end">
                  <v-tooltip text="Promover a Jugador" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn v-bind="props" icon size="x-small" color="green-lighten-1" variant="tonal" @click="openActionDialog(item, 'aprobar')">
                        <v-icon>mdi-account-check</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                  <v-tooltip text="Bloquear Acceso" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn v-bind="props" icon size="x-small" color="red-lighten-1" variant="tonal" @click="openActionDialog(item, 'rechazar')">
                        <v-icon>mdi-account-cancel</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
            </div>
        </template>
      </v-data-table>
    </v-card>

    <UserActionModal 
      v-model="dialog.show"
      :user="dialog.user"
      :action="dialog.action"
      :loading="isProcessing"
      @confirm="executeAction"
    />

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" location="top right">
      {{ snackbar.text }}
      <template v-slot:actions><v-btn icon="mdi-close" variant="text" @click="snackbar.show = false"></v-btn></template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { supabase } from '../../services/supabase';
import UserActionModal from '../../components/admin/modals/UserActionModal.vue';

const search = ref('');
const isLoading = ref(false);
const isProcessing = ref(false);
const users = ref([]);
const dialog = ref({ show: false, action: null, user: null });
const snackbar = ref({ show: false, text: '', color: 'success' });

const headers = [
  { title: 'Jugador / Socio', align: 'start', key: 'nombres' },
  { title: 'Información', align: 'start', key: 'contacto' },
  { title: 'Rol', align: 'start', key: 'role' },
  { title: 'Estado', align: 'center', key: 'status' },
  { title: 'Acciones', align: 'end', key: 'actions', sortable: false },
];

const viewerCount = computed(() => users.value.filter(u => u.status === 'pendiente').length);
const activeCount = computed(() => users.value.filter(u => u.status === 'activo').length);
const totalUsers = computed(() => users.value.filter(u => u.id).length); 

const displayUsers = computed(() => users.value.length > 0 ? users.value : [{}, {}]);

// ... (Métodos de supabase, getInitials, getStatusColor, etc. IDÉNTICOS A TU CÓDIGO ACTUAL) ...
// He resumido para no repetir, pero aquí pegas tus funciones: fetchUsers, executeAction, etc.

const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
const getStatusColor = (s) => s === 'activo' ? 'green' : s === 'pendiente' ? 'orange' : 'red';
const showSnackbar = (text, color) => { snackbar.value = { show: true, text, color }; };

const fetchUsers = async () => {
  isLoading.value = true;
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  if (!error) users.value = data || [];
  isLoading.value = false;
};

const openActionDialog = (user, action) => {
  dialog.value = { show: true, action, user };
};

const executeAction = async () => {
  isProcessing.value = true;
  const newStatus = dialog.value.action === 'aprobar' ? 'activo' : 'rechazado';
  const updates = { status: newStatus };
  if (newStatus === 'activo' && !dialog.value.user.role) updates.role = 'jugador';
  
  try {
    const { error } = await supabase.from('profiles').update(updates).eq('id', dialog.value.user.id);
    if (error) throw error;
    
    const index = users.value.findIndex(u => u.id === dialog.value.user.id);
    if (index !== -1) {
      users.value[index].status = newStatus;
      if (updates.role) users.value[index].role = updates.role;
    }
    showSnackbar(`Usuario actualizado`, 'success');
  } catch (e) {
    showSnackbar('Error al actualizar', 'error');
  } finally {
    isProcessing.value = false;
    dialog.value.show = false;
  }
};

onMounted(fetchUsers);
</script>

<style scoped>
/* ESTILOS ESPECÍFICOS DE LA TABLA Y STATS COPIADOS DE TU ADMIN PANEL */
.stats-card { border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
.gradient-orange { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
.gradient-green { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
.gradient-blue { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
.glass-card { background: rgba(30, 30, 35, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; }

/* ... resto de estilos de tabla ... */
.search-input :deep(.v-field) { border-radius: 8px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: white; }
.user-table :deep(th) { color: #9ca3af !important; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,0.05) !important; }
.user-table :deep(td) { border-bottom: 1px solid rgba(255,255,255,0.05) !important; color: #e5e7eb; }
.user-table :deep(.v-data-table-footer) { color: white !important; }
.user-table :deep(.v-data-table-footer__items-per-page) { display: none !important; }

/* ANIMACIONES */
.fade-in-up { opacity: 0; animation: fadeInUp 0.6s ease forwards; }
.delay-1 { animation-delay: 0.2s; }
.delay-2 { animation-delay: 0.3s; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>