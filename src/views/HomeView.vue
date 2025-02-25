<script setup>
    import Footer from '@/components/Footer.vue';
    // var i = 0;
    // var j = 0;
    // var txt = [
    //     "We have made program...",
    //     "The programm that finally will end our suffering for not knowing...",
    //     "The programm that will help you to see your progress and actualy know how fast you progress... and your PR's... ",
    //     "   ",
    //     "This is FITLIBRARY"
    // ];
    // var speed = 40; //0.04sec

    // function typeWriter() {
    //     if (j < txt.length) {
    //         if (i < txt[j].length) {
    //             document.getElementById("demo").innerHTML += txt[j].charAt(i);
    //             i++;
    //             setTimeout(typeWriter, speed); //tad kad uzraksta katru burtu
    //         } else {
    //             i = 0;
    //             j++;
    //             document.getElementById("demo").innerHTML += "<br>";
    //             setTimeout(typeWriter, 1000); // wait 1 seconds before displaying the next line, when all line is writed
    //         }
            
    //     }
    // }

    // typeWriter();

    // function toggleDropdown() {
    //     const dropdown = document.getElementById('dropdownMenu');
    //     dropdown.classList.toggle('active');
    // }
</script>


<template>
    <!-- <header>
        <h1>Fitlibrary</h1>
        <div class="hamburger" onclick="toggleDropdown()">
            <div></div>
            <div></div>
            <div></div>
        </div>
        <div class="nav-links">
            <table>
                <tr>
                    <th><a href="signup.html"><div class="vadibas_josla">Signup</div></a></th>
                    <th><a href="login.html"><div class="vadibas_josla">Login</div></a></th>
                    <th><a href="index.html"><div class="vadibas_josla">Home</div></a></th>
                    <th><a href="about.html"><div class="vadibas_josla">About</div></a></th>
                    <th><a href="contact.html"><div class="vadibas_josla">Contact</div></a></th>
                    <th><a href="coaching.html"><div class="vadibas_josla">Coaching</div></a></th>
                </tr>
            </table>
        </div>
    </header> -->
    <!-- <div class="dropdown" id="dropdownMenu">
        <a href="signup.html">Signup</a>
        <a href="login.html">Login</a>
        <a href="index.html">Home</a>
        <a href="about.html">About</a>
        <a href="contact.html">Contact</a>
        <a href="coaching.html">Coaching</a>
    </div> -->
    <!-- <main class="Beckgroound_image">
        <div id="teksts">
            <div id="demo" class="var pabiditpalabi"></div>
            <div id="demo2" class="var pabiditpalabi"></div>
        </div>
        <img src="pro+plan.jfif" alt="Average musu lietotnes lietotajs" class="pabiditpalabi">
    </main>
    <aside id="atstarpefoter">
        <h1 id="b" class="pabiditpalabi">We don't bite</h1>
        <table>
            <tr>
                <td><a href="signup.html"><div class="vadibas_josla pabiditpalabi"><h3>Signup</h3></div></a></td>
            </tr>
            <tr>
                <td><a href="login.html"><div class="vadibas_josla pabiditpalabi"><h3>Login</h3></div></a></td>
            </tr>            
        </table>
    </aside> -->
</template>


<style scoped>
.var {
    color: rgb(255, 255, 255);          
    font-size: 24px;    
    font-family: 'Times New Roman', Times, serif, sans-serif;  
    font-weight: bold;
}
header {
    background-color: #be0000;
    color: #fff;
    padding: 10px 20px;
    justify-content: space-between;
    align-items: center;
}

main {
    background-color: #333;
    padding-bottom: 50px; /* Add padding to prevent content from overlapping footer */
}
li {
    color: #be0000;
}
/* Hamburger menu styles */
.hamburger {
    display: none;
    flex-direction: column;
    cursor: pointer;
}
.hamburger div {
    width: 25px;
    height: 3px;
    background-color: white;
    margin: 4px 0;
    transition: 0.4s;
}
.dropdown {
    display: none;
    flex-direction: column;
    background-color: #be0000;
    position: relative;
    top: 0px; /* adjust based on your header height */
    width: 100%;
}
.dropdown a {
    color: white;
    padding: 15px;
    text-decoration: none;
    text-align: center;
}
.dropdown a:hover {
    background-color: #a30000;
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
}
body{
    margin: 0px;
}
/* #teksts {
    position: absolute;
}
.var {
    position: relative;
    left: 20px;
} */
.var {
    padding-bottom: 10px;
} 
.pabiditpalabi{
    transform: translateX(20px);
}
#atstarpefoter{
    padding-bottom: 20px;
}
h3{
    font-size: 1.5rem;
}
</style>