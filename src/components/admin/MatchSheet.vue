<script setup>
defineProps({ match: Object })
</script>

<template>
  <div class="acta-sheet">
    <!-- HEADER CON LOGO Y TÍTULO -->
    <div class="header-section">
      <div class="logo-container">
        <div class="soccer-ball">⚽</div>
      </div>
      <div class="title-section">
        <h1 class="main-title">SAN JOSÉ DE POALÓ</h1>
        <h2 class="subtitle">{{ match.championship || 'COPA EVOLUCIÓN 2025' }}</h2>
      </div>
    </div>

    <!-- INFORMACIÓN DEL PARTIDO -->
    <div class="match-info-grid">
      <div class="info-row">
        <div class="info-label">PARTIDO</div>
        <div class="info-value">{{ match.matchNumber || 'DÉCIMA SEGUNDA' }}</div>
      </div>
      <div class="info-row">
        <div class="info-label">ESTADIO</div>
        <div class="info-value">{{ match.stadium || match.location || 'ESTADIO PRINCIPAL' }}</div>
      </div>
      <div class="info-row">
        <div class="info-label">ÁRBITRO</div>
        <div class="info-value">{{ match.referee || '' }}</div>
      </div>
    </div>

    <div class="match-info-grid second-row">
      <div class="info-row">
        <div class="info-label">BOMBERO / LIRA</div>
        <div class="info-value">{{ match.fireman || '' }}</div>
      </div>
      <div class="info-row">
        <div class="info-label">FECHA</div>
        <div class="info-value">{{ match.date || '10/01/2025' }}</div>
      </div>
      <div class="info-row">
        <div class="info-label">HORA</div>
        <div class="info-value">{{ match.time || '16:00:00' }}</div>
      </div>
      <div class="info-row">
        <div class="info-label">CATEGORÍA</div>
        <div class="info-value">{{ match.category || 'A' }}</div>
      </div>
    </div>

    <!-- SECCIÓN DE EQUIPOS -->
    <div class="teams-section">
      <!-- EQUIPO LOCAL -->
      <div class="team-column">
        <div class="team-header local-header">
          <div class="firma-section">
            <div class="firma-label">FIRMA</div>
            <div class="firma-label">CAPITÁN</div>
          </div>
        </div>

        <table class="team-table">
          <thead>
            <tr>
              <th class="col-num">N°</th>
              <th class="col-name">APELLIDOS/NOMBRES</th>
              <th class="col-stat">GOL</th>
              <th class="col-stat">TA</th>
              <th class="col-stat">TR</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in 11" :key="i">
              <td class="col-num">{{ i }}</td>
              <td class="col-name"></td>
              <td class="col-stat"></td>
              <td class="col-stat"></td>
              <td class="col-stat"></td>
            </tr>
          </tbody>
        </table>

        <!-- SUSTITUTOS -->
        <div class="substitutes-header">
          <table class="team-table">
            <thead>
              <tr>
                <th class="col-num">N°</th>
                <th class="col-name">SUSTITUTOS</th>
                <th class="col-stat">GOL</th>
                <th class="col-stat">TA</th>
                <th class="col-stat">TR</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in 5" :key="i">
                <td class="col-num"></td>
                <td class="col-name"></td>
                <td class="col-stat"></td>
                <td class="col-stat"></td>
                <td class="col-stat"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- COLUMNA CENTRAL: CANCELAN Y RESULTADO -->
      <div class="center-column">
        <div class="cancelan-box">
          <div class="cancelan-header">
            <div class="icon-circle">🚩</div>
            <div class="cancelan-title">CANCELAN</div>
          </div>
          <div class="cancelan-content">
            <div class="team-name-box">
              <div class="team-label">NOMBRE DEL EQUIPO</div>
              <div class="team-name">{{ match.homeTeam || 'EQUIPO LOCAL' }}</div>
            </div>
          </div>
        </div>

        <div class="resultado-box">
          <div class="resultado-header">
            <div class="icon-circle">📊</div>
            <div class="resultado-title">RESULTADO FINAL</div>
          </div>
          <div class="resultado-content">
            <div class="score-display">
              <div class="score-box"></div>
              <div class="vs-text">-</div>
              <div class="score-box"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- EQUIPO VISITANTE -->
      <div class="team-column">
        <div class="team-header visitante-header">
          <div class="vocal-label">VOCAL DE MESA</div>
          <div class="firma-section">
            <div class="firma-label">FIRMA</div>
            <div class="firma-label">CAPITÁN</div>
          </div>
        </div>

        <table class="team-table">
          <thead>
            <tr>
              <th class="col-num">N°</th>
              <th class="col-name">APELLIDOS/NOMBRES</th>
              <th class="col-stat">GOL</th>
              <th class="col-stat">TA</th>
              <th class="col-stat">TR</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in 11" :key="i">
              <td class="col-num">{{ i }}</td>
              <td class="col-name"></td>
              <td class="col-stat"></td>
              <td class="col-stat"></td>
              <td class="col-stat"></td>
            </tr>
          </tbody>
        </table>

        <!-- SUSTITUTOS -->
        <div class="substitutes-header">
          <table class="team-table">
            <thead>
              <tr>
                <th class="col-num">N°</th>
                <th class="col-name">SUSTITUTOS</th>
                <th class="col-stat">GOL</th>
                <th class="col-stat">TA</th>
                <th class="col-stat">TR</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in 5" :key="i">
                <td class="col-num"></td>
                <td class="col-name"></td>
                <td class="col-stat"></td>
                <td class="col-stat"></td>
                <td class="col-stat"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- INFORME VOCAL DE MESA -->
    <div class="informe-section">
      <div class="informe-header">INFORME VOCAL DE MESA</div>
      <div class="informe-lines">
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.acta-sheet {
  width: 297mm;
  min-height: 210mm;
  padding: 15mm;
  background: white;
  color: black;
  font-family: 'Arial', sans-serif;
  box-sizing: border-box;
  position: relative;
}

