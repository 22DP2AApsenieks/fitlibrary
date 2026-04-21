<template>
  <div class="full-background">
    <div class="container">
      <div class="header-banner">
        <h1>💪 TRENIŅI AR SAVU SVARU 💪</h1>
        <p class="subtitle">Ievadi savus rezultātus, {{ username }}!</p>
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
                    <label>Atkārtojumu skaits:</label>
                    <input 
                      type="number" 
                      v-model.number="exercises[index].reps" 
                      min="0"
                      placeholder="Ievadi atkārtojumus"
                    />
                  </div>

                  <div class="input-group">
                    <label>Komentārs:</label>
                    <input
                      type="text"
                      v-model="exercises[index].comment"
                      placeholder="Pievieno piezīmi (nav obligāti)"
                    />
                  </div>
                </div>

                <!-- BUTTON -->
                <div class="button-group">
                  <button 
                    @click="saveReps(index)"
                    class="btn-save"
                  >
                    Saglabāt atkārtojumus
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
  name: "BodyweightView",
  data() {
    return {
      username: "",
      loading: true,
      expandedIndex: null,
      exercises: [
        {
          name: "Pievilkšanās",
          api: "addpullups",
          reps: 0,
          comment: "",
        },
        {
          name: "Līdztekas (Dips)",
          api: "adddips",
          reps: 0,
          comment: "",
        },
        {
          name: "Pietupieni",
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
        alert("Ievadi derīgu atkārtojumu skaitu.");
        return;
      }

      const payload = {
        username: this.username,
        date: new Date().toISOString().slice(0, 10),
        reps,
        comment: exercise.comment || "",
      };

      // debugam paskatīties, ko tieši sūtam uz backend
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
        exercise.reps = 0;
        exercise.comment = "";
        this.expandedIndex = null;
      } catch (err) {
        console.error("Saglabāšanas kļūda:", err);
        alert(
          err.response?.data?.error || "❌ Kļūda saglabājot. Pārbaudi backend logus."
        );
      }
    },
  },
  mounted() {
    // paņemam user no localStorage (fallback ja nav)
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
  box-shadow: inset 0 1px 0 rgba(176, 0, 0, 0.3), 0 8px 20px rgba(0, 0, 0, 0.6);
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

.content { display: flex; flex-direction: column; gap: 25px; }
.exercises-list { display: flex; flex-direction: column; gap: 20px; }
.exercise-item { display: flex; flex-direction: column; }
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

.exercise-button:hover { transform: translateY(-2px); background: #333333; border-color: #555; box-shadow: 0 6px 14px rgba(0, 0, 0, 0.5); }
.exercise-button.active { background: #3a3a3a; border-color: #666; color: #fff; box-shadow: 0 6px 16px rgba(0, 0, 0, 0.6); }
.button-text { display: block; text-align: center; flex: 1; }
.button-arrow { display: inline-block; transition: transform 0.3s ease; font-size: 0.8rem; }
.button-arrow.open { transform: rotate(180deg); }

.exercise-card { background: #1a1f2e; border: 1px solid #2d453d; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4); }
.expanded-card { animation: slideDown 0.3s ease forwards; }
@keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

.card-header-2000s { display:flex; justify-content:space-between; align-items:center; background: linear-gradient(90deg, #3a1a1a 0%, #5a2a2a 100%); padding: 20px 25px; border-bottom: 2px solid #8a4a4a; box-shadow: inset 0 1px 0 rgba(255,255,255,0.05); }
.exercise-title { margin:0; color:#ffffff; font-size:1.5rem; text-shadow:2px 2px 3px rgba(0,0,0,0.8); font-weight:800; letter-spacing:0.5px; }
.close-btn { background:transparent; border:none; color:#ffffff; font-size:1.5rem; cursor:pointer; padding:5px 10px; transition: all 0.2s ease; }
.close-btn:hover { transform: scale(1.15); color: #ffaaaa; }
.card-body { padding:30px; background:#1a1a1a; }

.input-section { margin-bottom:25px; background:#2a2a2a; padding:20px; border-radius:8px; border:1px solid #3a3a3a; }
.input-group { margin-bottom:18px; }
.input-group:last-child { margin-bottom:0; }
.input-group label { display:block; margin-bottom:8px; color:#ffffff; font-weight:600; font-size:0.95rem; }
.input-group input { width:100%; padding:12px 15px; border:1px solid #444; border-radius:6px; font-size:1rem; box-sizing:border-box; transition: all 0.2s ease; background: #2a2a2a; color: #ffffff; }
.input-group input:focus { outline:none; border-color:#666; box-shadow:0 0 0 3px rgba(200, 100, 100, 0.15); background:#333333; }
.input-group input::placeholder { color:#888888; }

.button-group { display:flex; gap:12px; flex-wrap:wrap; }
.btn-save { padding:12px 20px; border:1px solid #8a5a5a; border-radius:6px; cursor:pointer; font-weight:600; font-size:0.95rem; transition: all 0.2s ease; box-shadow:0 3px 8px rgba(0,0,0,0.4); background: #6a3a3a; color:#ffffff; flex:1; min-width:150px; }
.btn-save:hover { transform: translateY(-2px); box-shadow: 0 5px 12px rgba(0,0,0,0.5); background: #7a4a4a; }
.btn-save:active { transform: translateY(0); }

.footer-action { display:flex; justify-content:center; margin-top:40px; }
.btn-back { padding:15px 30px; background: #6a3a3a; color:#ffffff; border:1px solid #8a5a5a; border-radius:10px; font-size:1rem; font-weight:600; cursor:pointer; transition: all 0.3s ease; box-shadow:0 4px 12px rgba(0,0,0,0.4); }
.btn-back:hover { transform: translateY(-3px); box-shadow: 0 6px 18px rgba(0,0,0,0.5); background: #7a4a4a; }
.btn-back:active { transform: translateY(-1px); }

@media (max-width: 768px) {
  .header-banner h1 { font-size:1.5rem; }
  .card-body { padding:20px; }
  .exercise-button { padding:15px; font-size:0.9rem; }
  .exercise-title { font-size:1.2rem; }
}

</style>
