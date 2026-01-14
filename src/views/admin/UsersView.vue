<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../../services/supabase' 
import UserActionModal from '../../components/admin/modals/UserActionModal.vue'

// Estado
const users = ref([])
const loading = ref(false)
const search = ref('')
const showModal = ref(false)
const selectedUser = ref(null)

// Paginación
const page = ref(1)
const itemsPerPage = ref(8) // Forzamos 8

// Computed: Calcula cuántas filas vacías (ghosts) faltan para completar las 8
const ghostRows = computed(() => {
  const totalUsers = users.value.length
  
  // Si no hay usuarios, mostramos 8 vacías
  if (totalUsers === 0) return itemsPerPage.value

  // Calculamos total de páginas
  const totalPages = Math.ceil(totalUsers / itemsPerPage.value)

  // Si no estamos en la última página, no necesitamos ghosts (está llena)
  if (page.value < totalPages) return 0

  // Si estamos en la última página, calculamos el remanente
  const remainder = totalUsers % itemsPerPage.value
  return remainder === 0 ? 0 : itemsPerPage.value - remainder
})

// Encabezados
const headers = [
  { title: 'USUARIO', key: 'user_info', align: 'start', sortable: false },
  { title: 'ROL / CÉDULA', key: 'role_info', sortable: false },
  { title: 'ESTADO', key: 'status', align: 'center', sortable: false },
  { title: 'CONTACTO', key: 'contact_info', sortable: false },
  { title: 'ACCIONES', key: 'actions', sortable: false, align: 'end' },
]

// Carga de Datos
const fetchUsers = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  if (!error) users.value = data
  loading.value = false
}

const openEditModal = (user) => {
  selectedUser.value = { ...user } 
  showModal.value = true
}

const handleUserUpdated = () => {
  showModal.value = false
  fetchUsers()
}

onMounted(() => fetchUsers())

// Colores
const getRoleColor = (role) => ({ administrador: 'purple-accent-2', arbitro: 'orange-accent-2', jugador: 'blue-accent-2' }[role] || 'grey')
const getStatusColor = (status) => ({ activo: 'green', pendiente: 'amber', rechazado: 'red', suspendido: 'grey' }[status] || 'grey')
</script>

<template>
  <div class="h-100 d-flex flex-column">
    <div class="d-flex align-center justify-space-between mb-6">
      <h2 class="text-h5 font-weight-bold text-white tracking-wide">
        DIRECTORIO DE USUARIOS
      </h2>
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        placeholder="Buscar..."
        single-line hide-details density="compact" variant="outlined"
        style="max-width: 300px;"
        class="search-dark"
        bg-color="rgba(255,255,255,0.05)"
        color="white"
      ></v-text-field>
    </div>

    <v-card class="card-dark-outline" elevation="0">
      <v-data-table
        v-model:page="page"
        :headers="headers"
        :items="users"
        :items-per-page="itemsPerPage"
        :search="search"
        :loading="loading"
        theme="dark"
        class="bg-transparent"
        hover
        :items-per-page-options="[8]" 
      >
        <template v-slot:item.user_info="{ item }">
          <div class="d-flex align-center py-3">
            <v-avatar color="grey-darken-3" size="40" class="mr-3 border-subtle">
              <span class="font-weight-bold text-white">{{ item.nombres?.charAt(0) || 'U' }}</span>
            </v-avatar>
            <div>
              <div class="font-weight-bold text-white text-body-2">{{ item.nombres || 'Sin nombre' }}</div>
              <div class="text-caption text-grey">{{ item.email }}</div>
            </div>
          </div>
        </template>

        <template v-slot:item.role_info="{ item }">
          <div class="text-caption text-grey-lighten-1 mb-1 font-family-mono">{{ item.cedula || '---' }}</div>
          <v-chip :color="getRoleColor(item.role)" size="x-small" label class="font-weight-bold text-uppercase" variant="flat">
            {{ item.role || 'viewer' }}
          </v-chip>
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip :color="getStatusColor(item.status)" size="small" variant="outlined" class="font-weight-bold" style="border-width: 1px;">
            {{ item.status }}
          </v-chip>
        </template>

        <template v-slot:item.contact_info="{ item }">
          <div v-if="item.celular" class="text-caption text-grey-lighten-1"><v-icon size="x-small" color="grey">mdi-phone</v-icon> {{ item.celular }}</div>
          <div v-if="item.direccion" class="text-caption text-grey-lighten-1 text-truncate" style="max-width: 150px;">
            <v-icon size="x-small" color="grey">mdi-map-marker</v-icon> {{ item.direccion }}
          </div>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn icon="mdi-pencil" size="small" variant="text" color="white" @click="openEditModal(item)"></v-btn>
        </template>

        <template v-slot:body.append>
          <tr v-for="n in ghostRows" :key="'ghost-' + n" class="ghost-row">
            <td colspan="5" class="border-bottom-subtle">
              <div class="ghost-content"></div>
            </td>
          </tr>
        </template>

      </v-data-table>
    </v-card>

    <UserActionModal 
      v-model="showModal" 
      :user="selectedUser" 
      @updated="handleUserUpdated" 
    />
  </div>
</template>

<style scoped>
.card-dark-outline {
  background-color: transparent !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.bg-transparent {
  background-color: transparent !important;
}

.tracking-wide {
  letter-spacing: 1px;
}

/* Altura fija para las filas fantasmas igual que las reales */
.ghost-content {
  height: 64px; /* Ajustado para coincidir con la altura visual de las filas con avatar */
}

.border-bottom-subtle {
  border-bottom: 1px solid rgba(255, 255, 255, 0.07) !important;
}

/* Inputs */
.search-dark :deep(.v-field__outline__start),
.search-dark :deep(.v-field__outline__end),
.search-dark :deep(.v-field__outline__notch) {
  border-color: rgba(255, 255, 255, 0.2) !important;
}

/* Asegurar que el paginador se vea bien en oscuro */
:deep(.v-data-table-footer) {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
}
</style>