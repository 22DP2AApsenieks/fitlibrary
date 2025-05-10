<template>
  <div class="programm-view">
    <h1>Programm View</h1>
    <p>Tu tiki iekšā, {{ username }}!</p> <!-- Display the username -->
  </div>
</template>

<script>
export default {
  name: 'ProgrammView',
  data() {
    return {
      username: ''
    };
  },
  mounted() {
    this.username = localStorage.getItem('loggedInUser') || 'nezināmais lietotāj';
  }
}
</script>

<style scoped>
.programm-view {
  padding: 20px;
}
</style>

