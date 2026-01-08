<template>
  <div class="register-container">
    <v-row no-gutters class="fill-height">
      
      <v-col cols="12" md="6" class="d-none d-md-flex position-relative">
        <v-img
          src="https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?q=80&w=2070&auto=format&fit=crop"
          cover
          class="register-image"
        >
          <div class="image-text-wrapper d-flex flex-column justify-end pa-8 pb-12">
            <h2 class="text-h4 font-weight-black text-white text-uppercase mb-2 text-shadow-heavy" style="line-height: 1.1;">
              Únete al Equipo
            </h2>
            <p class="text-body-1 text-grey-lighten-2 font-weight-regular" style="max-width: 90%; text-shadow: 1px 1px 4px rgba(0,0,0,0.8);">
              Sé el primero en enterarte de los resultados, cambios de horario y noticias oficiales de San José de Poaló.
            </p>
          </div>
        </v-img>
      </v-col>

      <v-col cols="12" md="6" class="bg-dark-theme d-flex align-center justify-center position-relative">
        
        <v-btn
          icon="mdi-arrow-left"
          variant="text"
          color="white"
          class="position-absolute top-0 left-0 ma-4"
          to="/login"
          style="z-index: 10;"
        ></v-btn>

        <v-container class="pa-0 px-8" style="max-width: 700px;">
          <div class="fade-in-up">
            
            <div class="text-center mb-5">
              <v-avatar color="rgba(255,255,255,0.08)" size="50" class="mb-3 elevation-3">
                <v-icon color="white" size="28">mdi-account-plus</v-icon>
              </v-avatar>
              <h1 class="text-h5 font-weight-bold text-white mb-0">Crear Cuenta</h1>
              <p class="text-caption text-grey-lighten-1 font-weight-light">
                Registro oficial de socios y jugadores
              </p>
            </div>

            <v-form v-model="isValid" @submit.prevent="handleRegister">
              
              <v-row dense class="mb-1">
                <v-col cols="12" sm="4">
                  <div class="text-caption text-grey-lighten-3 mb-1 font-weight-bold ml-1 tracking-wider">
                    CÉDULA
                  </div>
                  <v-text-field
                    v-model="form.cedula"
                    :rules="[rules.required, rules.numeric]"
                    placeholder="Ej: 1807678789"
                    variant="solo-filled"
                    bg-color="rgba(255,255,255,0.06)"
                    color="white"
                    rounded="lg"
                    hide-details="auto"
                    density="compact"
                    class="custom-input-gray"
                    theme="dark"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="8">
                  <div class="text-caption text-grey-lighten-3 mb-1 font-weight-bold ml-1 tracking-wider">
                    NOMBRES Y APELLIDOS
                  </div>
                  <v-text-field
                    v-model="form.fullName"
                    :rules="[rules.required]"
                    placeholder="Ej: Juan Pérez"
                    variant="solo-filled"
                    bg-color="rgba(255,255,255,0.06)"
                    color="white"
                    rounded="lg"
                    hide-details="auto"
                    density="compact"
                    class="custom-input-gray"
                    theme="dark"
                  ></v-text-field>
                </v-col>
              </v-row>

              <div class="mb-2">
                <div class="text-caption text-grey-lighten-3 mb-1 font-weight-bold ml-1 tracking-wider">
                  NÚMERO CELULAR
                </div>
                <div class="d-flex gap-2">
                  <div style="width: 130px;">
                    <v-select
                      v-model="form.countryCode"
                      :items="countryCodes"
                      item-title="label"
                      item-value="code"
                      variant="solo-filled"
                      bg-color="rgba(255,255,255,0.06)"
                      color="white"
                      rounded="lg"
                      hide-details
                      density="compact"
                      class="custom-input-gray"
                      theme="dark"
                    >
                      <template v-slot:selection="{ item }">
                        <span class="text-caption font-weight-bold">{{ item.raw.flag }} {{ item.raw.code }}</span>
                      </template>
                      <template v-slot:item="{ props, item }">
                        <v-list-item v-bind="props" :title="item.raw.name" :subtitle="item.raw.code">
                          <template v-slot:prepend>
                            <span class="mr-2">{{ item.raw.flag }}</span>
                          </template>
                        </v-list-item>
                      </template>
                    </v-select>
                  </div>
                  <v-text-field
                    v-model="form.phone"
                    :rules="[rules.required, rules.numeric]"
                    placeholder="099 123 4567"
                    variant="solo-filled"
                    bg-color="rgba(255,255,255,0.06)"
                    color="white"
                    rounded="lg"
                    hide-details="auto"
                    density="compact"
                    class="custom-input-gray flex-grow-1"
                    theme="dark"
                  ></v-text-field>
                </div>
              </div>

              <div class="mb-2">
                <div class="d-flex align-center justify-space-between mb-1">
                  <div class="text-caption text-grey-lighten-3 font-weight-bold ml-1 tracking-wider">
                    CORREO (Notificaciones)
                  </div>
                  <v-icon color="yellow-darken-2" size="x-small" title="Importante">mdi-alert-circle-outline</v-icon>
                </div>
                <v-text-field
                  v-model="form.email"
                  :rules="[rules.required, rules.email]"
                  prepend-inner-icon="mdi-email-outline"
                  placeholder="ejemplo@correo.com"
                  variant="solo-filled"
                  bg-color="rgba(255,255,255,0.06)"
                  color="white"
                  rounded="lg"
                  hide-details="auto"
                  density="compact"
                  class="custom-input-gray"
                  theme="dark"
                ></v-text-field>
              </div>

              <div class="mb-2">
                <div class="text-caption text-grey-lighten-3 mb-1 font-weight-bold ml-1 tracking-wider">
                  DIRECCIÓN (Buscador Real Ecuador)
                </div>
                <v-autocomplete
                  v-model="form.address"
                  v-model:search="searchQuery"
                  :items="searchResults"
                  :loading="isSearchingAddress"
                  item-title="display_name"
                  item-value="display_name"
                  prepend-inner-icon="mdi-map-search-outline"
                  placeholder="Escribe tu sector (ej: Guachi Grande)..."
                  variant="solo-filled"
                  bg-color="rgba(255,255,255,0.06)"
                  color="white"
                  rounded="lg"
                  hide-details="auto"
                  density="compact"
                  class="custom-input-gray"
                  theme="dark"
                  no-filter
                  return-object
                  @update:search="searchAddress"
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-title class="text-caption text-grey">
                        {{ searchQuery ? 'Buscando dirección...' : 'Escribe para buscar...' }}
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                </v-autocomplete>
              </div>

              <v-row dense class="mb-5">
                <v-col cols="12" sm="6">
                  <div class="text-caption text-grey-lighten-3 mb-1 font-weight-bold ml-1 tracking-wider">
                    CONTRASEÑA
                  </div>
                  <v-text-field
                    v-model="form.password"
                    :rules="[rules.required, rules.min]"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    variant="solo-filled"
                    bg-color="rgba(255,255,255,0.06)"
                    color="white"
                    rounded="lg"
                    hide-details="auto"
                    density="compact"
                    class="custom-input-gray"
                    theme="dark"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="text-caption text-grey-lighten-3 mb-1 font-weight-bold ml-1 tracking-wider">
                    CONFIRMAR
                  </div>
                  <v-text-field
                    v-model="form.confirmPassword"
                    :rules="[rules.required, passwordMatch]"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    variant="solo-filled"
                    bg-color="rgba(255,255,255,0.06)"
                    color="white"
                    rounded="lg"
                    hide-details="auto"
                    density="compact"
                    class="custom-input-gray"
                    theme="dark"
                    :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="showPassword = !showPassword"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-btn
                block
                height="45"
                color="white"
                class="text-black font-weight-bold btn-login-gray mb-3 text-body-2"
                rounded="lg"
                type="submit"
                :loading="isLoading"
                elevation="4"
              >
                REGISTRARME
              </v-btn>

              <div class="text-center">
                <span class="text-grey-lighten-1 text-caption">¿Ya tienes cuenta? </span>
                <router-link to="/login" class="text-white font-weight-bold text-caption text-decoration-none hover-bright ml-1">
                  Inicia Sesión aquí
                </router-link>
              </div>

            </v-form>
          </div>
        </v-container>

        <v-overlay
          v-model="registrationSuccess"
          contained
          class="align-center justify-center text-center"
          persistent
          scrim="#0f1012"
          style="backdrop-filter: blur(5px);"
        >
          <div class="d-flex flex-column align-center success-content">
            <div class="success-circle mb-6">
              <v-icon icon="mdi-check" color="white" size="60" class="check-icon"></v-icon>
            </div>
            
            <h2 class="text-h4 font-weight-bold text-white mb-2 fade-in-text">
              ¡Registro Exitoso!
            </h2>
            <p class="text-grey-lighten-1 fade-in-text delay-200">
              Tu solicitud está en revisión.
            </p>
          </div>
        </v-overlay>

      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../../services/supabase';

