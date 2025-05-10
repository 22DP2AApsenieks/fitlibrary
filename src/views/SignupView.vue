<template>
  <div class="signup-container">
    <form @submit.prevent="signup" class="signup-form">
      <h1>Reģistrācija</h1>
      <input type="text" v-model="form.username" placeholder="Lietotājvārds" required />
      <input type="password" v-model="form.password" placeholder="Parole" required />
      <input type="email" v-model="form.email" placeholder="E-pasts" required />
      <button type="submit" class="signup-button">Reģistrēties</button>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

      <div class="login-link-section">
        <p>Jau ir konts? <router-link to="/login" class="login-link">Pieslēgties</router-link></p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({
  username: '',
  password: '',
  email: '',
  role: 'user' // Default role
});

const errorMessage = ref('');
const successMessage = ref('');

const signup = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Reģistrācija neizdevās');
    }

    successMessage.value = 'Reģistrācija veiksmīga!';
    setTimeout(() => router.push('/login'), 2000);
  } catch (error) {
    errorMessage.value = error.message;
  }
};
</script>

<style scoped>
.signup-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.signup-form input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.signup-button {
  padding: 10px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.signup-button:hover {
  background-color: darkred;
}

.error-message {
  color: red;
  text-align: center;
}

.success-message {
  color: green;
  text-align: center;
}

.login-link {
  color: #1db954;
  text-decoration: none;
}

.login-link-section {
  text-align: center;
  margin-top: 15px;
}
</style>