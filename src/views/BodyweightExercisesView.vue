<template>
  <div class="full-background">
    <div class="container">
      <div class="header-banner">
        <h1>💪 BODYWEIGHT EXERCISES 💪</h1>
        <p class="subtitle">Track your reps, {{ username }}!</p>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner-2000s"></div>
        <p>Loading your workouts...</p>
      </div>

      <div v-else class="content">
        <!-- EXERCISE BUTTONS WITH INLINE EXPANDED FORMS -->
        <div class="exercises-list">
          <div v-for="(exercise, index) in exercises" :key="index" class="exercise-item">
            <button
              class="exercise-button"
              :class="{ active: expandedIndex === index }"
              @click="expandedIndex = expandedIndex === index ? null : index"
            >
              <span class="button-text">{{ exercise.name }}</span>
              <span class="button-arrow" :class="{ open: expandedIndex === index }">▼</span>
            </button>

            <!-- EXPANDED EXERCISE CARD - INLINE -->
            <div v-if="expandedIndex === index" class="exercise-card expanded-card">
              <div class="card-header-2000s">
                <h2 class="exercise-title">🎯 {{ exercises[index].name }}</h2>
                <button 
                  class="close-btn"
                  @click="expandedIndex = null"
                >
                  ✕
                </button>
              </div>

              <div class="card-body">
                <!-- INPUT FIELDS -->
                <div class="input-section">
                  <div class="input-group">
                    <label>Reps performed:</label>
                    <input 
                      type="number" 
                      v-model.number="exercises[index].reps" 
                      min="0"
                      placeholder="Enter reps"
                    />
                  </div>

                  <div class="input-group">
                    <label>Comment:</label>
                    <input
                      type="text"
                      v-model="exercises[index].comment"
                      placeholder="Add a note (optional)"
                    />
                  </div>
                </div>

                <!-- BUTTON -->
                <div class="button-group">
                  <button 
                    @click="saveReps(index)"
                    class="btn-save"
                  >
                    Save Reps
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- BACK BUTTON -->
        <div class="footer-action">
          <button 
            @click="$router.push('/programm')"
            class="btn-back"
          >
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
  name: "BodyweightView",
  data() {
    return {
      username: "",
      loading: true,
      expandedIndex: null,
      exercises: [
        {
          name: "Pull-ups",
          api: "addpullups",
          reps: 0,
          comment: "",
        },
        {
          name: "Dips",
          api: "adddips",
          reps: 0,
          comment: "",
        },
        {
          name: "Squats",
          api: "addsquats",
          reps: 0,
          comment: "",
        },
      ],
    };
  },
  methods: {
    async saveReps(index) {
      const exercise = this.exercises[index];
      const reps = exercise.reps;

      if (reps <= 0) {
        alert("Please enter a valid number of reps.");
        return;
      }

      const payload = {
        username: this.username,
        date: new Date().toISOString().slice(0, 10),
        reps,
        comment: exercise.comment || "",
      };

      console.log(
        `📤 Sending to ${exercise.api}:`,
        JSON.stringify(payload, null, 2)
      );

      try {
        const res = await axios.post(
          `http://localhost:5000/${exercise.api}`,
          payload
        );
        alert(res.data.message || "Saved successfully!");
        exercise.reps = 0;
        exercise.comment = "";
        this.expandedIndex = null;
      } catch (err) {
        console.error("Save error:", err);
        alert(
          err.response?.data?.error || "❌ Error saving reps. Check backend logs."
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
  background: linear-gradient(135deg, #330000 0%, #660000 50%, #990000 100%);
  min-height: 100vh;
  padding: 40px 20px;
  margin: 0;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

/* HEADER BANNER */
.header-banner {
  background: linear-gradient(180deg, #990000 0%, #dd0000 100%);
  padding: 30px 25px;
  border-radius: 12px;
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 8px 20px rgba(0, 0, 0, 0.3);
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
  margin: 10px 0 0 0;
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  opacity: 0.95;
}

/* LOADING STATE */
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

.content {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* EXERCISE ITEMS LIST */
.exercises-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.exercise-item {
  display: flex;
  flex-direction: column;
}

/* EXERCISE BUTTONS */
.exercise-button {
  background: linear-gradient(135deg, #660000 0%, #990000 100%);
  border: 2px solid #dd0000;
  padding: 20px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  color: #ffcc00;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.exercise-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(221, 0, 0, 0.2);
}

.exercise-button.active {
  background: linear-gradient(135deg, #dd0000 0%, #ff3333 100%);
  border-color: #990000;
  color: #fff;
  box-shadow: 0 8px 20px rgba(221, 0, 0, 0.3);
}

.button-text {
  display: block;
  text-align: center;
  flex: 1;
}

.button-arrow {
  display: inline-block;
  transition: transform 0.3s ease;
  font-size: 0.8rem;
}

.button-arrow.open {
  transform: rotate(180deg);
}

/* EXERCISE CARD */
.exercise-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.expanded-card {
  animation: slideDown 0.3s ease forwards;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-header-2000s {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #cc0000 0%, #ff3333 100%);
  padding: 20px 25px;
  border-bottom: 2px solid #990000;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.exercise-title {
  margin: 0;
  color: #fff;
  font-size: 1.5rem;
  text-shadow: 2px 2px 3px rgba(0, 0, 0, 0.5);
  font-weight: 900;
  letter-spacing: 1px;
}

.close-btn {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px 10px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  transform: scale(1.2);
}

.card-body {
  padding: 30px;
  background: #f9f9f9;
}

/* INPUT SECTION */
.input-section {
  margin-bottom: 25px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.input-group {
  margin-bottom: 18px;
}

.input-group:last-child {
  margin-bottom: 0;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: bold;
  font-size: 0.95rem;
}

.input-group input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.input-group input:focus {
  outline: none;
  border-color: #dd0000;
  box-shadow: 0 0 0 3px rgba(221, 0, 0, 0.1);
  background: #fff;
}

.input-group input::placeholder {
  color: #999;
}

/* BUTTON GROUP */
.button-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-save {
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  background: linear-gradient(180deg, #00cc00 0%, #009900 100%);
  color: #fff;
  flex: 1;
  min-width: 150px;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(0, 204, 0, 0.3);
}

.btn-save:active {
  transform: translateY(0);
}

/* FOOTER ACTION */
.footer-action {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.btn-back {
  padding: 15px 30px;
  background: linear-gradient(180deg, #dd0000 0%, #990000 100%);
  color: #fff;
  border: 2px solid #660000;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.btn-back:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(221, 0, 0, 0.3);
}

.btn-back:active {
  transform: translateY(-1px);
}

/* MOBILE RESPONSIVE */
@media (max-width: 768px) {
  .header-banner h1 {
    font-size: 1.5rem;
  }

  .card-body {
    padding: 20px;
  }

  .exercise-button {
    padding: 15px;
    font-size: 0.9rem;
  }

  .exercise-title {
    font-size: 1.2rem;
  }
}
</style>

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

/* HEADER BANNER */
.header-banner {
  background: linear-gradient(180deg, #990000 0%, #dd0000 100%);
  padding: 30px 25px;
  border-radius: 12px;
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 8px 20px rgba(0, 0, 0, 0.3);
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
  margin: 10px 0 0 0;
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  opacity: 0.95;
}

/* LOADING STATE */
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

.content {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* EXERCISE CARD */
.exercise-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.exercise-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
}

.card-header-2000s {
  background: linear-gradient(90deg, #cc0000 0%, #ff3333 100%);
  padding: 20px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #990000;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.exercise-title {
  margin: 0;
  color: #fff;
  font-size: 1.5rem;
  text-shadow: 2px 2px 3px rgba(0, 0, 0, 0.5);
  font-weight: 900;
  letter-spacing: 1px;
}

.btn-add-workout {
  background: linear-gradient(180deg, #ffdd00 0%, #ffaa00 100%);
  color: #333;
  border: 2px solid #cc6600;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9rem;
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.6),
    0 4px 10px rgba(0, 0, 0, 0.25);
  transition: all 0.2s ease;
}

.btn-add-workout:hover {
  transform: translateY(-2px);
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.6),
    0 6px 14px rgba(0, 0, 0, 0.3);
}

.btn-add-workout:active {
  transform: translateY(0);
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.2),
    0 2px 4px rgba(0, 0, 0, 0.15);
}

.card-body {
  padding: 30px;
  background: #f9f9f9;
}

.no-data {
  text-align: center;
  padding: 40px 30px;
  color: #666;
  font-style: italic;
  border: 2px dashed #ccc;
  border-radius: 8px;
  background: #fff;
  font-size: 1.05rem;
}

/* PR SECTION */
.pr-section {
  border-radius: 10px;
  padding: 30px;
  text-align: center;
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    0 6px 15px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease;
  background-size: 200% 200%;
}

.pr-title {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
  letter-spacing: 1px;
}

.pr-value {
  font-size: 3rem;
  color: #333;
  font-weight: 900;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: 2px;
}

/* BENCHMARKS SECTION */
.benchmarks-section {
  background: #fff;
  border: 2px solid #ddd;
  border-radius: 10px;
  padding: 25px;
  margin-top: 25px;
}

.benchmarks-title {
  margin: 0 0 18px 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: bold;
  text-align: center;
  letter-spacing: 1px;
  border-bottom: 2px solid #dd0000;
  padding-bottom: 12px;
}

.benchmark-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.benchmark-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: linear-gradient(90deg, #f9f9f9 0%, #fff 100%);
  border-left: 5px solid #dd0000;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.benchmark-item:hover {
  background: linear-gradient(90deg, #f5f5f5 0%, #fefefe 100%);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
}

.benchmark-level {
  font-weight: bold;
  color: #333;
  font-size: 0.95rem;
}

.benchmark-value {
  background: linear-gradient(135deg, #ffdd00 0%, #ffaa00 100%);
  color: #333;
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
  border: 1px solid #cc6600;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

/* FOOTER ACTION */
.footer-action {
  text-align: center;
  padding: 25px;
}

.btn-back {
  background: linear-gradient(180deg, #555 0%, #333 100%);
  color: #fff;
  border: 2px solid #000;
  padding: 14px 32px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 5px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.btn-back:hover {
  background: linear-gradient(180deg, #666 0%, #444 100%);
  transform: translateY(-2px);
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 7px 16px rgba(0, 0, 0, 0.4);
}

.btn-back:active {
  transform: translateY(0);
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.2);
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .header-banner h1 {
    font-size: 1.5rem;
  }

  .card-header-2000s {
    flex-direction: column;
    gap: 15px;
  }

  .exercise-title {
    font-size: 1.3rem;
  }

  .btn-add-workout {
    width: 100%;
  }

  .card-body {
    padding: 20px;
  }

  .pr-section {
    padding: 20px;
  }

  .pr-value {
    font-size: 2.2rem;
  }

  .benchmarks-section {
    padding: 20px;
  }

  .benchmark-item {
    flex-wrap: wrap;
    padding: 12px 14px;
  }

  .benchmark-level {
    width: 100%;
    margin-bottom: 8px;
  }
}
</style>
