const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    let user = await User.findOne({ email: profile.emails[0].value });
    if (!user) {
      user = new User({
        username: profile.displayName,
        email: profile.emails[0].value,
        passwordHash: "oauth_google",
      });
      await user.save();
    }
    return done(null, user);
  }
));

passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/google/callback",
    profileFields: ["id", "emails", "name"],
  },
  async (accessToken, refreshToken, profile, done) => {
    let user = await User.findOne({ email: profile.emails[0].value });
    if (!user) {
      user = new User({
        username: profile.name.givenName,
        email: profile.emails[0].value,
        passwordHash: "oauth_facebook",
      });
      await user.save();
    }
    return done(null, user);
  }
));

module.exports = passport;