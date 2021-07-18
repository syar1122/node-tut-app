const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {

    done(null, id);
  });


passport.use(new GoogleStrategy({
    clientID: '426538703156-oji1cgj1jfhtdsgsk79f4svfj9i3jb0p.apps.googleusercontent.com',
    clientSecret: 'wyP8R4ambSWFFJZKw2vSolC1',
    callbackURL: "http://localhost:3000/api/user/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {

    console.log(profile);

      return cb(null, profile);

  }
));
