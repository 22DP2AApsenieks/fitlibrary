<template>
  <section class="hero-section">
    <div class="content">
      <h1>Pamata plāns</h1>
      <p class="intro">
        Šeit tiek iekļauts pat minimus lai palīdzētu tev kautcik progresēt
      </p>

      <p class="details">
        Neatkarīgi no tā, vai trenējies spēkam, izskatam vai izturībai – mums ir risinājums. Mūsu plāns apvieno pārbaudītas metodes gan no sporta zāles, gan kalistēnikas, lai sniegtu elastīgas, bet efektīvas programmas.
        Tas ietver:
      </p>

      <ul class="features">
        <li>Pilnas upper/lower un push/pull/legs treniņu programmas zālei vai ielu vingrošanai</li>
        <li>Pielāgojams spēka vai fiziskā izskata mērķiem</li>
        <li>Ielu vingrošanas plāni visiem līmeņiem – spēkam vai izturībai</li>
        <li>Skriešanas programmas izturības un ātruma attīstīšanai</li>
        <li>Reāla struktūra. Reāls progress. Bez liekā.</li>
      </ul>

      <img class="plan-image" src="../assets/images/noobplan.jfif" alt="Plāna priekšskatījums" />

      <div class="action">
        <router-link to="/checkout">
          <button class="cta-button">Pievienojies tagad – tikai $9.99</button>
        </router-link>
        <p class="note">Vienreizējs maksājums. Piekļuve uz mūžu.</p>
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