<template>
  <div>
    <h1>Admin Panel</h1>
    <p>Welcome, {{ username }}!</p>
    <!-- Add admin features here -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: localStorage.getItem('loggedInUser') || 'admin'
    };
  }
};
</script>