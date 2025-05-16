<template>
  <section class="coaching-section">
    <div class="coaching-content">
      <h2>Coaching Plans</h2>
      <div class="coaching-plans">
        <router-link to="/basic">
          <div class="plan red-gradient">
            <img src="../assets/images/noobplan.jfif" alt="Basic Plan" />
            <h3>Basic Plan</h3>
            <p>Coaching plans</p>
          </div>
        </router-link>

        <router-link to="/pro">
          <div class="plan red-gradient">
            <img src="../assets/images/proplan.jfif" alt="Pro Plan" />
            <h3>Pro Plan</h3>
            <p>Coaching + diet recommendations + support</p>
          </div>
        </router-link>

        <router-link to="/proplus">
          <div class="plan red-gradient">
            <img src="../assets/images/pro+plan.jfif" alt="Pro+ Plan" />
            <h3>Pro+ Plan</h3>
            <p>All maxed out with 24/7 support</p>
          </div>
        </router-link>
      </div>

      <router-link to="/checkout" class="take-my-money">
        <button class="cta-button">Take My Money</button>
      </router-link>
    </div>
  </section>
</template>

<style scoped>
.coaching-section {
  min-height: 100vh;
  background: linear-gradient(to bottom right, #2b0101, #490202, #1b0303);
  color: #f7f7f7;
  display: flex;
  align-items: flex-start; /* Pacel saturu uz augšu */
  justify-content: center;
  padding: 30px 20px 60px; /* Mazāks top padding, vairāk apakšā */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}


.coaching-content {
  max-width: 1200px;
  width: 100%;
  text-align: center;
  animation: fadeIn 1s ease-in-out;
}

h2 {
  font-size: 2.5rem;
  margin-bottom: 40px;
  color: #ffffff;
}

.coaching-plans {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  margin-bottom: 40px;
}

.plan {
  width: 280px;
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 8px 24px rgba(255, 0, 0, 0.2);
  cursor: pointer;
  color: white;
}

.plan:hover {
  transform: translateY(-12px);
  box-shadow: 0 12px 36px rgba(255, 0, 0, 0.4);
}

.red-gradient {
  background: linear-gradient(to bottom right, #ff1e1e, #990000);
}

.plan img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-bottom: 2px solid #770000;
}

.plan h3 {
  margin: 15px 0 5px;
  font-size: 1.4rem;
  color: #fff;
}

.plan p {
  font-size: 1rem;
  color: #ddd;
  padding: 0 15px 20px;
}

.take-my-money {
  display: inline-block;
  margin-top: 10px;
}

.cta-button {
  background: linear-gradient(to right, #ff4444, #cc0000);
  color: white;
  border: none;
  padding: 14px 36px;
  font-size: 18px;
  border-radius: 30px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s ease, transform 0.3s ease;
  box-shadow: 0 6px 16px rgba(255, 0, 0, 0.3);
}

.cta-button:hover {
  background: linear-gradient(to right, #e60000, #990000);
  transform: scale(1.05);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
