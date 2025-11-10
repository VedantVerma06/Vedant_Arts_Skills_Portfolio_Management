// gallery.js - Gallery page functionality
const gallery = {
  artworks: [],
  currentArtworkIndex: 0,
  currentArtworkId: null,

  // Initialize gallery
  init: async () => {
    await gallery.loadArtworks();
    gallery.setupModals();
  },

  // Load artworks
  loadArtworks: async () => {
    try {
      const container = document.getElementById('gallery-container');
      utils.showLoader(container);

      gallery.artworks = await utils.apiRequest('/artworks');
      
      if (container) {
        container.innerHTML = '';
        if (gallery.artworks.length === 0) {
          container.innerHTML = '<p class="text-center">No artworks available yet.</p>';
          return;
        }

        gallery.artworks.forEach((artwork) => {
          const card = gallery.createArtworkCard(artwork);
          container.appendChild(card);
        });
      }
    } catch (error) {
      console.error('Error loading artworks:', error);
      const container = document.getElementById('gallery-container');
      if (container) {
        container.innerHTML = '<p class="text-center">Error loading artworks. Please try again later.</p>';
      }
    }
  },

  // Create artwork card
  createArtworkCard: (artwork) => {
    const card = document.createElement('div');
    card.className = 'artwork-card';
    card.innerHTML = `
      ${artwork.isForSale ? '<div class="for-sale-badge">For Sale</div>' : ''}
      <img src="${artwork.imageUrl}" alt="${artwork.caption || 'Artwork'}" class="artwork-image">
      <div class="artwork-info">
        <div class="artwork-caption">${artwork.caption || 'Untitled'}</div>
        ${artwork.instagramLink ? `<a href="${artwork.instagramLink}" target="_blank" style="color: var(--accent-primary);"><i class="fab fa-instagram"></i> View on Instagram</a>` : ''}
        <div class="artwork-actions">
          <button class="like-btn" data-artwork-id="${artwork._id}">
            <i class="fas fa-heart"></i>
            <span>${artwork.likes || 0}</span>
          </button>
          <button class="comment-btn" data-artwork-id="${artwork._id}">
            <i class="fas fa-comment"></i>
            <span>${artwork.comments ? artwork.comments.length : 0}</span>
          </button>
        </div>
      </div>
    `;

    // Add click handler to open modal
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.artwork-actions')) {
        gallery.openArtworkModal(artwork);
      }
    });

    // Add like handler
    const likeBtn = card.querySelector('.like-btn');
    likeBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      await gallery.toggleLike(artwork._id, likeBtn);
    });

    // Add comment handler
    const commentBtn = card.querySelector('.comment-btn');
    commentBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      gallery.openCommentModal(artwork._id);
    });

    return card;
  },

  // Toggle like
  toggleLike: async (artworkId, buttonElement) => {
    if (!utils.isAuthenticated()) {
      utils.showError('Please login to like artworks');
      window.location.href = 'login.html';
      return;
    }

    try {
      const response = await utils.apiRequest(`/artworks/${artworkId}/like`, {
        method: 'PUT',
      });

      // Update UI - backend returns { likes: number }
      const span = buttonElement.querySelector('span');
      if (response.likes !== undefined) {
        span.textContent = response.likes;
        // Toggle liked state (simple toggle, backend doesn't track per-user)
        buttonElement.classList.toggle('liked');
      }

      // Reload artworks to sync with backend
      await gallery.loadArtworks();
    } catch (error) {
      utils.showError(error.message || 'Failed to like artwork');
    }
  },

  // Open artwork modal
  openArtworkModal: (artwork) => {
    gallery.currentArtworkId = artwork._id;
    gallery.currentArtworkIndex = gallery.artworks.findIndex(a => a._id === artwork._id);
    
    const modal = document.getElementById('artwork-modal');
    const modalContent = document.getElementById('modal-content');
    
    modalContent.innerHTML = `
      <div style="text-align: center;">
        <img src="${artwork.imageUrl}" alt="${artwork.caption}" style="max-width: 100%; max-height: 600px; border-radius: 8px; margin-bottom: 1rem;">
        <h2>${artwork.caption || 'Untitled'}</h2>
        ${artwork.instagramLink ? `<a href="${artwork.instagramLink}" target="_blank" class="btn btn-secondary"><i class="fab fa-instagram"></i> View on Instagram</a>` : ''}
        <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center;">
          <button class="btn btn-primary like-btn-modal" data-artwork-id="${artwork._id}">
            <i class="fas fa-heart"></i> ${artwork.likes || 0}
          </button>
          <button class="btn btn-primary comment-btn-modal" data-artwork-id="${artwork._id}">
            <i class="fas fa-comment"></i> ${artwork.comments ? artwork.comments.length : 0}
          </button>
        </div>
        ${gallery.artworks.length > 1 ? `
          <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center;">
            <button class="btn btn-secondary" id="prev-artwork">Previous</button>
            <button class="btn btn-secondary" id="next-artwork">Next</button>
          </div>
        ` : ''}
      </div>
    `;

    modal.classList.add('active');

    // Add event listeners
    const likeBtn = modalContent.querySelector('.like-btn-modal');
    if (likeBtn) {
      likeBtn.addEventListener('click', async () => {
        await gallery.toggleLike(artwork._id, likeBtn);
        // Reload artwork data
        const updatedArtworks = await utils.apiRequest(`/artworks`);
        const found = updatedArtworks.find(a => a._id === artwork._id);
        if (found) {
          likeBtn.innerHTML = `<i class="fas fa-heart"></i> ${found.likes || 0}`;
        }
      });
    }

    const commentBtn = modalContent.querySelector('.comment-btn-modal');
    if (commentBtn) {
      commentBtn.addEventListener('click', () => {
        gallery.openCommentModal(artwork._id);
      });
    }

    // Navigation buttons
    const prevBtn = modalContent.querySelector('#prev-artwork');
    const nextBtn = modalContent.querySelector('#next-artwork');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const prevIndex = gallery.currentArtworkIndex > 0 ? gallery.currentArtworkIndex - 1 : gallery.artworks.length - 1;
        gallery.openArtworkModal(gallery.artworks[prevIndex]);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const nextIndex = gallery.currentArtworkIndex < gallery.artworks.length - 1 ? gallery.currentArtworkIndex + 1 : 0;
        gallery.openArtworkModal(gallery.artworks[nextIndex]);
      });
    }
  },

  // Open comment modal
  openCommentModal: async (artworkId) => {
    gallery.currentArtworkId = artworkId;
    const modal = document.getElementById('comment-modal');
    const commentsList = document.getElementById('comments-list');
    
    // Load comments
    try {
      const artworks = await utils.apiRequest('/artworks');
      const artwork = artworks.find(a => a._id === artworkId);
      
      if (artwork && artwork.comments) {
        commentsList.innerHTML = '';
        if (artwork.comments.length === 0) {
          commentsList.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
        } else {
          artwork.comments.forEach((comment) => {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'card';
            commentDiv.style.marginBottom = '1rem';
            commentDiv.innerHTML = `
              <p><strong>${comment.user || 'Anonymous'}</strong></p>
              <p>${comment.text}</p>
              <small style="color: var(--text-muted);">${comment.createdAt ? utils.formatDate(comment.createdAt) : ''}</small>
            `;
            commentsList.appendChild(commentDiv);
          });
        }
      }
    } catch (error) {
      console.error('Error loading comments:', error);
      commentsList.innerHTML = '<p>Error loading comments.</p>';
    }

    modal.classList.add('active');
  },

  // Setup modals
  setupModals: () => {
    // Close artwork modal
    const artworkModal = document.getElementById('artwork-modal');
    const artworkModalClose = document.getElementById('modal-close');
    if (artworkModalClose) {
      artworkModalClose.addEventListener('click', () => {
        artworkModal.classList.remove('active');
      });
    }
    if (artworkModal) {
      artworkModal.addEventListener('click', (e) => {
        if (e.target === artworkModal) {
          artworkModal.classList.remove('active');
        }
      });
    }

    // Close comment modal
    const commentModal = document.getElementById('comment-modal');
    const commentModalClose = document.getElementById('comment-modal-close');
    if (commentModalClose) {
      commentModalClose.addEventListener('click', () => {
        commentModal.classList.remove('active');
      });
    }
    if (commentModal) {
      commentModal.addEventListener('click', (e) => {
        if (e.target === commentModal) {
          commentModal.classList.remove('active');
        }
      });
    }

    // Comment form
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
      commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!utils.isAuthenticated()) {
          utils.showError('Please login to comment');
          window.location.href = 'login.html';
          return;
        }

        const text = document.getElementById('comment-text').value;
        if (!text.trim()) {
          utils.showError('Please enter a comment');
          return;
        }

        // Get user info
        const user = auth.getCurrentUser();
        const userName = user ? (user.email || 'Anonymous') : 'Anonymous';

        try {
          await utils.apiRequest(`/artworks/${gallery.currentArtworkId}/comment`, {
            method: 'POST',
            body: JSON.stringify({ text, user: userName }),
          });

          utils.showSuccess('Comment posted successfully!');
          document.getElementById('comment-text').value = '';
          await gallery.openCommentModal(gallery.currentArtworkId);
          await gallery.loadArtworks();
        } catch (error) {
          utils.showError(error.message || 'Failed to post comment');
        }
      });
    }
  },
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('gallery.html')) {
    gallery.init();
  }
});

