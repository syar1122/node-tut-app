const express = require('express');

const router = express.Router();
const userCtrl = require('../controllers/user');
const passport = require('passport');
require('../config/passport-google-strategy');
require('../config/passport-jwt-strategy');

router.post("/signup" , userCtrl.singup);


router.post('/login' , userCtrl.login);

router.get('/google',
  passport.authenticate('google', { scope: ['profile','email']}));

  router.get('/home', passport.authenticate('jwt',{session:false}),(req,res) => {
    res.json(req.user);
    console.log(req.user);
  })

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' ,successRedirect:'http://localhost:4200/'}),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/api/user/home');
    res.status(200).json({message:"login with google succed"})
  });

module.exports = router;
