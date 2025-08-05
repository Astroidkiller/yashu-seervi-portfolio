// Portfolio data from JSON
const portfolioData = {
  "personal": {
    "name": "Yashu Seervi",
    "title": "AI Developer & Computer Science Student",
    "tagline": "Building AI Solutions for Social Impact",
    "email": "yashuseervi55@gmail.com",
    "phone": "+91 9602897582",
    "location": "Amravati, Andhra Pradesh",
    "linkedin": "linkedin.com/in/yashu-k-aa017a366",
    "github": "github.com/Astroidkiller"
  },
  "typingTexts": [
    "AI Developer",
    "Computer Science Student", 
    "OpenAI API Expert",
    "Machine Learning Enthusiast",
    "Social Impact Builder"
  ]
};

// DOM Elements
const typedTextElement = document.getElementById('typed-text');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const skillBars = document.querySelectorAll('.skill-progress');

// Typing Animation
class TypeWriter {
  constructor(element, texts, speed = 100, deleteSpeed = 50, pauseTime = 2000) {
    this.element = element;
    this.texts = texts;
    this.speed = speed;
    this.deleteSpeed = deleteSpeed;
    this.pauseTime = pauseTime;
    this.textIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.start();
  }

  start() {
    this.type();
  }

  type() {
    const currentText = this.texts[this.textIndex];
    
    if (this.isDeleting) {
      this.element.textContent = currentText.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.element.textContent = currentText.substring(0, this.charIndex + 1);
      this.charIndex++;
    }

    let typeSpeed = this.isDeleting ? this.deleteSpeed : this.speed;

    if (!this.isDeleting && this.charIndex === currentText.length) {
      typeSpeed = this.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.textIndex = (this.textIndex + 1) % this.texts.length;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// Navigation functionality
class Navigation {
  constructor() {
    this.init();
  }

  init() {
    this.handleNavToggle();
    this.handleNavLinks();
    this.handleScrollEffect();
  }

  handleNavToggle() {
    navToggle?.addEventListener('click', () => {
      navMenu?.classList.toggle('active');
      navToggle?.classList.toggle('active');
    });
  }

  handleNavLinks() {
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 70;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }

        // Close mobile menu
        navMenu?.classList.remove('active');
        navToggle?.classList.remove('active');
      });
    });
  }

  handleScrollEffect() {
    let lastScrollY = window.scrollY;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        navbar?.classList.add('nav-hidden');
      } else {
        navbar?.classList.remove('nav-hidden');
      }
      
      lastScrollY = currentScrollY;
    });
  }
}

// Scroll animations
class ScrollAnimations {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    this.init();
  }

  init() {
    this.createObserver();
    this.addAnimationClasses();
    this.animateSkillBars();
  }

  createObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Animate skill bars when skills section is visible
          if (entry.target.classList.contains('skills')) {
            this.animateSkillProgress();
          }
        }
      });
    }, this.observerOptions);
  }

  addAnimationClasses() {
    const animatedElements = document.querySelectorAll(`
      .about-content,
      .project-card,
      .cert-card,
      .skill-category,
      .timeline-item,
      .contact-content
    `);

    animatedElements.forEach(element => {
      element.classList.add('fade-in');
      this.observer.observe(element);
    });

    // Observe sections for skill bar animation
    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
      this.observer.observe(skillsSection);
    }
  }

  animateSkillProgress() {
    skillBars.forEach(bar => {
      const width = bar.getAttribute('data-width');
      setTimeout(() => {
        bar.style.width = width + '%';
      }, 300);
    });
  }

  animateSkillBars() {
    // Add staggered animation delays
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach((category, index) => {
      category.style.animationDelay = `${index * 0.2}s`;
    });
  }
}

// Contact form functionality
class ContactForm {
  constructor() {
    this.init();
  }

  init() {
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
      this.addInputValidation();
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const formObject = {};
    
    for (let [key, value] of formData.entries()) {
      formObject[key] = value;
    }

    if (this.validateForm(formObject)) {
      this.showSuccessMessage();
      contactForm.reset();
    }
  }

  validateForm(data) {
    const { name, email, subject, message } = data;
    let isValid = true;

    // Clear previous errors
    this.clearErrors();

    // Validate name
    if (!name || name.trim().length < 2) {
      this.showError('name', 'Name must be at least 2 characters long');
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      this.showError('email', 'Please enter a valid email address');
      isValid = false;
    }

    // Validate subject
    if (!subject || subject.trim().length < 5) {
      this.showError('subject', 'Subject must be at least 5 characters long');
      isValid = false;
    }

    // Validate message
    if (!message || message.trim().length < 10) {
      this.showError('message', 'Message must be at least 10 characters long');
      isValid = false;
    }

    return isValid;
  }

