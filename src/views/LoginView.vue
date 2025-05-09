<template>
  <div class="login-container">
    <form @submit.prevent="login" class="email-section">
      <h1>Logins</h1>
      <input type="email" v-model="form.Email" placeholder="E-pasta adrese" required />
      <input type="password" v-model="form.Password" placeholder="Parole" required />
      <button type="submit" class="login-button">Login</button>
      <div class="signup-section">
        <p>Forgot password? <a href="" class="signup-link">Haha. Biezpiens jāēd</a></p>
      </div>
    </form>

    <div class="user-list">
      <h2>Lietotāji</h2>
      <ul>
        <li v-for="(user, index) in users" :key="index">
          <strong>Lietotājvārds:</strong> {{ user.Username }}<br />
          <strong>Parole:</strong> {{ user.Pasword }}<br />
          <strong>E-pasts:</strong> {{ user['e-past'] }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';

const form = reactive({
  Email: '',
  Password: ''
});

const users = ref([]);

const login = async () => {
  console.log('Login ar:', form.Email, form.Password);
  // Šeit vari pievienot fetch uz backend login POST endpointu
};

const fetchUsers = async () => {
  try {
    const response = await fetch('http://localhost:5000/users');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    users.value = await response.json();
  } catch (error) {
    console.error('Kļūda ielādējot lietotājus:', error);
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.login-container {
  position: relative;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.email-section {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.email-section > input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.login-button {
  width: 100%;
  padding: 10px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

.login-button:hover {
  background-color: darkred;
}

.signup-link {
  color: #1db954;
  text-decoration: none;
}

.user-list {
  margin-top: 30px;
  text-align: left;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
}

.user-list ul {
  list-style: none;
  padding: 0;
}

.user-list li {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
</style>
