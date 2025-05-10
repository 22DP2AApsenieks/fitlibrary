<template>
  <div class="programm-view">
    <h1>Programm View</h1>
    <p>Tu tiki iekšā, {{ username }}!</p>

    <div v-if="loading">Ielādējas dati...</div>

    <div v-else>
      <h2>Treniņu progress:</h2>

      <div class="exercise-section">
        <h3>Pullups</h3>
        <ul>
          <li v-for="(entry, index) in pullups" :key="index">
            {{ entry.reps }} atkārtojumi ({{ entry.date || 'nav datuma' }})
          </li>
        </ul>
      </div>

      <div class="exercise-section">
        <h3>Dips</h3>
        <ul>
          <li v-for="(entry, index) in dips" :key="index">
            {{ entry.reps }} atkārtojumi ({{ entry.date || 'nav datuma' }})
          </li>
        </ul>
      </div>

      <div class="exercise-section">
        <h3>Squats</h3>
        <ul>
          <li v-for="(entry, index) in squats" :key="index">
            {{ entry.reps }} atkārtojumi ({{ entry.date || 'nav datuma' }})
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgrammView',
  data() {
    return {
      username: '',
      pullups: [],
      dips: [],
      squats: [],
      loading: true,
    };
  },
  async mounted() {
    this.username = localStorage.getItem('loggedInUser') || 'nezināmais';

    try {
      const [pullRes, dipRes, squatRes] = await Promise.all([
        fetch('http://localhost:5000/pullups'),
        fetch('http://localhost:5000/dips'),
        fetch('http://localhost:5000/squat')
      ]);

      const [pullData, dipData, squatData] = await Promise.all([
        pullRes.json(),
        dipRes.json(),
        squatRes.json()
      ]);

      this.pullups = pullData.filter(e => e.username === this.username);
      this.dips = dipData.filter(e => e.username === this.username);
      this.squats = squatData.filter(e => e.username === this.username);

    } catch (error) {
      console.error('Kļūda iegūstot treniņu datus:', error);
    } finally {
      this.loading = false;
    }
  }
}
</script>

<style scoped>
.programm-view {
  padding: 20px;
}

.exercise-section {
  margin-top: 20px;
}
</style>
