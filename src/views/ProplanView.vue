<template>
  <section class="hero-section">
    <div class="content">
      <h1>Pro Coaching Plan</h1>
      <p class="intro">
        This plan is for those who want the highest level of support and performance.
        We've built it for ambitious individuals who are ready to take full control of their fitness and transformation journey — no shortcuts, just results.
      </p>

      <p class="details">
        With the Pro Plan, you don’t just get workouts. You get a system, a coach, and a proven roadmap. Everything is tailored to you:
      </p>

      <ul class="features">
        <li>All full-body, split, PPL and calisthenics programs included</li>
        <li>Ongoing updates to plans based on your progress</li>
        <li>Personal coach feedback via email or video check-ins</li>
        <li>Basic meal plans and diet guidance from certified trainer</li>
        <li>Direct access to us for questions and accountability</li>
      </ul>

      <img class="plan-image" src="../assets/images/proplan.jfif" alt="Pro Plan" />

      <div class="action">
        <router-link to="/checkout">
          <button class="cta-button">Subscribe – $59.99/month</button>
        </router-link>
        <p class="note">Includes coaching, updates and priority support.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  min-height: 100vh;
  background: linear-gradient(to bottom right, #330000, #660000, #990000);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.content {
  max-width: 900px;
  text-align: center;
  animation: fadeIn 1.2s ease-in-out;
}

h1 {
  font-size: 3rem;
  margin-bottom: 20px;
}

.intro {
  font-size: 1.2rem;
  margin-bottom: 20px;
  line-height: 1.6;
  color: #f1dada;
}

.details {
  font-size: 1rem;
  margin-bottom: 20px;
  color: #f3bfbf;
}

.features {
  list-style: none;
  padding: 0;
  margin-bottom: 30px;
}

.features li {
  margin: 12px 0;
  font-size: 1.05rem;
  position: relative;
  padding-left: 25px;
  text-align: left;
}

.features li::before {
  content: "✔";
  position: absolute;
  left: 0;
  color: #ffc107;
  font-weight: bold;
}

.plan-image {
  width: 100%;
  max-width: 600px;
  border-radius: 16px;
  margin: 30px auto;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.action {
  margin-top: 30px;
}

.cta-button {
  background: linear-gradient(to right, #ff4e50, #f00000);
  border: none;
  padding: 14px 36px;
  font-size: 18px;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.3s ease, background 0.3s ease;
  color: white;
  box-shadow: 0 6px 18px rgba(255, 78, 80, 0.5);
}

.cta-button:hover {
  background: linear-gradient(to right, #cc0000, #900000);
  transform: scale(1.05);
}

.note {
  margin-top: 10px;
  font-size: 0.9rem;
  color: #eee;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
