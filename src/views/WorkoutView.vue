<template>
  <div class="workout-view">
    <h1>Pievieno treniņu {{ username }}</h1>

    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="message" class="message">{{ message }}</div>

    <form @submit.prevent="submitWorkout">
      <div class="form-group">
        <label for="reps">Reps:</label>
        <input type="number" id="reps" v-model="reps" min="1" required />
      </div>

      <div class="form-group">
        <label for="date">Datums:</label>
        <input type="date" id="date" v-model="date" required />
      </div>

      <button type="submit">Saglabāt</button>
    </form>

    <!-- Display data before sending -->
    <div v-if="showData">
      <h3>Data before sending to server:</h3>
      <pre>{{ workoutData }}</pre>
    </div>

    <router-link to="/programm">
      <button class="back-button">⬅ Atpakaļ uz programm</button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'WorkoutView',
  data() {
    return {
      username: localStorage.getItem('loggedInUser') || '',
      reps: 0,
      date: new Date().toISOString().split('T')[0],  // The input date will be in the format YYYY-MM-DD
      message: '',
      error: '',
      showData: false,
      workoutData: {}
    };
  },
  methods: {
    async submitWorkout() {
      this.message = '';
      this.error = '';

      if (!this.username) {
        this.error = 'Nav atrasts lietotājs!';
        return;
      }

      // Create a new Date object from the selected date and set the time to midnight UTC
      //const dateWithTime = new Date(this.date + 'T00:00:00.000Z');

      // Prepare data to be sent with the correct date format
      const workoutPayload = {
        username: this.username,
        reps: this.reps,
        date: dateWithTime.toISOString()  // Send the date in the full ISO 8601 format
      };

      // Show the data before sending
      this.workoutData = workoutPayload;
      this.showData = true;

      try {
        const res = await fetch('http://localhost:5000/addpullups', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(workoutPayload)
        });

        const result = await res.json();

        if (!res.ok) {
          this.error = result.error || 'Servera kļūda';
        } else {
          this.message = result.message;
          this.reps = 0;
          this.date = new Date().toISOString().split('T')[0]; // Reset to today's date after successful save
          this.showData = false; // Hide data after successful save
        }
      } catch (err) {
        this.error = 'Neizdevās pievienot treniņu';
        console.error(err);
      }
    }
  }
};
</script>

<style scoped>
.workout-view {
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input,
select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  padding: 10px 20px;
  background-color: #2e86de;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-color: #1e6bc8;
}

.message {
  color: green;
  margin-bottom: 10px;
}

.error {
  color: red;
  margin-bottom: 10px;
}

.back-button {
  margin-top: 20px;
  background-color: #ccc;
  color: black;
}
</style>
