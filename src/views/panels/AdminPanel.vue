<template>
  <v-layout class="admin-layout bg-dark-theme h-screen overflow-hidden">
    
    <v-navigation-drawer
      v-model="drawer"
      :permanent="!isMobile"
      :temporary="isMobile"
      color="#0f1012"
      class="border-r-gray"
      width="280"
      elevation="0"
    >
      <div class="pa-6 d-flex flex-column align-center">
        <v-avatar size="80" color="blue-grey-darken-4" class="mb-4 elevation-5">
          <v-icon size="40" color="blue-lighten-2">mdi-shield-crown</v-icon>
        </v-avatar>
        <h3 class="text-h6 font-weight-bold text-white tracking-wider text-center">FEDERACIÓN</h3>
        <span class="text-caption text-grey-lighten-1">Panel Administrativo</span>
      </div>

      <v-divider class="border-opacity-25 my-2"></v-divider>

      <v-list nav class="pa-4">
        <v-list-item
          v-for="(item, i) in menuItems"
          :key="i"
          :value="item"
          rounded="lg"
          class="mb-2 nav-item"
          :class="{ 'active-nav': currentSection === item.id }"
          @click="currentSection = item.id"
        >
          <template v-slot:prepend>
            <v-icon :color="currentSection === item.id ? 'white' : 'grey-lighten-1'">{{ item.icon }}</v-icon>
          </template>
          <v-list-item-title 
            class="font-weight-medium"
            :class="currentSection === item.id ? 'text-white' : 'text-grey-lighten-1'"
          >
            {{ item.title }}
          </v-list-item-title>
          
          <template v-slot:append v-if="item.id === 'users' && viewerCount > 0">
            <v-badge color="orange" :content="viewerCount" inline></v-badge>
          </template>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-4 mb-16">
          <v-btn
            block
            variant="outlined"
            color="red-lighten-2"
            class="border-opacity-50"
            prepend-icon="mdi-logout"
            @click="handleLogout"
          >
            Cerrar Sesión
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main class="bg-pattern h-100 d-flex flex-column position-relative">
      
      <div v-if="isMobile" class="pa-4 position-absolute top-0 left-0" style="z-index: 100;">
        <v-btn icon="mdi-menu" variant="tonal" color="white" @click="drawer = !drawer"></v-btn>
      </div>

      <v-container fluid class="pa-4 pa-md-8 flex-grow-1 d-flex flex-column h-100">
        
        <div class="d-flex justify-space-between align-center mb-6 fade-in-up" :class="{ 'pl-12': isMobile }">
          <div>
            <h1 class="text-h5 text-md-h4 font-weight-black text-white text-uppercase mb-1">
              {{ activeSectionTitle }}
            </h1>
            <p class="text-body-2 text-grey-lighten-1">{{ activeSectionSubtitle }}</p>
          </div>
          <div class="d-none d-md-flex gap-4">
              <v-btn icon variant="text" color="white" class="btn-glass-icon">
                  <v-icon>mdi-bell-outline</v-icon>
              </v-btn>
              <v-btn icon variant="text" color="white" class="btn-glass-icon">
                  <v-icon>mdi-cog-outline</v-icon>
              </v-btn>
          </div>
        </div>

        <div v-if="currentSection === 'users'" class="d-flex flex-column flex-grow-1 fade-in-up delay-1 h-100">
          
          <v-row class="mb-4 flex-grow-0">
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
                    <div class="text-caption font-weight-bold text-white mb-1 opacity-80">JUGADORES ACTIVOS</div>
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
                    <div class="text-caption font-weight-bold text-white mb-1 opacity-80">TOTAL REGISTROS</div>
                    <div class="text-h4 font-weight-black text-white">{{ totalUsers }}</div>
                  </div>
                  <v-icon size="32" color="white" class="opacity-50">mdi-account-group</v-icon>
                </div>
              </v-card>
            </v-col>
          </v-row>

          <v-card class="glass-card pa-1 flex-grow-1 d-flex flex-column overflow-hidden" elevation="0">
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
              <v-btn prepend-icon="mdi-refresh" variant="text" color="white" @click="fetchUsers" class="d-none d-sm-flex">
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
                <div v-else class="py-4"></div>
              </template>

              <template v-slot:item.role="{ item }">
                <span v-if="item.id" class="text-body-2 font-weight-medium text-grey-lighten-1">
                  {{ item.role ? item.role.charAt(0).toUpperCase() + item.role.slice(1) : 'No Asignado' }}
                </span>
              </template>

              <template v-slot:item.status="{ item }">
                <v-chip
                  v-if="item.id"
                  :color="getStatusColor(item.status)"
                  size="x-small"
                  class="font-weight-bold text-uppercase"
                  variant="flat"
                >
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
                      <v-btn
                        v-bind="props"
                        icon
                        size="x-small"
                        color="green-lighten-1"
                        variant="tonal"
                        @click="openActionDialog(item, 'aprobar')"
                      >
                        <v-icon>mdi-account-check</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                  
                  <v-tooltip text="Bloquear Acceso" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        icon
                        size="x-small"
                        color="red-lighten-1"
                        variant="tonal"
                        @click="openActionDialog(item, 'rechazar')"
                      >
                        <v-icon>mdi-account-cancel</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                </div>
                <div v-else-if="item.id" class="text-right">
                  <v-btn size="x-small" variant="text" color="grey" icon="mdi-pencil"></v-btn>
                </div>
              </template>
            </v-data-table>
          </v-card>
        </div>

        <div v-if="currentSection === 'matches'" class="fill-height d-flex flex-column justify-center align-center text-grey">
          <v-icon size="64" class="mb-4">mdi-soccer-field</v-icon>
          <h2>Gestión de Partidos</h2>
          <p>Próximamente...</p>
        </div>

      </v-container>
    </v-main>

    <v-dialog v-model="dialog.show" max-width="400">
      <v-card class="glass-card pa-4">
        <v-card-title class="text-white text-center text-h6 font-weight-bold">
          {{ dialog.action === 'aprobar' ? '¿Activar como Jugador?' : '¿Bloquear Acceso?' }}
        </v-card-title>
        <v-card-text class="text-center text-grey-lighten-1">
          <p v-if="dialog.action === 'aprobar'">
            El usuario <strong>{{ dialog.user?.nombres }}</strong> dejará de ser solo Viewer y podrá acceder al panel de Jugadores.
          </p>
          <p v-else>
             El usuario <strong>{{ dialog.user?.nombres }}</strong> será bloqueado del sistema.
          </p>
        </v-card-text>
        <v-card-actions class="justify-center mt-2">
          <v-btn variant="text" color="grey" @click="dialog.show = false">Cancelar</v-btn>
          <v-btn 
            :color="dialog.action === 'aprobar' ? 'green-lighten-1' : 'red-lighten-1'"
            variant="flat"
            class="px-6 font-weight-bold"
            :loading="isProcessing"
            @click="executeAction"
          >
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" location="top right">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn icon="mdi-close" variant="text" @click="snackbar.show = false"></v-btn>
      </template>
    </v-snackbar>

  </v-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';
