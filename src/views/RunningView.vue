<template>
  <div class="full-background">
    <div class="container">
      <div class="header-banner">
        <h1>🏃 Running Tracker 🏃</h1>
        <p class="subtitle">Record your run time, {{ username }}!</p>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner-2000s"></div>
        <p>Loading your run entries...</p>
      </div>

      <div v-else class="content">
        <div class="exercises-list">
          <div
            v-for="(distance, index) in distances"
            :key="distance.api"
            class="exercise-item"
          >
            <button
              class="exercise-button"
              :class="{ active: expandedIndex === index }"
              @click="expandedIndex = expandedIndex === index ? null : index"
            >
              <span class="button-text">{{ distance.name }}</span>
              <span class="button-arrow" :class="{ open: expandedIndex === index }">
                ▼
              </span>
            </button>

            <div v-if="expandedIndex === index" class="exercise-card expanded-card">
              <div class="card-header-2000s">
                <h2 class="exercise-title">🏁 {{ distance.name }}</h2>
                <button class="close-btn" @click="expandedIndex = null">✕</button>
              </div>

              <div class="card-body">
                <div class="input-section">
                  <div class="input-group">
                    <label>Time (minutes):</label>
                    <input type="number" v-model.number="distance.time" min="0" placeholder="Enter run time" />
                  </div>

                  <div class="input-group">
                    <label>Comment:</label>
                    <input
                      type="text"
                      v-model="distance.comment"
                      placeholder="Add a note (optional)"
                    />
                  </div>
                </div>

                <div class="button-group">
                  <button class="btn-save" @click="saveDistance(index)">
                    Save Time
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="footer-action">
          <button @click="$router.push('/programm')" class="btn-back">
            ← Back to Dashboard
          </button>
        </div>
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
      expandedIndex: 0,
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

      console.log(`📤 Sending to ${distance.api}:`, JSON.stringify(payload, null, 2));

      try {
        const res = await axios.post(`http://localhost:5000/${distance.api}`, payload);
        alert(res.data.message || "Saved successfully!");
        distance.time = 0;
        distance.comment = "";
      } catch (err) {
        console.error("Save error:", err);
        alert(err.response?.data?.error || "❌ Error saving. Check backend logs.");
      }
    },
  },
  mounted() {
    this.username = (localStorage.getItem("loggedInUser") || "nezināmais").toLowerCase();
    this.loading = false;
  },
};
</script>

<style scoped>
.full-background {
  background: linear-gradient(135deg, #330000 0%, #660000 50%, #990000 100%);
  min-height: 100vh;
  padding: 40px 20px;
  margin: 0;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

.header-banner {
  background: linear-gradient(180deg, #630000 0%, #171616 100%);
  padding: 30px 25px;
  border-radius: 12px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 8px 20px rgba(0, 0, 0, 0.3);
  margin-bottom: 30px;
  border: 2px solid #660000;
  text-align: center;
}

.header-banner h1 {
  margin: 0;
  font-size: 2rem;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  font-weight: 900;
  letter-spacing: 1px;
}

.subtitle {
  margin: 10px 0 0;
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  opacity: 0.95;
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: #fff;
  font-size: 1.2rem;
}

.spinner-2000s {
  width: 50px;
  height: 50px;
  border: 4px solid #dd0000;
  border-top: 4px solid #ffcc00;
  border-radius: 50%;
  animation: spin-2000s 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin-2000s {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.content { display: flex; flex-direction: column; gap: 25px; }
.exercises-list { display: flex; flex-direction: column; gap: 18px; }
.exercise-item { display: flex; flex-direction: column; }
.exercise-button {
  background: linear-gradient(135deg, #660000 0%, #990000 100%);
  border: 2px solid #dd0000;
  padding: 18px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  color: #ffcc00;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.25s ease;
}
.exercise-button:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(221,0,0,0.25); }
.exercise-button.active { background: linear-gradient(135deg, #dd0000 0%, #ff3333 100%); color: #fff; }
.button-text { text-align: left; }
.button-arrow { transition: transform 0.25s ease; }
.button-arrow.open { transform: rotate(180deg); }
.expanded-card { animation: slideDown 0.3s ease forwards; }
@keyframes slideDown { from { opacity:0; transform: translateY(-10px);} to { opacity:1; transform: translateY(0);} }
.exercise-card { background: #fff; border-radius: 12px; border: 1px solid #ccc; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.15); }
.card-header-2000s { background: linear-gradient(90deg, #cc0000 0%, #ff3333 100%); padding: 18px 20px; border-bottom: 2px solid #990000; display:flex; justify-content:space-between; align-items:center; }
.exercise-title { margin: 0; color:#fff; font-size:1.4rem; font-weight:800; }
.close-btn { background:transparent; border:none; color:#fff; font-size:1.4rem; cursor:pointer; }
.card-body { padding: 20px; background: #f9f9f9; }
.input-section { margin-bottom: 20px; background: #fff; padding: 16px; border-radius:8px; border:1px solid #e0e0e0; }
.input-group { margin-bottom:14px; }
.input-group label { display:block; margin-bottom:5px; font-weight:bold; color:#333; }
.input-group input { width:100%; padding:10px; border:2px solid #ddd; border-radius:6px; font-size:1rem; }
.input-group input:focus { outline:none; border-color:#dd0000; box-shadow:0 0 0 3px rgba(221,0,0,0.1); }
.button-group { display:flex; gap:12px; flex-wrap:wrap; }
.btn-save { background: linear-gradient(180deg, #00cc00 0%, #009900 100%); color:#fff; border:none; padding: 10px 16px; border-radius:6px; font-weight:bold; cursor:pointer; }
.btn-save:hover { transform:translateY(-1px); }
.result-section { background: linear-gradient(135deg, #ffdd00 0%, #ffaa00 100%); padding:14px; border-radius:8px; color:#333; border:2px solid #cc6600; }
.footer-action { text-align:center; padding:20px 0; }
.btn-back { background: linear-gradient(180deg, #555 0%, #333 100%); color: #fff; border:2px solid #000; padding:12px 28px; border-radius:8px; cursor:pointer; }
.btn-back:hover { transform: translateY(-2px); }
@media (max-width:768px) { .header-banner h1{font-size:1.5rem;} .card-body{padding:18px;} .button-group{flex-direction:column;} .btn-save{width:100%;} }
</style>
