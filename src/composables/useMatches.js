import { ref } from 'vue'
import { supabase } from '../services/supabase'

export function useMatches() {
  const matches = ref([])
  const players = ref([])
  const loading = ref(false)
  const saving = ref(false)

  // Obtener partidos
  const fetchMatches = async () => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`*, match_players(team_side, position, profiles:player_id(id, nombres, email, cedula))`)
        .order('date', { ascending: true })

      if (error) throw error

      matches.value = data.map(match => {
        // Mapear la estructura plana a objetos con rosters
        const mapPlayers = (side) => match.match_players
          .filter(mp => mp.team_side === side && mp.profiles)
          .map(mp => ({ ...mp.profiles, position: mp.position }))

        return {
          ...match,
          team_a_roster: mapPlayers('A'),
          team_b_roster: mapPlayers('B')
        }
      })
    } catch (error) {
      console.error('Error fetching matches:', error)
    } finally {
      loading.value = false
    }
  }

  // Obtener jugadores disponibles
  const fetchPlayers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, nombres, cedula, role')
      .in('role', ['jugador', 'arbitro'])
      .eq('status', 'activo')
      .order('nombres')
    if (data) players.value = data
  }

  // Guardar o Actualizar partido
  const saveMatch = async (matchData) => {
    saving.value = true
    try {
      // 1. Datos básicos
      const basicData = {
        team_a_name: matchData.team_a_name,
        team_b_name: matchData.team_b_name,
        date: matchData.date,
        time: matchData.time,
        location: matchData.location,
        status: matchData.status,
        game_type: matchData.game_type
      }

      let matchId = matchData.id
      if (matchId) {
        await supabase.from('matches').update(basicData).eq('id', matchId)
      } else {
        const { data } = await supabase.from('matches').insert(basicData).select().single()
        matchId = data.id
      }

      // 2. Gestión de Alineaciones (Borrar e insertar nuevas)
      await supabase.from('match_players').delete().eq('match_id', matchId)

      const newRoster = []
      const addPlayers = (roster, side) => {
        roster.forEach(p => {
          newRoster.push({
            match_id: matchId,
            player_id: p.id,
            team_side: side,
            position: p.position
          })
        })
      }
      
      addPlayers(matchData.team_a_roster, 'A')
      addPlayers(matchData.team_b_roster, 'B')

      if (newRoster.length > 0) {
        await supabase.from('match_players').insert(newRoster)
      }

      return true // Éxito
    } catch (error) {
      throw error
    } finally {
      saving.value = false
    }
  }

  return {
    matches,
    players,
    loading,
    saving,
    fetchMatches,
    fetchPlayers,
    saveMatch
  }
}