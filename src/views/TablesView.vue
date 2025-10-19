<template>
  <div class="table-view">
    <h1>Progress Tables</h1>
    <p>Welcome, {{ username }}!</p>

    <div class="selector">
      <label for="table-select">Choose exercise:</label>
      <select v-model="selectedTable" id="table-select" @change="fetchData">
        <option disabled value="">-- Select one --</option>
        <option
          v-for="table in availableTables"
          :key="table.value"
          :value="table.value"
        >
          {{ table.name }}
        </option>
      </select>
    </div>

    <div v-if="loading" class="loading">Loading data...</div>

    <div v-if="!loading && tableData.length > 0" class="results">
      <h2>{{ currentTableName }}</h2>

      <!-- Summary section -->
      <div class="summary">
        <p>
          Tracking since:
          <strong>{{ trackingDuration }}</strong>
        </p>
        <p>
          Average monthly progress:
          <strong
            :style="{ color: progressColor }"
          >
            {{ monthlyProgressDisplay }}
          </strong>
        </p>
      </div>

      <!-- Table -->
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th v-if="currentType === 'reps'">Reps</th>
            <th v-else-if="currentType === 'runtime'">Time (min)</th>
            <th v-else>1RM (kg)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in tableData" :key="index">
            <td>{{ formatDate(row.date) }}</td>
            <td v-if="row.reps">{{ row.reps }}</td>
            <td v-else-if="row.runtime">{{ row.runtime }}</td>
            <td v-else>{{ row.oneRepMax }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Chart -->
      <div class="chart-container">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>

    <div
      v-if="!loading && tableData.length === 0 && selectedTable"
      class="no-data"
    >
      No records found for this exercise yet.
    </div>

    <button class="back-btn" @click="$router.push('/programm')">Go Back</button>
  </div>
</template>

<script>
import axios from "axios";
import { Chart, registerables } from "chart.js";
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
      availableTables: [
        { name: "Pull-ups", value: "pullups", type: "reps" },
        { name: "Dips", value: "dips", type: "reps" },
        { name: "Squat", value: "squat", type: "reps" },
        { name: "Bench Press", value: "benchpress", type: "1rm" },
        { name: "Deadlift", value: "deadlift", type: "1rm" },
        { name: "Gym Squat", value: "gymsquat", type: "1rm" },
        { name: "Overhead Press", value: "overheadpress", type: "1rm" },
        { name: "Lat Pulldown", value: "latpulldown", type: "1rm" },
        { name: "Run 1km", value: "run_1km", type: "runtime" },
        { name: "Run 5km", value: "run_5km", type: "runtime" },
        { name: "Run 10km", value: "run_10km", type: "runtime" },
        { name: "Half Marathon", value: "run_halfmarathon", type: "runtime" },
        { name: "Marathon", value: "run_marathon", type: "runtime" },
      ],
    };
  },
  computed: {
    currentTableName() {
      const selected = this.availableTables.find(
        (t) => t.value === this.selectedTable
      );
      return selected ? selected.name : "";
    },
    currentType() {
      const selected = this.availableTables.find(
        (t) => t.value === this.selectedTable
      );
      return selected ? selected.type : "";
    },
    monthlyProgressDisplay() {
      if (this.currentType === "runtime") {
        return `${this.monthlyProgress.toFixed(2)} min/month`;
      } else if (this.currentType === "1rm") {
        return `${this.monthlyProgress.toFixed(2)} kg/month`;
      } else {
        return `${this.monthlyProgress.toFixed(2)} reps/month`;
      }
    },
  },
  methods: {
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString();
    },

    async fetchData() {
      if (!this.selectedTable) return;
      this.loading = true;
      this.tableData = [];

      try {
        const res = await axios.get(`http://localhost:5000/${this.selectedTable}`);
        this.tableData = res.data
          .filter((row) => row.username === this.username)
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        this.calculateProgress();
      } catch (err) {
        console.error("Fetch error:", err);
        alert("Error fetching data. Check backend logs.");
      } finally {
        this.loading = false;
      }
    },

    calculateProgress() {
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
      const months =
        (lastDate - firstDate) / (1000 * 60 * 60 * 24 * 30.44) || 1;

      const firstVal =
        first.reps || first.oneRepMax || first.runtime || 0;
      const lastVal =
        last.reps || last.oneRepMax || last.runtime || 0;
      let diff = lastVal - firstVal;

      // For runtimes, improvement means smaller time
      if (this.currentType === "runtime") diff = -diff;

      this.monthlyProgress = diff / months;

      // Duration string
      const days = Math.floor((lastDate - firstDate) / (1000 * 60 * 60 * 24));
      const totalMonths = Math.floor(days / 30);
      const remainingDays = days % 30;
      this.trackingDuration = `${totalMonths} months ${remainingDays} days`;

      this.progressColor = this.getColorByProgress(this.monthlyProgress);
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
      } else {
        // runtime (lower is better)
        if (rate < -1) return "#065f46";
        if (rate < -0.5) return "#22c55e";
        if (rate < 0.5) return "#9ca3af";
        if (rate < 1) return "#ef4444";
        return "#7f1d1d";
      }
    },

    renderChart() {
      if (this.chart) this.chart.destroy();

      if (!this.$refs.chartCanvas) return;

      const labels = this.tableData.map((row) => this.formatDate(row.date));
      const values = this.tableData.map(
        (row) => row.reps || row.runtime || row.oneRepMax || 0
      );

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
          scales: {
            y: { beginAtZero: true },
          },
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
    this.username = (
      localStorage.getItem("loggedInUser") || "nezināmais"
    ).toLowerCase();
  },
};
</script>

<style scoped>
.table-view {
  background: #fff;
  margin: 40px auto;
  padding: 20px;
  border-radius: 12px;
  width: 80%;
  max-width: 900px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.selector {
  margin: 20px 0;
}

.loading,
.no-data {
  text-align: center;
  margin-top: 20px;
  font-style: italic;
}

.summary {
  background: #f9fafb;
  border-radius: 8px;
  padding: 10px 15px;
  margin-top: 15px;
  margin-bottom: 15px;
}

.summary p {
  margin: 4px 0;
  font-size: 1.1em;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  padding: 8px 12px;
  border-bottom: 1px solid #ddd;
  text-align: center;
}

th {
  background-color: #f0f0f0;
}

.chart-container {
  width: 100%;
  height: 400px;
  margin: 40px auto 0;
}

button.back-btn {
  margin-top: 30px;
  padding: 8px 16px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

button.back-btn:hover {
  background: #495057;
}
</style>
