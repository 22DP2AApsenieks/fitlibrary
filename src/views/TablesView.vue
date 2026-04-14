<template>
  <div class="full-background">
    <div class="container">
      <div class="header-banner">
        <h1>📊 Progress Tables</h1>
        <p class="subtitle">Review your progress and chart growth, {{ username }}!</p>
      </div>

      <div class="inner-card">
        <div class="group-list">
          <div v-for="group in groupedTables" :key="group.name" class="group-card">
            <div class="group-header">
              <div class="group-title-row">
                <span class="group-icon">{{ group.icon }}</span>
                <div>
                  <h3>{{ group.name }}</h3>
                  <p>{{ group.description }}</p>
                </div>
              </div>
            </div>
            <div class="group-buttons">
              <button
                v-for="item in group.items"
                :key="item.value"
                :class="['exercise-card-btn', selectedTable === item.value ? 'active' : '']"
                @click="selectTable(item.value)"
              >
                <span class="item-dot">•</span> {{ item.name }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="loading" class="loading-state">
          <div class="spinner-2000s"></div>
          <p>Loading data ...</p>
        </div>

        <div v-else>
          <div v-if="selectedTable" class="selected-label">Selected: {{ currentTableName }}</div>
          <div v-if="tableData.length > 0" class="results">
            <div class="result-header">
              <h2>{{ currentTableName }}</h2>
              <div class="summary-pill">
                <span>Tracking: {{ trackingDuration }}</span>
                <span :style="{ color: progressColor }">{{ monthlyProgressDisplay }}</span>
              </div>
            </div>

            <div class="insights-card">
              <h3>Training Tips</h3>
              <ul>
                <li v-for="(tip, index) in aiTips" :key="index">{{ tip }}</li>
              </ul>
            </div>

            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th v-if="currentType === 'reps'">Reps</th>
                    <th v-else-if="currentType === 'runtime'">Time (min)</th>
                    <th v-if="currentType === 'runtime'">Change</th>
                    <th v-else>1RM (kg)</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, index) in tableData"
                    :key="index"
                    :class="getRowClass(index, row)"
                  >
                    <td>{{ formatDate(row.date) }}</td>
                    <td v-if="row.reps">{{ row.reps }}</td>
                    <td v-else-if="row.runtime">{{ row.runtime }}</td>
                    <td v-if="currentType === 'runtime'">
                      <span :class="getDeltaClass(index)">
                        {{ getDelta(index) }}
                      </span>
                    </td>
                    <td v-else>{{ row.oneRepMax }}</td>
                    <td>{{ row.comment || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="chart-container">
              <canvas ref="chartCanvas"></canvas>
            </div>
          </div>

          <div v-if="!loading && tableData.length === 0 && selectedTable" class="no-data">
            No records found yet. Run or lift and check again!
          </div>
        </div>

        <div class="footer-action">
          <button class="btn-back" @click="$router.push('/programm')">← Back to Dashboard</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Chart, registerables } from "chart.js";
import { generateWorkoutTips } from "@/utils/workoutAI";
Chart.register(...registerables);

export default {
  name: "TableView",
  data() {
    return {
      username: "",
      selectedTable: "",
      tableData: [],
      loading: false,
      chart: null,
      monthlyProgress: 0,
      progressColor: "#9ca3af",
      trackingDuration: "",
      aiTips: [],
      availableTables: [
        { name: "Pull-ups", value: "pullups", type: "reps", group: "Bodyweight" },
        { name: "Dips", value: "dips", type: "reps", group: "Bodyweight" },
        { name: "Squat", value: "squat", type: "reps", group: "Bodyweight" },
        { name: "Bench Press", value: "benchpress", type: "1rm", group: "Gym" },
        { name: "Deadlift", value: "deadlift", type: "1rm", group: "Gym" },
        { name: "Gym Squat", value: "gymsquat", type: "1rm", group: "Gym" },
        { name: "Overhead Press", value: "overheadpress", type: "1rm", group: "Gym" },
        { name: "Lat Pulldown", value: "latpulldown", type: "1rm", group: "Gym" },
        { name: "Run 1km", value: "run_1km", type: "runtime", group: "Running" },
        { name: "Run 5km", value: "run_5km", type: "runtime", group: "Running" },
        { name: "Run 10km", value: "run_10km", type: "runtime", group: "Running" },
        { name: "Half Marathon", value: "run_halfmarathon", type: "runtime", group: "Running" },
        { name: "Marathon", value: "run_marathon", type: "runtime", group: "Running" },
      ],
    };
  },
  computed: {
    groupedTables() {
      const groups = [
        { name: "Bodyweight", description: "Pull-up and dips progression.", icon: "💪", items: [] },
        { name: "Gym", description: "Track your 1RM lifts.", icon: "🏋️", items: [] },
        { name: "Running", description: "Time-based running metrics.", icon: "🏃", items: [] },
      ];
      this.availableTables.forEach((item) => {
        const group = groups.find((g) => g.name === item.group);
        if (group) group.items.push(item);
      });
      return groups;
    },
    currentTableName() {
      const selected = this.availableTables.find((t) => t.value === this.selectedTable);
      return selected ? selected.name : "";
    },
    currentType() {
      const selected = this.availableTables.find((t) => t.value === this.selectedTable);
      return selected ? selected.type : "";
    },
    monthlyProgressDisplay() {
      if (this.currentType === "runtime") {
        return `${this.monthlyProgress.toFixed(2)} min/month`;
      } else if (this.currentType === "1rm") {
        const sign = this.monthlyProgress >= 0 ? "+" : "";
        return `${sign}${this.monthlyProgress.toFixed(2)} kg/month`;
      }
      const sign = this.monthlyProgress >= 0 ? "+" : "";
      return `${sign}${this.monthlyProgress.toFixed(2)} reps/month`;
    },
  },
  methods: {
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString();
    },
    getDelta(index) {
      if (this.currentType !== "runtime") return "";
      if (index === 0) return "-";
      const current = this.tableData[index]?.runtime;
      const prev = this.tableData[index - 1]?.runtime;
      if (current == null || prev == null) return "-";
      const delta = current - prev;
      return delta > 0 ? `+${delta.toFixed(2)} min` : `${delta.toFixed(2)} min`;
    },
    getDeltaClass(index) {
      if (this.currentType !== "runtime" || index === 0) return "";
      const current = this.tableData[index]?.runtime;
      const prev = this.tableData[index - 1]?.runtime;
      if (current == null || prev == null) return "";
      const delta = current - prev;
      if (delta < 0) return "runtime-good";
      if (delta > 0) return "runtime-bad";
      return "";
    },
    selectTable(value) {
      this.selectedTable = value;
      this.fetchData();
    },
    async fetchData() {
      if (!this.selectedTable) return;
      this.loading = true;
      this.tableData = [];
      try {
        const res = await axios.get(`http://localhost:5000/${this.selectedTable}`);
        this.tableData = res.data
          .filter((row) => row.username === this.username)
          .map((row) => ({ ...row, runtime: row.time || row.runtime }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        await this.calculateProgress();
      } catch (err) {
        console.error("Fetch error:", err);
        alert("Error fetching data. Check backend logs.");
      } finally {
        this.loading = false;
      }
    },
    async calculateProgress() {
      if (this.tableData.length < 2) {
        this.monthlyProgress = 0;
        this.trackingDuration = "Not enough data";
        this.progressColor = "#9ca3af";
        return;
      }
      const first = this.tableData[0];
      const last = this.tableData[this.tableData.length - 1];
      const firstDate = new Date(first.date);
      const lastDate = new Date(last.date);
      const months = (lastDate - firstDate) / (1000 * 60 * 60 * 24 * 30.44) || 1;
      const firstVal = first.reps || first.oneRepMax || first.runtime || 0;
      const lastVal = last.reps || last.oneRepMax || last.runtime || 0;
      let diff = lastVal - firstVal;
      if (this.currentType === "runtime") {
        // runtime improvement is when lower time; keep monthlyProgress as negative delta (lower is better)
        this.monthlyProgress = (lastVal - firstVal) / months;
      } else {
        this.monthlyProgress = diff / months;
      }
      const days = Math.floor((lastDate - firstDate) / (1000 * 60 * 60 * 24));
      const totalMonths = Math.floor(days / 30);
      const remainingDays = days % 30;
      this.trackingDuration = `${totalMonths} months ${remainingDays} days`;
      this.progressColor = this.getColorByProgress(this.monthlyProgress);
      this.aiTips = generateWorkoutTips({
        tableData: this.tableData,
        selectedTable: this.selectedTable,
        currentType: this.currentType,
        monthlyProgress: this.monthlyProgress,
      });
    },
    getRowClass(index, row) {
      if (this.currentType !== "runtime" || !row.runtime) return "";
      if (index === 0) return "";
      const prev = this.tableData[index - 1];
      if (!prev || prev.runtime == null) return "";
      if (row.runtime < prev.runtime) return "runtime-good";
      if (row.runtime > prev.runtime) return "runtime-bad";
      return "";
    },
    getColorByProgress(rate) {
      if (this.currentType === "reps") {
        if (rate > 5) return "#065f46";
        if (rate > 2) return "#22c55e";
        if (rate >= -1) return "#9ca3af";
        if (rate > -5) return "#ef4444";
        return "#7f1d1d";
      } else if (this.currentType === "1rm") {
        if (rate > 5) return "#065f46";
        if (rate > 2) return "#22c55e";
        if (rate >= -1) return "#9ca3af";
        if (rate > -5) return "#ef4444";
        return "#7f1d1d";
      }
      if (rate < -1) return "#065f46";
      if (rate < -0.5) return "#22c55e";
      if (rate < 0.5) return "#9ca3af";
      if (rate < 1) return "#ef4444";
      return "#7f1d1d";
    },
    renderChart() {
      if (this.chart) this.chart.destroy();
      if (!this.$refs.chartCanvas) return;
      const labels = this.tableData.map((row) => this.formatDate(row.date));
      const values = this.tableData.map((row) => row.reps || row.runtime || row.oneRepMax || 0);
      const ctx = this.$refs.chartCanvas.getContext("2d");
      this.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: `${this.currentTableName} Progress`,
              data: values,
              borderColor: this.progressColor,
              backgroundColor: `${this.progressColor}33`,
              tension: 0.3,
              fill: true,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true } },
        },
      });
    },
  },
  watch: {
    async tableData(newData) {
      if (newData.length > 0) {
        await this.$nextTick();
        this.renderChart();
      } else if (this.chart) {
        this.chart.destroy();
      }
    },
  },
  mounted() {
    this.username = (localStorage.getItem("loggedInUser") || "nezināmais").toLowerCase();
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

    .insights-card {
      background: #11151f;
      border: 1px solid #444;
      border-radius: 12px;
      padding: 14px 16px;
      margin-bottom: 16px;
      color: #e0e0e0;
    }

    .insights-card h3 {
      margin: 0 0 10px;
      font-size: 1.05rem;
      color: #fff;
    }

    .insights-card ul {
      margin: 0;
      padding-left: 18px;
      color: #cbd5e1;
    }

    .insights-card li {
      margin-bottom: 8px;
      line-height: 1.4;
    }

    .summary-pill {
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
}
</style>
