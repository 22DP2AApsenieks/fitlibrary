<template>
    <div class="login-container">
      <h1>Sign up or u gay</h1>
      <div class="email-section">
        <input v-model="email" type="email" placeholder="Ievadi savu e-pasta adresi" class="email-input" />
        
      </div>
      <button v-if="email" class="next-button">tālāk</button>
      <div class="social-login">
        <button class="social-button google">Google</button>
        <button class="social-button facebook">Facebook</button>
        <button class="social-button apple">Apple</button>
      </div>
      <div class="footer">
        <p>Alredy have acc? <a href="#">Login</a></p>
      </div>
      <div class="disclaimer">
        <p>This data is processed by our Skibidi and Sigma with limited license copies.</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LoginView',
    data() {
      return {
        email: ''
      };
    }
  };
  </script>
  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
  }
  
  .email-section {
    margin: 20px 0;
  }
  
  .email-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
  }
  
  .next-button {
    width: 100%;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 10px;
  }
  
  .social-login {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
  }
  
  .social-button {
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  }
  
  .google {
    background-color: #db4437;
    color: white;
  }
  
  .facebook {
    background-color: #4267B2;
    color: white;
  }
  
  .apple {
    background-color: #000;
    color: white;
  }
  
  .footer {
    margin-top: 20px;
  }
  
  .disclaimer {
    margin-top: 30px;
    font-size: 12px;
    color: #666;
  }
  </style>