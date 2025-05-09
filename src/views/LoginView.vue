<template>
  <div class="login-container">
    <form @submit.prevent="login" class="email-section">
      <h1>Logins</h1>
      <input type="text" v-model="form.Username" placeholder="Username" required /> <!-- Changed to "text" for username -->
      <input type="password" v-model="form.Password" placeholder="Parole" required />
      <button type="submit" class="login-button">Login</button>
      
      <!-- Error Message Section -->
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

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
  // Reset the error message on each login attempt
  errorMessage.value = '';

  // Find the user by username
  const user = users.value.find(u => u.Username === form.Username); // Now searching by Username
  
  // If user exists and the password matches
  if (user && user.Pasword === form.Password) {
    console.log('Login successful');
    
    // You can add a redirection here using Vue Router
    // After successful login, you can route to another page
    // router.push('/dashboard'); // Example: Redirect to a "dashboard" page
    
  } else {
    console.error('Incorrect username or password');
    errorMessage.value = 'Incorrect username or password'; // Set the error message
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

/* Style for error message */
.error-message {
  color: red;
  margin-top: 10px;
  font-size: 14px;
  text-align: center;
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
