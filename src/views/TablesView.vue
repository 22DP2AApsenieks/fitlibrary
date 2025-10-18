<template>
  <div class="table-view">
    <h1>Progress Tables</h1>
    <p>Welcome, {{ username }}!</p>

    <div class="selector">
      <label for="table-select">Choose exercise:</label>
      <select v-model="selectedTable" id="table-select" @change="fetchData">
        <option disabled value="">-- Select one --</option>
        <option v-for="table in availableTables" :key="table.value" :value="table.value">
          {{ table.name }}
        </option>
      </select>
    </div>

    <div v-if="loading" class="loading">Loading data...</div>

    <div v-if="!loading && tableData.length > 0" class="results">
      <h2>{{ currentTableName }}</h2>
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
    </div>

    <div v-if="!loading && tableData.length === 0 && selectedTable" class="no-data">
      No records found for this exercise yet.
    </div>

    <button class="back-btn" @click="$router.push('/programm')">Go Back</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "TableView",
  data() {
    return {
      username: "",
      selectedTable: "",
      tableData: [],
      loading: false,
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
      const selected = this.availableTables.find(t => t.value === this.selectedTable);
      return selected ? selected.name : "";
    },
    currentType() {
      const selected = this.availableTables.find(t => t.value === this.selectedTable);
      return selected ? selected.type : "";
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
        // Filter only current user's data
        this.tableData = res.data.filter(row => row.username === this.username);
        console.log("Fetched data:", this.tableData);
      } catch (err) {
        console.error("Fetch error:", err);
        alert("Error fetching data. Check backend logs.");
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.username = (localStorage.getItem("loggedInUser") || "nezināmais").toLowerCase();
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
