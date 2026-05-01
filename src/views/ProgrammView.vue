<template>
<!--tatad seit talakaja koda dala tiek noformets panelis ar pogamkas aizvedis uz treninu ievadi vai prtogresa apskat. vel zemak bus atskauksems ievadisana un acc dzesana-->
  <div class="full-background">
    <div class="programm-view">
      <div class="header-section">
        <h1>Tavs fitnesa panelis</h1>
        <p class="welcome-text">Sveiks, <span class="username">{{ username }}</span>! 💪</p> <!--personalizeti : D-->
      </div>

      <div v-if="loading" class="loading-spinner">
        <div class="spinner"></div>
        <p>Ielādējam...</p> <!--parasti nekad tik ilgi neladejas tho-->
      </div>

      <div v-else class="content">
        <div class="motivation-card">
          <h2>Tā tik turpināt! 🔥</h2>
        </div>

        <div class="navigation-grid">
          <router-link to="/bexercises" class="nav-card"> <!--novirza uz bw vingrinajumiem-->
            <div class="card-icon">💪</div>
            <h3>Ar savu svaru</h3>
            <p>Pievilkšanās, līdztekas u.c.</p>
          </router-link>

          <router-link to="/g" class="nav-card">
            <div class="card-icon">🏋️</div>
            <h3>Trenažieru zāle</h3>
            <p>Smagie svari un spēks</p>
          </router-link>

          <router-link to="/running" class="nav-card">
            <div class="card-icon">🏃</div>
            <h3>Skriešana</h3>
            <p>Seko savam ātrumam</p>
          </router-link>

          <router-link to="/tables" class="nav-card">
            <div class="card-icon">📊</div>
            <h3>Progresa tabulas</h3>
            <p>Detalizēta analīze</p>
          </router-link>
        </div>

        <div class="review-section">
          <h3>Dalies ar atsauksmi</h3>
          <p class="section-subtitle">Palīdzi mums uzlabot lietotni</p>
          <textarea 
            v-model="reviewText" 
            placeholder="Ko tu domā par FitLibrary?" 
            rows="4"
            class="review-textarea"
          ></textarea> 
          <button @click="submitReview" class="submit-review-button">
            <span v-if="!reviewMessage">Iesniegt atsauksmi</span>
            <span v-else>{{ reviewMessage }}</span>
          </button>
        </div>

        <div class="danger-zone"> <!--pectam velreiz parjatas vai tiesam grib dzest kontu, no vories-->
          <h3>Konta dzēšana</h3>
          <p class="danger-text">Dzēst kontu un visus saistītos datus</p>
          <button @click="confirmDelete" class="delete-button">
            Dzēst manu kontu 
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  name: "ProgrammView",

  data() {
    return {
      username: "",
      loading: true,
      reviewText: "",
      reviewMessage: ""
    };
  },

  methods: {
    submitReview() {
      if (!this.reviewText.trim()) {
        this.reviewMessage = "Ieraksti kaut ko 😅";
        return;
      }

      // šeit vari vēlāk pieslēgt backend
      console.log("Atsauksme:", this.reviewText);

      this.reviewMessage = "Paldies par atsauksmi! 🙌";
      this.reviewText = "";

      setTimeout(() => {
        this.reviewMessage = "";
      }, 3000);
    },

    confirmDelete() {
      const confirmAction = confirm("Vai tiešām vēlies dzēst kontu?");
      if (!confirmAction) return;

      // backend call nākotnē
      alert("Konts dzēsts (demo versija)");
    }
  },

  mounted() {
    this.username =
      (localStorage.getItem("loggedInUser") || "nezināmais").toLowerCase();

    this.loading = false;
  }
};
</script>

<style scoped>
.full-background {
  background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #0d1117 100%);
  min-height: 100vh;
  padding: 40px 20px;
  margin: 0;
}

.programm-view {
  max-width: 1000px;
  margin: 0 auto;
  background: #1a1a1a;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  overflow: hidden;
}

.header-section {
  background: linear-gradient(135deg, #3a1a1a 0%, #5a2a2a 100%);
  color: white;
  padding: 40px 30px;
  text-align: center;
  border-bottom: 2px solid #8a4a4a;
}

.header-section h1 {
  font-size: 2.5rem;
  margin: 0 0 10px 0;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.welcome-text {
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.9;
  color: #e0e0e0;
}

.username {
  font-weight: 700;
  text-transform: capitalize;
}

.content {
  padding: 40px 30px;
  background: #1a1a1a;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 30px;
  color: #e0e0e0;
}

.spinner {
  border: 4px solid #444;
  border-top: 4px solid #8a4a4a;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 0.8s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.motivation-card {
  background: linear-gradient(135deg, #3a2a2a 0%, #2a1a1a 100%);
  color: white;
  padding: 30px;
  border-radius: 16px;
  text-align: center;
  margin-bottom: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid #8a4a4a;
}

.motivation-card h2 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
}

.navigation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.nav-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 16px;
  text-decoration: none;
  color: #e0e0e0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.nav-card:hover {
  transform: translateY(-8px);
  border-color: #8a4a4a;
  box-shadow: 0 15px 40px rgba(138, 74, 74, 0.3);
  background: #333333;
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.nav-card h3 {
  margin: 0 0 8px 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: #ffffff;
}

.nav-card p {
  margin: 0;
  font-size: 0.9rem;
  color: #b0b0b0;
}

.review-section {
  background: #2a2a2a;
  padding: 30px;
  border-radius: 16px;
  margin-bottom: 30px;
  border-left: 4px solid #8a4a4a;
}

.review-section h3 {
  margin: 0 0 8px 0;
  color: #ffffff;
  font-size: 1.4rem;
}

.section-subtitle {
  margin: 0 0 20px 0;
  color: #b0b0b0;
  font-size: 0.95rem;
}

.review-textarea {
  width: 100%;
  padding: 15px;
  border: 1px solid #444;
  border-radius: 12px;
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  transition: all 0.3s ease;
  background: #2a2a2a;
  color: #ffffff;
}

.review-textarea:focus {
  outline: none;
  border-color: #666;
  box-shadow: 0 0 0 3px rgba(200, 100, 100, 0.15);
  background: #333333;
}

.submit-review-button {
  width: 100%;
  padding: 14px 30px;
  margin-top: 15px;
  background: #007011;
  color: white;
  border: 1px solid #002500;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
}

.submit-review-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
  background: #00c631;
}

.submit-review-button:active {
  transform: translateY(0);
}

.danger-zone {
  background: #2a1a1a;
  padding: 30px;
  border-radius: 16px;
  border-left: 4px solid #8a4a4a;
}

.danger-zone h3 {
  margin: 0 0 8px 0;
  color: #ffaaaa;
  font-size: 1.4rem;
  font-weight: 700;
}

.danger-text {
  margin: 0 0 20px 0;
  color: #b0b0b0;
  font-size: 0.95rem;
}

.delete-button {
  width: 100%;
  padding: 14px 30px;
  background: #890000;
  color: white;
  border: 1px solid #680000;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
}

.delete-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
  background: #970000;
}

.delete-button:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .full-background {
    padding: 20px 10px;
  }

  .programm-view {
    border-radius: 16px;
  }

  .header-section {
    padding: 30px 20px;
  }

  .header-section h1 {
    font-size: 2rem;
  }

  .content {
    padding: 25px 20px;
  }

  .navigation-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  .nav-card {
    padding: 20px;
  }

  .card-icon {
    font-size: 2.5rem;
  }
}
</style>
