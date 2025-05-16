<template>
  <section class="hero-section">
    <div class="content">
      <h1>Welcome to FITLIBRARY</h1>
      <p class="intro">
        Discover the ultimate app to track your progress, smash your goals, and visualize your true potential.
        No more guessing — just real, actionable insights tailored to your fitness journey.
      </p>

      <p class="details">
        FITLIBRARY gives you everything you need:
      </p>

      <ul class="features">
        <li>Personalized workout tracking</li>
        <li>Progress visualization with graphs and stats</li>
        <li>Motivational reminders and PR tracking</li>
        <li>Clean, intuitive interface made for all levels</li>
        <li>Continuous updates with new features</li>
      </ul>

      <div class="image-wrapper">
        <img
          class="plan-image"
          src="../assets/images/pro+plan.jfif"
          alt="Average app user"
        />
        <span class="tooltip">Most average app user</span>
      </div>

      <div class="action">
        <router-link to="/signup">
          <button class="cta-button">Get Started Now</button>
        </router-link>
        <p class="note">Join thousands who’ve transformed their fitness journey.</p>
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
  overflow: hidden;
}

.content {
  max-width: 900px;
  text-align: center;
  animation: fadeInUp 1.2s ease forwards;
  user-select: none;
}

h1 {
  font-size: 3.4rem;
  margin-bottom: 20px;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-shadow: 0 0 15px #ff3b3fcc;
}

.intro {
  font-size: 1.25rem;
  margin-bottom: 20px;
  line-height: 1.6;
  color: #ffd6d6;
  font-weight: 500;
}

.details {
  font-size: 1.1rem;
  margin-bottom: 25px;
  color: #ffb0b0;
  font-weight: 600;
}

.features {
  list-style: none;
  padding: 0;
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.features li {
  margin: 12px 0;
  font-size: 1.1rem;
  position: relative;
  padding-left: 28px;
  text-align: left;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #ffe0e0;
}

.features li::before {
  content: "✔";
  position: absolute;
  left: 0;
  color: #ffdb3b;
  font-weight: 900;
  font-size: 1.2rem;
  top: 2px;
  text-shadow: 0 0 3px #ffd93baa;
}

/* Image wrapper to position tooltip */
.image-wrapper {
  position: relative;
  display: inline-block;
  cursor: pointer;
  margin-bottom: 40px;
}

.plan-image {
  width: 100%;
  max-width: 550px;
  border-radius: 20px;
  box-shadow: 0 12px 32px rgba(255, 0, 0, 0.6);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  user-select: none;
}

.plan-image:hover {
  transform: scale(1.05) rotate(1.5deg);
  box-shadow: 0 20px 40px rgba(255, 50, 50, 0.9);
}

/* Tooltip that appears on image hover */
.tooltip {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  background: rgba(255, 78, 80, 0.95);
  color: #fff;
  padding: 6px 18px;
  font-weight: 700;
  border-radius: 24px;
  font-size: 1rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease, transform 0.3s ease;
  user-select: none;
  text-shadow: 0 0 5px #ff4e50;
  box-shadow: 0 4px 10px rgba(255, 78, 80, 0.6);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.image-wrapper:hover .tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* Call to action */
.action {
  margin-top: 30px;
}

.cta-button {
  background: linear-gradient(to right, #ffcc00, #ff9900);
  border: none;
  padding: 14px 36px;
  font-size: 18px;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.3s ease, background 0.3s ease;
  color: black;
  font-weight: bold;
  box-shadow: 0 6px 18px rgba(255, 204, 0, 0.4);
}

.cta-button:hover {
  background: linear-gradient(to right, #e6b800, #cc8400);
  transform: scale(1.05);
}

.note {
  margin-top: 12px;
  font-size: 1rem;
  color: #ffc3c3;
  font-weight: 500;
  user-select: none;
}

/* Animations */
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
@media (max-width: 720px) {
  h1 {
    font-size: 2.6rem;
  }

  .intro, .details, .features li {
    font-size: 1rem;
  }

  .plan-image {
    max-width: 100%;
  }

  .features {
    max-width: 100%;
    padding: 0 10px;
  }
}
</style>
