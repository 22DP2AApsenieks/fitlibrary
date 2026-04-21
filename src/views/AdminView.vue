<template>
  <div>
    <h1>Administratora panelis</h1>
    <p>Laipni lūgts, {{ username }}!</p>

    <h2>Visi lietotāji</h2>
    <ul v-if="users.length" class="user-list">
      <li v-for="user in users" :key="user.username" class="user-item">
        <span v-if="!editingUser || editingUser !== user.username">{{ user.username }}</span>
        <input
          v-else
          v-model="editUsername"
          @keyup.enter="saveEdit(user.username)"
          @blur="cancelEdit"
          class="edit-input"
        />
        <button 
          class="edit-btn" 
          @click="startEdit(user.username, user.username)" 
          v-if="!editingUser || editingUser !== user.username"
        >
          Rediģēt
        </button>
        <button 
          class="save-btn" 
          @click="saveEdit(user.username)" 
          v-if="editingUser === user.username"
        >
          Saglabāt
        </button>
        <button 
          class="cancel-btn" 
          @click="cancelEdit" 
          v-if="editingUser === user.username"
        >
          Atcelt
        </button>
        <button class="delete-btn" @click="deleteUser(user.username)">
          Dzēst
        </button>
      </li>
    </ul>
    <p v-else>Nav atrasti lietotāji.</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: localStorage.getItem('loggedInUser') || '',
      users: [],
      editingUser: null,
      editUsername: ''
    };
  },
  methods: {
    fetchUsers() {
      // paņemam visus lietotājus no backend
      fetch('http://localhost:5000/users')
        .then(res => res.json())
        .then(data => {
          this.users = data;
        })
        .catch(() => {
          this.users = [];
        });
    },
    deleteUser(username) {
      if (confirm(`Dzēst lietotāju "${username}"?`)) {
        fetch(`http://localhost:5000/delete-account/${username}`, { method: 'DELETE' })
          .then(res => res.json())
          .then(() => {
            // izmetam no loka bez reload
            this.users = this.users.filter(u => u.username !== username);
          });
      }
    },
    startEdit(username, currentName) {
      this.editingUser = username;
      this.editUsername = currentName;
    },
    cancelEdit() {
      this.editingUser = null;
      this.editUsername = '';
    },
    saveEdit(oldUsername) {
      if (!this.editUsername.trim()) return;

      fetch(`http://localhost:5000/edit-username`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          oldUsername, 
          newUsername: this.editUsername.trim() 
        })
      })
        .then(res => res.json())
        .then(() => {
          this.cancelEdit();
          this.fetchUsers(); // pēc edit refreshojam listu
        });
    }
  },
  mounted() {
    this.fetchUsers();
  }
};
</script>

<style scoped>
.user-list {
  list-style: none;
  padding: 0;
  margin-top: 24px;
  max-width: 600px;
}
.user-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 10px;
}
.edit-btn {
  background: #007bff;
  color: #fff;
  border: none;
  padding: 4px 12px;
  border-radius: 5px;
  cursor: pointer;
}
.save-btn {
  background: #28a745;
  color: #fff;
  border: none;
  padding: 4px 12px;
  border-radius: 5px;
  cursor: pointer;
}
.cancel-btn {
  background: #aaa;
  color: #fff;
  border: none;
  padding: 4px 12px;
  border-radius: 5px;
  cursor: pointer;
}
.delete-btn {
  background: #d32f2f;
  color: #fff;
  border: none;
  padding: 4px 12px;
  border-radius: 5px;
  cursor: pointer;
}
.edit-input {
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>
