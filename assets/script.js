let body=document.querySelector('body');

let crsr = document.getElementById('cursor');

// Smoother cursor movement using transform
body.addEventListener('mousemove', function(dets) {
    crsr.style.transform = `translate(${dets.clientX - crsr.offsetWidth/2}px, ${dets.clientY - crsr.offsetHeight/2}px)`;
});

// Smooth scrolling to the view
document.querySelector('a[href="#About"]').addEventListener('click',function(event){
    event.preventDefault();
    document.getElementById('about-me').scrollIntoView({behavior:"smooth"})
})

document.querySelector('a[href="#education"]').addEventListener('click',function(event){
    event.preventDefault();
    document.getElementById('education-content').scrollIntoView({behavior:"smooth"})
})

document.querySelector('a[href="#experience"]').addEventListener('click',function(event){
    event.preventDefault();
    document.getElementById('experience-section').scrollIntoView({behavior:"smooth"})
})

document.querySelector('a[href="#skills"]').addEventListener('click',function(event){
    event.preventDefault();
    document.getElementById('skills').scrollIntoView({behavior:"smooth"})
})

document.querySelector('a[href="#techstack"]').addEventListener('click',function(event){
    event.preventDefault();
    document.getElementById('tech-stack').scrollIntoView({behavior:"smooth"})
})

document.querySelector('a[href="#projects"]').addEventListener('click',function(event){
    event.preventDefault();
    document.getElementById('projects').scrollIntoView({behavior:"smooth"})
})

// ADDED: Smooth scrolling for new Competitions section
document.querySelector('a[href="#competitions"]').addEventListener('click',function(event){
    event.preventDefault();
    document.getElementById('competitions').scrollIntoView({behavior:"smooth"})
})

document.querySelector('a[href="#connect"]').addEventListener('click',function(event){
    event.preventDefault();
    document.getElementById('connect').scrollIntoView({behavior:"smooth"})
})

// Home link smooth scroll
const homeLink = document.querySelector('a[href="#home"]');
if (homeLink) {
    homeLink.addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('home-context').scrollIntoView({behavior:"smooth"})
    })
}

// FIXED: Changed selector from duplicate id to unique id
window.addEventListener("DOMContentLoaded", function() {
    let line = document.querySelector('#typing-intro'); // Changed from '#home-context p#lines'
    if(!line) return;

    const text = "Hello, I'm Aayush Kumar.";
    line.textContent = '';
    let i = 0;

    function type() {
        if (i < text.length) {
            line.style.fontSize ="4rem";
            line.style.fontWeight = "bold";
            line.textContent += text.charAt(i);
            i++;
            setTimeout(type, 70); 
        }
    }

    type(); 
});

function showProjects(category) {
    // Hide all categories
    document.querySelectorAll('.project-category').forEach(div => {
        div.style.display = "none";
    });

    // Show only the selected one
    document.getElementById(category + '-projects').style.display = "block";
}