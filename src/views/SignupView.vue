<template>
  <div class="signup-container">
    <form @submit.prevent="signup" class="email-section">
      <h1>Reģistrācija</h1>
      <input type="text" v-model="form.Username" placeholder="Lietotājvārds" required />
      <input type="email" v-model="form.Email" placeholder="E-pasts" required />
      <input type="password" v-model="form.Password" placeholder="Parole" required />
      <button type="submit" class="signup-button">Reģistrēties</button>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>

    <div class="user-list">
      <h2>Esošie Lietotāji (test)</h2>
      <ul>
        <li v-for="(user, index) in users" :key="index">
          <strong>Lietotājvārds:</strong> {{ user.username }}<br />
          <strong>Parole:</strong> {{ user.password }}<br />
          <strong>E-pasts:</strong> {{ user.email }}<br />
          <strong>Loma:</strong> {{ user.role }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({
  Username: '',
  Email: '',
  Password: ''
});
const users = ref([]);
const errorMessage = ref('');

const fetchUsers = async () => {
  try {
    const res = await fetch('http://localhost:5000/users');
    users.value = await res.json();
  } catch (err) {
    console.error('Neizdevās ielādēt lietotājus:', err);
  }
};

const signup = async () => {
  errorMessage.value = '';
  try {
    const res = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: form.Username,
        password: form.Password,
        email: form.Email
      })
    });

    const result = await res.json();
    if (!res.ok) {
      errorMessage.value = result.error || 'Reģistrācija neizdevās';
      return;
    }

    console.log('Lietotājs reģistrēts!');
    localStorage.setItem('loggedInUser', form.Username);
    await fetchUsers();
    router.push('/programm');
  } catch (error) {
    errorMessage.value = 'Servera kļūda';
    console.error(error);
  }
};

onMounted(fetchUsers);
</script>

<style scoped>
.signup-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.email-section > input {
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.signup-button {
  width: 100%;
  padding: 10px;
  background-color: green;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.signup-button:hover {
  background-color: darkgreen;
}

.error-message {
  color: red;
  margin-top: 10px;
  text-align: center;
}

.user-list {
  margin-top: 30px;
  background: #f0f0f0;
  padding: 15px;
  border-radius: 10px;
}
</style>
