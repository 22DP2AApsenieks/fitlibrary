<script setup>
</script>

<template>
  <header>
    <h1>Fitlibrary</h1>
    <nav class="nav-links">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/plans">Plans</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
@keyframes subtlePulse {
  0%, 100% {
    background-color: #1f1f1f;
  }
  50% {
    background-color: #2a1a1a;
  }
}

header {
  position: sticky;
  top: 0;
  background-color: #1f1f1f; /* darker charcoal */
  animation: subtlePulse 10s ease-in-out infinite;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.2rem 0;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.85);
  z-index: 20;
  user-select: none;
  border-bottom: 3px solid #7a0000; /* deeper crimson */
  transition: background-color 0.6s ease;
  font-smooth: always;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

header:hover {
  background-color: #2a1a1a;
  animation-play-state: paused;
}

h1 {
  font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 900;
  font-size: 2.8rem;
  color: #b00000;
  margin: 0 0 0.5rem 0;
  letter-spacing: 3px;
  text-shadow:
    0 0 3px #b00000,
    0 0 6px #7f0000;
  transition: color 0.5s ease, text-shadow 0.5s ease;
  user-select: none;
}

header:hover h1 {
  color: #ff1a1a;
  text-shadow:
    0 0 5px #ff1a1a,
    0 0 10px #cc0000;
}

.nav-links {
  display: flex;
  gap: 2.8rem;
}

.nav-links a {
  color: #ddd;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.2rem;
  padding: 8px 18px;
  border-radius: 10px;
  border: 2px solid transparent;
  box-shadow: 0 0 5px transparent;
  transition:
    background-color 0.3s ease,
    color 0.3s ease,
    box-shadow 0.3s ease,
    transform 0.2s ease;
  user-select: none;
  font-feature-settings: "liga", "kern";
}

.nav-links a:hover {
  background-color: #a50000;
  color: #fff;
  border-color: #a50000;
  box-shadow: 0 0 14px #a50000;
  transform: scale(1.12);
}

.nav-links a:focus-visible {
  outline: 2px solid #b00000;
  outline-offset: 3px;
}
</style>