import { supabase } from '../../services/supabase';

const router = useRouter();
const { mobile } = useDisplay();
const isMobile = computed(() => mobile.value);

const drawer = ref(!mobile.value);
const currentSection = ref('users');
const search = ref('');
const isLoading = ref(false);
const isProcessing = ref(false);
const users = ref([]);

const dialog = ref({ show: false, action: null, user: null });
const snackbar = ref({ show: false, text: '', color: 'success' });

const menuItems = [
  { title: 'Usuarios & Socios', icon: 'mdi-account-group', id: 'users' },
  { title: 'Partidos', icon: 'mdi-soccer', id: 'matches' },
  { title: 'Resultados', icon: 'mdi-scoreboard', id: 'results' },
  { title: 'Configuración', icon: 'mdi-cog', id: 'settings' },
];

const headers = [
  { title: 'Jugador / Socio', align: 'start', key: 'nombres' },
  { title: 'Información', align: 'start', key: 'contacto' },
  { title: 'Rol', align: 'start', key: 'role' },
  { title: 'Estado', align: 'center', key: 'status' },
  { title: 'Acciones', align: 'end', key: 'actions', sortable: false },
];

// --- Computed Props ---
const activeSectionTitle = computed(() => {
  const item = menuItems.find(i => i.id === currentSection.value);
  return item ? item.title : 'Panel';
});

const activeSectionSubtitle = computed(() => {
  if (currentSection.value === 'users') return 'Gestiona permisos y activa nuevos jugadores.';
  return 'Bienvenido al panel de control.';
});

