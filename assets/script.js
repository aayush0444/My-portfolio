// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== CURSOR FUNCTIONALITY ====================
    const body = document.querySelector('body');
    const crsr = document.getElementById('cursor');
    
    if (crsr) {
        // Smoother cursor movement using transform
        body.addEventListener('mousemove', function(dets) {
            crsr.style.transform = `translate(${dets.clientX - crsr.offsetWidth/2}px, ${dets.clientY - crsr.offsetHeight/2}px)`;
        });
    }

    // ==================== SMOOTH SCROLLING ====================
    const scrollLinks = {
        'About': 'about-me',
        'education': 'education-content',
        'experience': 'experience-section',
        'skills': 'skills',
        'techstack': 'tech-stack',
        'projects': 'projects',
        'competitions': 'competitions',
        'connect': 'connect',
        'home': 'home-context'
    };

    // Add smooth scroll listeners for all navigation links
    Object.keys(scrollLinks).forEach(linkHash => {
        const link = document.querySelector(`a[href="#${linkHash}"]`);
        const target = document.getElementById(scrollLinks[linkHash]);
        
        if (link && target) {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                target.scrollIntoView({behavior: "smooth"});
            });
        }
    });

    // ==================== TYPING ANIMATION ====================
    const typingElement = document.querySelector('#typing-intro');
    if (typingElement) {
        const text = "Hello, I'm Aayush Kumar.";
        typingElement.textContent = '';
        let i = 0;

        function type() {
            if (i < text.length) {
                typingElement.style.fontSize = "4rem";
                typingElement.style.fontWeight = "bold";
                typingElement.textContent += text.charAt(i);
                i++;
                setTimeout(type, 70); 
            }
        }

        type();
    }

    // ==================== PROJECT TABS INITIALIZATION ====================
    // Show Data Analytics projects by default on page load
    const defaultTab = 'analytics';
    const defaultProject = document.getElementById(`${defaultTab}-projects`);
    if (defaultProject) {
        defaultProject.style.display = "block";
    }
});

// ==================== PROJECT TAB SWITCHING (Global function) ====================
function showProjects(category) {
    // Hide all project categories
    const allCategories = document.querySelectorAll('.project-category');
    allCategories.forEach(div => {
        div.style.display = "none";
    });

    // Show the selected category
    const selectedCategory = document.getElementById(category + '-projects');
    if (selectedCategory) {
        selectedCategory.style.display = "block";
    }

    // Add active state to clicked tab (optional visual feedback)
    const allTabs = document.querySelectorAll('.heading-card');
    allTabs.forEach(tab => {
        tab.classList.remove('active-tab');
    });
    
    // Find and activate the clicked tab
    const categoryMap = {
        'analytics': 0,
        'science': 1,
        'genai': 2
    };
    
    const tabIndex = categoryMap[category];
    if (tabIndex !== undefined && allTabs[tabIndex]) {
        allTabs[tabIndex].classList.add('active-tab');
    }
}