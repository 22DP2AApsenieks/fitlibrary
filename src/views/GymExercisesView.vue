<template>
  <div class="full-background">
    <div class="gym-view">
      <h1>Gym View</h1>
      <p>Welcome, {{ username }}!</p>

      <div v-if="loading">Loading data...</div>

      <div v-else>
        <div
          class="exercise-section"
          v-for="(exercise, index) in exercises"
          :key="index"
        >
          <h3>{{ exercise.name }}</h3>

          <!-- Input fields -->
          <div class="input-group">
            <label>Weight lifted (kg):</label>
            <input type="number" v-model.number="exercise.weight" min="0" />
          </div>

          <div class="input-group">
            <label>Reps performed:</label>
            <input type="number" v-model.number="exercise.reps" min="1" />
          </div>

          <div class="input-group">
            <label>Or enter your 1RM directly (kg):</label>
            <input type="number" v-model.number="exercise.oneRepMax" min="0" />
          </div>

          <!-- Buttons -->
          <button @click="calculateOneRepMax(index)">Calculate 1RM</button>

          <p v-if="exercise.calculatedOneRepMax !== null">
            Estimated 1RM:
            <strong>{{ exercise.calculatedOneRepMax }} kg</strong>
          </p>

          <button
            v-if="exercise.calculatedOneRepMax"
            @click="saveOneRepMax(index)"
          >
            Save 1RM
          </button>
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
  name: "GymView",
  data() {
    return {
      username: "",
      loading: true,
      exercises: [
        {
          name: "Bench Press",
          api: "addbenchpress",
          weight: 0,
          reps: 0,
          oneRepMax: 0,
          calculatedOneRepMax: null,
        },
        {
          name: "Deadlift",
          api: "adddeadlift",
          weight: 0,
          reps: 0,
          oneRepMax: 0,
          calculatedOneRepMax: null,
        },
        {
          name: "Squat",
          api: "addgymsquat", // ✅ fixed: matches backend route
          weight: 0,
          reps: 0,
          oneRepMax: 0,
          calculatedOneRepMax: null,
        },
        {
          name: "Overhead Press",
          api: "addoverheadpress",
          weight: 0,
          reps: 0,
          oneRepMax: 0,
          calculatedOneRepMax: null,
        },
        {
          name: "Lat Pulldown",
          api: "addlatpulldown",
          weight: 0,
          reps: 0,
          oneRepMax: 0,
          calculatedOneRepMax: null,
        },
      ],
    };
  },
  methods: {
    calculateOneRepMax(index) {
      const exercise = this.exercises[index];

      if (exercise.oneRepMax > 0) {
        exercise.calculatedOneRepMax = exercise.oneRepMax;
      } else if (exercise.weight > 0 && exercise.reps > 0) {
        // Epley formula
        exercise.calculatedOneRepMax = Math.round(
          exercise.weight * (1 + exercise.reps / 30)
        );
      } else {
        exercise.calculatedOneRepMax = null;
        alert("Enter weight & reps OR a 1RM.");
      }
    },

    async saveOneRepMax(index) {
      const exercise = this.exercises[index];
      const oneRepMax = exercise.calculatedOneRepMax;

      if (!oneRepMax || oneRepMax <= 0) {
        alert("Please calculate or enter a valid 1RM before saving.");
        return;
      }

      const payload = {
        username: this.username,
        date: new Date().toISOString().slice(0, 10),
        oneRepMax,
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
      } catch (err) {
        console.error("Save error:", err);
        alert(
          err.response?.data?.error || "❌ Error saving 1RM. Check backend logs."
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

.gym-view {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 600px;
}

.exercise-section {
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
  background: #007bff;
  color: #fff;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}

.back-button {
  margin-top: 20px;
  background: #6c757d;
}

.back-button:hover {
  background: #495057;
}
</style>
