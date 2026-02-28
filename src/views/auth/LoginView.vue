<template>
  <div class="login-container">
    <v-row no-gutters class="fill-height">
      
      <v-col cols="12" md="6" class="d-none d-md-flex position-relative">
        <v-img
          src="https://images.unsplash.com/photo-1556056504-5c7696c4c28d?q=80&w=2076&auto=format&fit=crop"
          cover
          class="login-image"
        >
          <div class="image-text-wrapper d-flex flex-column justify-end pa-8 pb-12">
            <h2 class="text-h4 font-weight-black text-white text-uppercase mb-3 text-shadow-heavy" style="line-height: 1.1;">
              Bienvenido al Estadio
            </h2>
            <p class="text-body-1 text-grey-lighten-2 font-weight-regular" style="max-width: 85%; text-shadow: 1px 1px 4px rgba(0,0,0,0.8);">
              Tu acceso directo a las estadísticas, resultados y la pasión de la Liga San José de Poaló.
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
          to="/"
          style="z-index: 10;"
        ></v-btn>

        <v-container class="pa-0 px-8" style="max-width: 600px;">
          <div class="fade-in-up">
            
            <div class="text-center mb-6">
              <v-avatar color="rgba(255,255,255,0.08)" size="70" class="mb-4 elevation-3">
                <v-icon color="white" size="36">mdi-account-key</v-icon>
              </v-avatar>
              <h1 class="text-h4 font-weight-bold text-white mb-1">Iniciar Sesión</h1>
              <p class="text-body-2 text-grey-lighten-1 font-weight-light">
                Ingresa a tu cuenta oficial de la liga
              </p>
            </div>

            <div 
              v-if="errorMessage" 
              class="d-flex align-center justify-center mb-5 text-orange-darken-1 fade-in"
            >
              <v-icon icon="mdi-alert" size="small" class="mr-2"></v-icon>
              <span class="text-caption font-weight-bold text-uppercase" style="letter-spacing: 0.5px;">
                {{ errorMessage }}
              </span>
            </div>

            <v-form v-model="isValid" @submit.prevent="handleLogin">
              
              <div class="mb-4">
                <div class="text-caption text-grey-lighten-3 mb-1 font-weight-bold ml-1 tracking-wider">
                  CORREO ELECTRÓNICO
                </div>
                <v-text-field
                  v-model="email"
                  :rules="[rules.required, rules.email]"
                  prepend-inner-icon="mdi-email-outline"
                  placeholder="ejemplo@correo.com"
                  variant="solo-filled"
                  bg-color="rgba(255,255,255,0.06)"
                  color="white"
                  rounded="lg"
                  hide-details="auto"
                  density="comfortable"
                  class="custom-input-gray w-100"
                  theme="dark"
                ></v-text-field>
              </div>

              <div class="mb-2">
                <div class="d-flex justify-space-between align-center mb-1 ml-1">
                  <span class="text-caption text-grey-lighten-3 font-weight-bold tracking-wider">CONTRASEÑA</span>
                </div>
                <v-text-field
                  v-model="password"
                  :rules="[rules.required]"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="showPassword = !showPassword"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  variant="solo-filled"
                  bg-color="rgba(255,255,255,0.06)"
                  color="white"
                  rounded="lg"
                  hide-details="auto"
                  density="comfortable"
                  class="custom-input-gray w-100"
                  theme="dark"
                ></v-text-field>
              </div>

              <div class="d-flex justify-end mb-6 mt-2">
                <a href="#" class="text-caption text-blue-grey-lighten-3 text-decoration-none font-weight-medium hover-bright transition-swing">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <v-btn
                block
                height="48"
                color="white"
                class="text-black font-weight-bold btn-login-gray mb-6 text-body-1"
                rounded="lg"
                type="submit"
                :loading="isLoading"
                elevation="4"
              >
                INGRESAR AL SISTEMA
              </v-btn>

              <div class="register-section position-relative py-5 px-4 text-center rounded-xl">
                <div class="background-glass"></div>
                <div class="position-relative" style="z-index: 2;">
                  <div class="d-flex align-center justify-center mb-2">
                    <v-icon color="white" size="20" class="mr-2">mdi-bell-ring</v-icon>
                    <span class="text-body-2 font-weight-bold text-white">¿No tienes una cuenta?</span>
                  </div>
                  <p class="text-caption text-grey-lighten-2 mb-3 px-2" style="line-height: 1.3;">
                    Regístrate para recibir notificaciones al instante sobre cambios.
                  </p>
                  <v-btn
                    to="/register"
                    variant="outlined"
                    color="white"
                    width="100%"
                    height="40"
                    class="btn-outline-gray"
                    rounded="lg"
                    size="small"
                  >
                    REGÍSTRATE AHORA
                  </v-btn>
                </div>
              </div>

            </v-form>
          </div>
        </v-container>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../../services/supabase';

