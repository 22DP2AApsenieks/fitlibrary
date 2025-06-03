<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <div id="app">
    <main>
      <h2>We are a small company with a goal to help everyone in sports, from running to weightlifting.</h2>
      <h3>Our biggest goal is to help you progress faster (:</h3>
      <RouterView />
      
      <!-- Google Maps Embed -->
      <div class="map-container">
        <iframe
          width="600"
          height="450"
          style="border:0"
          loading="lazy"
          allowfullscreen
          referrerpolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=Rīga,+Latvia&output=embed">
        </iframe>
      </div>
    </main>
  </div>
</template>

<style scoped>
header {
  background-color: #be0000;
  color: #fff;
  padding: 10px 20px;
  text-align: center;
}
nav ul {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
  gap: 15px;
}
nav ul li {
  display: inline;
}
nav ul li a {
  color: white;
  text-decoration: none;
  font-weight: bold;
}
main {
  text-align: center;
  padding: 20px;
}
main img {
  max-width: 100%;
  height: auto;
  margin: 10px;
}
.map-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>