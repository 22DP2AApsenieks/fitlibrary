<script setup>
const schoolImage = new URL('../assets/images/school.jpg', import.meta.url).href
</script>

<template>
  <section class="hero-section about-hero">
    <div class="content about-hero-inner">
      <div class="about-copy">
        <p class="eyebrow">About Fitlibrary</p>
        <h1>Built for students, powered by progress.</h1>
        <p class="intro">
          Fitlibrary is a polished workout tracker designed to present training progress clearly and professionally.
          This app is based at Rīgas Valsts tehnikums and designed to make your school project stand out.
        </p>
        <p class="details">Explore why Fitlibrary is the modern choice for students, teachers, and athletes.</p>
        <div class="hero-actions">
          <router-link to="/signup">
            <button class="cta-button">Start your training</button>
          </router-link>
        </div>
      </div>

      <div class="about-panel">
        <span class="panel-badge">Based in Rīga</span>
        <h2>Rīgas Valsts tehnikums</h2>
        <p class="panel-text">Krišjāņa Valdemāra iela 1C, Centra rajons, Rīga, Latvia</p>
        <p class="panel-description">
          Our location is the heart of the project. This school provides the educational foundation
          and local base for Fitlibrary’s development.
        </p>
      </div>
    </div>
  </section>

  <section class="about-grid">
    <article>
      <h3>Easy tracking</h3>
      <p>Log workouts and view progress clearly.</p>
    </article>
    <article>
      <h3>School-ready</h3>
      <p>Built for students at Rīgas Valsts tehnikums.</p>
    </article>
  </section>

  <section class="about-image">
    <div class="image-copy">
      <p class="eyebrow">School location</p>
      <h2>Rīgas Valsts tehnikums</h2>
      <p>On Valdemāra iela in the center of Rīga.</p>
    </div>
    <div class="image-frame">
      <img :src="schoolImage" alt="Rīgas Valsts tehnikums school building" />
      <p class="image-note">Rīgas Valsts tehnikums on Valdemāra iela.</p>
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
  background: linear-gradient(to bottom right, #330000, #660000, #990000);
  color: #fff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.content {
  max-width: 900px;
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
  color: #ffb0b0;
  font-weight: 600;
}

.eyebrow {
  margin: 0 0 18px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.85rem;
  color: #ffdb3b;
  font-weight: 700;
}

.about-copy h1 {
  margin: 0 0 24px;
  font-size: clamp(2.8rem, 5vw, 4rem);
  line-height: 1.05;
  letter-spacing: 0.03em;
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.18);
}

.intro {
  margin: 0 0 28px;
  font-size: 1.05rem;
  line-height: 1.85;
  color: #f4e4e4;
}

.hero-actions {
  display: flex;
  justify-content: flex-start;
  margin-top: 16px;
}

.cta-button {
  background: linear-gradient(to right, #ffcc00, #ff9900);
  border: none;
  padding: 14px 36px;
  border-radius: 30px;
  color: black;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(255, 204, 0, 0.4);
  transition: transform 0.3s ease, background 0.3s ease;
}

.cta-button:hover {
  background: linear-gradient(to right, #e6b800, #cc8400);
  transform: scale(1.03);
}

.about-panel {
  padding: 32px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.18);
}

.panel-badge {
  display: inline-flex;
  padding: 10px 16px;
  border-radius: 999px;
  background: rgba(255, 221, 59, 0.18);
  color: #fff;
  font-weight: 700;
  margin-bottom: 18px;
}

.about-panel h2 {
  margin: 0 0 12px;
  font-size: 2rem;
}

.panel-text,
.panel-description {
  margin: 0 0 16px;
  color: #dbd9dd;
  line-height: 1.8;
}

.about-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  width: min(1120px, 100%);
  margin: 48px auto;
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