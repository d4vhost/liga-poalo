<script setup>
defineProps({ match: Object })
</script>

<template>
  <div class="acta-sheet">
    <div class="header">
      <h2>LIGA DEPORTIVA POALÓ</h2>
      <h3>{{ match.championship }}</h3>
      <div class="meta-info">
        <span>📅 {{ match.date }}</span>
        <span>⏰ {{ match.time }}</span>
        <span>🏆 {{ match.category }}</span>
      </div>
    </div>

    <div class="match-vs">
      <div class="team">
        <h1 class="team-name">{{ match.homeTeam || 'LOCAL' }}</h1>
        <div class="sign-box">(Firma Capitán)</div>
      </div>
      <div class="vs">VS</div>
      <div class="team">
        <h1 class="team-name">{{ match.awayTeam || 'VISITANTE' }}</h1>
        <div class="sign-box">(Firma Capitán)</div>
      </div>
    </div>

    <div class="score-section">
      <div class="score-box"></div>
      <span class="score-divider">-</span>
      <div class="score-box"></div>
    </div>

    <div class="footer-signs">
      <div class="sign-line">ÁRBITRO</div>
      <div class="sign-line">VOCAL</div>
    </div>
  </div>
</template>

<style scoped>
/* CSS Puro para garantizar impresión perfecta */
.acta-sheet {
  width: 210mm;
  min-height: 297mm;
  padding: 40px;
  background: white;
  color: black;
  font-family: Arial, sans-serif;
  box-sizing: border-box;
}
.header { text-align: center; border-bottom: 3px solid black; padding-bottom: 20px; margin-bottom: 30px; }
.header h2 { margin: 0; font-size: 24pt; text-transform: uppercase; letter-spacing: 2px; }
.header h3 { margin: 10px 0; font-size: 16pt; color: #444; }
.meta-info { display: flex; justify-content: space-between; font-weight: bold; margin-top: 15px; border: 1px solid #ddd; padding: 10px; }
.match-vs { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; }
.team { width: 40%; text-align: center; }
.team-name { font-size: 18pt; text-transform: uppercase; margin-bottom: 15px; }
.sign-box { border: 2px dashed #999; height: 60px; display: flex; align-items: flex-end; justify-content: center; font-size: 10pt; color: #666; padding-bottom: 5px; }
.vs { font-size: 40pt; font-weight: bold; color: #ccc; }
.score-section { text-align: center; margin-bottom: 60px; }
.score-box { display: inline-block; width: 80px; height: 80px; border: 3px solid black; vertical-align: middle; }
.score-divider { font-size: 40pt; margin: 0 20px; vertical-align: middle; }
.footer-signs { display: flex; justify-content: space-around; margin-top: 100px; }
.sign-line { border-top: 2px solid black; width: 200px; text-align: center; padding-top: 10px; font-weight: bold; }
</style>