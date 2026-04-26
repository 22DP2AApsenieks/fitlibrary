<template>
  <div class="admin-container">
    <h1>⚙️ Administratora panelis</h1>

    <!-- REVIEWS BUTTON -->
    <button @click="toggleReviews" class="reviews-toggle-btn">
      {{ showReviews ? '🔙 Atpakaļ' : '📋 Skatīt atsauksmes' }}
    </button>

    <!-- REVIEWS SECTION -->
    <div v-if="showReviews" class="reviews-section">
      <h2>📋 Visas atsauksmes</h2>
      <div v-if="allReviews.length === 0" class="no-reviews">Nav atsauksmju</div>
      <div v-for="(review, index) in allReviews" :key="index" class="review-card">
        <p class="review-text">"{{ review.review }}"</p>
        <p class="review-meta">📧 {{ review.email || 'Anonīms' }}</p>
        <button @click="deleteReview(review)" class="delete-review-btn">🗑️ Dzēst</button>
      </div>
    </div>

    <!-- DASHBOARD -->
    <div class="dashboard">
      <div class="card">
        <h3>Lietotāji</h3>
        <p>{{ users.length }}</p>
      </div>

      <div class="card">
        <h3>Aktīvie</h3>
        <p>{{ activeUsers }}</p>
      </div>
    </div>

    <!-- SEARCH -->
    <input v-model="search" placeholder="🔍 Meklēt..." class="search"/>

    <!-- LEADERBOARD -->
    <div class="leaderboard">
      <h2>🏆 Top lietotāji</h2>
      <div v-for="(user, i) in topUsers" :key="user.username" class="leader-item">
        {{ i+1 }}. {{ user.username }} — {{ user.total }} treniņi
      </div>
    </div>

    <!-- USERS -->
    <div v-for="user in filteredUsers" :key="user.username"
         :class="['user-card', { inactive: user.total === 0 }]">

      <!-- EDIT / DISPLAY -->
      <div v-if="editingUser === user.username" class="edit-section">
        <input v-model="editUsername" class="edit-input"/>
        <button @click="saveEdit(user.username)">💾</button>
        <button @click="cancelEdit">❌</button>
      </div>

      <div v-else>
        <h3>{{ user.username }}</h3>
        <div class="actions">
          <button @click="startEdit(user.username)">✏️</button>
          <button @click="deleteUser(user.username)">🗑️</button>
        </div>
      </div>

      <p>📧 {{ user.email || 'Nav e-pasta' }}</p>
      <p>📊 Kopā treniņi: <b>{{ user.total }}</b></p>

      <!-- EMAIL -->
      <div class="email-section">
        <input v-model="emailMessage[user.username]" placeholder="Ziņa..."/>
        <button @click="sendReminder(user)">📨</button>
      </div>

      <!-- STATS -->
      <button @click="loadStats(user.username)" class="stats-btn">
        📊 Cik bieži ir veikti ieraksti
      </button>

      <div v-if="userStats[user.username]" class="stats">
        <div v-for="(v,k) in userStats[user.username]" :key="k" class="stat-row">
          <span>{{ formatName(k) }}</span>
          <b>{{ v }}</b>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [],
      search: '',
      emailMessage: {},
      userStats: {},
      editingUser: null,
      editUsername: '',
      showReviews: false,
      allReviews: []
    };
  },

  computed: {
    filteredUsers() {
      const s = this.search.toLowerCase();
      return [...this.users]
        .filter(u => u.username.toLowerCase().includes(s))
        .sort((a,b)=>{
          const aS = a.username.toLowerCase().startsWith(s);
          const bS = b.username.toLowerCase().startsWith(s);
          if(aS && !bS) return -1;
          if(!aS && bS) return 1;
          return b.total - a.total;
        });
    },

    topUsers() {
      return [...this.users].sort((a,b)=>b.total-a.total).slice(0,5);
    },

    activeUsers() {
      return this.users.filter(u => u.total > 0).length;
    }
  },

  methods: {

    async fetchUsers() {
      const endpoints = [
        'users',
        'dips','pullups','squat',
        'benchpress','deadlift','gymsquat','overheadpress','latpulldown',
        'run_1km','run_5km','run_10km','run_halfmarathon','run_marathon'
      ];

      const results = await Promise.all(
        endpoints.map(e => fetch(`http://localhost:5000/${e}`).then(r=>r.json()))
      );

      const users = results[0];

      this.users = users.map(u=>{
        let total = 0;

        results.slice(1).forEach(table=>{
          total += table.filter(r =>
            r.username &&
            r.username.toLowerCase().trim() === u.username.toLowerCase().trim()
          ).length;
        });

        return { ...u, total };
      });
    },

    sendReminder(user) {
      const msg = this.emailMessage[user.username];
      if(!msg) return alert("Ievadi ziņu");

      const url =
        `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(user.email)}&su=FitLib&body=${encodeURIComponent(msg)}`;

      window.open(url,'_blank');
      this.emailMessage[user.username]='';
    },

    async loadStats(username) {
      const endpoints = [
        'dips','pullups','squat',
        'benchpress','deadlift','gymsquat','overheadpress','latpulldown',
        'run_1km','run_5km','run_10km','run_halfmarathon','run_marathon'
      ];

      const results = await Promise.all(
        endpoints.map(e => fetch(`http://localhost:5000/${e}`).then(r=>r.json()))
      );

      const stats = {};

      endpoints.forEach((name, i) => {
        stats[name] = results[i].filter(r =>
          r.username &&
          r.username.toLowerCase().trim() === username.toLowerCase().trim()
        ).length;
      });

      this.userStats[username] = stats;
    },

    startEdit(username) {
      this.editingUser = username;
      this.editUsername = username;
    },

    cancelEdit() {
      this.editingUser = null;
      this.editUsername = '';
    },

    saveEdit(oldUsername) {
      if (!this.editUsername.trim()) return;

      fetch('http://localhost:5000/edit-username', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldUsername,
          newUsername: this.editUsername.trim()
        })
      }).then(() => {
        this.fetchUsers();
        this.cancelEdit();
      });
    },

    deleteUser(username) {
      if (!confirm(`Dzēst ${username}?`)) return;

      fetch(`http://localhost:5000/delete-account/${username}`, {
        method: 'DELETE'
      }).then(() => {
        this.users = this.users.filter(u => u.username !== username);
      });
    },

    formatName(k){
      return k.replace('_',' ').toUpperCase();
    },

    async toggleReviews() {
      if (!this.showReviews) {
        // Same approach as HomeView but with cache-busting
        fetch('http://localhost:5000/allreviews?t=' + Date.now())
          .then(res => res.json())
          .then(data => {
            console.log('Reviews:', data);
            if (data && data.length > 0) {
              this.allReviews = data;
            }
          })
          .catch(e => console.error('Error:', e));
      }
      this.showReviews = !this.showReviews;
    },

    async deleteReview(review) {
      if (!confirm('Vai tiešām dzēst šo atsauksmi?')) return;
      
      try {
        await fetch('http://localhost:5000/delete-review', { 
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: review.email, review: review.review })
        });
        this.allReviews = this.allReviews.filter(r => r.review !== review.review || r.email !== review.email);
      } catch (e) {
        console.error('Error deleting review:', e);
        alert('Neizdevās dzēst atsauksmi');
      }
    }
  },

  mounted() {
    this.fetchUsers();
  }
};
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  background: linear-gradient(to bottom right, #330000, #660000, #990000);
  padding: 40px 20px;
  color: #fff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* TITLE */
.title {
  text-align: center;
  font-size: 2.8rem;
  font-weight: 900;
  margin-bottom: 30px;
  text-shadow: 0 0 15px #ff3b3bcc;
}

/* DASHBOARD */
.dashboard {
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.card {
  flex: 1;
  min-width: 150px;
  background: rgba(0,0,0,0.3);
  backdrop-filter: blur(10px);
  padding: 25px;
  border-radius: 18px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px) scale(1.03);
}

.card h3 {
  color: #ffb0b0;
}

.card p {
  font-size: 2rem;
  font-weight: bold;
  color: #ffd700;
}

/* SEARCH */
.search {
  width: 100%;
  padding: 14px;
  border-radius: 30px;
  border: none;
  margin-bottom: 25px;
  background: rgba(0,0,0,0.4);
  color: white;
  outline: none;
  box-shadow: 0 0 10px rgba(255,0,0,0.4);
}

/* LEADERBOARD */
.leaderboard {
  background: rgba(0,0,0,0.35);
  padding: 20px;
  border-radius: 18px;
  margin-bottom: 25px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.4);
}