/* HEADER SECTION */
.header-section {
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 3px solid #000;
  padding-bottom: 12px;
  margin-bottom: 15px;
  position: relative;
}

.logo-container {
  position: absolute;
  left: 0;
}

.soccer-ball {
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60px;
  background: white;
  border-radius: 50%;
  border: 3px solid #000;
}

.title-section {
  text-align: center;
  flex: 1;
}

.main-title {
  font-size: 28pt;
  font-weight: 900;
  letter-spacing: 3px;
  margin: 0;
  text-transform: uppercase;
  color: #000;
}

.subtitle {
  font-size: 14pt;
  font-weight: 700;
  margin: 5px 0 0 0;
  color: #d32f2f;
  text-transform: uppercase;
}

/* MATCH INFO GRID */
.match-info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 10px;
}

.match-info-grid.second-row {
  grid-template-columns: 2fr 1fr 1fr 1fr;
}

.info-row {
  border: 2px solid #000;
  background: #fff;
  min-height: 40px;
}

.info-label {
  background: #ffeb3b;
  padding: 4px 8px;
  font-size: 9pt;
  font-weight: 700;
  border-bottom: 2px solid #000;
  text-align: center;
  text-transform: uppercase;
}

.info-value {
  padding: 6px 8px;
  font-size: 10pt;
  font-weight: 600;
  text-align: center;
  min-height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* TEAMS SECTION */
.teams-section {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 12px;
  margin-bottom: 15px;
}

.team-column {
  display: flex;
  flex-direction: column;
}

.team-header {
  background: #ffeb3b;
  border: 2px solid #000;
  padding: 8px;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.local-header {
  justify-content: flex-end;
}

.visitante-header {
  justify-content: space-between;
}

.vocal-label {
  font-size: 9pt;
  font-weight: 700;
  text-transform: uppercase;
  background: white;
  padding: 4px 12px;
  border: 2px solid #000;
  border-radius: 4px;
}

.firma-section {
  display: flex;
  gap: 8px;
}

.firma-label {
  font-size: 8pt;
  font-weight: 700;
  text-transform: uppercase;
  background: white;
  padding: 4px 12px;
  border: 2px solid #000;
  border-radius: 4px;
}

/* TEAM TABLE */
.team-table {
  width: 100%;
  border-collapse: collapse;
  border: 2px solid #000;
  background: white;
}

.team-table thead {
  background: #fff;
}

.team-table th {
  border: 1px solid #000;
  padding: 6px 4px;
  font-size: 8pt;
  font-weight: 700;
  text-transform: uppercase;
  text-align: center;
}

.team-table td {
  border: 1px solid #000;
  padding: 8px 4px;
  font-size: 9pt;
  text-align: center;
}

.col-num {
  width: 40px;
}

.col-name {
  text-align: left;
  padding-left: 8px;
}

.col-stat {
  width: 40px;
}

.substitutes-header {
  margin-top: 8px;
}

/* CENTER COLUMN */
.center-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 200px;
}

.cancelan-box,
.resultado-box {
  border: 3px solid #000;
  background: white;
  display: flex;
  flex-direction: column;
}

.cancelan-header,
.resultado-header {
  background: #ffeb3b;
  padding: 8px;
  border-bottom: 3px solid #000;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.icon-circle {
  width: 30px;
  height: 30px;
  background: white;
  border: 2px solid #000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.cancelan-title,
.resultado-title {
  font-size: 10pt;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.cancelan-content {
  padding: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.team-name-box {
  text-align: center;
}

.team-label {
  font-size: 8pt;
  font-weight: 700;
  color: #666;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.team-name {
  font-size: 14pt;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #ccc;
  padding: 10px;
}

.resultado-content {
  padding: 20px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.score-display {
  display: flex;
  align-items: center;
  gap: 15px;
}

.score-box {
  width: 60px;
  height: 60px;
  border: 3px solid #000;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24pt;
  font-weight: 900;
}

.vs-text {
  font-size: 20pt;
  font-weight: 900;
  color: #666;
}

/* INFORME SECTION */
.informe-section {
  border: 2px solid #000;
  margin-top: 15px;
}

.informe-header {
  background: #ffeb3b;
  padding: 8px;
  font-size: 10pt;
  font-weight: 900;
  text-transform: uppercase;
  text-align: center;
  border-bottom: 2px solid #000;
  letter-spacing: 1px;
}

.informe-lines {
  padding: 15px;
  background: white;
}

.line {
  height: 30px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
}

/* PRINT STYLES */
@media print {
  .acta-sheet {
    width: 297mm;
    height: 210mm;
    margin: 0;
    padding: 15mm;
    page-break-after: always;
  }
  
  @page {
    size: A4 landscape;
    margin: 0;
  }
}
</style>