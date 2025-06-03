<template>
  <section class="signup-section">
    <div class="signup-content">
      <form @submit.prevent="signup" class="signup-form">
        <h1>Sign Up</h1>
        <input type="text" v-model="form.Username" placeholder="Username" required />
        <input type="email" v-model="form.Email" placeholder="Email" required />
        <input type="password" v-model="form.Password" placeholder="Password" required />
        <button type="submit" class="signup-button">Sign Up</button>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <div class="redirect-login">
          <p>Already have an account?
            <router-link to="/login" class="login-link"> Log in here</router-link>
          </p>
        </div>
      </form>

      
    </div>
  </section>
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
.signup-section {
  min-height: 100vh;
  background: linear-gradient(to bottom right, #330000, #660000, #990000);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #fff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.signup-content {
  background: linear-gradient(to bottom right, #000000, #3f3f3f, #666666);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 12px 32px rgba(255, 0, 0, 0.6);
  max-width: 500px;
  width: 100%;
  animation: fadeInUp 1.2s ease forwards;
}

.signup-form h1 {
  font-size: 2.5rem;
  margin-bottom: 25px;
  text-align: center;
  font-weight: bold;
  text-shadow: 0 0 15px #ff3b3fcc;
}

.signup-form input {
  width: 100%;
  padding: 14px;
  margin-bottom: 16px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  background: #fff;
  color: #333;
  box-shadow: 0 4px 10px rgba(255, 0, 0, 0.3);
  transition: box-shadow 0.3s ease;
}

.signup-form input:focus {
  outline: none;
  box-shadow: 0 0 10px rgba(255, 204, 0, 0.9);
}

.signup-button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(to right, #ffcc00, #ff9900);
  color: black;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(255, 204, 0, 0.4);
  transition: transform 0.3s ease, background 0.3s ease;
}

.signup-button:hover {
  background: linear-gradient(to right, #e6b800, #cc8400);
  transform: scale(1.05);
}

.error-message {
  color: #ff9999;
  margin-top: 10px;
  text-align: center;
  font-weight: 500;
}

.redirect-login {
  text-align: center;
  margin-top: 20px;
}

.login-link {
  color: #ffd700;
  font-weight: 600;
  text-decoration: underline;
}

.user-list {
  margin-top: 40px;
  background: rgba(255, 255, 255, 0.07);
  padding: 20px;
  border-radius: 16px;
  font-size: 0.95rem;
  color: #ffe0e0;
  box-shadow: 0 4px 20px rgba(255, 0, 0, 0.2);
}

.user-list h2 {
  text-align: center;
  margin-bottom: 16px;
  color: #ffdb3b;
}

/* Animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 600px) {
  .signup-content {
    padding: 25px 20px;
  }

  .signup-form h1 {
    font-size: 2rem;
  }
}
</style>
