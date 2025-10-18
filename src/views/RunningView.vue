<template>
  <div class="full-background">
    <div class="running-view">
      <h1>Running View</h1>
      <p>Welcome, {{ username }}!</p>

      <div v-if="loading">Loading data...</div>

      <div v-else>
        <div
          class="run-section"
          v-for="(run, index) in runs"
          :key="index"
        >
          <h3>{{ run.name }}</h3>

          <!-- Input field -->
          <div class="input-group">
            <label>Time (minutes):</label>
            <input type="number" v-model.number="run.time" min="0" />
          </div>

          <!-- Save button -->
          <button @click="saveRun(index)">Save Time</button>
        </div>

        <button class="back-button" @click="$router.push('/programm')">
          Go back
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "RunningView",
  data() {
    return {
      username: "",
      loading: true,
      runs: [
        { name: "1 km", api: "run_1km", time: 0 },
        { name: "5 km", api: "run_5km", time: 0 },
        { name: "10 km", api: "run_10km", time: 0 },
        { name: "Half Marathon", api: "run_halfmarathon", time: 0 },
        { name: "Marathon", api: "run_marathon", time: 0 },
      ],
    };
  },
  methods: {
    async saveRun(index) {
      const run = this.runs[index];

      if (!run.time || run.time <= 0) {
        alert("Please enter a valid running time before saving.");
        return;
      }

      const payload = {
        username: this.username,
        date: new Date().toISOString().slice(0, 10),
        runtime: run.time,
      };

      console.log(`📤 Sending to ${run.api}:`, JSON.stringify(payload, null, 2));

      try {
        const res = await axios.post(
          `http://localhost:5000/add${run.api}`,
          payload
        );
        console.log("✅ Response:", res.data);
        alert(res.data.message || "Saved successfully!");
      } catch (err) {
        console.error("❌ Save error:", err);
        alert(
          err.response?.data?.error || "Error saving run time. Check backend logs."
        );
      }
    },
  },
  mounted() {
    this.username =
      (localStorage.getItem("loggedInUser") || "nezināmais").toLowerCase();
    this.loading = false;
  },
};
</script>

<style scoped>
.full-background {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f5f5;
}

.running-view {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 600px;
}

.run-section {
  border-bottom: 1px solid #ddd;
  padding: 15px 0;
}

.input-group {
  margin: 8px 0;
}

button {
  margin-top: 8px;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background: #28a745;
  color: #fff;
  cursor: pointer;
}

button:hover {
  background: #218838;
}

.back-button {
  margin-top: 20px;
  background: #6c757d;
}

.back-button:hover {
  background: #495057;
}
</style>
