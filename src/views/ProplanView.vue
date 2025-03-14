<template>
    <div>
      <h2>Coaching Plans</h2>
      <div class="coaching-plans">
        <router-link to="/pro">
          <div class="plan">
            <img src="../assets/images/proplan.jfif" alt="Pro Plan" />
            <h3>Pro Plan</h3>
            <p>Includes ALL workout plans. Diet recomendations from coach. Personal couch.</p>
          </div>
        </router-link>
      </div>

      <router-link to="/checkout" class="take-my-money">
        <button>59.99$/Month</button>
      </router-link>
    </div>
  </template>
  
  <style scoped>
  h2 {
    text-align: center;
    margin-top: 20px;
  }
  .coaching-plans {
    display: flex;
    justify-content: center;
    margin: 20px;
    gap: 20px;
  }
  .plan {
    width: 250px;
    border: 1px solid #ccc;
    border-radius: 10px;
    overflow: hidden;
    text-align: center;
    transition: transform 0.3s;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  .plan:hover {
    transform: translateY(-20px);
  }
  .plan img {
    width: 100%;
    border-bottom: 1px solid #ccc;
  }
  .plan h3 {
    margin: 10px 0;
  }
  .plan p {
    padding: 0 10px;
  }
  .take-my-money {
    display: block;
    margin: 20px auto;
    text-align: center;
  }
  .take-my-money button {
    background-color: #34C759;
    color: #fff;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
  }
  .take-my-money button:hover {
    background-color: #2E865F;
  }
  </style> 