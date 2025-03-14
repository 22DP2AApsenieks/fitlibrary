<template>
  <div>
    <main class="Beckgroound_image">
      <div id="demo" v-html="currentText"></div> <!-- Typing text animation -->
      
      <div id="dropdownMenu" :class="{ active: isActive }">
        <!-- Dropdown content -->
      </div>

      <div id="teksts">
        <div id="demo2" class="var pabiditpalabi"></div>
      </div>

      <img
        src="../assets/images/pro+plan.jfif"
        alt="Average musu lietotnes lietotajs"
        class="pabiditpalabi"
      >
    </main>

    <aside id="atstarpefoter">
      <!-- Centered heading -->
      <h1 id="b">We don't bite</h1>
      
      <!-- Centered auth buttons -->
      <div class="auth-buttons">
        <RouterLink to="/signup">Sign up</RouterLink>
        <RouterLink to="/login">Log in</RouterLink>
      </div>
    </aside>
  </div>
</template>

<script>
export default {
  data() {
    return {
      txt: [
        "We have made program...",
        "The program that finally will end our suffering for not knowing...",
        "The program that will help you to see your progress and actually know how fast you progress... and your PR's...",
        "   ",
        'This is <span class="fitlibrary-text">FITLIBRARY</span>'
      ],
      currentText: '',
      i: 0,
      j: 0,
      speed: 40,
      isActive: false
    };
  },
  mounted() {
    this.typeWriter();
  },
  methods: {
    typeWriter() {
      if (this.j < this.txt.length) {
        if (this.i < this.txt[this.j].length) {
          this.currentText += this.txt[this.j].charAt(this.i); // Update the text
          this.i++;
          setTimeout(this.typeWriter, this.speed); // Call recursively
        } else {
          this.i = 0;
          this.j++;
          this.currentText += '<br>'; // Add a line break after each sentence
          setTimeout(this.typeWriter, 1000); // Wait 1s before writing next line
        }
      }
    },
    toggleDropdown() {
      this.isActive = !this.isActive; // Toggle the 'active' class
    }
  }
};
</script>

<style scoped>
/* Typing text animation area */
#demo {
  color: #fff;
  font-size: large;
  transform: translateX(20px);
  padding-top: 1cap;
}

/* White text for the typed lines below #demo */
.var {
  color: #fff;
  font-size: 24px;
  font-family: 'Times New Roman', Times, serif, sans-serif;
  font-weight: bold;
}

/* Dark background for the main area */
main {
  background-color: #333;
  padding-bottom: 50px; /* prevent overlap with footer area */
}

/* Body reset */
body {
  margin: 0px;
}

/* Extra spacing on .var */
.var {
  padding-bottom: 10px;
}

/* This class shifts elements right; keep for images, etc. */
.pabiditpalabi {
  transform: translateX(20px);
}

/* Large heading style */
#b {
  font-size: 3rem;
  margin-bottom: 15px;
}

/* Center heading & buttons */
#atstarpefoter {
  padding-bottom: 20px;
  text-align: center;
}

/* Use flex to line up the two buttons horizontally, centered */
.auth-buttons {
  display: inline-flex;
  gap: 10px;
}

/* Basic button styling */
.auth-buttons a {
  background-color: #be0000;
  color: white;
  padding: 15px 30px;
  border-radius: 5px;
  text-decoration: none;
  transition: 0.3s ease-in-out;
  font-size: 1rem;
  display: inline-block;
}

.auth-buttons a:hover {
  background-color: #900000;
}

/* Fix for FITLIBRARY text inside v-html */
::v-deep(.fitlibrary-text) {
  color: red !important;   /* Make it red */
  font-size: 2rem !important; /* Make it bigger */
  font-weight: bold;
  text-transform: uppercase;  /* Optional: all caps */
}
</style>
