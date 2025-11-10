// orders.js - Orders page functionality
const orders = {
  uploadedImages: [],

  // Initialize orders page
  init: async () => {
    // Check if showing order form or orders list
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('new') === 'true') {
      orders.setupOrderForm();
    } else {
      await orders.loadOrders();
    }
  },

  // Setup order form
  setupOrderForm: () => {
    // Prefill user info if available
    const user = auth.getCurrentUser();
    if (user && user.email) {
      const emailInput = document.getElementById('order-email');
      if (emailInput) {
        emailInput.value = user.email;
      }
    }

    // File upload handler
    const fileUploadArea = document.getElementById('file-upload-area');
    const fileInput = document.getElementById('order-images');
    const uploadedImagesContainer = document.getElementById('uploaded-images');

    if (fileUploadArea && fileInput) {
      fileUploadArea.addEventListener('click', () => {
        fileInput.click();
      });

      fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadArea.classList.add('dragover');
      });

      fileUploadArea.addEventListener('dragleave', () => {
        fileUploadArea.classList.remove('dragover');
      });

      fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.classList.remove('dragover');
        const files = Array.from(e.dataTransfer.files);
        orders.handleFileUpload(files);
      });

      fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        orders.handleFileUpload(files);
      });
    }

    // Cancel button
    const cancelBtn = document.getElementById('cancel-order-form');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        window.location.href = 'orders.html';
      });
    }

    // Form submission
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
      orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await orders.submitOrder();
      });
    }

    // Close success modal
    const closeSuccessModal = document.getElementById('close-success-modal');
    if (closeSuccessModal) {
      closeSuccessModal.addEventListener('click', () => {
        document.getElementById('success-modal').classList.remove('active');
        setTimeout(() => {
          window.location.href = 'contact.html';
        }, 500);
      });
    }
  },

  // Handle file upload
  handleFileUpload: (files) => {
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          orders.uploadedImages.push({
            file: file,
            dataUrl: e.target.result,
          });
          orders.displayUploadedImage(e.target.result, orders.uploadedImages.length - 1);
        };
        reader.readAsDataURL(file);
      }
    });
  },

  // Display uploaded image
  displayUploadedImage: (dataUrl, index) => {
    const container = document.getElementById('uploaded-images');
    if (container) {
      const imageDiv = document.createElement('div');
      imageDiv.className = 'uploaded-image';
      imageDiv.innerHTML = `
        <img src="${dataUrl}" alt="Reference image">
        <button type="button" class="remove-image" data-index="${index}">
          <i class="fas fa-times"></i>
        </button>
      `;
      container.appendChild(imageDiv);

      // Remove image handler
      const removeBtn = imageDiv.querySelector('.remove-image');
      removeBtn.addEventListener('click', () => {
        orders.uploadedImages.splice(index, 1);
        imageDiv.remove();
        // Update indices
        orders.updateImageIndices();
      });
    }
  },

  // Update image indices after removal
  updateImageIndices: () => {
    const removeBtns = document.querySelectorAll('.remove-image');
    removeBtns.forEach((btn, index) => {
      btn.setAttribute('data-index', index);
    });
  },

  // Submit order
  submitOrder: async () => {
    if (!utils.isAuthenticated()) {
      utils.showError('Please login to place an order');
      window.location.href = 'login.html';
      return;
    }

    try {
      const userName = document.getElementById('order-name').value;
      const userEmail = document.getElementById('order-email').value;
      const size = document.getElementById('order-size').value;
      const budget = parseFloat(document.getElementById('order-budget').value);
      const deadline = document.getElementById('order-deadline').value;
      const description = document.getElementById('order-description').value;

      // Note: Backend currently expects: size, description, budget, deadline
      // Reference images and userName/userEmail might need backend updates
      // For now, send what backend expects
      const orderData = {
        size,
        description,
        budget,
        deadline,
        userName, // May be used by backend if supported
        userEmail, // May be used by backend if supported
        type: 'commission',
      };

      // Send order as JSON
      await utils.apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });

      // Show success modal
      document.getElementById('success-modal').classList.add('active');

      // Redirect after 10 seconds
      setTimeout(() => {
        window.location.href = 'contact.html';
      }, 10000);
    } catch (error) {
      utils.showError(error.message || 'Failed to place order');
    }
  },

  // Load user orders
  loadOrders: async () => {
    try {
      const container = document.getElementById('orders-list');
      if (!container) return;

      utils.showLoader(container);

      const ordersList = await utils.apiRequest('/orders/my');
      
      container.innerHTML = '';
      
      // Handle case where backend returns message instead of array
      if (!Array.isArray(ordersList) || ordersList.length === 0) {
        container.innerHTML = `
          <div class="card text-center">
            <h2>You have no orders till now</h2>
            <p style="margin-top: 1rem; color: var(--text-secondary);">
              Start by placing your first commission order!
            </p>
            <a href="orders.html?new=true" class="btn btn-primary" style="margin-top: 1rem;">
              <i class="fas fa-plus"></i> Place New Order
            </a>
          </div>
        `;
        return;
      }

      ordersList.forEach((order) => {
        const orderCard = orders.createOrderCard(order);
        container.appendChild(orderCard);
      });
    } catch (error) {
      console.error('Error loading orders:', error);
      const container = document.getElementById('orders-list');
      if (container) {
        container.innerHTML = '<p class="text-center">Error loading orders. Please try again later.</p>';
      }
    }
  },

  // Create order card
  createOrderCard: (order) => {
    const card = document.createElement('div');
    card.className = 'order-card';
    
    // Handle both 'in_progress' and 'in-progress' formats
    const status = order.status.toLowerCase().replace('-', '_');
    const statusClass = status.replace('_', '-');
    const statusLabel = status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
        <div>
          <h3>Order #${order._id.slice(-6)}</h3>
          <p style="color: var(--text-secondary); margin-top: 0.5rem;">
            Placed on ${utils.formatDate(order.createdAt)}
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
      ${order.referenceImages && order.referenceImages.length > 0 ? `
        <div style="margin-bottom: 1rem;">
          <strong>Reference Images:</strong>
          <div style="display: flex; gap: 1rem; margin-top: 0.5rem; flex-wrap: wrap;">
            ${order.referenceImages.map(img => `
              <img src="${img}" alt="Reference" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;">
            `).join('')}
          </div>
        </div>
      ` : ''}
      ${order.status === 'pending' ? `
        <button class="btn btn-danger cancel-order-btn" data-order-id="${order._id}">
          <i class="fas fa-times"></i> Cancel Order
        </button>
      ` : ''}
    `;

    // Add cancel handler
    const cancelBtn = card.querySelector('.cancel-order-btn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to cancel this order?')) {
          await orders.cancelOrder(order._id);
        }
      });
    }

    return card;
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    try {
      const reason = prompt('Please provide a reason for cancellation:');
      if (!reason) {
        utils.showError('Reason is required');
        return;
      }

      await utils.apiRequest(`/orders/${orderId}/cancel`, {
        method: 'PUT',
        body: JSON.stringify({ reason }),
      });

      utils.showSuccess('Order cancelled successfully');
      await orders.loadOrders();
    } catch (error) {
      utils.showError(error.message || 'Failed to cancel order');
    }
  },
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('orders.html')) {
    orders.init();
  }
});