const viewerCount = computed(() => users.value.filter(u => u.status === 'pendiente').length);
const activeCount = computed(() => users.value.filter(u => u.status === 'activo').length);
const totalUsers = computed(() => users.value.filter(u => u.id).length); 

// PROPIEDAD COMPUTADA PARA VISUALIZACIÓN
// Esto asegura que siempre haya filas visibles, incluso si no hay datos
const displayUsers = computed(() => {
  // Si tenemos usuarios reales, los mostramos
  if (users.value.length > 0) return users.value;
  // Si no hay nadie, mostramos 2 filas vacías para mantener el diseño
  return [{}, {}];
});

// --- Métodos ---

const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

const getStatusColor = (status) => {
  if (status === 'activo') return 'green-lighten-1';
  if (status === 'pendiente') return 'orange-lighten-1'; // Naranja para Viewer (Pendiente)
  if (status === 'rechazado') return 'red-lighten-1';
  return 'grey';
};

const fetchUsers = async () => {
  isLoading.value = true;
  // FETCH SIMPLE: Traemos TODO sin filtros raros
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
    users.value = [];
  } else {
    // Asignamos la data real a la variable reactiva
    users.value = data || [];
  }
  
  isLoading.value = false;
};

const openActionDialog = (user, action) => {
  dialog.value = { show: true, action, user };
};

const executeAction = async () => {
  if (!dialog.value.user) return;
  
  isProcessing.value = true;
  // Aprobar = Activo, Rechazar = Rechazar
  const newStatus = dialog.value.action === 'aprobar' ? 'activo' : 'rechazado';
  // Si se aprueba, también le asignamos rol de jugador por defecto si no tenía
  const updates = { status: newStatus };
  if (newStatus === 'activo' && !dialog.value.user.role) {
    updates.role = 'jugador';
  }
  
  try {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', dialog.value.user.id);

    if (error) throw error;

    // Actualizar localmente
    const index = users.value.findIndex(u => u.id === dialog.value.user.id);
    if (index !== -1) {
      users.value[index].status = newStatus;
      if (updates.role) users.value[index].role = updates.role;
    }

    showSnackbar(`Usuario actualizado correctamente`, 'success');
  } catch (error) {
    console.error(error);
    showSnackbar('Error al actualizar usuario', 'error');
  } finally {
    isProcessing.value = false;
    dialog.value.show = false;
  }
};

const showSnackbar = (text, color) => {
  snackbar.value = { show: true, text, color };
};

const handleLogout = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem('user_role');
  router.push('/login');
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
/* --- LAYOUT & FONDO --- */
.admin-layout { background: #0f1012; color: white; }
.h-screen { height: 100vh; }
.overflow-hidden { overflow: hidden; }
.w-100 { width: 100%; }
.bg-pattern {
  background-image: radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 20px 20px;
  background-color: #141518;
}
.border-r-gray { border-right: 1px solid rgba(255, 255, 255, 0.05); }

/* --- SIDEBAR --- */
.nav-item { transition: all 0.3s ease; }
.active-nav {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.15), transparent);
  border-left: 3px solid #60a5fa;
}

/* --- CARDS & STATS --- */
.stats-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}
.stats-card:hover { transform: translateY(-5px); }
.gradient-orange { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
.gradient-green { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
.gradient-blue { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }

.glass-card {
  background: rgba(30, 30, 35, 0.6) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
}

/* --- TABLA --- */
.search-input :deep(.v-field) {
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
}
.user-table :deep(th) {
  color: #9ca3af !important;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}
.user-table :deep(td) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
  color: #e5e7eb;
}

/* PAGINACIÓN BLANCA Y OCULTAR SELECTOR ITEMS PER PAGE */
.user-table :deep(.v-data-table-footer) { color: white !important; }
.user-table :deep(.v-btn--icon) { color: white !important; }
/* ESTA CLASE OCULTA EL SELECTOR "Items per page" */
.user-table :deep(.v-data-table-footer__items-per-page) { display: none !important; }

/* --- UTILS --- */
.btn-glass-icon {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.gap-2 { gap: 8px; }
.gap-4 { gap: 16px; }
.mb-16 { margin-bottom: 64px !important; } 

/* ANIMACIONES */
.fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.6s ease forwards;
}
.delay-1 { animation-delay: 0.2s; }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>