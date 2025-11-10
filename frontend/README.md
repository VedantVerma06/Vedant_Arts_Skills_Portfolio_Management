# Vedant Verma - Artistic Portfolio Frontend

This is the frontend application for the Vedant Verma Artistic Portfolio & Commission Management Website.

## Features

- **Home Page**: Slideshow background, logo display, fun facts section
- **About Page**: Artist profile picture and bio
- **Gallery**: Masonry grid layout with like/comment functionality, full-screen modal view
- **Contact & Services**: Contact information and commission pricing table
- **Orders**: Place new orders, view order history, cancel pending orders
- **Admin Dashboard**: Complete admin panel for managing artworks, orders, settings, and more
- **Authentication**: Google OAuth for users, admin login for administrators
- **Theme Support**: Light/Dark mode toggle
- **Responsive Design**: Works on mobile, tablet, and desktop

## Setup Instructions

1. **Ensure Backend is Running**
   - The backend should be running on `http://localhost:5000`
   - Make sure all backend APIs are accessible

2. **Open the Frontend**
   - Simply open `index.html` in a web browser
   - Or use a local server (recommended):
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js (http-server)
     npx http-server -p 8000
     ```

3. **Access the Application**
   - Open `http://localhost:8000` in your browser
   - You'll be redirected to the login page

4. **Login**
   - **Users**: Click "Continue with Google" to login via Google OAuth
   - **Admin**: Enter admin email and password (configured in backend .env file)

## File Structure

```
frontend/
├── assets/
│   ├── css/
│   │   └── style.css          # Main stylesheet with theme support
│   └── js/
│       ├── config.js          # API configuration and utilities
│       ├── auth.js            # Authentication handling
│       ├── main.js            # Home page functionality
│       ├── about.js           # About page functionality
│       ├── gallery.js         # Gallery page functionality
│       ├── orders.js          # Orders page functionality
│       ├── admin.js           # Admin dashboard functionality
│       └── contact.js         # Contact page functionality
├── index.html                 # Home page
├── about.html                 # About page
├── gallery.html               # Gallery page
├── contact.html               # Contact & Services page
├── orders.html                # Orders page (user dashboard)
├── admin-dashboard.html       # Admin dashboard
├── login.html                 # Login page
└── auth-success.html          # OAuth callback handler
```

## API Integration

The frontend connects to the backend API at `http://localhost:5000/api`. All API requests are handled through the `utils.apiRequest()` function in `config.js`.

### Key API Endpoints Used:

- `/api/auth/google` - Google OAuth login
- `/api/admin/login` - Admin login
- `/api/artworks` - Get/create/update/delete artworks
- `/api/artworks/:id/like` - Like artwork
- `/api/artworks/:id/comment` - Comment on artwork
- `/api/orders` - Get/create/update orders
- `/api/orders/my` - Get user's orders
- `/api/about` - Get/update about section
- `/api/funfacts` - Get/add/delete fun facts
- `/api/settings` - Get/update settings

## Authentication

- JWT tokens are stored in `localStorage` as `jwt_token`
- User role is extracted from the JWT token
- Admin users are redirected to the admin dashboard
- Regular users can access the gallery, place orders, etc.

## Theme Support

- Themes are stored in `localStorage` as `theme`
- Toggle theme using the button in the top-right corner
- Supports light and dark themes with CSS variables

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Uses ES6+ features (async/await, arrow functions, etc.)

## Notes

- The frontend uses vanilla JavaScript (no frameworks)
- All API requests include JWT token in Authorization header when authenticated
- File uploads are handled via FormData for artwork and settings
- The order system currently sends JSON (reference images upload may need backend updates)

## Backend Requirements

Ensure your backend:
- Is running on `http://localhost:5000`
- Has CORS enabled for the frontend origin
- Has all required environment variables set
- Has Google OAuth configured
- Has Cloudinary configured for image uploads

## Troubleshooting

1. **CORS Errors**: Make sure backend CORS is configured to allow your frontend origin
2. **Authentication Issues**: Check that JWT tokens are being stored correctly in localStorage
3. **API Errors**: Verify backend is running and endpoints are accessible
4. **Image Upload Issues**: Ensure Cloudinary is configured in backend
5. **Theme Not Persisting**: Check browser localStorage is enabled

## Future Enhancements

The following features are planned for Phase 2:
- Testimonials system
- Blog/Art Journey section
- Live Chat (Socket.io)
- Invoice Download (PDF generation)
- Search/Filter in Gallery
- User Profile Section
- Analytics Dashboard
- SEO Optimization
- PWA Support

