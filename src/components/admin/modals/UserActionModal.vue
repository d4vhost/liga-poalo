<script setup>
import { ref, watch } from 'vue'
import { supabase } from '../../../services/supabase'

const props = defineProps({
  modelValue: Boolean,
  user: Object
})

const emit = defineEmits(['update:modelValue', 'updated'])

// Formulario reactivo
const formData = ref({
  nombres: '',
  cedula: '',
  email: '',
  celular: '',
  direccion: '',
  role: '',
  status: '',
  password: '',
  confirmPassword: ''
})

const saving = ref(false)
const addressLoading = ref(false)
const addressResults = ref([])
const searchTimer = ref(null)

const roles = ['viewer', 'jugador', 'arbitro', 'administrador']
const statuses = ['pendiente', 'activo', 'rechazado', 'suspendido']

// Cargar datos al abrir
watch(() => props.user, (newUser) => {
  if (newUser) {
    formData.value = {
      nombres: newUser.nombres || '',
      cedula: newUser.cedula || '',
      email: newUser.email || '',
      celular: newUser.celular || '',
      direccion: newUser.direccion || '',
      role: newUser.role || 'viewer',
      status: newUser.status || 'pendiente',
      password: '',
      confirmPassword: ''
    }
  }
})

// Lógica de búsqueda de dirección
const handleAddressInput = (val) => {
  // Manejo robusto del input
  const query = typeof val === 'string' ? val : val?.target?.value || '';
  
  if (!query || query.length < 3) { 
    addressResults.value = []; 
    return 
  }
  
  clearTimeout(searchTimer.value)
  searchTimer.value = setTimeout(async () => {
    addressLoading.value = true
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=ec`)
      const data = await response.json()
      // Mapeamos solo el nombre para el autocompletado
      addressResults.value = data.map(item => item.display_name)
    } catch (e) { 
      console.error("Error buscando dirección:", e) 
    } finally { 
      addressLoading.value = false 
    }
  }, 800)
}

const save = async () => {
  // Validación de contraseñas
  if (formData.value.password && formData.value.password !== formData.value.confirmPassword) {
    alert('Las contraseñas no coinciden')
    return
  }

  saving.value = true
  
  try {
    // 1. Actualizar Datos del Perfil
    const { data, error: profileError } = await supabase
      .from('profiles')
      .update({
        nombres: formData.value.nombres,
        cedula: formData.value.cedula,
        celular: formData.value.celular,
        direccion: formData.value.direccion,
        role: formData.value.role,
        status: formData.value.status
      })
      .eq('id', props.user.id)
      .select() // IMPORTANTE: Confirma que la actualización ocurrió

    if (profileError) throw profileError

    // Verificación de seguridad: si data está vacío, RLS bloqueó la actualización
    if (!data || data.length === 0) {
      throw new Error("No se pudo actualizar. Verifica tus permisos de Administrador.")
    }

    // 2. Actualizar Contraseña (Opcional)
    if (formData.value.password) {
      const { error: rpcError } = await supabase.rpc('admin_update_user_password', {
        target_user_id: props.user.id,
        new_password: formData.value.password
      })
      
      if (rpcError) throw new Error('Error al cambiar contraseña: ' + rpcError.message)
    }

    emit('updated') // Avisar al padre para recargar la tabla
    
  } catch (error) {
    alert('Error: ' + error.message)
    console.error(error)
  } finally {
    saving.value = false
  }
}

const close = () => emit('update:modelValue', false)
</script>

<template>
  <v-dialog 
    :model-value="modelValue" 
    @update:model-value="close" 
    max-width="700px" 
    scrollable
    transition="dialog-bottom-transition"
  >
    <v-card color="#0f1012" class="card-modal-premium" elevation="10">
      
      <v-toolbar color="transparent" density="compact" height="50" class="px-2 border-bottom-subtle">
        <v-toolbar-title class="text-subtitle-2 font-weight-black text-white tracking-wide">
          EDITAR USUARIO
        </v-toolbar-title>
        <v-btn icon size="small" @click="close" color="grey">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      
      <v-card-text class="pa-4">
        <v-form @submit.prevent="save">
          <v-row dense>
            
            <v-col cols="12" class="mb-1">
              <span class="text-caption text-primary font-weight-bold text-uppercase">Información Personal</span>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-text-field 
                v-model="formData.nombres" 
                label="Nombres Completos" 
                variant="outlined" density="compact" 
                base-color="grey" color="white"
                bg-color="rgba(255,255,255,0.03)"
                prepend-inner-icon="mdi-account"
                class="input-premium"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field 
                v-model="formData.cedula" 
                label="Cédula" 
                variant="outlined" density="compact"
                base-color="grey" color="white"
                bg-color="rgba(255,255,255,0.03)"
                prepend-inner-icon="mdi-card-account-details"
                class="input-premium"
                hide-details="auto"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="mt-2 mb-1">
              <span class="text-caption text-primary font-weight-bold text-uppercase">Contacto</span>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-text-field 
                v-model="formData.email" 
                label="Correo (Solo lectura)" 
                variant="outlined" density="compact"
                base-color="grey-darken-2" color="grey"
                bg-color="transparent"
                prepend-inner-icon="mdi-email"
                readonly
                class="input-premium"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field 
                v-model="formData.celular" 
                label="Celular" 
                variant="outlined" density="compact"
                base-color="grey" color="white"
                bg-color="rgba(255,255,255,0.03)"
                prepend-inner-icon="mdi-phone"
                class="input-premium"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" class="mt-2">
              <v-autocomplete
                v-model="formData.direccion"
                :items="addressResults"
                :loading="addressLoading"
                label="Dirección Domiciliaria"
                variant="outlined"
                density="compact"
                base-color="grey" color="white"
                bg-color="rgba(255,255,255,0.03)"
                prepend-inner-icon="mdi-map-search"
                no-filter 
                hide-no-data
                @update:search="handleAddressInput"
                :return-object="false"
                class="input-premium"
                hide-details="auto"
                placeholder="Escribe para buscar..."
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" class="mt-2 mb-1">
              <span class="text-caption text-primary font-weight-bold text-uppercase">Permisos</span>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-select 
                v-model="formData.role" 
                :items="roles" 
                label="Rol" 
                variant="outlined" density="compact"
                base-color="grey" color="white"
                bg-color="rgba(255,255,255,0.03)"
                prepend-inner-icon="mdi-shield-account"
                class="input-premium"
                hide-details="auto"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select 
                v-model="formData.status" 
                :items="statuses" 
                label="Estado" 
                variant="outlined" density="compact"
                base-color="grey" color="white"
                bg-color="rgba(255,255,255,0.03)"
                prepend-inner-icon="mdi-list-status"
                class="input-premium"
                hide-details="auto"
              ></v-select>
            </v-col>

            <v-col cols="12" class="mt-2 mb-1">
              <span class="text-caption text-red-accent-2 font-weight-bold text-uppercase">Zona de Seguridad</span>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field 
                v-model="formData.password" 
                label="Nueva Clave (Opcional)" 
                type="password" 
                variant="outlined" density="compact"
                base-color="grey" color="white"
                bg-color="rgba(255,255,255,0.03)"
                prepend-inner-icon="mdi-lock"
                class="input-premium"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field 
                v-model="formData.confirmPassword" 
                label="Confirmar Clave" 
                type="password" 
                variant="outlined" density="compact"
                base-color="grey" color="white"
                bg-color="rgba(255,255,255,0.03)"
                prepend-inner-icon="mdi-lock-check"
                class="input-premium"
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider class="border-subtle"></v-divider>
      <v-card-actions class="pa-3 bg-dark-theme">
        <v-spacer></v-spacer>
        <v-btn 
          variant="outlined" 
          color="grey" 
          size="small"
          class="mr-2 border-subtle" 
          @click="close"
        >
          Cancelar
        </v-btn>
        <v-btn 
          color="white" 
          variant="flat" 
          size="small"
          @click="save" 
          :loading="saving"
          class="font-weight-bold text-black px-4"
        >
          Guardar Cambios
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
/* Estilos Dark Premium (Igual que antes) */
.card-modal-premium {
  border: 1px solid rgba(255, 255, 255, 0.15);
  background-color: #0f1012 !important;
}

.border-bottom-subtle { border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
.border-subtle { border-color: rgba(255, 255, 255, 0.1) !important; }
.tracking-wide { letter-spacing: 1.5px; }

/* Estilos finos para inputs */
.input-premium :deep(.v-field__outline__start),
.input-premium :deep(.v-field__outline__end),
.input-premium :deep(.v-field__outline__notch) {
  border-color: rgba(255, 255, 255, 0.15) !important;
}

.input-premium :deep(.v-field:hover .v-field__outline__start),
.input-premium :deep(.v-field:hover .v-field__outline__end),
.input-premium :deep(.v-field:hover .v-field__outline__notch) {
  border-color: rgba(255, 255, 255, 0.4) !important;
}
</style>