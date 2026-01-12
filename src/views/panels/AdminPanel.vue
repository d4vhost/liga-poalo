<template>
  <v-layout class="admin-layout bg-dark-theme h-screen overflow-hidden">
    
    <AdminSidebar 
      v-model:drawer="drawer"
      :is-mobile="isMobile"
      @logout="handleLogout"
    />

    <v-main class="bg-pattern h-100 d-flex flex-column position-relative">
      
      <div v-if="isMobile" class="pa-4 position-absolute top-0 left-0" style="z-index: 100;">
        <v-btn icon="mdi-menu" variant="tonal" color="white" @click="drawer = !drawer"></v-btn>
      </div>

      <v-container fluid class="pa-4 pa-md-8 flex-grow-1 d-flex flex-column h-100 overflow-y-auto">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-container>

    </v-main>
  </v-layout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';
import { supabase } from '../../services/supabase';
import AdminSidebar from '../../components/admin/AdminSidebar.vue';

const router = useRouter();
const { mobile } = useDisplay();
const isMobile = computed(() => mobile.value);
const drawer = ref(!mobile.value);

const handleLogout = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem('user_role');
  router.push('/login');
};
</script>

<style scoped>
.admin-layout { background: #0f1012; color: white; }
.h-screen { height: 100vh; }
.overflow-hidden { overflow: hidden; }
.bg-pattern {
  background-image: radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 20px 20px;
  background-color: #141518;
}

/* Transición suave entre páginas */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>