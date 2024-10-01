document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll("#nav button");
    const sections = document.querySelectorAll(".content-section");

    buttons.forEach((button) => {
        button.addEventListener("click", function () {
            const sectionId = this.getAttribute("data-section");

            // Hide all sections
            sections.forEach((section) => {
                section.style.display = "none";
            });

            // Show the selected section
            const selectedSection = document.getElementById(sectionId);
            if (selectedSection) {
                selectedSection.style.display = "block";
            }
        });
    });
});
document.addEventListener("DOMContentLoaded", function  () {
  document.getElementById('home').style.display='block';}
 )
 
 //back to top button 
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 20) {
        document.getElementById("back-to-top-btn").style.display = "block";
    } else {
        document.getElementById("back-to-top-btn").style.display = "none";
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}