  showError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--color-error)';
    errorElement.style.fontSize = 'var(--font-size-sm)';
    errorElement.style.marginTop = 'var(--space-4)';
    errorElement.style.display = 'block';
    
    field.parentNode.appendChild(errorElement);
    field.style.borderColor = 'var(--color-error)';
  }

  clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.remove());
    
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(control => {
      control.style.borderColor = 'var(--color-border)';
    });
  }

  showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
      <div style="
        background: rgba(var(--color-success-rgb), 0.1);
        color: var(--color-success);
        padding: var(--space-16);
        border-radius: var(--radius-base);
        margin-bottom: var(--space-16);
        text-align: center;
        border: 1px solid rgba(var(--color-success-rgb), 0.3);
      ">
        ✅ Thank you for your message! I'll get back to you soon.
      </div>
    `;
    
    contactForm.parentNode.insertBefore(successMessage, contactForm);
    
    setTimeout(() => {
      successMessage.remove();
    }, 5000);
  }

  addInputValidation() {
    const inputs = contactForm.querySelectorAll('.form-control');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input);
      });
      
      input.addEventListener('input', () => {
        this.clearFieldError(input);
      });
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    this.clearFieldError(field);
    
    switch(fieldName) {
      case 'name':
        if (value.length < 2) {
          this.showFieldError(field, 'Name must be at least 2 characters long');
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          this.showFieldError(field, 'Please enter a valid email address');
        }
        break;
      case 'subject':
        if (value.length < 5) {
          this.showFieldError(field, 'Subject must be at least 5 characters long');
        }
        break;
      case 'message':
        if (value.length < 10) {
          this.showFieldError(field, 'Message must be at least 10 characters long');
        }
        break;
    }
  }

  showFieldError(field, message) {
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error-message';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--color-error)';
    errorElement.style.fontSize = 'var(--font-size-sm)';
    errorElement.style.marginTop = 'var(--space-4)';
    errorElement.style.display = 'block';
    
    field.parentNode.appendChild(errorElement);
    field.style.borderColor = 'var(--color-error)';
  }

  clearFieldError(field) {
    const errorMessage = field.parentNode.querySelector('.field-error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
    field.style.borderColor = 'var(--color-border)';
  }
}

// Smooth scrolling for all internal links
class SmoothScrolling {
  constructor() {
    this.init();
  }

  init() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 70;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

// Intersection Observer for advanced animations
class AdvancedAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.animateOnScroll();
    this.addHoverEffects();
    this.addLoadingAnimations();
  }

  animateOnScroll() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(`
      .hero-content,
      .about-highlights .highlight-item,
      .project-card,
      .cert-card,
      .skill-category,
      .timeline-item,
      .contact-item
    `);

    animatedElements.forEach((element, index) => {
      element.style.animationDelay = `${index * 0.1}s`;
      element.style.animationPlayState = 'paused';
      observer.observe(element);
    });
  }

  addHoverEffects() {
    // Add dynamic hover effects to cards
    const cards = document.querySelectorAll('.project-card, .cert-card, .contact-item');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        this.addPulseEffect(card);
      });
    });
  }

  addPulseEffect(element) {
    element.style.animation = 'pulse 0.6s ease-in-out';
    setTimeout(() => {
      element.style.animation = '';
    }, 600);
  }

  addLoadingAnimations() {
    // Add staggered loading animations
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(20px)';
      section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      section.style.transitionDelay = `${index * 0.1}s`;
      
      setTimeout(() => {
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
      }, 100);
    });
  }
}

// Performance optimizations
class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.lazyLoadImages();
    this.optimizeScrollEvents();
    this.preloadCriticalResources();
  }

  lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  optimizeScrollEvents() {
    let ticking = false;
    
    const updateScrollPosition = () => {
      // Optimized scroll handling
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollPosition);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
  }

  preloadCriticalResources() {
    // Preload critical fonts and resources
    const criticalResources = [
      'https://r2cdn.perplexity.ai/fonts/FKGroteskNeue.woff2'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }
}

// Theme handler (for potential future theme switching)
class ThemeHandler {
  constructor() {
    this.init();
  }

  init() {
    this.detectPreferredTheme();
    this.handleThemeChanges();
  }

  detectPreferredTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-color-scheme', prefersDark ? 'dark' : 'light');
  }

  handleThemeChanges() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      document.documentElement.setAttribute('data-color-scheme', e.matches ? 'dark' : 'light');
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize typing animation
  if (typedTextElement) {
    new TypeWriter(typedTextElement, portfolioData.typingTexts, 100, 50, 2000);
  }

  // Initialize all components
  new Navigation();
  new ScrollAnimations();
  new ContactForm();
  new SmoothScrolling();
  new AdvancedAnimations();
  new PerformanceOptimizer();
  new ThemeHandler();

  // Add some additional CSS for animations
  const style = document.createElement('style');
  style.textContent = `
    .nav-hidden {
      transform: translateY(-100%);
    }
    
    .animate-in {
      animation: slideInUp 0.6s ease forwards;
    }
    
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.02); }
      100% { transform: scale(1); }
    }
    
    @media (max-width: 768px) {
      .nav-menu.active {
        position: fixed;
        top: 70px;
        left: 0;
        width: 100%;
        background: rgba(19, 52, 59, 0.98);
        backdrop-filter: blur(10px);
        flex-direction: column;
        padding: var(--space-20) 0;
        display: flex;
        gap: var(--space-16);
        border-bottom: 1px solid rgba(50, 184, 198, 0.2);
        z-index: 999;
      }
      
      .nav-toggle.active .bar:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
      }
      
      .nav-toggle.active .bar:nth-child(2) {
        opacity: 0;
      }
      
      .nav-toggle.active .bar:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
      }
    }
  `;
  document.head.appendChild(style);

  // Add loading complete class
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 500);
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations when page is not visible
    document.body.style.animationPlayState = 'paused';
  } else {
    // Resume animations when page becomes visible
    document.body.style.animationPlayState = 'running';
  }
});

// Expose some functions globally for potential external use
window.portfolioApp = {
  scrollToSection: (sectionId) => {
    const section = document.querySelector(sectionId);
    if (section) {
      const offsetTop = section.offsetTop - 70;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  },
  
  showNotification: (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: var(--space-16);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-base);
      box-shadow: var(--shadow-lg);
      z-index: 10000;
      max-width: 400px;
      transition: all 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
};