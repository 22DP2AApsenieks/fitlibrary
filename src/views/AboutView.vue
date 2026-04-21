<script setup>
const schoolImage = new URL('../assets/images/school.jpg', import.meta.url).href
</script>

<template>
  <section class="hero-section about-hero">
    <div class="content about-hero-inner">
      <div class="about-copy">
        <p class="eyebrow">Par Fitlibrary</p>
        <h1>Izveidots ikvienam, kurš vēlas progresēt.</h1>
        <p class="intro">
          Izstrādāts, lai treniņu rutīnas būtu tīras, vienkāršas un viegli saprotamas.
        </p>
        <p class="details">Lietotne apvieno kvalitatīvu dizainu ar praktiskām treniņu apkopošanas funkcijām.</p>
        <div class="hero-actions">
          <router-link to="/signup">
            <button class="cta-button">Sāc trenēties</button>
          </router-link>
        </div>
      </div>

      <div class="about-panel">
        <span class="panel-badge">Skolas projekts</span>
        <h2>Rīgas Valsts tehnikums</h2>
        <p class="panel-text">Krišjāņa Valdemāra iela 1C, Centra rajons, Rīga</p>
        <div class="panel-grid">
          <div>
            <strong>Fokuss</strong>
            <p>Progresa uzskaite, skaidra struktūra un lietotāja ērtums</p>
          </div>
          <div>
            <strong>Kāpēc mēs to izveidojām?</strong>
            <p>Ādamam bija ideja palīdzēt cilvēkiem sasniegt savus fitnesa mērķus. Viņš saprata, ka viens no galvenajiem iemesliem, kāpēc cilvēki stagnē, ir tas, ka viņi neseko līdzi savam progresam.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section,
.about-hero {
  min-height: 100vh;
  padding: 60px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top left, rgba(255, 215, 90, 0.14), transparent 30%),
    linear-gradient(135deg, #290000, #530b0b 45%, #2f0b0b 100%);
  color: #fff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.content {
  max-width: 1120px;
  width: 100%;
  text-align: center;
  user-select: none;
  padding: 0 20px;
}

/* GRID */
.about-hero-inner {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 32px;
  width: min(1120px, 100%);
  align-items: center;
}

/* LEFT SIDE TEXT */
.about-copy {
  max-width: 620px;
  margin: 0 auto;
  text-align: left;
}

/* 🔥 STAGGER ANIMATION */
.about-copy > * {
  opacity: 0;
  animation: fadeInUp 0.8s ease forwards;
}

.about-copy > *:nth-child(1) { animation-delay: 0.1s; }
.about-copy > *:nth-child(2) { animation-delay: 0.2s; }
.about-copy > *:nth-child(3) { animation-delay: 0.3s; }
.about-copy > *:nth-child(4) { animation-delay: 0.4s; }
.about-copy > *:nth-child(5) { animation-delay: 0.5s; }

/* TEXT STYLES */
.details {
  font-size: 1.05rem;
  margin: 0 0 28px;
  color: #ffcd76;
  font-weight: 600;
}

.eyebrow {
  margin: 0 0 18px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.82rem;
  color: #ffd84f;
  font-weight: 700;
}

.about-copy h1 {
  margin: 0 0 24px;
  font-size: clamp(2.8rem, 5vw, 4rem);
  line-height: 1.05;
  letter-spacing: 0.02em;
  text-shadow: 0 0 18px rgba(255, 235, 150, 0.18);
}

.intro {
  margin: 0 0 24px;
  font-size: 1.08rem;
  line-height: 1.75;
  color: #f5e8e8;
}

/* BUTTON */
.hero-actions {
  display: flex;
  justify-content: flex-start;
  margin-top: 16px;
}

.cta-button {
  background: linear-gradient(to right, #ffcc00, #ff9a00);
  border: none;
  padding: 15px 36px;
  border-radius: 999px;
  color: #111;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 12px 30px rgba(255, 170, 0, 0.28);
  transition: transform 0.25s ease, background 0.25s ease;
}

.cta-button:hover {
  background: linear-gradient(to right, #ffd74c, #ffb200);
  transform: translateY(-2px);
}

/* RIGHT PANEL */
.about-panel {
  padding: 34px;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(12px);

  /* 🔥 animate panel */
  opacity: 0;
  animation: fadeInUp 1s ease forwards;
  animation-delay: 0.4s;
}

.panel-badge {
  display: inline-flex;
  padding: 10px 18px;
  border-radius: 999px;
  background: rgba(255, 221, 59, 0.22);
  color: #fff;
  font-weight: 700;
  margin-bottom: 20px;
}

.about-panel h2 {
  margin: 0 0 14px;
  font-size: 2rem;
}

.panel-text {
  margin: 0 0 20px;
  color: #e4dcdc;
  line-height: 1.8;
}

.panel-grid {
  display: grid;
  gap: 18px;
}

.panel-grid div {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 18px 20px;
}

.panel-grid strong {
  display: block;
  margin-bottom: 8px;
  font-size: 0.98rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #ffec9a;
}

.panel-grid p {
  margin: 0;
  color: #d8d0d0;
  line-height: 1.75;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .about-hero-inner {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .about-hero {
    padding: 40px 16px;
  }

  .about-copy h1 {
    font-size: 2.4rem;
  }

  .about-panel {
    padding: 20px;
  }
}

/* ✅ IMPORTANT: animation must be OUTSIDE media queries */
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
</style>