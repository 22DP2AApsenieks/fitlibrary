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
  height: 8.5rem;
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

.nav-links a {
    text-decoration: none;
    background-color: #ffffff; /* Default button color */
    color: rgb(0, 0, 0); /* Text color */
    padding: 1px 20px; /* Button padding */
    border-radius: 5px; /* Rounded corners */
    transition: background-color 0.8s ease, color 0.8s ease; /* Smooth transition */
    font-size: 1.2rem; /* Adjust text size */
    font-weight: bold;
    border: 2px solid transparent; /* Initially no border */
}

.nav-links a:hover {
    background-color: red; /* Turns red on hover */
    color: white; /* Keep text white */
    border-color: red; /* Border also turns red */
}


h1 {
    margin-top: 1rem;
    margin-bottom: 0.1rem;
}
</style>