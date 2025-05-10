<template>
  <div class="programm-view">
    <h1>Programm View</h1>
    <p>Ur in, {{ username }}!</p>

    <div v-if="loading">Loading data...</div>

    <div v-else>
      <h2>U do great! WOW:</h2>

      <div class="exercise-section">
        <h3>Pull-ups</h3>
        <ul>
          <li v-for="(entry, index) in pullups" :key="index">
            {{ entry.reps }} reps ({{ formatDate(entry.date) }})
          </li>
        </ul>
        <canvas id="pullupsChart"></canvas>
      </div>

      <div class="exercise-section">
        <h3>Dips</h3>
        <ul>
          <li v-for="(entry, index) in dips" :key="index">
            {{ entry.reps }} reps ({{ formatDate(entry.date) }})
          </li>
        </ul>
        <canvas id="dipsChart"></canvas>
      </div>

      <div class="exercise-section">
        <h3>Squats</h3>
        <ul>
          <li v-for="(entry, index) in squats" :key="index">
            {{ entry.reps }} reps ({{ formatDate(entry.date) }})
          </li>
        </ul>
        <canvas id="squatsChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

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
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return 'nav datuma';
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    },
    getTrendColor(data) {
      if (data.length < 2) return 'blue';
      const diff = data[data.length - 1].reps - data[0].reps;
      if (diff > 0) return 'green';
      if (diff < 0) return 'red';
      return 'blue';
    },
    drawChart(canvasId, data) {
      const ctx = document.getElementById(canvasId);
      if (!ctx || data.length === 0) return;

      const color = this.getTrendColor(data);

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map(e => this.formatDate(e.date)),
          datasets: [{
            label: 'Reps',
            data: data.map(e => e.reps),
            fill: true,
            backgroundColor: color === 'green'
              ? 'rgba(0, 255, 0, 0.1)'
              : color === 'red'
              ? 'rgba(255, 0, 0, 0.1)'
              : 'rgba(0, 123, 255, 0.1)',
            borderColor: color,
            tension: 0.3,
            pointBackgroundColor: color,
            pointBorderColor: '#fff',
            pointRadius: 5
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: '#333',
              titleColor: '#fff',
              bodyColor: '#fff'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              },
              grid: {
                color: '#ddd'
              }
            },
            x: {
              grid: {
                color: '#eee'
              }
            }
          }
        }
      });
    }
  },
  async mounted() {
    this.username = (localStorage.getItem('loggedInUser') || 'nezināmais').toLowerCase();

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

      // Filter by username and sort by date (oldest to newest)
      this.pullups = pullData
        .filter(e => e.username.toLowerCase() === this.username)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      this.dips = dipData
        .filter(e => e.username.toLowerCase() === this.username)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      this.squats = squatData
        .filter(e => e.username.toLowerCase() === this.username)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    } catch (error) {
      console.error('Kļūda iegūstot treniņu datus:', error);
    } finally {
      this.loading = false;
      this.$nextTick(() => {
        this.drawChart('pullupsChart', this.pullups);
        this.drawChart('dipsChart', this.dips);
        this.drawChart('squatsChart', this.squats);
      });
    }
  }
};
</script>

<style scoped>
.programm-view {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.exercise-section {
  margin-top: 30px;
  background: #f9f9f9;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

canvas {
  margin-top: 10px;
  max-width: 100%;
  height: 140px !important;
}
</style>
