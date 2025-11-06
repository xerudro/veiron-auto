// ===== MOBILE MENU TOGGLE =====
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    mobileMenuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        
        // Change icon
        const icon = this.querySelector('i');
        if (nav.classList.contains('active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            nav.classList.remove('active');
            mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
        }
    });

    // ===== LANGUAGE SWITCHER =====
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const selectedLang = this.getAttribute('data-lang');
            
            // Remove active class from all buttons
            langButtons.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Handle language change
            changeLanguage(selectedLang);
        });
    });

    function changeLanguage(lang) {
        // Store selected language
        localStorage.setItem('selectedLanguage', lang);
        
        // Get current page name
        const currentPage = window.location.pathname.split('/').pop();
        
        // Redirect to appropriate page based on current page
        if (currentPage === 'booking-en.html') {
            if (lang === 'en') {
                window.location.href = 'booking-en.html';
            } else {
                window.location.href = 'booking.html';
            }
        } else if (currentPage === 'booking.html') {
            if (lang === 'en') {
                window.location.href = 'booking-en.html';
            } else {
                window.location.href = 'booking.html';
            }
        } else if (currentPage === 'contact-en.html') {
            if (lang === 'en') {
                window.location.href = 'contact-en.html';
            } else {
                window.location.href = 'contact.html';
            }
        } else if (currentPage === 'contact.html') {
            if (lang === 'en') {
                window.location.href = 'contact-en.html';
            } else {
                window.location.href = 'contact.html';
            }
        } else {
            // Default to index pages
            if (lang === 'en') {
                window.location.href = 'index-en.html';
            } else {
                window.location.href = 'index-ro.html';
            }
        }
    }

    // ===== SCROLL EFFECTS =====
    let lastScrollTop = 0;
    const header = document.querySelector('.header');

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add shadow on scroll
        if (scrollTop > 10) {
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.15)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
        
        lastScrollTop = scrollTop;
    });

    // ===== SMOOTH SCROLLING =====
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle internal links
            if (href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });


});