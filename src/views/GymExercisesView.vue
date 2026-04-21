<template>
  <div class="full-background">
    <div class="container">
      <div class="header-banner">
        <h1>🏋️ TRENIŅI ZĀLĒ 🏋️</h1>
        <p class="subtitle">Seko savam 1RM, {{ username }}!</p>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner-2000s"></div>
        <p>Ielādējam tavus treniņus...</p>
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

            <!-- EXPANDED EXERCISE CARD -->
            <div v-if="expandedIndex === index" class="exercise-card expanded-card">
              <div class="card-header-2000s">
                <h2 class="exercise-title">🎯 {{ exercises[index].name }}</h2>
                <button class="close-btn" @click="expandedIndex = null">✕</button>
              </div>

              <div class="card-body">
                <div class="input-section">
                  <div class="input-group">
                    <label>Svars (kg):</label>
                    <input 
                      type="number" 
                      v-model.number="exercises[index].weight" 
                      min="0"
                      placeholder="Ievadi svaru"
                    />
                  </div>

                  <div class="input-group">
                    <label>Atkārtojumi:</label>
                    <input 
                      type="number" 
                      v-model.number="exercises[index].reps" 
                      min="1"
                      placeholder="Ievadi atkārtojumus"
                    />
                  </div>

                  <div class="input-group">
                    <label>Vai ievadi savu 1RM (kg):</label>
                    <input 
                      type="number" 
                      v-model.number="exercises[index].oneRepMax" 
                      min="0"
                      placeholder="Ievadi 1RM"
                    />
                  </div>

                  <div class="input-group">
                    <label>Komentārs:</label>
                    <input
                      type="text"
                      v-model="exercises[index].comment"
                      placeholder="Piezīme (nav obligāti)"
                    />
                  </div>
                </div>

                <div class="button-group">
                  <button 
                    @click="calculateOneRepMax(index)"
                    class="btn-calculate"
                  >
                    Aprēķināt 1RM
                  </button>

                  <button
                    v-if="exercises[index].calculatedOneRepMax"
                    @click="saveOneRepMax(index)"
                    class="btn-save"
                  >
                    Saglabāt 1RM
                  </button>
                </div>

                <div v-if="exercises[index].calculatedOneRepMax !== null" class="result-section">
                  <p class="result-label">Aprēķinātais 1RM:</p>
                  <p class="result-value">{{ exercises[index].calculatedOneRepMax }} kg</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="footer-action">
          <button 
            @click="$router.push('/programm')"
            class="btn-back"
          >
            ← Atpakaļ uz paneli
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "GymView",
  data() {
    return {
      username: "",
      loading: true,
      expandedIndex: null,
      exercises: [
        {
          name: "Spiešana guļus",
          api: "addbenchpress",
          weight: 0,
          reps: 0,
          oneRepMax: 0,
          calculatedOneRepMax: null,
          comment: "",
        },
        {
          name: "Vilce no zemes (Deadlift)",
          api: "adddeadlift",
          weight: 0,
          reps: 0,
          oneRepMax: 0,
          calculatedOneRepMax: null,
          comment: "",
        },
        {
          name: "Pietupiens ar svaru",
          api: "addgymsquat",
          weight: 0,
          reps: 0,
          oneRepMax: 0,
          calculatedOneRepMax: null,
          comment: "",
        },
        {
          name: "Spiešana virs galvas",
          api: "addoverheadpress",
          weight: 0,
          reps: 0,
          oneRepMax: 0,
          calculatedOneRepMax: null,
          comment: "",
        },
        {
          name: "Vilkme no aukšas (Lat Pulldown)",
          api: "addlatpulldown",
          weight: 0,
          reps: 0,
          oneRepMax: 0,
          calculatedOneRepMax: null,
          comment: "",
        },
      ],
    };
  },
  methods: {
    calculateOneRepMax(index) {
      const exercise = this.exercises[index];

      if (exercise.oneRepMax > 0) {
        // ja user jau ievadīja 1RM, izmantojam to
        exercise.calculatedOneRepMax = exercise.oneRepMax;
      } else if (exercise.weight > 0 && exercise.reps > 0) {
        // Epley formula 1RM aprēķinam
        exercise.calculatedOneRepMax = Math.round(
          exercise.weight * (1 + exercise.reps / 30)
        );
      } else {
        exercise.calculatedOneRepMax = null;
        alert("Ievadi svaru un atkārtojumus vai 1RM.");
      }
    },

    async saveOneRepMax(index) {
      const exercise = this.exercises[index];
      const oneRepMax = exercise.calculatedOneRepMax;

      if (!oneRepMax || oneRepMax <= 0) {
        alert("Vispirms aprēķini vai ievadi derīgu 1RM.");
        return;
      }

      const payload = {
        username: this.username,
        date: new Date().toISOString().slice(0, 10),
        oneRepMax,
        comment: exercise.comment || "",
      };

      console.log(
        `📤 Sūtam uz ${exercise.api}:`,
        JSON.stringify(payload, null, 2)
      );

      try {
        const res = await axios.post(
          `http://localhost:5000/${exercise.api}`,
          payload
        );
        alert(res.data.message || "Saglabāts!");
        exercise.comment = "";
      } catch (err) {
        console.error("Saglabāšanas kļūda:", err);
        alert(
          err.response?.data?.error || "❌ Kļūda saglabājot 1RM."
        );
      }
    },
  },
  mounted() {
    // paņem username no localStorage
    this.username =
      (localStorage.getItem("loggedInUser") || "nezināmais").toLowerCase();
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

/* HEADER BANNER */
.header-banner {
  background: linear-gradient(180deg, #6a0000 0%, #310000 100%);
  padding: 30px 25px;
  border-radius: 12px;
  box-shadow: 
    inset 0 1px 0 rgba(45, 90, 61, 0.3),
    0 8px 20px rgba(0, 0, 0, 0.6);
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
  margin: 10px 0 0 0;
  color: #b0e0c0;
  font-size: 1rem;
  font-weight: bold;
  opacity: 0.9;
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
  background: #2a2a2a;
  border: 1px solid #444;
  padding: 18px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
}

.exercise-button:hover {
  transform: translateY(-2px);
  background: #333333;
  border-color: #555;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.5);
}

.exercise-button.active {
  background: #3a3a3a;
  border-color: #666;
  color: #fff;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.6);
}

.button-icon {
  font-size: 2rem;
}

.button-text {
  display: block;
  text-align: center;
}

.button-arrow {
  display: inline-block;
  transition: transform 0.3s ease;
  font-size: 0.8rem;
  margin-top: 5px;
}

.button-arrow.open {
  transform: rotate(180deg);
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
}

.close-btn {
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px 10px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  transform: scale(1.15);
  color: #ffaaaa;
}

/* EXERCISE CARD */
.exercise-card {
  background: #1a1f2e;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #2d453d;
}

.exercise-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(74, 157, 111, 0.15);
}

.card-header-2000s {
  background: linear-gradient(90deg, #3a1a1a 0%, #5a2a2a 100%);
  padding: 20px 25px;
  border-bottom: 2px solid #8a4a4a;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.exercise-title {
  margin: 0;
  color: #ffffff;
  font-size: 1.5rem;
  text-shadow: 2px 2px 3px rgba(0, 0, 0, 0.8);
  font-weight: 800;
  letter-spacing: 0.5px;
}

.card-body {
  padding: 30px;
  background: #1a1a1a;
}

/* INPUT SECTION */
.input-section {
  margin-bottom: 25px;
  background: #2a2a2a;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #3a3a3a;
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
  color: #ffffff;
  font-weight: 600;
  font-size: 0.95rem;
}

.input-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #444;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: all 0.2s ease;
  background: #2a2a2a;
  color: #ffffff;
}

.input-group input:focus {
  outline: none;
  border-color: #666;
  box-shadow: 0 0 0 3px rgba(200, 100, 100, 0.15);
  background: #333333;
}

.input-group input::placeholder {
  color: #888888;
}

/* BUTTON GROUP */
.button-group {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.btn-calculate {
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);
  background: #6a3a3a;
  color: #ffffff;
  flex: 1;
  min-width: 150px;
  border: 1px solid #8a5a5a;
}

.btn-calculate:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.5);
  background: #7a4a4a;
}

