<template>
  <div class="admin-container">
    <h1>⚙️ Administratora panelis</h1>

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
        📊 Statistika
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
      editUsername: ''
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
    }
  },

  mounted() {
    this.fetchUsers();
  }
};
</script>

<style scoped>
.admin-container {
  padding: 30px;
  background: #121212;
  color: #eee;
  font-family: Arial;
}

h1 { color: #ff3b3b; }

.dashboard {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.card {
  background: #1e1e1e;
  padding: 20px;
  border-radius: 10px;
  flex: 1;
}

.search {
  padding: 10px;
  width: 100%;
  margin-bottom: 20px;
  background: #1e1e1e;
  border: none;
  color: white;
}

.user-card {
  background: #1a1a1a;
  padding: 15px;
  margin-bottom: 12px;
  border-radius: 10px;
}

.user-card.inactive {
  border: 2px solid red;
}

.email-section {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

button {
  background: #ff3b3b;
  color: white;
  border: none;
  padding: 6px 10px;
  cursor: pointer;
}

button:hover {
  background: #ff1f1f;
}

.stats {
  margin-top: 10px;
  background: #111;
  padding: 10px;
  border-radius: 6px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
}

.leaderboard {
  background: #1a1a1a;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 10px;
}

.actions {
  display: flex;
  gap: 10px;
}

.edit-section {
  display: flex;
  gap: 10px;
}

.edit-input {
  padding: 5px;
  background: #222;
  color: white;
  border: none;
}
</style>