document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navbar Effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    mobileToggle.addEventListener('click', () => {
        // Simple toggle for now. In a full app, we'd add an active class to nav-menu to show it
        const isVisible = navMenu.style.display === 'flex';
        if (isVisible) {
            navMenu.style.display = 'none';
        } else {
            navMenu.style.display = 'flex';
            navMenu.style.flexDirection = 'column';
            navMenu.style.position = 'absolute';
            navMenu.style.top = '100%';
            navMenu.style.left = '0';
            navMenu.style.width = '100%';
            navMenu.style.backgroundColor = 'var(--bg-light)';
            navMenu.style.padding = '2rem';
            navMenu.style.boxShadow = 'var(--shadow-soft)';
        }
    });

    // 3. Fade-in Animations using IntersectionObserver
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                
                // If it's a hero image wrapper, trigger its inner scale
                if (entry.target.classList.contains('hero-image-wrapper')) {
                    entry.target.classList.add('appear');
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => fadeObserver.observe(el));

    // 4. Horizontal Scroll Interaction for Testimonials (Desktop Grab & Drag)
    const reviewsContainer = document.querySelector('.reviews-container');
    let isDown = false;
    let startX;
    let scrollLeft;

    if (reviewsContainer) {
        reviewsContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            reviewsContainer.classList.add('active');
            startX = e.pageX - reviewsContainer.offsetLeft;
            scrollLeft = reviewsContainer.scrollLeft;
        });

        reviewsContainer.addEventListener('mouseleave', () => {
            isDown = false;
            reviewsContainer.classList.remove('active');
        });

        reviewsContainer.addEventListener('mouseup', () => {
            isDown = false;
            reviewsContainer.classList.remove('active');
        });

        reviewsContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - reviewsContainer.offsetLeft;
            const walk = (x - startX) * 2; // scroll-fast multiplier
            reviewsContainer.scrollLeft = scrollLeft - walk;
        });
    }

    // Assign Images when ready
    // You can swap these with locally generated items
});
