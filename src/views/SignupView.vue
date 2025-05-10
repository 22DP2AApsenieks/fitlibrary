<template>
  <div class="signup-container">
    <form @submit.prevent="signup" class="email-section">
      <h1>Signup</h1>
      <input type="text" v-model="form.Username" placeholder="Username" required />
      <input type="password" v-model="form.Password" placeholder="Password" required />
      <input type="email" v-model="form.Email" placeholder="Email" required />
      <button type="submit" class="signup-button">Signup</button>

      <!-- Error Message Section -->
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <div class="login-section">
        <p>Already have an account? <a href="/login" class="login-link">Login here</a></p>
      </div>
    </form>

    <div class="user-list">
      <h2>Current Users</h2>
      <ul>
        <li v-for="(user, index) in users" :key="index">
          <strong>Username:</strong> {{ user.username }}<br />
          <strong>Password:</strong> {{ user.password }}<br />
          <strong>Email:</strong> {{ user.email }}<br />
          <strong>Role:</strong> {{ user.role }}<br />
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
  Password: '',
  Email: ''
});

const users = ref([]);
const errorMessage = ref('');

const signup = async () => {
  errorMessage.value = '';

  // Check if the username already exists
  const userExists = users.value.some(u => u.username === form.Username);

  if (userExists) {
    errorMessage.value = 'Username is already taken.';
    return;
  }

  // If username is not taken, proceed with signup logic
  const newUser = {
    username: form.Username,
    password: form.Password,
    email: form.Email,
    role: 'user' // Default role for the new user
  };

  // For testing, save the new user locally
  users.value.push(newUser);

  console.log('Signup successful');
  localStorage.setItem('loggedInUser', form.Username); // Save the username
  router.push('/programm'); // Redirect to /programm
};

const fetchUsers = async () => {
  try {
    const response = await fetch('http://localhost:5000/users');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    users.value = await response.json();
  } catch (error) {
    console.error('Error loading users:', error);
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.signup-container {
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

.signup-button {
  width: 100%;
  padding: 10px;
  background-color: green;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

.signup-button:hover {
  background-color: darkgreen;
}

.login-link {
  color: #1db954;
  text-decoration: none;
}

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
