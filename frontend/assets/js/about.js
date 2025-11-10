// about.js - About page functionality
const about = {
  // Initialize about page
  init: async () => {
    await about.loadAboutContent();
  },

  // Load about content
  loadAboutContent: async () => {
    try {
      // Load from /api/about
      const aboutData = await utils.apiRequest('/about');
      const settings = await utils.apiRequest('/settings');

      // Set profile picture
      const aboutImage = document.getElementById('about-image');
      if (aboutImage) {
        if (aboutData.profilePicUrl || settings.profilePicUrl) {
          aboutImage.src = aboutData.profilePicUrl || settings.profilePicUrl;
          aboutImage.style.display = 'block';
        }
      }

      // Set bio
      const aboutBio = document.getElementById('about-bio');
      if (aboutBio) {
        const bioText = aboutData.aboutBio || settings.aboutBio || 'No bio available yet.';
        aboutBio.innerHTML = `<p>${bioText.replace(/\n/g, '</p><p>')}</p>`;
      }
    } catch (error) {
      console.error('Error loading about content:', error);
      const aboutBio = document.getElementById('about-bio');
      if (aboutBio) {
        aboutBio.innerHTML = '<p>Unable to load about content. Please try again later.</p>';
      }
    }
  },
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('about.html')) {
    about.init();
  }
});

