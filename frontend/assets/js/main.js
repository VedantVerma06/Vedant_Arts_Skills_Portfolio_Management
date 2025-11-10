// main.js - Main page functionality
const main = {
  // Initialize main page
  init: async () => {
    await main.loadSettings();
    await main.loadFunFacts();
    main.setupNavigation();
  },

  // Load settings (logo, background artworks)
  loadSettings: async () => {
    try {
      const settings = await utils.apiRequest('/settings');
      
      // Set logo
      const logoImg = document.getElementById('logo-img');
      if (logoImg && settings.logoUrl) {
        logoImg.src = settings.logoUrl;
        logoImg.alt = 'Vedant Verma Logo';
      }

      // Set background slideshow
      const slideshow = document.getElementById('background-slideshow');
      if (slideshow && settings.backgroundArtworks && settings.backgroundArtworks.length > 0) {
        slideshow.innerHTML = '';
        settings.backgroundArtworks.forEach((url, index) => {
          const slide = document.createElement('img');
          slide.src = url;
          slide.className = 'slide';
          slide.style.animationDelay = `${index * 5}s`;
          slideshow.appendChild(slide);
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  },

  // Load fun facts
  loadFunFacts: async () => {
    try {
      const funFacts = await utils.apiRequest('/funfacts');
      const container = document.getElementById('fun-facts-container');
      
      if (container && funFacts.length > 0) {
        container.innerHTML = '';
        funFacts.forEach((factObj) => {
          const card = document.createElement('div');
          card.className = 'fun-fact-card';
          card.innerHTML = `
            <i class="fas fa-star"></i>
            <p>${factObj.fact}</p>
          `;
          container.appendChild(card);
        });
      }
    } catch (error) {
      console.error('Error loading fun facts:', error);
    }
  },

  // Setup smooth navigation
  setupNavigation: () => {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  },
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
    main.init();
  }
});

