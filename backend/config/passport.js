// config/passport.js
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        // if email exists (registered via email) link account instead of duplicate
        const existingByEmail = await User.findOne({ email: profile.emails?.[0]?.value });
        if (existingByEmail) {
          existingByEmail.googleId = profile.id;
          existingByEmail.profileImage = profile.photos?.[0]?.value || existingByEmail.profileImage;
          user = await existingByEmail.save();
        } else {
          user = await User.create({
            googleId: profile.id,
            username: profile.displayName || 'Google User',
            email: profile.emails?.[0]?.value,
            profileImage: profile.photos?.[0]?.value,
            role: 'user'
          });
        }
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }));
};
