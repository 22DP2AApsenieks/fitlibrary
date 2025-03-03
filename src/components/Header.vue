<script setup>

</script>


<template>
    <header>
        <h1>Fitlibrary</h1>
        <div class="nav-links">
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/signup">Sign up</RouterLink>
            <RouterLink to="/login">Log in</RouterLink>
            <RouterLink to="/plans">Plans</RouterLink>
            <RouterLink to="/about">About</RouterLink>
        </div>  
    </header>
</template>

<style scoped>
header {
  background-color: rgb(255, 255, 255);
  border-radius: 5px;
  transition: background, 1.5s;
  width: 7rem;
  height: 9rem;
  color: crimson;
  text-align: center;
  flex-direction: column;
  width: 100%;
  font-size: x-large;
}
.nav-links {
    display: flex;
    justify-content: center;
    gap: 3rem;
    width: 100%;
}
h1 {
    margin-top: 1rem;
    margin-bottom: 0.1rem;
}
</style>