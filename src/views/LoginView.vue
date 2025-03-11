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
        <p>No acc? <a href="" class="signup-link">Haha. time to change it</a></p>
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
  text-align: center;
  position: absolute;
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 30%;
  height: 20%;
  top: 20rem;
  right: 50%;
  transform: translateX(50%);
  font-size: larger;
}

.email-section > input {
  width: 100%;
  padding: 0.1rem, 0.1rem;
  height: 3rem;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: larger;
}

.login-button {
  width: 100%;

  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: larger;
  background-color: red; /* Red background */
  color: white; /* White text */
  cursor: pointer; /* Pointer cursor on hover */
}

.login-button:hover {
  background-color: darkred; /* Darker red on hover */
}
</style>