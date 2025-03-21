/**
 * Template Name: Dewi
 * Template URL: https://bootstrapmade.com/dewi-free-multi-purpose-html-template/
 * Updated: Feb 2025 with Bootstrap v5.3.3
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */

(function () {
  "use strict";

  /**
   * Apply .scrolled class when scrolling
   */
  function toggleScrolled() {
    const body = document.querySelector("body");
    const header = document.querySelector("#header");
    if (!header) return;
    if (window.scrollY > 100) {
      body.classList.add("scrolled");
    } else {
      body.classList.remove("scrolled");
    }
  }

  document.addEventListener("scroll", toggleScrolled);
  window.addEventListener("load", toggleScrolled);

  /**
   * Mobile navigation toggle
   */
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener("click", function () {
      document.body.classList.toggle("mobile-nav-active");
      this.classList.toggle("bi-list");
      this.classList.toggle("bi-x");
    });
  }

  /**
   * Smooth scroll to hash links
   */
  document.querySelectorAll('#navmenu a').forEach((navItem) => {
    navItem.addEventListener("click", function (event) {
      if (document.querySelector(".mobile-nav-active")) {
        document.body.classList.remove("mobile-nav-active");
        mobileNavToggleBtn.classList.toggle("bi-list");
        mobileNavToggleBtn.classList.toggle("bi-x");
      }
    });
  });

  /**
   * Preloader removal
   */
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => preloader.remove());
  }

  /**
   * Scroll to top button
   */
  const scrollTop = document.querySelector(".scroll-top");
  if (scrollTop) {
    function toggleScrollTop() {
      if (window.scrollY > 100) {
        scrollTop.classList.add("active");
      } else {
        scrollTop.classList.remove("active");
      }
    }
    scrollTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", toggleScrollTop);
    window.addEventListener("load", toggleScrollTop);
  }

  /**
   * Initiate animation on scroll (AOS)
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }
  window.addEventListener("load", aosInit);

  /**
   * Initiate GLightbox
   */
  const glightbox = GLightbox({ selector: ".glightbox" });

  /**
   * Initiate Swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach((swiperElement) => {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );
      new Swiper(swiperElement, config);
    });
  }
  window.addEventListener("load", initSwiper);

  /**
   * Isotope Filter
   */
  document.querySelectorAll(".isotope-layout").forEach((isotopeItem) => {
    let layout = isotopeItem.getAttribute("data-layout") || "masonry";
    let filter = isotopeItem.getAttribute("data-default-filter") || "*";
    let sort = isotopeItem.getAttribute("data-sort") || "original-order";

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector(".isotope-container"), function () {
      initIsotope = new Isotope(isotopeItem.querySelector(".isotope-container"), {
        itemSelector: ".isotope-item",
        layoutMode: layout,
        filter: filter,
        sortBy: sort,
      });
    });

    isotopeItem.querySelectorAll(".isotope-filters li").forEach((filterItem) => {
      filterItem.addEventListener("click", function () {
        isotopeItem
          .querySelector(".isotope-filters .filter-active")
          .classList.remove("filter-active");
        this.classList.add("filter-active");
        initIsotope.arrange({ filter: this.getAttribute("data-filter") });

        aosInit();
      });
    });
  });

  /**
   * Correct scrolling position for hash links on page load
   */
  window.addEventListener("load", function () {
    if (window.location.hash && document.querySelector(window.location.hash)) {
      setTimeout(() => {
        let section = document.querySelector(window.location.hash);
        let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
        window.scrollTo({
          top: section.offsetTop - parseInt(scrollMarginTop),
          behavior: "smooth",
        });
      }, 100);
    }
  });
  document.addEventListener('DOMContentLoaded', function() {
    new PureCounter();
  });

/**
 * Bootstrap Tab Switcher
 */