const router = useRouter();
const isValid = ref(false);
const isLoading = ref(false);
const showPassword = ref(false);
const errorMessage = ref('');

const email = ref('');
const password = ref('');

const rules = {
  required: value => !!value || 'Requerido.',
  email: value => /.+@.+\..+/.test(value) || 'Correo inválido.'
};

// --- Lógica de Redirección ---
const redireccionarPorRol = (role) => {
  if (role === 'administrador') router.push('/panel-admin');
  else if (role === 'arbitro') router.push('/panel-arbitro');
  else if (role === 'jugador') router.push('/panel-jugador');
  else throw new Error('NO_PERMISSION');
};

// --- Verificar Sesión al Iniciar ---
onMounted(async () => {
  // 🛠️ FIX TEMPORAL: Limpiamos la sesión guardada al montar el componente.
  // Esto evitará que te redirija automáticamente al inicio por no tener las 
  // rutas de los paneles creadas aún, permitiéndote ver y diseñar el Login.
  // *Nota: Cuando ya vayas a programar la lógica real y tengas tus rutas hechas, 
  // puedes borrar estas 3 líneas.*
  await supabase.auth.signOut();
  localStorage.removeItem('user_role');
  localStorage.removeItem('offline_auth');

  // Continúa con la lógica normal
  const { data } = await supabase.auth.getSession();
  const cachedRole = localStorage.getItem('user_role');

  if (data.session) {
    if (cachedRole && ['administrador', 'arbitro', 'jugador'].includes(cachedRole)) {
      redireccionarPorRol(cachedRole);
    } else {
      await supabase.auth.signOut();
      localStorage.removeItem('user_role');
      localStorage.removeItem('offline_auth');
    }
  }
});

const handleLogin = async () => {
  if (!isValid.value) return;

  isLoading.value = true;
  errorMessage.value = '';

  try {
    // 1. Autenticación
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (authError) throw authError;

    // 2. Obtener Perfil
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (profileError) throw profileError;

    const userRole = profileData?.role;

    // 3. Validar Permisos
    if (!userRole || !['administrador', 'arbitro', 'jugador'].includes(userRole)) {
      await supabase.auth.signOut(); 
      throw new Error('NO_PERMISSION'); 
    }

    // 4. Éxito
    localStorage.setItem('user_role', userRole);
    localStorage.setItem('offline_auth', JSON.stringify({
      email: email.value,
      password: password.value,
      role: userRole
    }));

    redireccionarPorRol(userRole);

  } catch (error) {
    console.error("Login Check:", error.message);
    
    if (error.message === 'NO_PERMISSION') {
      errorMessage.value = 'Su cuenta no tiene permisos de acceso al panel.';
    } else if (error.message.includes('Invalid login')) {
      errorMessage.value = 'Credenciales incorrectas. Verifique correo y contraseña.';
    } else {
      errorMessage.value = 'Error de conexión o credenciales inválidas.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: #000;
}

/* --- ESTILOS VISUALES --- */
.bg-dark-theme { background: #0f1012; }
.login-image { height: 100%; width: 100%; filter: brightness(0.85); }
.image-text-wrapper {
  position: absolute; bottom: 0; left: 0; width: 100%; height: 50%;
  background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 60%, transparent 100%);
}
.text-shadow-heavy { text-shadow: 2px 2px 8px rgba(0,0,0,0.9); }
.tracking-wider { letter-spacing: 1px; }

.custom-input-gray :deep(.v-field) {
  border-radius: 12px !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
}
.custom-input-gray :deep(.v-field--focused) {
  border-color: rgba(255, 255, 255, 0.4) !important;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.05);
  background: rgba(255,255,255,0.09) !important;
}
.custom-input-gray :deep(input) { padding-top: 0; }
.custom-input-gray :deep(input::placeholder) { color: rgba(255, 255, 255, 0.25) !important; opacity: 1; }

.btn-login-gray {
  letter-spacing: 1.5px;
  transition: all 0.3s ease;
  border: 1px solid white;
}
.btn-login-gray:hover {
  background: #e0e0e0 !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.15);
}
.hover-bright:hover { color: white !important; }

/* REGISTRO */
.register-section { border: 1px solid rgba(255, 255, 255, 0.08); overflow: hidden; }
.background-glass {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255, 255, 255, 0.02); z-index: 1;
}
.btn-outline-gray {
  border-width: 1px; letter-spacing: 1px; font-weight: 700; transition: all 0.3s;
}
.btn-outline-gray:hover { background: rgba(255, 255, 255, 0.1) !important; border-color: white; }

/* ANIMACIONES */
.fade-in-up { opacity: 0; animation: fadeInUp 0.8s ease forwards; }
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in { animation: fadeIn 0.5s ease forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

@media (max-width: 960px) {
  .login-container { height: auto; min-height: 100vh; overflow-y: auto; }
}
</style>