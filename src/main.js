import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 1. Importar Vuetify y sus estilos
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// 2. Importar los Iconos (Material Design Icons)
import '@mdi/font/css/materialdesignicons.css' 

// 3. Configuración de Vuetify (Tema y colores)
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light', // Puedes cambiar a 'dark' si prefieres fondo negro
  },
})

const app = createApp(App)

app.use(router)
app.use(vuetify)
app.mount('#app')