document.addEventListener("DOMContentLoaded", function () {
  window.switchTab = function (event, tabId) {
    if (event && typeof event.preventDefault === "function") {
      event.preventDefault(); // Prevent default behavior
    }

    // Deactivate all tabs
    document.querySelectorAll(".nav-link").forEach((tab) => tab.classList.remove("active"));
    
    // Find the target tab link
    let targetTab = document.querySelector(`[data-bs-target="#${tabId}"]`);
    if (targetTab) {
      let tab = new bootstrap.Tab(targetTab);
      tab.show();
      targetTab.classList.add("active"); // Highlight the clicked tab
    }

    // Scroll smoothly to the features section
    let featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
});

  /**
   * Form handling code for contact form and newsletter
   * Commented out to resolve errors
   */
  /*
  document.addEventListener('DOMContentLoaded', function() {
    // Your Telegram Bot Token and Chat ID (from setup steps)
    const botToken = ''; // Replace with your actual bot token
    const chatId = '';     // Replace with your actual chat ID
    
    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading message
        contactForm.querySelector('.loading').style.display = 'block';
        contactForm.querySelector('.error-message').style.display = 'none';
        contactForm.querySelector('.sent-message').style.display = 'none';
        
        // Get form data
        const name = contactForm.querySelector('input[name="name"]').value;
        const email = contactForm.querySelector('input[name="email"]').value;
        const phone = contactForm.querySelector('input[name="phone"]').value;
        const message = contactForm.querySelector('textarea[name="message"]').value;
        
        // Format message for Telegram
        const telegramMessage = `
  🔔 New Contact Form Submission:
        
  👤 Name: ${name}
  📧 Email: ${email}
  📱 Phone: ${phone}
        
  💬 Message:
  ${message}
        `;
        
        // Send to Telegram
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: telegramMessage
          })
        })
        .then(response => response.json())
        .then(data => {
          // Hide loading indicator
          contactForm.querySelector('.loading').style.display = 'none';
          
          if (data.ok) {
            // Show success message
            contactForm.querySelector('.sent-message').style.display = 'block';
            contactForm.reset(); // Clear the form
          } else {
            // Show error message
            contactForm.querySelector('.error-message').textContent = 'An error occurred. Please try again.';
            contactForm.querySelector('.error-message').style.display = 'block';
          }
        })
        .catch(error => {
          // Hide loading indicator and show error
          contactForm.querySelector('.loading').style.display = 'none';
          contactForm.querySelector('.error-message').textContent = 'Failed to send message. Please try again.';
          contactForm.querySelector('.error-message').style.display = 'block';
        });
      });
    }
    
    // Newsletter Subscription
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading message
        newsletterForm.querySelector('.loading').style.display = 'block';
        newsletterForm.querySelector('.error-message').style.display = 'none';
        newsletterForm.querySelector('.sent-message').style.display = 'none';
        
        // Get form data
        const email = newsletterForm.querySelector('input[name="email"]').value;
        
        // Format message for Telegram
        const telegramMessage = `
  📧 New Newsletter Subscription:
        
  Email: ${email}
  Date: ${new Date().toLocaleString()}
        `;
        
        // Send to Telegram
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: telegramMessage
          })
        })
        .then(response => response.json())
        .then(data => {
          // Hide loading indicator
          newsletterForm.querySelector('.loading').style.display = 'none';
          
          if (data.ok) {
            // Show success message
            newsletterForm.querySelector('.sent-message').style.display = 'block';
            newsletterForm.reset(); // Clear the form
            
            // Optional: Save subscribers to localStorage for backup
            try {
              const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
              subscribers.push({email: email, date: new Date().toISOString()});
              localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
            } catch (e) {
              console.error('Could not save to localStorage', e);
            }
          } else {
            // Show error message
            newsletterForm.querySelector('.error-message').textContent = 'An error occurred. Please try again.';
            newsletterForm.querySelector('.error-message').style.display = 'block';
          }
        })
        .catch(error => {
          // Hide loading indicator and show error
          newsletterForm.querySelector('.loading').style.display = 'none';
          newsletterForm.querySelector('.error-message').textContent = 'Failed to subscribe. Please try again.';
          newsletterForm.querySelector('.error-message').style.display = 'block';
        });
      });
    }
  });
  */

  /**
   * Simple form handling code (alternative to Telegram)
   * Uncomment this if you want basic form functionality without external API calls
   */
  /*
  document.addEventListener('DOMContentLoaded', function() {
    // Form handling utility function
    function setupForm(formId) {
      const form = document.getElementById(formId);
      if (!form) return;
      
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get appropriate message containers
        const loadingDiv = form.querySelector('.loading');
        const errorDiv = form.querySelector('.error-message');
        const successDiv = form.querySelector('.sent-message');
        
        // Show loading
        loadingDiv.style.display = 'block';
        errorDiv.style.display = 'none';
        successDiv.style.display = 'none';
        
        // For demonstration, we'll just simulate success and store in localStorage
        setTimeout(() => {
          try {
            // Collect form data
            const formData = new FormData(form);
            const formValues = {};
            formData.forEach((value, key) => {
              formValues[key] = value;
            });
            
            // Store in localStorage based on form type
            if (formId === 'contactForm') {
              const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
              messages.push({...formValues, date: new Date().toISOString()});
              localStorage.setItem('contact_messages', JSON.stringify(messages));
            } else if (formId === 'newsletterForm') {
              const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
              subscribers.push({email: formValues.email, date: new Date().toISOString()});
              localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
            }
            
            // Show success message
            loadingDiv.style.display = 'none';
            successDiv.style.display = 'block';
            form.reset();
            
          } catch (error) {
            console.error('Error processing form:', error);
            loadingDiv.style.display = 'none';
            errorDiv.textContent = 'An error occurred. Please try again.';
            errorDiv.style.display = 'block';
          }
        }, 1000); // Simulate network delay
      });
    }
    
    // Set up contact form and newsletter form
    setupForm('contactForm');
    setupForm('newsletterForm');
  });
  */

})();
