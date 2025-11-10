// admin.js - Admin dashboard functionality
const admin = {
  currentOrder: null,

  // Initialize admin dashboard
  init: async () => {
    await admin.loadDashboardStats();
    admin.setupEventListeners();
  },

  // Setup event listeners
  setupEventListeners: () => {
    // Add artwork button
    const addArtworkBtn = document.getElementById('add-artwork-btn');
    if (addArtworkBtn) {
      addArtworkBtn.addEventListener('click', () => {
        admin.openArtworkModal();
      });
    }

    // Artwork form
    const artworkForm = document.getElementById('artwork-form');
    if (artworkForm) {
      artworkForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await admin.saveArtwork();
      });
    }

    // Cancel artwork form
    const cancelArtworkForm = document.getElementById('cancel-artwork-form');
    if (cancelArtworkForm) {
      cancelArtworkForm.addEventListener('click', () => {
        document.getElementById('artwork-modal').classList.remove('active');
      });
    }

    // Artwork image preview
    const artworkImage = document.getElementById('artwork-image');
    if (artworkImage) {
      artworkImage.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const preview = document.getElementById('artwork-image-preview');
            preview.src = e.target.result;
            preview.style.display = 'block';
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // About form
    const aboutForm = document.getElementById('about-form');
    if (aboutForm) {
      aboutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await admin.updateAbout();
      });
    }

    // Fun fact form
    const funfactForm = document.getElementById('funfact-form');
    if (funfactForm) {
      funfactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await admin.addFunFact();
      });
    }

    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await admin.updateContact();
      });
    }

    // Add pricing button
    const addPricingBtn = document.getElementById('add-pricing-btn');
    if (addPricingBtn) {
      addPricingBtn.addEventListener('click', () => {
        admin.addPricingRow();
      });
    }

    // Settings form
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
      settingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await admin.updateSettings();
      });
    }

    // Close modals
    const artworkModalClose = document.getElementById('artwork-modal-close');
    if (artworkModalClose) {
      artworkModalClose.addEventListener('click', () => {
        document.getElementById('artwork-modal').classList.remove('active');
      });
    }

    const orderModalClose = document.getElementById('order-modal-close');
    if (orderModalClose) {
      orderModalClose.addEventListener('click', () => {
        document.getElementById('order-modal').classList.remove('active');
      });
    }
  },

  // Load dashboard stats
  loadDashboardStats: async () => {
    try {
      const container = document.getElementById('dashboard-stats');
      if (!container) return;

      const stats = await utils.apiRequest('/admin-dashboard/stats');
      
      if (stats.data) {
        container.innerHTML = `
          <div class="stat-card">
            <h3>${stats.data.artworks || 0}</h3>
            <p>Total Artworks</p>
          </div>
          <div class="stat-card">
            <h3>${stats.data.orders || 0}</h3>
            <p>Total Orders</p>
          </div>
          <div class="stat-card">
            <h3>${stats.data.users || 0}</h3>
            <p>Total Users</p>
          </div>
          <div class="stat-card">
            <h3>${stats.data.totalLikes || 0}</h3>
            <p>Total Likes</p>
          </div>
        `;
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      const container = document.getElementById('dashboard-stats');
      if (container) {
        container.innerHTML = '<p>Error loading stats.</p>';
      }
    }
  },

  // Load artworks
  loadArtworks: async () => {
    try {
      const container = document.getElementById('artworks-list');
      if (!container) return;

      utils.showLoader(container);

      const artworks = await utils.apiRequest('/artworks');
      
      container.innerHTML = '';
      
      if (artworks.length === 0) {
        container.innerHTML = '<p>No artworks yet. Add your first artwork!</p>';
        return;
      }

      artworks.forEach((artwork) => {
        const card = admin.createArtworkCard(artwork);
        container.appendChild(card);
      });
    } catch (error) {
      console.error('Error loading artworks:', error);
      const container = document.getElementById('artworks-list');
      if (container) {
        container.innerHTML = '<p>Error loading artworks.</p>';
      }
    }
  },

  // Create artwork card for admin
  createArtworkCard: (artwork) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.display = 'grid';
    card.style.gridTemplateColumns = '200px 1fr auto';
    card.style.gap = '1rem';
    card.style.alignItems = 'center';
    
    card.innerHTML = `
      <img src="${artwork.imageUrl}" alt="${artwork.caption}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;">
      <div>
        <h3>${artwork.title || artwork.caption}</h3>
        <p style="color: var(--text-secondary);">${artwork.caption}</p>
        <p><strong>Likes:</strong> ${artwork.likes || 0} | <strong>Comments:</strong> ${artwork.comments ? artwork.comments.length : 0}</p>
        ${artwork.isForSale ? '<span class="order-status completed">For Sale</span>' : ''}
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        <button class="btn btn-primary edit-artwork-btn" data-artwork-id="${artwork._id}">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn btn-danger delete-artwork-btn" data-artwork-id="${artwork._id}">
          <i class="fas fa-trash"></i> Delete
        </button>
        <button class="btn btn-secondary view-comments-btn" data-artwork-id="${artwork._id}">
          <i class="fas fa-comments"></i> Comments
        </button>
      </div>
    `;

    // Edit button
    const editBtn = card.querySelector('.edit-artwork-btn');
    editBtn.addEventListener('click', () => {
      admin.openArtworkModal(artwork);
    });

    // Delete button
    const deleteBtn = card.querySelector('.delete-artwork-btn');
    deleteBtn.addEventListener('click', async () => {
      if (confirm('Are you sure you want to delete this artwork?')) {
        await admin.deleteArtwork(artwork._id);
      }
    });

    // View comments button
    const commentsBtn = card.querySelector('.view-comments-btn');
    commentsBtn.addEventListener('click', () => {
      admin.viewArtworkComments(artwork);
    });

    return card;
  },

  // Open artwork modal
  openArtworkModal: (artwork = null) => {
    const modal = document.getElementById('artwork-modal');
    const form = document.getElementById('artwork-form');
    const title = document.getElementById('artwork-modal-title');
    
    if (artwork) {
      title.textContent = 'Edit Artwork';
      document.getElementById('artwork-id').value = artwork._id;
      document.getElementById('artwork-title').value = artwork.title || '';
      document.getElementById('artwork-caption').value = artwork.caption || '';
      document.getElementById('artwork-instagram').value = artwork.instagramLink || '';
      document.getElementById('artwork-for-sale').checked = artwork.isForSale || false;
      
      const preview = document.getElementById('artwork-image-preview');
      if (artwork.imageUrl) {
        preview.src = artwork.imageUrl;
        preview.style.display = 'block';
      }
    } else {
      title.textContent = 'Add Artwork';
      form.reset();
      document.getElementById('artwork-image-preview').style.display = 'none';
    }
    
    modal.classList.add('active');
  },

  // Save artwork
  saveArtwork: async () => {
    try {
      const formData = new FormData();
      const artworkId = document.getElementById('artwork-id').value;
      const imageFile = document.getElementById('artwork-image').files[0];

      const isForSale = document.getElementById('artwork-for-sale').checked;
      formData.append('title', document.getElementById('artwork-title').value);
      formData.append('caption', document.getElementById('artwork-caption').value);
      formData.append('instagramLink', document.getElementById('artwork-instagram').value);
      formData.append('isForSale', isForSale);
      formData.append('isAvailable', isForSale); // Also set isAvailable
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (artworkId) {
        // Update existing artwork
        await utils.apiRequestFormData(`/artworks/${artworkId}`, formData, 'PUT');
        utils.showSuccess('Artwork updated successfully!');
      } else {
        // Create new artwork
        if (!imageFile) {
          utils.showError('Please select an image');
          return;
        }
        await utils.apiRequestFormData('/artworks', formData, 'POST');
        utils.showSuccess('Artwork added successfully!');
      }

      document.getElementById('artwork-modal').classList.remove('active');
      await admin.loadArtworks();
    } catch (error) {
      utils.showError(error.message || 'Failed to save artwork');
    }
  },

  // Delete artwork
  deleteArtwork: async (artworkId) => {
    try {
      await utils.apiRequest(`/artworks/${artworkId}`, {
        method: 'DELETE',
      });

      utils.showSuccess('Artwork deleted successfully!');
      await admin.loadArtworks();
    } catch (error) {
      utils.showError(error.message || 'Failed to delete artwork');
    }
  },

  // View artwork comments
  viewArtworkComments: async (artwork) => {
    const modal = document.getElementById('order-modal');
    const modalContent = document.getElementById('order-modal-content');
    
    modalContent.innerHTML = `
      <h3>Comments for "${artwork.title || artwork.caption}"</h3>
      <div id="comments-list-admin" style="max-height: 400px; overflow-y: auto; margin-top: 1rem;">
        ${artwork.comments && artwork.comments.length > 0 
          ? artwork.comments.map(comment => `
              <div class="card" style="margin-bottom: 1rem;">
                <p><strong>${comment.user || 'Anonymous'}</strong></p>
                <p>${comment.text}</p>
                <small style="color: var(--text-muted);">${utils.formatDate(comment.createdAt)}</small>
                <button class="btn btn-danger btn-sm delete-comment-btn" data-artwork-id="${artwork._id}" data-comment-id="${comment._id}" style="margin-top: 0.5rem;">
                  <i class="fas fa-trash"></i> Delete
                </button>
              </div>
            `).join('')
          : '<p>No comments yet.</p>'
        }
      </div>
    `;

    modal.classList.add('active');

    // Add delete comment handlers
    document.querySelectorAll('.delete-comment-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const artworkId = btn.getAttribute('data-artwork-id');
        const commentId = btn.getAttribute('data-comment-id');
        if (confirm('Are you sure you want to delete this comment?')) {
          try {
            await utils.apiRequest(`/artworks/${artworkId}/comment/${commentId}`, {
              method: 'DELETE',
            });
            utils.showSuccess('Comment deleted successfully!');
            await admin.loadArtworks();
            admin.viewArtworkComments(artwork);
          } catch (error) {
            utils.showError(error.message || 'Failed to delete comment');
          }
        }
      });
    });
  },

  // Load orders
  loadOrders: async () => {
    try {
      const container = document.getElementById('admin-orders-list');
      if (!container) return;

      utils.showLoader(container);

      const ordersList = await utils.apiRequest('/orders');
      
      container.innerHTML = '';
      
      if (!Array.isArray(ordersList) || ordersList.length === 0) {
        container.innerHTML = '<p>No orders yet.</p>';
        return;
      }

      ordersList.forEach((order) => {
        const card = admin.createOrderCard(order);
        container.appendChild(card);
      });
    } catch (error) {
      console.error('Error loading orders:', error);
      const container = document.getElementById('admin-orders-list');
      if (container) {
        container.innerHTML = '<p>Error loading orders.</p>';
      }
    }
  },

  // Create order card for admin
  createOrderCard: (order) => {
    const card = document.createElement('div');
    card.className = 'order-card';
    
    const statusClass = order.status.replace('_', '-');
    const statusLabel = order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
        <div>
          <h3>Order #${order._id.slice(-6)}</h3>
          <p style="color: var(--text-secondary); margin-top: 0.5rem;">
            <strong>Customer:</strong> ${order.userName || (order.user && order.user.name) || 'N/A'} (${order.userEmail || (order.user && order.user.email) || 'N/A'})<br>
            <strong>Date:</strong> ${utils.formatDate(order.createdAt)}
          </p>
        </div>
        <span class="order-status ${statusClass}">${statusLabel}</span>
      </div>
      <div style="margin-bottom: 1rem;">
        <p><strong>Size:</strong> ${order.size || 'N/A'}</p>
        <p><strong>Budget:</strong> $${order.budget || '0'}</p>
        <p><strong>Description:</strong> ${order.description}</p>
        ${order.reason ? `<p><strong>Reason:</strong> ${order.reason}</p>` : ''}
      </div>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <select class="form-select order-status-select" data-order-id="${order._id}" style="width: auto;">
          <option value="pending" ${order.status === 'pending' || order.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="accepted" ${order.status === 'accepted' || order.status === 'Accepted' ? 'selected' : ''}>Accepted</option>
          <option value="in_progress" ${order.status === 'in_progress' || order.status === 'in-progress' || order.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
          <option value="completed" ${order.status === 'completed' || order.status === 'Completed' ? 'selected' : ''}>Completed</option>
          <option value="rejected" ${order.status === 'rejected' || order.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
          <option value="cancelled" ${order.status === 'cancelled' || order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
        <button class="btn btn-primary update-order-btn" data-order-id="${order._id}">
          Update Status
        </button>
        <button class="btn btn-secondary view-order-btn" data-order-id="${order._id}">
          View Details
        </button>
      </div>
    `;

    // Update status button
    const updateBtn = card.querySelector('.update-order-btn');
    updateBtn.addEventListener('click', async () => {
      const status = card.querySelector('.order-status-select').value;
      await admin.updateOrderStatus(order._id, status);
    });

    // View details button
    const viewBtn = card.querySelector('.view-order-btn');
    viewBtn.addEventListener('click', () => {
      admin.viewOrderDetails(order);
    });

    return card;
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      let reason = '';
      if (status === 'rejected' || status === 'cancelled') {
        reason = prompt('Please provide a reason:');
        if (!reason) {
          utils.showError('Reason is required');
          return;
        }
      }

      // Backend model enum uses 'in_progress' with underscore, but controller checks for 'in-progress' with hyphen
      // Send 'in_progress' to match model enum (backend should handle validation)
      const backendStatus = status === 'in_progress' ? 'in_progress' : status;

      await utils.apiRequest(`/orders/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: backendStatus, reason }),
      });

      utils.showSuccess('Order status updated successfully!');
      await admin.loadOrders();
    } catch (error) {
      utils.showError(error.message || 'Failed to update order status');
    }
  },

  // View order details
  viewOrderDetails: (order) => {
    const modal = document.getElementById('order-modal');
    const modalContent = document.getElementById('order-modal-content');
    
    modalContent.innerHTML = `
      <h3>Order #${order._id.slice(-6)}</h3>
      <div style="margin-top: 1rem;">
        <p><strong>Customer:</strong> ${order.userName || (order.user && order.user.name) || 'N/A'}</p>
        <p><strong>Email:</strong> ${order.userEmail || (order.user && order.user.email) || 'N/A'}</p>
        <p><strong>Size:</strong> ${order.size || 'N/A'}</p>
        <p><strong>Budget:</strong> $${order.budget || '0'}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Description:</strong> ${order.description}</p>
        ${order.reason ? `<p><strong>Reason:</strong> ${order.reason}</p>` : ''}
        ${order.referenceImages && order.referenceImages.length > 0 ? `
          <div style="margin-top: 1rem;">
            <strong>Reference Images:</strong>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; margin-top: 0.5rem;">
              ${order.referenceImages.map(img => `
                <img src="${img}" alt="Reference" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;">
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;

    modal.classList.add('active');
  },

  // Load about
  loadAbout: async () => {
    try {
      const aboutData = await utils.apiRequest('/about');
      const settings = await utils.apiRequest('/settings');

      document.getElementById('about-bio').value = aboutData.aboutBio || settings.aboutBio || '';
    } catch (error) {
      console.error('Error loading about:', error);
    }
  },

  // Update about
  updateAbout: async () => {
    try {
      const formData = new FormData();
      formData.append('aboutBio', document.getElementById('about-bio').value);
      
      const imageFile = document.getElementById('about-image').files[0];
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await utils.apiRequestFormData('/about', formData, 'PUT');
      utils.showSuccess('About section updated successfully!');
    } catch (error) {
      utils.showError(error.message || 'Failed to update about section');
    }
  },

  // Load fun facts
  loadFunFacts: async () => {
    try {
      const funFacts = await utils.apiRequest('/funfacts');
      const container = document.getElementById('funfacts-list');
      
      if (container) {
        container.innerHTML = '';
        if (funFacts.length === 0) {
          container.innerHTML = '<p>No fun facts yet.</p>';
          return;
        }

        funFacts.forEach((factObj) => {
          const factDiv = document.createElement('div');
          factDiv.className = 'card';
          factDiv.style.marginBottom = '1rem';
          factDiv.innerHTML = `
            <p>${factObj.fact}</p>
            <button class="btn btn-danger btn-sm delete-funfact-btn" data-fact-id="${factObj._id}" style="margin-top: 0.5rem;">
              <i class="fas fa-trash"></i> Delete
            </button>
          `;
          container.appendChild(factDiv);

          // Delete handler
          const deleteBtn = factDiv.querySelector('.delete-funfact-btn');
          deleteBtn.addEventListener('click', async () => {
            if (confirm('Are you sure you want to delete this fun fact?')) {
              await admin.deleteFunFact(factObj._id);
            }
          });
        });
      }
    } catch (error) {
      console.error('Error loading fun facts:', error);
    }
  },

  // Add fun fact
  addFunFact: async () => {
    try {
      const text = document.getElementById('funfact-text').value;
      if (!text.trim()) {
        utils.showError('Please enter a fun fact');
        return;
      }

      await utils.apiRequest('/funfacts', {
        method: 'POST',
        body: JSON.stringify({ fact: text }),
      });

      utils.showSuccess('Fun fact added successfully!');
      document.getElementById('funfact-text').value = '';
      await admin.loadFunFacts();
    } catch (error) {
      utils.showError(error.message || 'Failed to add fun fact');
    }
  },

  // Delete fun fact
  deleteFunFact: async (factId) => {
    try {
      await utils.apiRequest(`/funfacts/${factId}`, {
        method: 'DELETE',
      });

      utils.showSuccess('Fun fact deleted successfully!');
      await admin.loadFunFacts();
    } catch (error) {
      utils.showError(error.message || 'Failed to delete fun fact');
    }
  },

  // Load contact
  loadContact: async () => {
    try {
      const settings = await utils.apiRequest('/settings');

      document.getElementById('contact-email').value = settings.contactEmail || '';
      document.getElementById('contact-phone').value = settings.contactPhone || '';
      document.getElementById('contact-whatsapp').value = settings.whatsappNumber || '';
      document.getElementById('contact-instagram').value = settings.instagramLink || '';

      // Load commission pricing
      const pricingList = document.getElementById('commission-pricing-list');
      if (pricingList) {
        pricingList.innerHTML = '';
        if (settings.commissionPricing && settings.commissionPricing.length > 0) {
          settings.commissionPricing.forEach((pricing, index) => {
            admin.addPricingRow(pricing.size, pricing.price, index);
          });
        }
      }
    } catch (error) {
      console.error('Error loading contact:', error);
    }
  },

  // Add pricing row
  addPricingRow: (size = '', price = '', index = null) => {
    const container = document.getElementById('commission-pricing-list');
    if (!container) return;

    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.gap = '1rem';
    row.style.marginBottom = '0.5rem';
    row.innerHTML = `
      <input type="text" class="form-input pricing-size" placeholder="Size (e.g., 12x16)" value="${size}" style="flex: 1;">
      <input type="number" class="form-input pricing-price" placeholder="Price" value="${price}" style="flex: 1;">
      <button type="button" class="btn btn-danger remove-pricing-btn">
        <i class="fas fa-times"></i>
      </button>
    `;

    container.appendChild(row);

    // Remove button
    const removeBtn = row.querySelector('.remove-pricing-btn');
    removeBtn.addEventListener('click', () => {
      row.remove();
    });
  },

  // Update contact
  updateContact: async () => {
    try {
      // Collect pricing data
      const pricingRows = document.querySelectorAll('#commission-pricing-list > div');
      const commissionPricing = [];
      pricingRows.forEach(row => {
        const size = row.querySelector('.pricing-size').value;
        const price = row.querySelector('.pricing-price').value;
        if (size && price) {
          commissionPricing.push({ size, price: parseFloat(price) });
        }
      });

      await utils.apiRequest('/settings', {
        method: 'PUT',
        body: JSON.stringify({
          contactEmail: document.getElementById('contact-email').value,
          contactPhone: document.getElementById('contact-phone').value,
          whatsappNumber: document.getElementById('contact-whatsapp').value,
          instagramLink: document.getElementById('contact-instagram').value,
          commissionPricing: JSON.stringify(commissionPricing),
        }),
      });

      utils.showSuccess('Contact info updated successfully!');
    } catch (error) {
      utils.showError(error.message || 'Failed to update contact info');
    }
  },

  // Load settings
  loadSettings: async () => {
    try {
      const settings = await utils.apiRequest('/settings');
      // Settings are loaded, form is ready for updates
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  },

  // Update settings
  updateSettings: async () => {
    try {
      const formData = new FormData();
      
      const logoFile = document.getElementById('logo-upload').files[0];
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      const backgroundFiles = document.getElementById('background-artworks').files;
      if (backgroundFiles.length > 0) {
        // Upload background artworks one by one
        for (let file of backgroundFiles) {
          const bgFormData = new FormData();
          bgFormData.append('image', file);
          await utils.apiRequestFormData('/settings/background', bgFormData, 'POST');
        }
      }

      if (logoFile) {
        await utils.apiRequestFormData('/settings', formData, 'PUT');
      }

      utils.showSuccess('Settings updated successfully!');
    } catch (error) {
      utils.showError(error.message || 'Failed to update settings');
    }
  },
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('admin-dashboard.html')) {
    admin.init();
  }
});

