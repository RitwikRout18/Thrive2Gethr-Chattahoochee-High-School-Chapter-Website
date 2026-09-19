// DOM Elements
const navbar = document.querySelector('.navbar');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
const mobileLinks = document.querySelectorAll('.mobile-link');
const sections = document.querySelectorAll('.hidden');

// Sticky Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
function toggleMenu() {
    mobileNavOverlay.classList.toggle('active');
    
    // Transform hamburger icon
    const spans = mobileMenuBtn.querySelectorAll('span');
    if (mobileNavOverlay.classList.contains('active')) {
        spans[0].style.transform = 'translateY(8px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-8px) rotate(-45deg)';
        document.body.style.overflow = 'hidden'; // Stop scrolling
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
        document.body.style.overflow = ''; // Enable scrolling
    }
}

mobileMenuBtn.addEventListener('click', toggleMenu);

// Close mobile menu when a link is clicked
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (mobileNavOverlay.classList.contains('active')) {
            toggleMenu();
        }
    });
});

// Intersection Observer for scroll animations (fade in)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// Add active state to initial visible sections
window.addEventListener('load', () => {
    document.querySelector('.slide-up')?.classList.add('show');
    // Ensure scroll position check on load
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    }
});

// Navbar Mouse Tracking for Ripple Effect
navbar.addEventListener('mousemove', (e) => {
    const rect = navbar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    navbar.style.setProperty('--mouse-x', `${x}px`);
});

// Intro Section Interactive Canvas Grid
const canvas = document.getElementById('intro-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const spacing = 35; // Grid spacing
    const mouse = { x: -1000, y: -1000, radius: 75 };

    function initCanvas() {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
        particles = [];
        
        for (let x = 0; x < width + spacing; x += spacing) {
            for (let y = 120; y < height + spacing; y += spacing) {
                particles.push({
                    x: x, y: y,
                    baseX: x, baseY: y,
                    size: 2,
                });
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'; // Brighter dots

        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            
            // Vector from mouse to particle
            let dx = mouse.x - p.x;
            let dy = mouse.y - p.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                // Force away from mouse
                let force = (mouse.radius - distance) / mouse.radius;
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                
                let pushStrength = 7;
                p.x -= forceDirectionX * force * pushStrength;
                p.y -= forceDirectionY * force * pushStrength;
            } else {
                // Spring back to base position smoothly
                p.x -= (p.x - p.baseX) * 0.1;
                p.y -= (p.y - p.baseY) * 0.1;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
        requestAnimationFrame(animate);
    }

    const introBgGrid = document.querySelector('.intro-bg-grid');
    introBgGrid.addEventListener('mousemove', (e) => {
        const rect = introBgGrid.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    introBgGrid.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    window.addEventListener('resize', () => {
        initCanvas();
    });

    initCanvas();
    animate();
}

// Expandable Events Box Toggle for Mobile / Click
const eventsBox = document.querySelector('.expandable-events-box');
if (eventsBox) {
    const trigger = eventsBox.querySelector('.events-box-trigger');
    trigger.addEventListener('click', (e) => {
        eventsBox.classList.toggle('active');
        e.stopPropagation();
    });

    document.addEventListener('click', (e) => {
        if (!eventsBox.contains(e.target)) {
            eventsBox.classList.remove('active');
        }
    });
}
