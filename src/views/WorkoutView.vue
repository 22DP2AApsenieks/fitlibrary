<template>
  <div>
    <h2>Pievieno pull-ups treniņu</h2>

    <form @submit.prevent="submit">
      <!-- Username vairs nav redzams vai rediģējams -->
      <p>Treniņš tiek pievienots lietotājam: <strong>{{ username }}</strong></p>

      <label>Reps:</label>
      <input type="number" v-model.number="reps" min="1" required />

      <label>Date:</label>
      <input type="date" v-model="date" required />

      <label>Comment:</label>
      <input type="text" v-model="comment" placeholder="Komentārs (nav obligāts)" />




      <button type="submit">Saglabāt</button>
    </form>

    <p v-if="message" style="color: green">{{ message }}</p>
    <p v-if="error" style="color: red">{{ error }}</p>

    <router-link to="/programm">
      <button class="back-button">⬅ Atpakaļ uz programm</button>
    </router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      reps: 1,
      date: new Date().toISOString().slice(0, 10),
      comment: '', // <-- lowercase
      message: '',
      error: ''
    };
  },
  mounted() {
    this.username = (localStorage.getItem('loggedInUser') || 'nezināmais').toLowerCase();
  },
  methods: {
    async submit() {
      this.message = '';
      this.error = '';

      try {
        const res = await fetch('http://localhost:5000/addpullups', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: this.username,
            reps: this.reps,
            date: this.date,
            comment: this.comment // ✅ send the comment to backend
          })
        });

        const data = await res.json();

        if (res.ok) {
          this.message = data.message;
          this.reps = 1;
          this.date = new Date().toISOString().slice(0, 10);
          this.comment = ''; // clear input
        } else {
          this.error = data.error || 'Nezināma kļūda';
        }
      } catch (e) {
        this.error = 'Neizdevās pievienot treniņu';
      }
    }
  }
};
</script>

