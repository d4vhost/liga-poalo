<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { supabase } from '../../services/supabase'
import AdminSidebar from '../../components/admin/AdminSidebar.vue'

const router = useRouter()
const { mobile } = useDisplay()
const drawer = ref(!mobile.value)
const adminName = ref('')

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('nombres')
      .eq('id', session.user.id)
      .single()

    if (profile) {
      adminName.value = profile.nombres || session.user.email
    }
  }
})

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/login')
}
</script>

<template>
  <v-app theme="dark" class="bg-dark-theme">
    
    <v-app-bar color="#0f1012" elevation="0" class="border-bottom-subtle" height="70">
      <v-app-bar-nav-icon 
        class="d-md-none mr-2" 
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      
      <div class="d-flex flex-column justify-center ml-2">
        <div class="text-subtitle-1 font-weight-black text-white tracking-wide" style="line-height: 1.1;">
          PANEL ADMINISTRATIVO
        </div>
        <div class="text-caption font-weight-bold text-grey tracking-wide">
          SAN JOSÉ DE POALÓ
        </div>
      </div>

      <v-spacer></v-spacer>

      <div class="d-none d-sm-flex align-center mr-4 px-3 py-1">
        <span class="text-subtitle-2 font-weight-bold text-grey-lighten-2 mr-3">
          {{ adminName }}
        </span>
        <v-icon color="grey" size="24">mdi-account-circle-outline</v-icon>
      </div>
    </v-app-bar>

    <v-navigation-drawer 
      v-model="drawer" 
      :permanent="!mobile" 
      color="#0f1012"
      elevation="0"
      class="border-right-subtle"
      width="260"
    >
      <div class="d-flex flex-column fill-height pt-4">
        <div class="pa-3 flex-grow-1">
          <AdminSidebar />
        </div>

        <div class="pa-4 border-top-subtle">
          <v-btn 
            block 
            variant="outlined" 
            color="white" 
            class="text-body-2 font-weight-bold btn-border-subtle"
            @click="handleLogout"
          >
            <v-icon start>mdi-logout</v-icon>
            Cerrar Sesión
          </v-btn>
        </div>
      </div>
    </v-navigation-drawer>

    <v-main class="bg-dark-theme">
      <v-container fluid class="pa-6">
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
/* --- ESTILOS IDÉNTICOS AL PANEL ARBITRO --- */
.bg-dark-theme {
  background-color: #0f1012 !important; /* El color oscuro que tienes en árbitro */
  color: white;
}

.border-bottom-subtle {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.border-right-subtle {
  border-right: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.border-top-subtle {
  border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.btn-border-subtle {
  border-color: rgba(255, 255, 255, 0.2);
}

.tracking-wide {
  letter-spacing: 1.2px;
}
</style>