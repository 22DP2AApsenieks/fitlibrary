<template>
  <section class="hero-section">
    <div class="content">
      <h1>Pro+  plāns</h1>
      <p class="intro">
        **Pro+ plāns** ir ekskluzīvākā  pieredze — radīta nopietniem cilvēkiem, kuri vēlas elitārus rezultātus. Tas nav tikai fitnesa plāns. Tā ir tieša piekļuve tavam maksimālajam potenciālam.
      </p>

      <p class="details">
        Viss, ko mēs zinām, viss, ko esam pārbaudījuši — apvienots personalizētā, vienmēr pieejamā atbalsta sistēmā:
      </p>

      <ul class="features">
        <li>Visas treniņu programmas: spēks, ielu vingrošana, skriešana, estētika — pilnībā pieejamas</li>
        <li>Tieša piekļuve personīgajam trenerim 24/7</li>
        <li>Pielāgoti uztura plāni + iknedēļas check-in</li>
        <li>Tehnikas pārbaude (form check caur video)</li>
        <li>Ekskluzīva Pro+ Discord un video Q&A piekļuve</li>
        <li><strong>Zelta biedra karte</strong> — mūža apņemšanās simbols</li>
      </ul>

      <img class="plan-image" src="../assets/images/pro+plan.jfif" alt="Pro+ plāns" />

      <div class="action">
        <router-link to="/checkout">
          <button class="cta-button">Pievienojies Pro+ — $199.99/mēnesī</button>
        </router-link>
        <p class="note">Tiem, kuri vēlas visu. Rezultāti garantēti, darbs obligāts.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  min-height: 100vh;
  background: linear-gradient(to bottom right, #000000, #1a1a1a, #2d2d2d);
  color: #f7f7f7;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.content {
  max-width: 1000px;
  text-align: center;
  animation: fadeIn 1.2s ease-in-out;
}

h1 {
  font-size: 3rem;
  margin-bottom: 20px;
  color: #ffd700;
}

.intro {
  font-size: 1.2rem;
  margin-bottom: 20px;
  line-height: 1.6;
  color: #ddd;
}

.details {
  font-size: 1rem;
  margin-bottom: 20px;
  color: #bbb;
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
  content: "★";
  position: absolute;
  left: 0;
  color: #ffd700;
  font-weight: bold;
}

.plan-image {
  width: 100%;
  max-width: 600px;
  border-radius: 16px;
  margin: 30px auto;
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
}

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
  margin-top: 10px;
  font-size: 0.9rem;
  color: #aaa;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>