// JavaScript functionality for the portfolio website

// DOM Elements
const header = document.getElementById('header');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');

// Header scroll effect
let lastScrollY = window.scrollY;

function updateHeaderOnScroll() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScrollY = currentScrollY;
}

// Mobile menu toggle
function toggleMobileMenu() {
    const isActive = mobileNav.classList.contains('active');
    
    if (isActive) {
        mobileNav.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        // Reset hamburger animation
        const hamburgers = mobileMenuBtn.querySelectorAll('.hamburger');
        hamburgers.forEach(hamburger => {
            hamburger.style.transform = '';
        });
    } else {
        mobileNav.classList.add('active');
        mobileMenuBtn.classList.add('active');
        // Animate hamburger to X
        const hamburgers = mobileMenuBtn.querySelectorAll('.hamburger');
        hamburgers[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
        hamburgers[1].style.opacity = '0';
        hamburgers[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
    }
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const headerHeight = header.offsetHeight;
        const elementPosition = element.offsetTop - headerHeight;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (mobileNav.classList.contains('active')) {
            toggleMobileMenu();
        }
    }
}

// Animate proficiency bars when they come into view
function animateProficiencyBars() {
    const proficiencyItems = document.querySelectorAll('.proficiency-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fillBar = entry.target.querySelector('.proficiency-fill');
                const percentage = fillBar.style.width;
                
                // Reset and animate
                fillBar.style.width = '0%';
                setTimeout(() => {
                    fillBar.style.width = percentage;
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    proficiencyItems.forEach(item => {
        observer.observe(item);
    });
}

// Animate achievement numbers when they come into view
function animateAchievementNumbers() {
    const achievementCards = document.querySelectorAll('.achievement-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numberElement = entry.target.querySelector('.achievement-number');
                const finalNumber = numberElement.textContent;
                const numericValue = parseInt(finalNumber.replace(/\D/g, ''));
                
                if (!isNaN(numericValue)) {
                    animateNumber(numberElement, 0, numericValue, finalNumber.includes('+') ? '+' : '');
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    achievementCards.forEach(card => {
        observer.observe(card);
    });
}

// Animate number counting
function animateNumber(element, start, end, suffix = '') {
    const duration = 2000; // 2 seconds
    const increment = (end - start) / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 16);
}

// Add hover effects to project cards
function addProjectCardEffects() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

// Add typing effect to hero title (optional enhancement)
function addTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const text = heroTitle.innerHTML;
    heroTitle.innerHTML = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    };
    
    // Start typing effect after a short delay
    setTimeout(typeWriter, 500);
}

// Handle form submissions (if contact form is present)
function handleContactForm() {
    const contactForm = document.querySelector('#contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Show success message (in a real app, you'd send this to a server)
            showToast('Message Sent!', 'Thank you for reaching out. I\'ll get back to you soon!');
            
            // Reset form
            contactForm.reset();
        });
    }
}

// Simple toast notification
function showToast(title, message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-header">
            <strong>${title}</strong>
            <button class="toast-close" onclick="closeToast(this)">&times;</button>
        </div>
        <div class="toast-body">${message}</div>
    `;
    
    // Add toast styles if not already present
    if (!document.querySelector('#toast-styles')) {
        const styles = document.createElement('style');
        styles.id = 'toast-styles';
        styles.textContent = `
            .toast {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                min-width: 300px;
                z-index: 1000;
                animation: slideIn 0.3s ease-out;
            }
            .toast-header {
                padding: 12px 16px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .toast-body {
                padding: 12px 16px;
                color: #666;
            }
            .toast-close {
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: #999;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add toast to page
    document.body.appendChild(toast);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
}

function closeToast(button) {
    const toast = button.closest('.toast');
    if (toast) {
        toast.remove();
    }
}

// Lazy loading for images
function setupLazyLoading() {
    const images = document.querySelectorAll('img');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        if (img.dataset.src) {
            imageObserver.observe(img);
        }
    });
}

// Add smooth reveal animations for sections
function addScrollAnimations() {
    const animatedElements = document.querySelectorAll('.highlight-card, .skill-category, .certification-card, .project-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Handle external links
function setupExternalLinks() {
    const externalLinks = document.querySelectorAll('a[href^="http"], a[href^="mailto"], a[href^="tel"]');
    
    externalLinks.forEach(link => {
        if (link.hostname !== window.location.hostname) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
}

// Performance: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize everything when DOM is loaded
function init() {
    // Basic functionality
    setupExternalLinks();
    addProjectCardEffects();
    handleContactForm();
    
    // Animations
    animateProficiencyBars();
    animateAchievementNumbers();
    addScrollAnimations();
    setupLazyLoading();
    
    // Event listeners
    window.addEventListener('scroll', debounce(updateHeaderOnScroll, 10));
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!header.contains(e.target) && mobileNav.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
    
    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
}

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Make scrollToSection available globally for onclick handlers
window.scrollToSection = scrollToSection;