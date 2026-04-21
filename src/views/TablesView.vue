<template>
  <div class="full-background">
    <div class="container">
      <div class="header-banner">
        <h1>📊 Progresa tabulas</h1>
        <p class="subtitle">
          Pārskati savu progresu un attīstību, {{ username }}!
        </p>
      </div>

      <div class="inner-card">

        <!-- GRUPAS -->
        <div class="group-list">
          <div v-for="group in groupedTables" :key="group.name" class="group-card">
            <div class="group-title-row">
              <span class="group-icon">{{ group.icon }}</span>
              <div>
                <h3>{{ group.name }}</h3>
                <p>{{ group.description }}</p>
              </div>
            </div>

            <div class="group-buttons">
              <button
                v-for="item in group.items"
                :key="item.value"
                :class="['exercise-card-btn', selectedTable === item.value ? 'active' : '']"
                @click="selectTable(item.value)"
              >
                • {{ item.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- IELĀDE -->
        <div v-if="loading" class="loading-state">
          <div class="spinner-2000s"></div>
          <p>Ielādē datus...</p>
        </div>

        <!-- DATI -->
        <div v-else>
          <div v-if="selectedTable" class="selected-label">
            Izvēlēts: {{ currentTableName }}
          </div>

          <div v-if="tableData.length > 0">
            <table>
              <thead>
                <tr>
                  <th>Datums</th>
                  <th v-if="currentType === 'reps'">Atkārtojumi</th>
                  <th v-else-if="currentType === 'runtime'">Laiks</th>
                  <th v-else>1RM</th>
                  <th>Komentārs</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(row, i) in tableData" :key="i">
                  <td>{{ formatDate(row.date) }}</td>
                  <td v-if="row.reps">{{ row.reps }}</td>
                  <td v-else-if="row.runtime">{{ row.runtime }}</td>
                  <td v-else>{{ row.oneRepMax }}</td>
                  <td>{{ row.comment || '-' }}</td>
                </tr>
              </tbody>
            </table>

            <div class="chart-container">
              <canvas ref="chartCanvas"></canvas>
            </div>
          </div>

          <div v-if="selectedTable && tableData.length === 0">
            Vēl nav datu.
          </div>
        </div>

        <!-- 🤖 AI TRENERIS -->
        <div v-if="aiTips.length" class="ai-box">
          <h3>🤖 AI treneris</h3>
          <ul>
            <li v-for="(tip, i) in aiTips" :key="i">{{ tip }}</li>
          </ul>
        </div>

        <div class="footer-action">
          <button @click="$router.push('/programm')">
            ← Atpakaļ
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default {
  data() {
    return {
      username: "",
      selectedTable: "",
      tableData: [],
      loading: false,
      chart: null,

      availableTables: [
        { name: "Pievilkšanās", value: "pullups", type: "reps", group: "Bodyweight" },
        { name: "Dipsi", value: "dips", type: "reps", group: "Bodyweight" },
        { name: "Pietupieni", value: "squat", type: "reps", group: "Bodyweight" },

        { name: "Spiešana guļus", value: "benchpress", type: "1rm", group: "Gym" },
        { name: "Deadlift", value: "deadlift", type: "1rm", group: "Gym" },
        { name: "Pietupieni (gym)", value: "gymsquat", type: "1rm", group: "Gym" },
        { name: "Plecu spiešana", value: "overheadpress", type: "1rm", group: "Gym" },
        { name: "Lat pulldown", value: "latpulldown", type: "1rm", group: "Gym" },

        { name: "Skrējiens 1km", value: "run_1km", type: "runtime", group: "Running" },
        { name: "Skrējiens 5km", value: "run_5km", type: "runtime", group: "Running" },
        { name: "Skrējiens 10km", value: "run_10km", type: "runtime", group: "Running" },
        { name: "Pusmaratons", value: "run_halfmarathon", type: "runtime", group: "Running" },
        { name: "Maratons", value: "run_marathon", type: "runtime", group: "Running" },
      ],
    };
  },

  computed: {
    groupedTables() {
      const groups = {
        Bodyweight: { name: "Svars ar ķermeni", icon: "💪", description: "Treniņi ar savu svaru", items: [] },
        Gym: { name: "Zāle", icon: "🏋️", description: "Spēka treniņi", items: [] },
        Running: { name: "Skriešana", icon: "🏃", description: "Ātrums un izturība", items: [] },
      };

      this.availableTables.forEach((item) => {
        groups[item.group].items.push(item);
      });

      return Object.values(groups);
    },

    currentTableName() {
      const t = this.availableTables.find((t) => t.value === this.selectedTable);
      return t ? t.name : "";
    },

    currentType() {
      const t = this.availableTables.find((t) => t.value === this.selectedTable);
      return t ? t.type : "";
    },

    aiTips() {
      if (!this.tableData.length) return [];

      const tips = [];

      const first = this.tableData[0];
      const last = this.tableData[this.tableData.length - 1];

      const firstVal = first.reps || first.runtime || first.oneRepMax || 0;
      const lastVal = last.reps || last.runtime || last.oneRepMax || 0;

      const diff = lastVal - firstVal;

      if (this.currentType === "runtime") {
        if (diff < 0) {
          tips.push("🔥 Tavs skriešanas laiks uzlabojas — turpini!");
        } else if (diff > 0) {
          tips.push("⚠️ Laiks pasliktinājās — pievērs uzmanību atjaunošanai.");
        } else {
          tips.push("➖ Nav izmaiņu — mēģini palielināt intensitāti.");
        }
      } else {
        if (diff > 0) {
          tips.push("💪 Spēks aug — lieliski!");
        } else if (diff < 0) {
          tips.push("⚠️ Spēks samazinājās — pārbaudi atpūtu un uzturu.");
        } else {
          tips.push("➖ Plateau — palielini svaru vai atkārtojumus.");
        }
      }

      if (this.tableData.length < 3) {
        tips.push("📊 Pievieno vairāk treniņu datu.");
      } else {
        tips.push("📈 Laba konsekvence — turpini!");
      }

      return tips;
    },
  },

  methods: {
    formatDate(d) {
      return new Date(d).toLocaleDateString();
    },

    selectTable(val) {
      this.selectedTable = val;
      this.fetchData();
    },

    async fetchData() {
      if (!this.selectedTable) return;

      this.loading = true;
      this.tableData = [];

      try {
        const res = await axios.get(
          `http://localhost:5000/${this.selectedTable}`
        );

        this.tableData = res.data
          .filter(
            (row) =>
              row.username &&
              row.username.toLowerCase() === this.username
          )
          .map((row) => ({
            ...row,
            runtime: row.time || row.runtime,
          }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        this.$nextTick(() => {
          this.renderChart();
        });
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        this.loading = false;
      }
    },

    renderChart() {
      if (!this.$refs.chartCanvas || !this.tableData.length) return;

      if (this.chart) this.chart.destroy();

      const ctx = this.$refs.chartCanvas.getContext("2d");

      this.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: this.tableData.map((r) =>
            this.formatDate(r.date)
          ),
          datasets: [
            {
              data: this.tableData.map(
                (r) => r.reps || r.runtime || r.oneRepMax || 0
              ),
              borderColor: "red",
              tension: 0.3,
            },
          ],
        },
      });
    },
  },

  mounted() {
    this.username =
      (localStorage.getItem("loggedInUser") || "nezināmais").toLowerCase();
  },
};
</script>

<style scoped>
.full-background {
  background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #0d1117 100%);
  min-height: 100vh;
  padding: 30px 10px 20px;
}

.container {
  width: min(100%, 980px);
  margin: 0 auto;
}

.header-banner {
  background: linear-gradient(180deg, #3a1a1a 0%, #5a2a2a 100%);
  border-radius: 12px;
  padding: 20px 18px;
  border: 1px solid #8a4a4a;
  color: #fff;
  text-align: center;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.5);
}

.header-banner h1 {
  margin: 0;
  font-size: 2rem;
  letter-spacing: 1px;
  text-shadow: 2px 2px 3px rgba(0, 0, 0, 0.8);
}

.subtitle {
  margin: 8px 0 0;
  font-weight: 700;
  opacity: 0.9;
  color: #e0e0e0;
}

.inner-card {
  margin-top: 20px;
  border-radius: 14px;
  background: #1a1a1a;
  padding: 18px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
  border: 1px solid #2a2a2a;
}

.group-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 14px;
  margin-bottom: 20px;
}

