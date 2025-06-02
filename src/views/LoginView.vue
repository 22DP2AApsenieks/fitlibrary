<template>
  <div class="login-container">
    <form @submit.prevent="login" class="email-section">
      <h1>Logins</h1>
      <input type="text" v-model="form.Username" placeholder="Username" required /> <!-- Changed to "text" for username -->
      <input type="password" v-model="form.Password" placeholder="Parole" required />
      <button type="submit" class="login-button">Login</button>
      
      <!-- Error Message Section -->
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <div class="Signup-section">
        <p>Forgot password? <router-link to="/signup" class="Signup-link">Haha. Biezpiens jāēd</router-link></p>
      </div>
    </form>

    <div class="user-list">
      <h2>Lietotāji</h2>
      <ul>
        <li v-for="(user, index) in users" :key="index">
          <strong>Lietotājvārds:</strong> {{ user.username }}<br />
          <strong>Parole:</strong> {{ user.password }}<br />
          <strong>E-pasts:</strong> {{ user['email'] }}<br />
          <strong>role:</strong> {{ user['role'] }}<br />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
// Import Vue Router
import { useRouter } from 'vue-router';

const router = useRouter();

const form = reactive({
  Username: '',  // Changed from Email to Username
  Password: ''
});

const users = ref([]);
const errorMessage = ref(''); // Reactive error message variable

const login = async () => {
  errorMessage.value = '';

  const user = users.value.find(u => u.username === form.Username);

  if (user && user.password === form.Password) {
    console.log('Login successful');
    localStorage.setItem('loggedInUser', user.username);  // Save username

    // Redirect based on role or username
    if (user.username === 'admin' || user.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/programm');
    }
  } else {
    console.error('Incorrect username or password');
    errorMessage.value = 'Incorrect username or password';
  }
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
  min-height: 100vh;
  background: linear-gradient(to bottom right, #000000, #202020, #302500,  #000000);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #f5f5f5;
}

.email-section {
  background: linear-gradient(to bottom right, #f70000, #bb0000 , #800101);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(255, 0, 0, 0.3);
  max-width: 400px;
  width: 100%;
  text-align: center;
  animation: fadeIn 1s ease-in-out;
}

.email-section h1 {
  margin-bottom: 20px;
  font-size: 2rem;
  color: #fff;
}

.email-section > input {
  width: 100%;
  padding: 12px;
  margin: 12px 0;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  background: #222;
  color: #fff;
  transition: border 0.3s ease;
}

.email-section > input:focus {
  outline: none;
  border: 2px solid #ff6666;
}

.login-button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(to right, #ff4444, #cc0000);
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  margin-top: 12px;
  transition: background 0.3s ease, transform 0.3s ease;
}

.login-button:hover {
  background: linear-gradient(to right, #e60000, #990000);
  transform: scale(1.03);
}

.signup-link {
  color: #ffaaaa;
  text-decoration: underline;
  font-weight: 500;
}

.Signup-section {
  margin-top: 15px;
}

.error-message {
  color: #ffaaaa;
  margin-top: 10px;
  font-size: 14px;
}

.user-list {
  margin-top: 40px;
  background: #222;
  padding: 20px;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  color: #ddd;
  box-shadow: 0 6px 16px rgba(255, 0, 0, 0.1);
}

.user-list h2 {
  margin-bottom: 15px;
  color: #ff6666;
}

.user-list ul {
  list-style: none;
  padding: 0;
}

.user-list li {
  padding: 12px;
  border-bottom: 1px solid #444;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
