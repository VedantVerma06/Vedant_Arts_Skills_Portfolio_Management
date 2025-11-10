// config.js - API Configuration and Utility Functions
const API_BASE_URL = 'http://localhost:5000/api';

// Utility functions
const utils = {
  // Get JWT token from localStorage
  getToken: () => {
    return localStorage.getItem('jwt_token');
  },

  // Get user role from token
  getUserRole: () => {
    const token = utils.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    } catch (e) {
      return null;
    }
  },

  // Check if user is admin
  isAdmin: () => {
    return utils.getUserRole() === 'admin';
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!utils.getToken();
  },

  // Make API request with auth header
  apiRequest: async (url, options = {}) => {
    const token = utils.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || `API request failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      
      // Provide helpful error messages
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        const helpfulMessage = `
          ❌ Cannot connect to backend server!
          
          Possible causes:
          1. Backend server is not running on http://localhost:5000
          2. Backend server crashed or encountered an error
          3. CORS configuration issue
          4. Frontend opened via file:// protocol (use http://localhost)
          
          Solutions:
          - Make sure backend server is running: cd backend && npm start
          - Check backend server logs for errors
          - Open frontend via http://localhost:8000 (not file://)
          - Check browser console for CORS errors
        `;
        console.error(helpfulMessage);
        throw new Error('Cannot connect to backend server. Please ensure the server is running on http://localhost:5000');
      }
      
      throw error;
    }
  },

  // Make API request with FormData (for file uploads)
  apiRequestFormData: async (url, formData, method = 'POST') => {
    const token = utils.getToken();
    const headers = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method,
        headers,
        body: formData,
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || `API request failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      
      // Provide helpful error messages
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        throw new Error('Cannot connect to backend server. Please ensure the server is running on http://localhost:5000');
      }
      
      throw error;
    }
  },

  // Test backend connection
  testConnection: async () => {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`, {
        method: 'GET',
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  // Show loading spinner
  showLoader: (element) => {
    if (element) {
      element.innerHTML = '<div class="loader"></div>';
    }
  },

  // Show error message
  showError: (message) => {
    alert(`❌ Error: ${message}`);
  },

  // Show success message
  showSuccess: (message) => {
    alert(`✅ ${message}`);
  },

  // Format date
  formatDate: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  // Redirect to page
  redirect: (url) => {
    window.location.href = url;
  },

  // Get theme from localStorage
  getTheme: () => {
    return localStorage.getItem('theme') || 'light';
  },

  // Set theme
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  },

  // Toggle theme
  toggleTheme: () => {
    const currentTheme = utils.getTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    utils.setTheme(newTheme);
    return newTheme;
  },
};

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
  const theme = utils.getTheme();
  utils.setTheme(theme);
});

