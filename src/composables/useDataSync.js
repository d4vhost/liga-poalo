import { watch } from 'vue'
import { supabase } from '../services/supabase' // Tu conexión existente
import { useOnline } from '@vueuse/core' // Detector de internet
import { useSyncQueue } from '../stores/syncQueue' // Tu cola de espera

export function useDataSync() {
  const online = useOnline() 
  const store = useSyncQueue()

  // 1. FUNCIÓN PRINCIPAL: Úsala en lugar de supabase.from().insert()
  const guardarDato = async (tabla, datos) => {
    if (online.value) {
      // CASO A: Hay internet 🟢 -> Enviamos directo a la nube
      console.log(`[Online] Enviando a tabla '${tabla}'...`)
      const { data, error } = await supabase.from(tabla).insert(datos).select()
      
      if (error) throw error
      return { success: true, data }
      
    } else {
      // CASO B: No hay internet 🔴 -> Guardamos en el bolsillo (Store)
      console.log(`[Offline] Guardando localmente en cola...`)
      store.addToQueue({
        type: 'INSERT',
        table: tabla,
        payload: datos
      })
      
      return { success: true, offline: true, message: 'Guardado pendiente de sincronización' }
    }
  }

  // 2. EL SINCRONIZADOR: Revisa la cola y sube los datos
  const procesarCola = async () => {
    if (store.queue.length === 0) return // Nada que hacer

    console.log(`🔄 Intentando sincronizar ${store.queue.length} elementos...`)
    
    // Recorremos la cola (hacemos una copia para no romper el loop al borrar)
    const colaActual = [...store.queue]

    for (const item of colaActual) {
      try {
        // Intentamos subir
        const { error } = await supabase.from(item.table).insert(item.payload)
        
        if (!error) {
          // Si subió bien, lo borramos de la lista de pendientes
          store.removeFromQueue(item.id)
          console.log(`✅ Elemento sincronizado: ${item.table}`)
        } else {
          console.error(`❌ Error sincronizando ${item.table}:`, error.message)
        }
      } catch (e) {
        console.error("Error de conexión al sincronizar", e)
      }
    }
  }

  // 3. AUTOMATIZACIÓN: Si vuelve el internet, procesar la cola automáticamente
  watch(online, (isOnline) => {
    if (isOnline) {
      console.log('🌐 Conexión restaurada. Sincronizando...')
      procesarCola()
    }
  })

  return { 
    guardarDato, 
    isOnline: online,
    procesarCola 
  }
}