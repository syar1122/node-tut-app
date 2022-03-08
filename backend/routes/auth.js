const express = require('express');

const router = express.Router();
const userCtrl = require('../controllers/user');
const authCtrl = require('../controllers/auth');
const passport = require('passport');
const checkAuth = require('../middleware/check-auth');

require('../config/passport-google-strategy');
require('../config/passport-jwt-strategy');

router.post("/signup" , authCtrl.singup);


router.post('/login' , authCtrl.login);

// router.get('/google',
//   passport.authenticate('google', { scope: ['profile','email']}));


// router.get('/google/callback',
//   passport.authenticate('google', { failureRedirect: 'http://localhost:4200/login',successRedirect:"http://localhost:4200",session:false}),
//   (req,res) => {

//   });

// router.get('/auth',userCtrl.googleLogin);


module.exports = router;
