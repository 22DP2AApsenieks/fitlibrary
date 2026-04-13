<template>
  <section class="hero-section checkout-hero">
    <div class="content">
      <p class="single-line">We curently don’t sell plans. Myb sooon. we'll see</p>
    </div>
  </section>
</template>

<style scoped>
.hero-section,
.checkout-hero {
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
  user-select: none;
  padding: 0 20px;
}

.single-line {
  font-size: 1.35rem;
  line-height: 1.8;
  color: #ffd6d6;
  margin: 0;
}

@media (max-width: 720px) {
  .content {
    padding: 0 15px;
  }
}
</style>
