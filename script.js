/* =========================================
   GLOBAL BOOKING MODAL LOGIC
   ========================================= */
let currentModalStep = 1;
const totalModalSteps = 6;

// Store the user's selections
let bookingData = {
    service: 'Hydrafacial',
    price: '$120',
    specialist: 'Any Available Specialist',
    time: '11:30 AM'
};

// Handle closing the modal
function closeModal() {
    const modalOverlay = document.getElementById('bookingModal');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore background scrolling
        
        // Reset to step 1 after the fade-out animation
        setTimeout(() => {
            currentModalStep = 1;
            updateModalDisplay();
            
            // Reset footer display if they completed the booking
            document.getElementById('modalFooter').style.display = 'flex';
            document.getElementById('successFooter').style.display = 'none';
            document.getElementById('progressTracker').style.display = 'flex';
            document.querySelector('.modal-title').style.display = 'block';
        }, 300);
    }
}

// Handle clicking an option (Service, Specialist, Time)
function selectOption(type, value, price, element) {
    // Save data
    bookingData[type] = value;
    if (price) bookingData.price = price;
    
    // Remove 'selected' or 'active' class from siblings
    const siblings = element.parentElement.children;
    for(let i = 0; i < siblings.length; i++) {
        siblings[i].classList.remove('selected');
        siblings[i].classList.remove('active'); 
    }
    
    // Add class to clicked element
    element.classList.add(type === 'time' ? 'active' : 'selected');
}

// Handle "Continue" button
function nextStep() {
    if (currentModalStep < totalModalSteps) {
        // If moving to Summary (Step 5), populate the data on screen
        if(currentModalStep === 4) {
            document.getElementById('sumService').innerText = bookingData.service;
            document.getElementById('sumSpecialist').innerText = bookingData.specialist;
            document.getElementById('sumTime').innerText = bookingData.time;
            document.getElementById('sumPrice').innerText = bookingData.price;
        }
        // If moving to Success (Step 6)
        if(currentModalStep === 5) {
            document.getElementById('finalService').innerText = bookingData.service;
            document.getElementById('finalSpecialist').innerText = bookingData.specialist;
            document.getElementById('finalTime').innerText = bookingData.time;
            
            // Swap footer buttons to show the WhatsApp link
            document.getElementById('modalFooter').style.display = 'none';
            document.getElementById('successFooter').style.display = 'flex';
            document.getElementById('progressTracker').style.display = 'none';
            document.querySelector('.modal-title').style.display = 'none';
        }
        
        currentModalStep++;
        updateModalDisplay();
    }
}

// Handle "Back" button
function prevStep() {
    if (currentModalStep > 1) {
        currentModalStep--;
        updateModalDisplay();
    } else {
        closeModal();
    }
}

// Update UI based on current step
function updateModalDisplay() {
    // Hide all steps
    document.querySelectorAll('.modal-step').forEach(step => step.classList.remove('active'));
    
    // Show current step
    const activeStep = document.getElementById(`step${currentModalStep}`);
    if (activeStep) activeStep.classList.add('active');
    
    // Update progress tracker UI
    if(currentModalStep <= 5) {
        document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
            const stepNum = index + 1;
            if (stepNum === currentModalStep) {
                indicator.classList.add('active');
                indicator.classList.remove('completed');
            } else if (stepNum < currentModalStep) {
                indicator.classList.add('completed');
                indicator.classList.remove('active');
            } else {
                indicator.classList.remove('active');
                indicator.classList.remove('completed');
            }
        });
        
        // Change "Continue" button text on step 5
        const btnContinue = document.getElementById('btnContinue');
        if (btnContinue) {
            btnContinue.innerText = (currentModalStep === 5) ? "Confirm Appointment" : "Continue";
        }
    }
}


/* =========================================
   ON PAGE LOAD (DOM CONTENT LOADED)
   ========================================= */
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
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
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
    }

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
    let autoScrollTimer;
    let scrollSpeed = 1;
    
    if (reviewsContainer) {
        // Make sure 'reviewsTrack' is defined right above the if statement!
    const reviewsTrack = document.querySelector('.reviews-track');
    
    let autoScrollTimer;
    let scrollSpeed = 1; // Change to 0.5 for slower, 2 for faster!

    if (reviewsContainer && reviewsTrack) {
        // 1. Clone the reviews so it creates a seamless infinite loop!
        reviewsTrack.innerHTML += reviewsTrack.innerHTML;

        // 2. The Auto-Scroll Function
        function autoScroll() {
            if (!isDown) {
                reviewsContainer.scrollLeft += scrollSpeed;
                
                // If we've scrolled past the first set, instantly reset to 0 (invisible to the user)
                if (reviewsContainer.scrollLeft >= reviewsTrack.scrollWidth / 2) {
                    reviewsContainer.scrollLeft = 0;
                }
            }
            autoScrollTimer = requestAnimationFrame(autoScroll);
        }

        // 3. Start the auto-scrolling
        autoScrollTimer = requestAnimationFrame(autoScroll);

        // 4. Pause scrolling when the user hovers over a review to read it
        reviewsContainer.addEventListener('mouseenter', () => {
            cancelAnimationFrame(autoScrollTimer);
        });

        // 5. Your manual drag logic (updated to pause/resume the auto-scroll)
        reviewsContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            cancelAnimationFrame(autoScrollTimer); // Stop auto-scroll while dragging
            reviewsContainer.classList.add('active');
            startX = e.pageX - reviewsContainer.offsetLeft;
            scrollLeft = reviewsContainer.scrollLeft;
        });

        reviewsContainer.addEventListener('mouseleave', () => {
            isDown = false;
            reviewsContainer.classList.remove('active');
            autoScrollTimer = requestAnimationFrame(autoScroll); // Resume auto-scroll
        });

        reviewsContainer.addEventListener('mouseup', () => {
            isDown = false;
            reviewsContainer.classList.remove('active');
            autoScrollTimer = requestAnimationFrame(autoScroll); // Resume auto-scroll
        });

        reviewsContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - reviewsContainer.offsetLeft;
            const walk = (x - startX) * 2; 
            reviewsContainer.scrollLeft = scrollLeft - walk;
        });
    }
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

    // 5. Open Modal Triggers (Attach clicks to all "Book" buttons)
    const modalOverlay = document.getElementById('bookingModal');
    const closeModalBtn = document.getElementById('closeModal');
    
    // Find all buttons that contain the word "Book" or "Appointment"
    const bookButtons = document.querySelectorAll('a, button');
    bookButtons.forEach(btn => {
        if(btn.innerText.includes('Book') || btn.innerText.includes('Appointment')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault(); 
                if (modalOverlay) {
                    modalOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Stop background scrolling
                }
            });
        }
    });

    // Attach click to the modal's X close button
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
});