.leader-item {
  margin: 8px 0;
  color: #ffd700;
  font-weight: 600;
}

/* USER CARD */
.user-card {
  background: rgba(0,0,0,0.35);
  padding: 18px;
  margin-bottom: 15px;
  border-radius: 18px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.4);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.user-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(255,50,50,0.4);
}

.user-card.inactive {
  border: 2px solid #ff3b3b;
}

/* HEADER */
.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* ACTION BUTTONS */
.actions {
  display: flex;
  gap: 10px;
}

button {
  background: linear-gradient(to right, #ff4e50, #ff0000);
  border: none;
  padding: 6px 12px;
  border-radius: 20px;
  color: white;
  cursor: pointer;
  transition: 0.25s;
  font-weight: 600;
}

button:hover {
  transform: scale(1.08);
  background: linear-gradient(to right, #ff1f1f, #cc0000);
}

/* EMAIL */
.email-section {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.email-section input {
  flex: 1;
  padding: 8px;
  border-radius: 20px;
  border: none;
  background: rgba(0,0,0,0.4);
  color: white;
}

/* STATS BUTTON */
.stats-btn {
  margin-top: 10px;
  background: linear-gradient(to right, #ffcc00, #ff9900);
  color: black;
}

/* STATS BOX */
.stats {
  margin-top: 10px;
  background: rgba(0,0,0,0.6);
  padding: 10px;
  border-radius: 10px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  padding: 3px 0;
  color: #ffd6d6;
}

/* EDIT */
.edit-section {
  display: flex;
  gap: 10px;
}

.edit-input {
  padding: 6px;
  border-radius: 10px;
  border: none;
  background: rgba(0,0,0,0.5);
  color: white;
}

/* REVIEWS TOGGLE BUTTON */
.reviews-toggle-btn {
  display: block;
  width: 100%;
  padding: 14px;
  margin-bottom: 20px;
  background: linear-gradient(to right, #4a90d9, #357abd);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.25s, box-shadow 0.25s;
}

.reviews-toggle-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 5px 20px rgba(74, 144, 217, 0.5);
}

/* REVIEWS SECTION */
.reviews-section {
  background: rgba(0,0,0,0.4);
  padding: 20px;
  border-radius: 18px;
  margin-bottom: 25px;
}

.reviews-section h2 {
  margin-bottom: 15px;
  color: #ffd700;
}

.no-reviews {
  text-align: center;
  color: #aaa;
  padding: 20px;
}

.review-card {
  background: rgba(0,0,0,0.5);
  padding: 15px;
  margin-bottom: 12px;
  border-radius: 12px;
  border-left: 4px solid #4a90d9;
}

.review-text {
  font-style: italic;
  color: #fff;
  margin-bottom: 8px;
}

.review-meta {
  font-size: 0.85rem;
  color: #aaa;
  margin-bottom: 10px;
}

.delete-review-btn {
  background: linear-gradient(to right, #d94a4a, #bd3535);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
}

.delete-review-btn:hover {
  transform: scale(1.05);
}

/* RESPONSIVE */
@media (max-width: 720px) {
  .title {
    font-size: 2rem;
  }

  .dashboard {
    flex-direction: column;
  }

}
</style>