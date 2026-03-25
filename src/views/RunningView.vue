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
      expandedIndex: null,
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
  background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #0d1117 100%);
  min-height: 100vh;
  padding: 40px 20px;
  margin: 0;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

.header-banner {
  background: linear-gradient(180deg, #6a0000 0%, #310000 100%);
  padding: 30px 25px;
  border-radius: 12px;
  box-shadow: inset 0 1px 0 rgba(45, 90, 61, 0.3), 0 8px 20px rgba(0, 0, 0, 0.6);
  margin-bottom: 30px;
  border: 2px solid #000000;
  text-align: center;
}

.header-banner h1 {
  margin: 0;
  font-size: 2rem;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  font-weight: 900;
  letter-spacing: 1px;
}

.subtitle {
  margin: 10px 0 0;
  color: #b0e0c0;
  font-size: 1rem;
  font-weight: bold;
  opacity: 0.9;
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
  border: 4px solid #2d5a3d;
  border-top: 4px solid #4a9d6f;
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
  background: #2a2a2a;
  border: 1px solid #444;
  padding: 16px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.25s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
}
.exercise-button:hover { transform: translateY(-2px); background: #333333; border-color: #555; box-shadow: 0 6px 14px rgba(0, 0, 0, 0.5); }
.exercise-button.active { background: #3a3a3a; border-color: #666; color: #fff; box-shadow: 0 6px 16px rgba(0, 0, 0, 0.6); }
.button-text { text-align: left; }
.button-arrow { transition: transform 0.25s ease; }
.button-arrow.open { transform: rotate(180deg); }
.expanded-card { animation: slideDown 0.3s ease forwards; }
@keyframes slideDown { from { opacity:0; transform: translateY(-10px);} to { opacity:1; transform: translateY(0);} }
.exercise-card { background: #1a1f2e; border: 1px solid #2d453d; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.4); }
.card-header-2000s { background: linear-gradient(90deg, #3a1a1a 0%, #5a2a2a 100%); padding: 18px 20px; border-bottom: 2px solid #8a4a4a; display:flex; justify-content:space-between; align-items:center; }
.exercise-title { margin: 0; color:#ffffff; font-size:1.4rem; font-weight:800; }
.close-btn { background:transparent; border:none; color:#ffffff; font-size:1.4rem; cursor:pointer; transition: all 0.2s ease; }
.close-btn:hover { color: #ffaaaa; transform: scale(1.1); }
.card-body { padding: 20px; background: #1a1a1a; }
.input-section { margin-bottom: 20px; background: #2a2a2a; padding: 16px; border-radius:8px; border:1px solid #3a3a3a; }
.input-group { margin-bottom:14px; }
.input-group label { display:block; margin-bottom:5px; font-weight:600; color:#ffffff; }
.input-group input { width:100%; padding:10px; border:1px solid #444; border-radius:6px; font-size:1rem; background: #2a2a2a; color: #ffffff; transition: all 0.2s ease; }
.input-group input:focus { outline:none; border-color:#666; box-shadow:0 0 0 3px rgba(200, 100, 100, 0.15); background: #333333; }
.button-group { display:flex; gap:12px; flex-wrap:wrap; }
.btn-save { background: #6a3a3a; color:#ffffff; border:1px solid #8a5a5a; padding: 10px 16px; border-radius:6px; font-weight:600; cursor:pointer; transition: all 0.2s ease; box-shadow: 0 3px 8px rgba(0,0,0,0.4); }
.btn-save:hover { transform:translateY(-1px); background: #7a4a4a; box-shadow: 0 5px 12px rgba(0,0,0,0.5); }
.result-section { background: linear-gradient(135deg, #2d5a3d 0%, #1a3a28 100%); padding:14px; border-radius:8px; color:#b0e0c0; border:2px solid #4a9d6f; }
.footer-action { text-align:center; padding:20px 0; }
.btn-back { background: #6a3a3a; color: #ffffff; border:1px solid #8a5a5a; padding:12px 28px; border-radius:8px; cursor:pointer; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.4); }
.btn-back:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.5); background: #7a4a4a; }
@media (max-width:768px) { .header-banner h1{font-size:1.5rem;} .card-body{padding:18px;} .button-group{flex-direction:column;} .btn-save{width:100%;} }
</style>
