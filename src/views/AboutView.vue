<script setup>
const schoolImage = new URL('../assets/images/school.jpg', import.meta.url).href
</script>

<template>
  <section class="hero-section about-hero">
    <div class="content about-hero-inner">
      <div class="about-copy">
        <p class="eyebrow">About Fitlibrary</p>
        <h1>Built for everyone who wants to progress.</h1>
        <p class="intro">
          Designed to keep workout routines clean, simple, and easy to follow.
        </p>
        <p class="details">The app combines polished visuals with practical training features.</p>
        <div class="hero-actions">
          <router-link to="/signup">
            <button class="cta-button">Start your training</button>
          </router-link>
        </div>
      </div>

      <div class="about-panel">
        <span class="panel-badge">School project</span>
        <h2>Rīgas Valsts tehnikums</h2>
        <p class="panel-text">Krišjāņa Valdemāra iela 1C, Centra rajons, Rīga</p>
        <div class="panel-grid">
          <div>
            <strong>Focus</strong>
            <p>Progress tracking, routine clarity, and user friendlieness</p>
          </div>
          <div>
            <strong>Why we built it?</strong>
            <p>Adam had this idea about helping people achieve their fitness goals. He saw that big reason why people platoe is that they dont track their progress.</p>
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
    linear-gradient(135deg, #2f0b0b, #5f1a1a 45%, #7d2d2d 100%);
  color: #fff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.content {
  max-width: 1120px;
  width: 100%;
  text-align: center;
  animation: fadeInUp 1.2s ease forwards;
  user-select: none;
  padding: 0 20px;
}

.about-hero-inner {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 32px;
  width: min(1120px, 100%);
  align-items: center;
}

.about-copy {
  max-width: 620px;
  margin: 0 auto;
  text-align: left;
}

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

.about-panel {
  padding: 34px;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(12px);
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

.about-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  width: min(1120px, 100%);
  margin: 52px auto 0;
}

.about-grid article {
  padding: 26px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.16);
}

.about-grid h3 {
  margin-top: 0;
  font-size: 1.4rem;
}

.about-grid p {
  margin: 16px 0 0;
  color: #d8d8d8;
  line-height: 1.75;
}

  .about-image {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 32px;
    width: min(1120px, 100%);
    margin: 0 auto 80px;
    align-items: center;
  }

  .image-copy h2 {
    margin: 0 0 20px;
    font-size: 2.2rem;
  }

  .image-copy p {
    margin: 0;
    color: #d8d8d8;
    line-height: 1.8;
  }

  .image-frame {
    border-radius: 28px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.18);
    padding: 18px;
  }

  .image-frame img {
    width: 100%;
    display: block;
    border-radius: 20px;
    object-fit: cover;
  }

  .image-note {
    margin: 16px 0 0;
    font-size: 0.98rem;
    color: #d8d8d8;
    text-align: center;
  }

  @media (max-width: 1024px) {
    .about-hero-inner,
    .about-grid,
    .about-image {
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

    .about-panel,
    .about-grid article,
    .image-frame {
      padding: 20px;
    }
  }
</style>