.btn-calculate:active {
  transform: translateY(0);
}

.btn-save {
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);
  background: #6a3a3a;
  color: #ffffff;
  flex: 1;
  min-width: 150px;
  border: 1px solid #8a5a5a;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.5);
  background: #7a4a4a;
}

.btn-save:active {
  transform: translateY(0);
}

/* RESULT SECTION */
.result-section {
  background: linear-gradient(135deg, #3a2a2a 0%, #2a1a1a 100%);
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  border: 2px solid #8a5a5a;
  margin-top: 20px;
}

.result-label {
  margin: 0 0 10px 0;
  color: #ffffff;
  font-weight: 600;
  font-size: 0.95rem;
}

.result-value {
  margin: 0;
  color: #ffaaaa;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 1px;
}

/* FOOTER ACTION */
.footer-action {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.btn-back {
  padding: 15px 30px;
  background: #6a3a3a;
  color: #ffffff;
  border: 1px solid #8a5a5a;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.btn-back:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.5);
  background: #7a4a4a;
}

.btn-back:active {
  transform: translateY(-1px);
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .header-banner h1 {
    font-size: 1.5rem;
  }

  .exercise-buttons-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .exercise-button {
    padding: 15px;
    font-size: 0.9rem;
  }

  .button-icon {
    font-size: 1.5rem;
  }

  .card-body {
    padding: 20px;
  }

  .button-group {
    flex-direction: column;
  }

  .btn-calculate,
  .btn-save {
    width: 100%;
  }

  .result-value {
    font-size: 1.8rem;
  }
}
</style>