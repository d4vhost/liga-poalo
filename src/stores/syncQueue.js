import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useSyncQueue = defineStore('syncQueue', () => {
  // 1. Intentamos recuperar datos guardados anteriormente en el navegador
  const savedQueue = localStorage.getItem('offlineQueue')
  const queue = ref(savedQueue ? JSON.parse(savedQueue) : [])

  // 2. Vigilamos la cola: si cambia, guardamos automáticamente en localStorage
  // Así, si cierran el navegador, los datos no se pierden
  watch(queue, (newVal) => {
    localStorage.setItem('offlineQueue', JSON.stringify(newVal))
  }, { deep: true })

  // Acción para agregar algo a la cola
  const addToQueue = (action) => {
    queue.value.push({
      ...action,
      id: Date.now() + Math.random(), // ID único temporal
      timestamp: new Date().toISOString()
    })
  }

  // Acción para quitar algo de la cola (cuando ya se subió a internet)
  const removeFromQueue = (id) => {
    queue.value = queue.value.filter(item => item.id !== id)
  }

  return { queue, addToQueue, removeFromQueue }
})