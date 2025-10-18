<template>
  <div class="full-background">
    <div class="programm-view">
      <h1>Programm View</h1>
      <p>Ur in, {{ username }}!</p>

      <div v-if="loading">Loading data...</div>

      <div v-else>
        <h2>U do great! WOW:</h2>
          
        <router-link to="/bexercises">
          <button class="bexercises-button">Bodyweight Exercises</button>
        </router-link>

        <router-link to="/g">
          <button class="bexercises-button">Gym Exercises</button>
        </router-link>

        <router-link to="/running">
          <button class="bexercises-button">Running</button>
        </router-link>

        <router-link to="/tables">
          <button class="bexercises-button">Tables</button>
        </router-link>



      
        <div class="review-section">
          <h3>Leave a Review</h3>
          <textarea v-model="reviewText" placeholder="Do u like this programm?" rows="4"></textarea>
          <button @click="submitReview" class="submit-review-button">Submit Review</button>
          <p v-if="reviewMessage">{{ reviewMessage }}</p>
          <!-- Debug: Show review payload -->
          <pre style="background:#eee;padding:8px;border-radius:6px;margin-top:10px;">
{{ reviewPayload }}
          </pre>
        </div>
        <div style="margin-top: 40px;">
          <button @click="confirmDelete" class="delete-button">Delete My Account</button>
        </div>
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
      charts: {},
      reviewText: '',
      reviewMessage: ''
    };
  },
  computed: {
    reviewPayload() {
      return JSON.stringify({
        username: this.username,
        review: this.reviewText
      }, null, 2);
    }
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

      // Destroy previous chart if exists to prevent overlay
      if (this.charts[canvasId]) {
        this.charts[canvasId].destroy();
      }

      const color = this.getTrendColor(data);

      this.charts[canvasId] = new Chart(ctx, {
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
              ticks: { stepSize: 1 },
              grid: { color: '#ddd' }
            },
            x: {
              grid: { color: '#eee' }
            }
          }
        }
      });
    },
    async fetchData() {
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
    },
    async submitReview() {
      this.reviewMessage = '';
      if (!this.reviewText.trim()) {
        this.reviewMessage = 'Review cannot be empty!';
        return;
      }
      // Log the payload before sending
      const payload = {
        username: this.username,
        review: this.reviewText
      };
      console.log('Submitting review payload:', payload);

      try {
        const res = await fetch('http://localhost:5000/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to submit review');
        this.reviewMessage = 'Review submitted!';
        this.reviewText = '';
      } catch (err) {
        this.reviewMessage = err.message;
      }
    },
    confirmDelete() {
      const answer = prompt("Are you sure you want to delete your account? Type 'yes' to confirm:");
      if (answer?.toLowerCase() === 'yes') {
        fetch(`http://localhost:5000/delete-account/${this.username}`, {
          method: 'DELETE'
        })
        .then(res => {
          if (!res.ok) throw new Error('Server error');
          alert('Your account and data have been deleted.');
          localStorage.removeItem('loggedInUser');
          this.$router.push('/'); // Or '/login' if you want to redirect there
        })
        .catch(err => {
          console.error('Error deleting account:', err);
          alert('Failed to delete your account.');
        });
      } else {
        alert('Account deletion cancelled.');
      }
    }
  },
  mounted() {
    this.username = (localStorage.getItem('loggedInUser') || 'nezināmais').toLowerCase();
    this.fetchData();
  }
};
</script>

<style scoped>
.full-background {
  background: linear-gradient(to bottom right, #330000, #660000, #990000);
  min-height: 100vh;
  padding: 0;
  margin: 0;
}

.programm-view {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background: linear-gradient(to bottom right, #ffffff, #a59494, #aaa0a0);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
