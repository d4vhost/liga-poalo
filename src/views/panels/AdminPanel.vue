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
          
          <template v-slot:append v-if="item.id === 'users' && pendingCount > 0">
            <v-badge color="orange" :content="pendingCount" inline></v-badge>
          </template>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-4">
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
                    <div class="text-caption font-weight-bold text-white mb-1 opacity-80">PENDIENTES</div>
                    <div class="text-h4 font-weight-black text-white">{{ pendingCount }}</div>
                  </div>
                  <v-icon size="32" color="white" class="opacity-50">mdi-account-clock</v-icon>
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
              <v-btn icon="mdi-refresh" variant="text" color="white" @click="fetchUsers" class="d-flex d-sm-none"></v-btn>
            </v-toolbar>

            <v-data-table
              :headers="headers"
              :items="users"
              :search="search"
              :loading="isLoading"
              theme="dark"
              class="bg-transparent mt-2 user-table flex-grow-1"
              items-per-page="8"
              fixed-header
            >
              <template v-slot:item.nombres="{ item }">
                <div class="d-flex align-center py-2">
                  <v-avatar color="grey-darken-3" size="36" class="mr-3">
                    <span class="text-white font-weight-bold">{{ getInitials(item.nombres) }}</span>
                  </v-avatar>
                  <div class="d-flex flex-column">
                    <span class="font-weight-bold text-white text-body-2">{{ item.nombres }}</span>
                    <span class="text-caption text-grey-lighten-1">{{ item.email }}</span>
                  </div>
                </div>
              </template>

              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="getStatusColor(item.status)"
                  size="x-small"
                  class="font-weight-bold text-uppercase"
                  variant="flat"
                >
                  {{ item.status }}
                </v-chip>
              </template>

              <template v-slot:item.contacto="{ item }">
                <div class="d-flex flex-column">
                  <span class="text-caption text-grey-lighten-2"><v-icon size="x-small" class="mr-1">mdi-card-account-details</v-icon>{{ item.cedula }}</span>
                  <span class="text-caption text-grey-lighten-2"><v-icon size="x-small" class="mr-1">mdi-phone</v-icon>{{ item.celular }}</span>
                </div>
              </template>

              <template v-slot:item.actions="{ item }">
                <div v-if="item.status === 'pendiente'" class="d-flex gap-2 justify-end">
                  <v-btn
                    icon
                    size="x-small"
                    color="green-lighten-1"
                    variant="tonal"
                    @click="openActionDialog(item, 'aprobar')"
                  >
                    <v-icon>mdi-check</v-icon>
                  </v-btn>
                  
                  <v-btn
                    icon
                    size="x-small"
                    color="red-lighten-1"
                    variant="tonal"
                    @click="openActionDialog(item, 'rechazar')"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </div>
                <div v-else class="text-right">
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
          {{ dialog.action === 'aprobar' ? '¿Aprobar Usuario?' : '¿Rechazar Usuario?' }}
        </v-card-title>
        <v-card-text class="text-center text-grey-lighten-1">
          <p v-if="dialog.action === 'aprobar'">
            El usuario <strong>{{ dialog.user?.nombres }}</strong> tendrá acceso inmediato al panel de jugadores.
          </p>
          <p v-else>
             El usuario <strong>{{ dialog.user?.nombres }}</strong> no podrá acceder al sistema.
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
import { useDisplay } from 'vuetify'; // Importante para responsivo
import { supabase } from '../../services/supabase';

const router = useRouter();
const { mobile } = useDisplay(); // Detecta si es móvil
const isMobile = computed(() => mobile.value);

const drawer = ref(!mobile.value); // Inicia cerrado en móvil, abierto en PC
const currentSection = ref('users');
const search = ref('');
const isLoading = ref(false);
const isProcessing = ref(false);
const users = ref([]);

// Estado para Diálogo y Snackbar
const dialog = ref({ show: false, action: null, user: null });
const snackbar = ref({ show: false, text: '', color: 'success' });

// Menú Lateral
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

// --- Computed Stats ---
const activeSectionTitle = computed(() => {
  const item = menuItems.find(i => i.id === currentSection.value);
  return item ? item.title : 'Panel';
});

const activeSectionSubtitle = computed(() => {
  if (currentSection.value === 'users') return 'Gestiona las solicitudes de registro y permisos.';
  return 'Bienvenido al panel de control.';
});

const pendingCount = computed(() => users.value.filter(u => u.status === 'pendiente').length);
const activeCount = computed(() => users.value.filter(u => u.status === 'activo').length);
const totalUsers = computed(() => users.value.length);

// --- Métodos ---

const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

const getStatusColor = (status) => {
  if (status === 'activo') return 'green-lighten-1';
  if (status === 'pendiente') return 'orange-lighten-1';
  if (status === 'rechazado') return 'red-lighten-1';
  return 'grey';
};

const fetchUsers = async () => {
  isLoading.value = true;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
  } else {
    users.value = data || [];
  }
  
  // LOGICA "AUN ASI NO HAYA DATOS": Agregamos Mocks si está vacío o para visualización
  // (Aquí siempre agrego 2 dummy al final para que veas el diseño)
  users.value.push(
    { id: 'mock-1', nombres: 'Carlos Ejemplo (Demo)', email: 'demo1@liga.com', status: 'pendiente', cedula: '1800000001', celular: '099000001', role: 'jugador' },
    { id: 'mock-2', nombres: 'Luis Prueba (Demo)', email: 'demo2@liga.com', status: 'activo', cedula: '1800000002', celular: '099000002', role: 'arbitro' }
  );

  isLoading.value = false;
};

const openActionDialog = (user, action) => {
  dialog.value = { show: true, action, user };
};

const executeAction = async () => {
  if (!dialog.value.user) return;
  
  isProcessing.value = true;
  const newStatus = dialog.value.action === 'aprobar' ? 'activo' : 'rechazado';
  
  try {
    // Si es mock data, solo simula
    if (dialog.value.user.id.startsWith('mock-')) {
       await new Promise(r => setTimeout(r, 1000)); // Simula red
    } else {
       const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', dialog.value.user.id);
       if (error) throw error;
    }

    // Actualizar lista local
    const index = users.value.findIndex(u => u.id === dialog.value.user.id);
    if (index !== -1) {
      users.value[index].status = newStatus;
    }

    showSnackbar(`Usuario ${newStatus === 'activo' ? 'aprobado' : 'rechazado'} correctamente`, 'success');
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
.admin-layout {
  background: #0f1012; 
  color: white;
}
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

/* PAGINACIÓN BLANCA */
.user-table :deep(.v-data-table-footer) {
  color: white !important;
}
.user-table :deep(.v-btn--icon) {
  color: white !important;
}

/* --- UTILS --- */
.btn-glass-icon {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.gap-2 { gap: 8px; }
.gap-4 { gap: 16px; }
.tracking-wider { letter-spacing: 1.5px; }

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