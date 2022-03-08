const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

// passport.serializeUser((user, done) => {
//   console.log("passport serialize")
//   done(null, user._id);
// });

// passport.deserializeUser((id, done) => {
//   console.log("passport deSerialize " + id)
//   User.findById(id).then((err,user) => {
//     console.log(user)
//     done(err, user);
//   });

//   });


passport.use(new GoogleStrategy({
    clientID: '426538703156-oji1cgj1jfhtdsgsk79f4svfj9i3jb0p.apps.googleusercontent.com',
    clientSecret: 'wyP8R4ambSWFFJZKw2vSolC1',
    callbackURL: "http://localhost:3000/api/user/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {

    try {
      console.log(profile)
    currentUser = await User.findOne({'google.email': profile.emails[0].value});

    if(!currentUser){
      const newUser = new User({'provider':profile.provider,'google':{username:profile.displsyname,fname:profile.name.givenName,lname:profile.name.familyName,email:profile.emails[0].value,profilePicture:profile.photos[0].value}});
      user = await newUser.save();
      if(user){
        console.log('google user created');
        done(null, newUser);
      }

    }

      console.log('google user exist');

      done(null, currentUser);
    } catch (err) {
      done(err,false);
    }




  }
));