const router = useRouter();
const isValid = ref(false);
const isLoading = ref(false);
const showPassword = ref(false);
const registrationSuccess = ref(false);

// Variables para búsqueda de dirección
const searchQuery = ref('');
const searchResults = ref([]);
const isSearchingAddress = ref(false);
let searchTimeout = null;

const form = ref({
  cedula: '',
  fullName: '',
  email: '',
  countryCode: '+593',
  phone: '',
  address: null,
  password: '',
  confirmPassword: ''
});

// Lógica de Búsqueda de Direcciones (OpenStreetMap)
const searchAddress = (val) => {
  if (!val || val.length < 3) {
    searchResults.value = [];
    return;
  }

  isSearchingAddress.value = true;
  if (searchTimeout) clearTimeout(searchTimeout);

  searchTimeout = setTimeout(async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&countrycodes=ec&limit=5`
      );
      const data = await response.json();
      searchResults.value = data;
    } catch (error) {
      console.error("Error buscando dirección:", error);
    } finally {
      isSearchingAddress.value = false;
    }
  }, 500);
};

const countryCodes = [
  { code: '+593', name: 'Ecuador', flag: '🇪🇨' },
  { code: '+1', name: 'USA', flag: '🇺🇸' },
  { code: '+34', name: 'España', flag: '🇪🇸' },
];

const rules = {
  required: value => !!value || 'Requerido.',
  email: value => /.+@.+\..+/.test(value) || 'Inválido.',
  numeric: value => /^\d+$/.test(value) || 'Solo números.',
  min: value => value.length >= 6 || 'Mín. 6 chars.'
};

const passwordMatch = computed(() => {
  return () => form.value.password === form.value.confirmPassword || 'No coinciden';
});

// FUNCIÓN DE REGISTRO CONECTADA A SUPABASE
const handleRegister = async () => {
  if (!isValid.value) return;

  isLoading.value = true;

  try {
    const direccionFinal = form.value.address?.display_name || form.value.address || 'Sin dirección';
    const celularFinal = `${form.value.countryCode} ${form.value.phone}`;

    // Enviamos a Supabase
    // Los datos extra van en 'options.data' para que el Trigger SQL los capture
    const { error } = await supabase.auth.signUp({
      email: form.value.email,
      password: form.value.password,
      options: {
        data: {
          cedula: form.value.cedula,
          nombres: form.value.fullName,
          celular: celularFinal,
          direccion: direccionFinal
        }
      }
    });

    if (error) throw error;

    // ÉXITO: Mostramos animación
    isLoading.value = false;
    registrationSuccess.value = true;

    // Redirigir después de 2.5 segundos
    setTimeout(() => {
      router.push('/login');
    }, 2500);

  } catch (error) {
    console.error('Error al registrar:', error);
    isLoading.value = false;
    // Aquí puedes usar un snackbar si prefieres, por ahora un alert simple en caso de error crítico
    alert(error.message || 'Ocurrió un error al registrarse');
  }
};
</script>

<style scoped>
.register-container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: #000;
}

/* Fondo derecho */
.bg-dark-theme {
  background: #0f1012; 
}

/* Nueva imagen de fútbol */
.register-image {
  height: 100%;
  width: 100%;
  filter: brightness(0.85); 
}

.image-text-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 60%, transparent 100%);
}

.text-shadow-heavy {
  text-shadow: 2px 2px 8px rgba(0,0,0,0.9);
}

.tracking-wider {
  letter-spacing: 0.5px;
  font-size: 0.7rem !important; 
}

/* INPUTS COMPACTOS */
.custom-input-gray :deep(.v-field) {
  border-radius: 10px !important; 
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
}

.custom-input-gray :deep(.v-field--focused) {
  border-color: rgba(255, 255, 255, 0.4) !important;
  background: rgba(255,255,255,0.09) !important;
}

.custom-input-gray :deep(input) {
  padding-top: 0; 
  font-size: 0.9rem; 
}

/* BOTONES */
.btn-login-gray {
  letter-spacing: 1px;
  border: 1px solid white;
}

.btn-login-gray:hover {
  background: #e0e0e0 !important;
  transform: translateY(-2px);
}

.hover-bright:hover {
  color: white !important;
  text-decoration: underline !important;
}

.gap-2 { gap: 8px; }

/* ANIMACIÓN DE ENTRADA DEL FORMULARIO */
.fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s ease forwards;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* --- ANIMACIONES DE ÉXITO (NUEVO) --- */
.success-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #4CAF50; /* Verde éxito */
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
  animation: pulse-green 2s infinite;
  transform: scale(0);
  animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.check-icon {
  opacity: 0;
  animation: showIcon 0.3s 0.4s forwards;
}

.fade-in-text {
  opacity: 0;
  transform: translateY(10px);
  animation: fadeInUp 0.5s ease forwards;
  animation-delay: 0.3s;
}

.delay-200 {
  animation-delay: 0.5s;
}

@keyframes popIn {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}

@keyframes showIcon {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes pulse-green {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 20px rgba(76, 175, 80, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
}

/* Responsive */
@media (max-width: 960px) {
  .register-container {
    height: auto;
    min-height: 100vh;
    overflow-y: auto;
  }
}
</style>