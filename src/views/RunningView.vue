<template>
  <div class="running-view">
    <h1>Running Tracker</h1>
    <p>Welcome, {{ username }}!</p>

    <div class="distance-section">
      <div
        class="distance-card"
        v-for="(distance, index) in distances"
        :key="index"
      >
        <h3>{{ distance.name }}</h3>

        <div class="input-group">
          <label>Time (minutes):</label>
          <input type="number" v-model.number="distance.time" min="0" />
        </div>

        <div class="input-group">
          <label>Comment:</label>
          <input
            type="text"
            v-model="distance.comment"
            placeholder="Add a note (optional)"
          />
        </div>

        <button @click="saveDistance(index)">Save {{ distance.name }}</button>
      </div>
    </div>

    <button class="back-button" @click="$router.push('/programm')">
      Go back
    </button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "RunningView",
  data() {
    return {
      username: "",
      distances: [
        { name: "1K Run", api: "add1krun", time: 0, comment: "" },
        { name: "5K Run", api: "add5krun", time: 0, comment: "" },
        { name: "10K Run", api: "add10krun", time: 0, comment: "" },
        { name: "Half Marathon", api: "addhalfmarathon", time: 0, comment: "" },
        { name: "Marathon", api: "addmarathon", time: 0, comment: "" },
      ],
    };
  },
  methods: {
    async saveDistance(index) {
      const distance = this.distances[index];

      if (!distance.time || distance.time <= 0) {
        alert("Please enter a valid time.");
        return;
      }

      const payload = {
        username: this.username,
        date: new Date().toISOString().slice(0, 10),
        time: distance.time,
        comment: distance.comment || "",
      };

      console.log(
        `📤 Sending to ${distance.api}:`,
        JSON.stringify(payload, null, 2)
      );

      try {
        const res = await axios.post(
          `http://localhost:5000/${distance.api}`,
          payload
        );
        alert(res.data.message || "Saved successfully!");
        distance.time = 0;
        distance.comment = "";
      } catch (err) {
        console.error("Save error:", err);
        alert(
          err.response?.data?.error || "❌ Error saving. Check backend logs."
        );
      }
    },
  },
  mounted() {
    this.username =
      (localStorage.getItem("loggedInUser") || "nezināmais").toLowerCase();
  },
};
</script>

<style scoped>
.running-view {
  padding: 20px;
  background: #ffffff;
  color: #333;
  min-height: 100vh;
}

.running-view h1 {
  color: #be0000;
  text-align: center;
}

.running-view p {
  text-align: center;
  color: #666;
}

.distance-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.distance-card {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 12px;
  border: 2px solid #be0000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.distance-card h3 {
  color: #be0000;
}

.input-group {
  margin: 10px 0;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.input-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

button {
  margin-top: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background: #be0000;
  color: #fff;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  background: #990000;
}

.back-button {
  background: #6c757d;
  margin-top: 20px;
}

.back-button:hover {
  background: #495057;
}
</style>