.group-card {
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 12px;
  padding: 14px;
}

.group-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.group-icon {
  display: inline-flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #3a2a2a;
  border: 1px solid #8a4a4a;
  font-size: 1rem;
}

.group-card h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #ffffff;
}

.group-card p {
  margin: 4px 0 0;
  font-size: 0.9rem;
  color: #b0b0b0;
}

.group-buttons {
  margin-top: 12px;
  display: grid;
  gap: 8px;
}

.exercise-card-btn {
  text-align: left;
  border: 1px solid #444;
  background: #2a2a2a;
  border-radius: 8px;
  padding: 8px 12px;
  font-weight: 600;
  color: #e0e0e0;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: 0.2px;
}

.exercise-card-btn:hover {
  background: #333333;
  border-color: #666;
}

.exercise-card-btn.active {
  background: #6a3a3a;
  border-color: #8a4a4a;
  box-shadow: 0 4px 10px rgba(138, 74, 74, 0.3);
  color: #ffffff;
}

.item-dot { color: #8a4a4a; margin-right: 6px; }

.selected-label {
  font-weight: 700;
  color: #e0e0e0;
  margin: 8px 0 10px;
  font-size: 0.95rem;
}

.loading-state {
  text-align: center;
  color: #e0e0e0;
  padding: 24px;
}

.spinner-2000s {
  width: 42px;
  height: 42px;
  border: 4px solid #444;
  border-top: 4px solid #8a4a4a;
  border-radius: 50%;
  animation: spin-2000s 1s linear infinite;
  margin: 0 auto 10px;
}

@keyframes spin-2000s { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.result-header h2 { margin: 0; color: #ffffff; }

.summary-pill {
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 10px;
  padding: 10px 12px;
  display: inline-flex;
  gap: 10px;
  font-weight: 600;
  color: #e0e0e0;
}

.table-wrap { overflow-x: auto; margin-top: 12px; border-radius: 10px; border: 1px solid #444; }

table { width: 100%; border-collapse: collapse; }

th, td {
  padding: 10px 12px;
  border-bottom: 1px solid #444;
  text-align: center;
  color: #e0e0e0;
}

th {
  background: #2a2a2a;
  color: #ffffff;
  font-weight: 700;
}

tbody tr:hover { background: #2a2a2a; }

.runtime-good { background: #ecfdf3 !important; color: #065f46; }
.runtime-bad { background: #fef2f2 !important; color: #b91c1c; }

.chart-container {
  width: 100%;
  min-height: 330px;
  margin-top: 18px;
  border-radius: 10px;
  background: #2a2a2a;
  border: 1px solid #444;
  padding: 8px;
}

.no-data {
  text-align: center;
  margin: 18px 0;
  font-style: italic;
  color: #b0b0b0;
}

/* AI BOX */
.ai-box {
  margin-top: 18px;
  background: #1e2a1e;
  border: 1px solid #2d4a2d;
  border-radius: 12px;
  padding: 14px 18px;
}

.ai-box h3 {
  margin: 0 0 10px;
  color: #86efac;
  font-size: 1rem;
}

.ai-box ul {
  margin: 0;
  padding-left: 18px;
  color: #d1fae5;
  font-size: 0.95rem;
  line-height: 1.6;
}

/* AI CHAT */
.ai-chat {
  margin-top: 16px;
  background: #1a1e2e;
  border: 1px solid #2a3a5a;
  border-radius: 12px;
  padding: 14px 18px;
}

.ai-chat h3 {
  margin: 0 0 10px;
  color: #93c5fd;
  font-size: 1rem;
}

.ai-chat-row {
  display: flex;
  gap: 8px;
}

.ai-chat input {
  flex: 1;
  background: #2a2a3a;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 9px 12px;
  color: #e0e0e0;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}

.ai-chat input:focus {
  border-color: #6a8aaa;
}

.ai-chat button {
  background: #3a5a8a;
  color: #fff;
  border: 1px solid #4a6a9a;
  border-radius: 8px;
  padding: 9px 18px;
  cursor: pointer;
  font-weight: 700;
  transition: background 0.2s;
  min-width: 64px;
}

.ai-chat button:hover:not(:disabled) {
  background: #4a6aaa;
}

.ai-chat button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ai-answer {
  margin: 12px 0 0;
  color: #bfdbfe;
  font-size: 0.95rem;
  line-height: 1.6;
  border-top: 1px solid #2a3a5a;
  padding-top: 10px;
}

.footer-action { text-align: center; margin-top: 18px; }

.btn-back {
  background: #6a3a3a;
  color: #fff;
  border: 1px solid #8a5a5a;
  border-radius: 8px;
  padding: 12px 24px;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.btn-back:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5); background: #7a4a4a; }

@media (max-width: 800px) {
  .header-banner h1 { font-size: 1.6rem; }
  .summary-pill { width: 100%; justify-content: center; }
  .chart-container { min-height: 280px; }
  .ai-chat-row { flex-direction: column; }
}
</style>