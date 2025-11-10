// contact.js - Contact page functionality
const contact = {
  // Initialize contact page
  init: async () => {
    await contact.loadContactInfo();
    await contact.loadCommissionPricing();
  },

  // Load contact information
  loadContactInfo: async () => {
    try {
      const settings = await utils.apiRequest('/settings');
      const contactInfo = document.getElementById('contact-info');
      
      if (contactInfo) {
        contactInfo.innerHTML = '';
        
        // Contact image (could use a default or settings image)
        const contactImage = document.getElementById('contact-image');
        if (contactImage && settings.profilePicUrl) {
          contactImage.src = settings.profilePicUrl;
          contactImage.style.display = 'block';
        }

        // Contact details
        if (settings.contactEmail) {
          const emailItem = document.createElement('div');
          emailItem.className = 'contact-item';
          emailItem.innerHTML = `
            <i class="fas fa-envelope"></i>
            <div>
              <strong>Email</strong>
              <p><a href="mailto:${settings.contactEmail}">${settings.contactEmail}</a></p>
            </div>
          `;
          contactInfo.appendChild(emailItem);
        }

        if (settings.contactPhone) {
          const phoneItem = document.createElement('div');
          phoneItem.className = 'contact-item';
          phoneItem.innerHTML = `
            <i class="fas fa-phone"></i>
            <div>
              <strong>Phone</strong>
              <p><a href="tel:${settings.contactPhone}">${settings.contactPhone}</a></p>
            </div>
          `;
          contactInfo.appendChild(phoneItem);
        }

        if (settings.whatsappNumber) {
          const whatsappItem = document.createElement('div');
          whatsappItem.className = 'contact-item';
          whatsappItem.innerHTML = `
            <i class="fab fa-whatsapp"></i>
            <div>
              <strong>WhatsApp</strong>
              <p><a href="https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}" target="_blank">${settings.whatsappNumber}</a></p>
            </div>
          `;
          contactInfo.appendChild(whatsappItem);
        }

        if (settings.instagramLink) {
          const instagramItem = document.createElement('div');
          instagramItem.className = 'contact-item';
          instagramItem.innerHTML = `
            <i class="fab fa-instagram"></i>
            <div>
              <strong>Instagram</strong>
              <p><a href="${settings.instagramLink}" target="_blank">Visit Instagram</a></p>
            </div>
          `;
          contactInfo.appendChild(instagramItem);
        }

        // LinkedIn (if available in settings)
        // You can add LinkedIn to AdminSettings model if needed
      }
    } catch (error) {
      console.error('Error loading contact info:', error);
      const contactInfo = document.getElementById('contact-info');
      if (contactInfo) {
        contactInfo.innerHTML = '<p>Unable to load contact information. Please try again later.</p>';
      }
    }
  },

  // Load commission pricing
  loadCommissionPricing: async () => {
    try {
      const settings = await utils.apiRequest('/settings');
      const tbody = document.getElementById('commission-tbody');
      
      if (tbody) {
        tbody.innerHTML = '';
        
        if (settings.commissionPricing && settings.commissionPricing.length > 0) {
          settings.commissionPricing.forEach((pricing) => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${pricing.size || 'N/A'}</td>
              <td>$${pricing.price || '0'}</td>
            `;
            tbody.appendChild(row);
          });
        } else {
          tbody.innerHTML = '<tr><td colspan="2" class="text-center">No commission pricing available yet.</td></tr>';
        }
      }
    } catch (error) {
      console.error('Error loading commission pricing:', error);
      const tbody = document.getElementById('commission-tbody');
      if (tbody) {
        tbody.innerHTML = '<tr><td colspan="2" class="text-center">Error loading pricing.</td></tr>';
      }
    }
  },
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('contact.html')) {
    contact.init();
  }
});

