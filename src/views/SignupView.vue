<template>
  <div class="signup-container">
    <h1>Sign up</h1>
    <input v-model="username" type="text" placeholder="Username" class="input-field" />
    <input v-model="email" type="email" placeholder="E-pasta adrese" class="input-field" />
    <input v-model="password" type="password" placeholder="Password" class="input-field" />
    <button class="login-button">Sign up</button>
    <p>Alredy have acc <a href="#">Ur sigma</a></p>
  </div>
</template>

<script>
export default {
  name: 'SignupView',
  data() {
    return {
      username: '',
      email: '',
      password: ''
    };
  }
};
</script>

<style scoped>
.signup-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.input-field {
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
</style>
