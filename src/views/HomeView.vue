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

      <img src="..\assets\images\pro+plan.jfif" alt="Average musu lietotnes lietotajs" class="pabiditpalabi">
    </main>

    <aside id="atstarpefoter">
      <h1 id="b" class="pabiditpalabi">We don't bite</h1>
      
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
          setTimeout(this.typeWriter, 1000); // Wait for 1 second before writing next line
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
#demo {
  color: rgb(255, 255, 255);  
  font-size: large; 
  transform: translateX(20px);
  padding-top: 1cap;
}
.var {
  color: rgb(255, 255, 255);          
  font-size: 24px;    
  font-family: 'Times New Roman', Times, serif, sans-serif;  
  font-weight: bold;
}

main {
  background-color: #333;
  padding-bottom: 50px; /* Add padding to prevent content from overlapping footer */
}

#b {
  font-size: 2rem;
  margin-bottom: 5px; /* Reduce space between the heading and buttons */
}

body {
  margin: 0px;
}

.var {
  padding-bottom: 10px;
} 

.pabiditpalabi {
  transform: translateX(20px);
}

#atstarpefoter {
  padding-bottom: 20px;
}

.auth-buttons a {
  display: flex;
  align-items: flex-start; /* Align to the left */
  gap: 5px; /* Reduce the gap between buttons */
  margin-top: 10px;
  margin-left: 20px;
  background-color: #be0000; /* Button color */
  color: white; /* Text color */
  padding: 10px 20px; /* Padding for better size */
  border-radius: 5px; /* Rounded corners */
  text-decoration: none; /* Remove underline */
  transition: 0.3s ease-in-out;
  font-size: 1rem;
  display: inline-block; /* Ensure proper spacing */
}

.auth-buttons a:hover {
  background-color: #900000; /* Darker color on hover */
}
/* New Styles for Signup/Login buttons */


.vadibas_josla:hover {
  background-color: #900000;
}

h3 {
  font-size: 1.5rem;
  padding-bottom: 2px;
}

/* ✅ Fix for FITLIBRARY text inside v-html */

::v-deep(.fitlibrary-text) { 
  color: red !important;  /* Make it red */
  font-size: 2rem !important; /* Make it bigger */
  font-weight: bold;
  text-transform: uppercase; /* Optional: Ensure it's all caps */
}
</style>
