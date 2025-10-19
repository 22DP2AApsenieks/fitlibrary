<template>
  <div>
    <h2>Pievieno squat treniņu</h2>
    <form @submit.prevent="submit">
      <p>Lietotājs: <strong>{{ username }}</strong></p>

      <label>Reps:</label>
      <input type="number" v-model.number="reps" required />

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
      username: localStorage.getItem('loggedInUser') || '',
      reps: 1,
      date: new Date().toISOString().slice(0, 10),
      comment: '', // added comment
      message: '',
      error: ''
    };
  },
  methods: {
    async submit() {
      this.message = '';
      this.error = '';

      const payload = {
        username: this.username,
        reps: this.reps,
        date: this.date,
        comment: this.comment // send comment
      };

      try {
        const res = await fetch('http://localhost:5000/addsquats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Nezināma kļūda');

        this.message = data.message;
        this.reps = 1;
        this.date = new Date().toISOString().slice(0, 10);
        this.comment = ''; // clear comment input
      } catch (err) {
        this.error = err.message;
      }
    }
  }
};
</script>
