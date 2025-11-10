// auth.js - Authentication Handling
const auth = {
  // Initialize auth check on page load
  init: () => {
    // Check if user is authenticated
    const token = utils.getToken();
    if (token) {
      // User is logged in, hide login page if exists
      const loginPage = document.querySelector('.login-container');
      if (loginPage && window.location.pathname !== '/login.html') {
        // Already authenticated, redirect based on role
        auth.redirectBasedOnRole();
      }
    } else {
      // Not authenticated, check if we're on a protected page
      if (auth.isProtectedPage() && window.location.pathname !== '/login.html') {
        window.location.href = 'login.html';
      }
    }
  },

  // Check if current page requires authentication
  isProtectedPage: () => {
    const protectedPages = ['orders.html', 'admin-dashboard.html'];
    const currentPage = window.location.pathname.split('/').pop();
    return protectedPages.includes(currentPage);
  },

  // Redirect based on user role
  redirectBasedOnRole: () => {
    const role = utils.getUserRole();
    if (role === 'admin') {
      if (window.location.pathname !== '/admin-dashboard.html') {
        window.location.href = 'admin-dashboard.html';
      }
    } else {
      // Regular user, allow access to user pages
      return;
    }
  },

  // Admin login
  adminLogin: async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.success && data.token) {
        localStorage.setItem('jwt_token', data.token);
        localStorage.setItem('user_role', 'admin');
        utils.showSuccess('Admin login successful!');
        window.location.href = 'admin-dashboard.html';
      } else if (data.token) {
        // Handle legacy response format
        localStorage.setItem('jwt_token', data.token);
        localStorage.setItem('user_role', 'admin');
        utils.showSuccess('Admin login successful!');
        window.location.href = 'admin-dashboard.html';
      } else {
        throw new Error(data.message || 'Login failed: No token received');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      utils.showError(error.message || 'Login failed. Please check your credentials and ensure the server is running.');
    }
  },

  // Google OAuth login
  googleLogin: () => {
    window.location.href = `http://localhost:5000/api/auth/google`;
  },

  // Handle OAuth callback (called from auth-success.html)
  handleOAuthCallback: () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');

    if (error) {
      utils.showError(`Authentication failed: ${error}`);
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 3000);
      return;
    }

    if (token) {
      localStorage.setItem('jwt_token', token);
      // Decode token to get user info
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        localStorage.setItem('user_role', payload.role || 'user');
        
        // Redirect based on role
        if (payload.role === 'admin') {
          window.location.href = 'admin-dashboard.html';
        } else {
          window.location.href = 'index.html';
        }
      } catch (e) {
        console.error('Error decoding token:', e);
        utils.showError('Error processing authentication token');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 3000);
      }
    } else {
      utils.showError('Authentication failed: No token received');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 3000);
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_role');
    window.location.href = 'login.html';
  },

  // Get current user info from token
  getCurrentUser: () => {
    const token = utils.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.id,
        role: payload.role,
        email: payload.email,
      };
    } catch (e) {
      return null;
    }
  },
};

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
  auth.init();

  // Handle admin login form
  const adminLoginForm = document.getElementById('admin-login-form');
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('admin-email').value;
      const password = document.getElementById('admin-password').value;
      await auth.adminLogin(email, password);
    });
  }

  // Handle Google login button
  const googleLoginBtn = document.getElementById('google-login-btn');
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', () => {
      auth.googleLogin();
    });
  }

  // Handle logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      auth.logout();
    });
  }

  // Handle OAuth callback if on auth-success page
  if (window.location.pathname.includes('auth-success')) {
    auth.handleOAuthCallback();
  }
});

