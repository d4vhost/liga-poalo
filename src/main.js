import { createApp } from 'vue'
import { createPinia } from 'pinia' 
import App from './App.vue'
import router from './router'

// 1. Importar Vuetify y sus estilos
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// 2. Importar los Iconos
import '@mdi/font/css/materialdesignicons.css' 

// 3. Configuración de Vuetify
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
  },
})

const app = createApp(App)

app.use(createPinia()) 
app.use(router)
app.use(vuetify)
app.mount('#app')