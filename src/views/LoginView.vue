<script>
import { reactive } from 'vue';
// defineProps({
// aaa: {
// type: String,
// default: "home",
// },
// })
const form = reactive({
Email: '',
Passwword: ''
})

const login = async () => {
console.log(form.Email);
};
</script>

<template>
  <div class="login-container">
    <form @submit.prevent="login" class="email-section">
      <h1>Logins</h1>
      <input type="email" placeholder="E-pasta adrese"/>
      <input type="password" placeholder="password" />
      <button type="submit" class="login-button">Login</button>
      <div class="signup-section">
        <p>Forgot pasword? <a href="" class="signup-link">Haha. Biezpiens jāēd</a></p>
        <!-- <p>No acc? <a href="#" class="signup-link">Haha. time to change it</a></p> -->
      </div>
    </form>
  </div>
</template>



<style scoped>
.login-container {
  position: relative;
}

.signup-link {
  color: #1db954;
  text-decoration: none;
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
  background-color: darkred; /* Darker red on hover */
}
</style>