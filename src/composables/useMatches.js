import { ref } from 'vue'
import { supabase } from '../services/supabase'

export function useMatches() {
  const matches = ref([])
  const players = ref([])
  const loading = ref(false)
  const saving = ref(false)

  const fetchMatches = async () => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`*, match_players(team_side, position, profiles:player_id(id, nombres, email, cedula))`)
        .order('date', { ascending: true })

      if (error) throw error
      matches.value = data.map(match => {
        const mapPlayers = (side) => match.match_players
          .filter(mp => mp.team_side === side && mp.profiles)
          .map(mp => ({ ...mp.profiles, position: mp.position }))
        return { ...match, team_a_roster: mapPlayers('A'), team_b_roster: mapPlayers('B') }
      })
    } catch (error) { console.error(error) } finally { loading.value = false }
  }

  const fetchPlayers = async () => {
    const { data } = await supabase.from('profiles').select('id, nombres, cedula, role').in('role', ['jugador', 'arbitro']).eq('status', 'activo').order('nombres')
    if (data) players.value = data
  }

  const saveMatch = async (matchData) => {
    saving.value = true
    try {
      const basicData = {
        team_a_name: matchData.team_a_name,
        team_b_name: matchData.team_b_name,
        date: matchData.date,
        time: matchData.time,
        location: matchData.location,
        status: matchData.status,
        game_type: '11v11'
      }
      let matchId = matchData.id
      if (matchId) {
        await supabase.from('matches').update(basicData).eq('id', matchId)
      } else {
        const { data } = await supabase.from('matches').insert(basicData).select().single()
        matchId = data.id
      }
      await supabase.from('match_players').delete().eq('match_id', matchId)
      const newRoster = []
      const add = (r, s) => r.forEach(p => newRoster.push({ match_id: matchId, player_id: p.id, team_side: s, position: p.position }))
      add(matchData.team_a_roster, 'A'); add(matchData.team_b_roster, 'B')
      if (newRoster.length > 0) await supabase.from('match_players').insert(newRoster)
    } catch (error) { throw error } finally { saving.value = false }
  }

  return { matches, players, loading, saving, fetchMatches, fetchPlayers, saveMatch }
}