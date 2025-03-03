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
        <a href="signup.html"><div class="vadibas_josla"><h3>Signup</h3></div></a>
        <a href="login.html"><div class="vadibas_josla"><h3>Login</h3></div></a>
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
        "This is FITLIBRARY"
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

li {
  color: #be0000;
}

@media (max-width: 768px) {
  .nav-links {
    display: none; /* Hide navigation links on mobile */
  }
  .hamburger {
    display: flex; /* Show hamburger on mobile */
  }
  .dropdown.active {
    display: flex; /* Show dropdown when active */
  }
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

/* New Styles for Signup/Login buttons */
.auth-buttons {
  display: flex;
   /* Stack buttons vertically */
  align-items: flex-start; /* Align to the left */
  gap: 5px; /* Reduce the gap between buttons */
  margin-top: 10px;
  margin-left: 20px; /* Adjust left positioning if needed */
}

.vadibas_josla {
  background-color: #be0000;
  padding: 0px 50px; /* Make buttons smaller */
  text-align: left;
  border-radius: 5px;
  color: white;
  transition: 0.3s ease-in-out;
  font-size: 1rem; /* Reduce text size */
  width: fit-content; /* Make button size adjust to text */
}

.vadibas_josla:hover {
  background-color: #900000;
}

h3 {
  font-size: 1.5rem;
  padding-bottom: 2px;
}
</style>
