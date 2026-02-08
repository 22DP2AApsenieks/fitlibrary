<template>
  <div class="full-background">
    <div class="programm-view">
      <div class="header-section">
        <h1>Your Fitness Dashboard</h1>
        <p class="welcome-text">Welcome back, <span class="username">{{ username }}</span>! 💪</p>
      </div>

      <div v-if="loading" class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading your progress...</p>
      </div>

      <div v-else class="content">
        <div class="motivation-card">
          <h2>Keep Crushing Your Goals! 🔥</h2>
        </div>

        <div class="navigation-grid">
          <router-link to="/bexercises" class="nav-card">
            <div class="card-icon">💪</div>
            <h3>Bodyweight</h3>
            <p>Pull-ups, Dips & More</p>
          </router-link>

          <router-link to="/g" class="nav-card">
            <div class="card-icon">🏋️</div>
            <h3>Gym Exercises</h3>
            <p>Heavy Lifts & Strength</p>
          </router-link>

          <router-link to="/running" class="nav-card">
            <div class="card-icon">🏃</div>
            <h3>Running</h3>
            <p>Track Your Speed</p>
          </router-link>

          <router-link to="/tables" class="nav-card">
            <div class="card-icon">📊</div>
            <h3>Progress Tables</h3>
            <p>Detailed Analytics</p>
          </router-link>
        </div>

        <div class="review-section">
          <h3>Share Your Feedback</h3>
          <p class="section-subtitle">Help us improve by sharing your thoughts</p>
          <textarea 
            v-model="reviewText" 
            placeholder="What do you think about FitLibrary?" 
            rows="4"
            class="review-textarea"
          ></textarea>
          <button @click="submitReview" class="submit-review-button">
            <span v-if="!reviewMessage">Submit Review</span>
            <span v-else>{{ reviewMessage }}</span>
          </button>
        </div>

        <div class="danger-zone">
          <h3>Danger Zone</h3>
          <p class="danger-text">Delete your account and all associated data</p>
          <button @click="confirmDelete" class="delete-button">
            Delete My Account
          </button>
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
  background: linear-gradient(135deg, #330000 0%, #660000 50%, #990000 100%);
  min-height: 100vh;
  padding: 40px 20px;
  margin: 0;
}

.programm-view {
  max-width: 1000px;
  margin: 0 auto;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.header-section {
  background: linear-gradient(135deg, #990000 0%, #dd0000 100%);
  color: white;
  padding: 40px 30px;
  text-align: center;
}

.header-section h1 {
  font-size: 2.5rem;
  margin: 0 0 10px 0;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.welcome-text {
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.95;
}

.username {
  font-weight: 700;
  text-transform: capitalize;
}

.content {
  padding: 40px 30px;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 30px;
  color: #dd0000;
}

.spinner {
  border: 4px solid #f0f0f0;
  border-top: 4px solid #dd0000;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 0.8s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.motivation-card {
  background: linear-gradient(135deg, #610000 0%, #000000 100%);
  color: white;
  padding: 30px;
  border-radius: 16px;
  text-align: center;
  margin-bottom: 40px;
  box-shadow: 0 10px 30px rgba(221, 0, 0, 0.3);
}

.motivation-card h2 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
}

.navigation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.nav-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  text-decoration: none;
  color: #333;
  transition: all 0.3s ease;
  cursor: pointer;
}

.nav-card:hover {
  transform: translateY(-8px);
  border-color: #dd0000;
  box-shadow: 0 15px 40px rgba(221, 0, 0, 0.2);
  background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.nav-card h3 {
  margin: 0 0 8px 0;
  font-size: 1.3rem;
  font-weight: 700;
}

.nav-card p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

.review-section {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 16px;
  margin-bottom: 30px;
  border-left: 4px solid #dd0000;
}

.review-section h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.4rem;
}

.section-subtitle {
  margin: 0 0 20px 0;
  color: #666;
  font-size: 0.95rem;
}

.review-textarea {
  width: 100%;
  padding: 15px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  transition: all 0.3s ease;
}

.review-textarea:focus {
  outline: none;
  border-color: #dd0000;
  box-shadow: 0 0 0 3px rgba(221, 0, 0, 0.1);
}

.submit-review-button {
  width: 100%;
  padding: 14px 30px;
  margin-top: 15px;
  background: linear-gradient(135deg, #006308 0%, #2fc900 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(221, 0, 0, 0.3);
}

.submit-review-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 94, 12, 0.4);
}

.submit-review-button:active {
  transform: translateY(0);
}

.danger-zone {
  background: #fff5f5;
  padding: 30px;
  border-radius: 16px;
  border-left: 4px solid #e53e3e;
}

.danger-zone h3 {
  margin: 0 0 8px 0;
  color: #e53e3e;
  font-size: 1.4rem;
  font-weight: 700;
}

.danger-text {
  margin: 0 0 20px 0;
  color: #a0262f;
  font-size: 0.95rem;
}

.delete-button {
  width: 100%;
  padding: 14px 30px;
  background: linear-gradient(135deg, #e40000 0%, #70004b 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(229, 62, 62, 0.3);
}

.delete-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(229, 62, 62, 0.4);
}

.delete-button:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .full-background {
    padding: 20px 10px;
  }

  .programm-view {
    border-radius: 16px;
  }

  .header-section {
    padding: 30px 20px;
  }

  .header-section h1 {
    font-size: 2rem;
  }

  .content {
    padding: 25px 20px;
  }

  .navigation-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  .nav-card {
    padding: 20px;
  }

  .card-icon {
    font-size: 2.5rem;
  }
}
</style>
