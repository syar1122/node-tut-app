const express = require('express');


const router = express.Router();

const passport = require('passport');
require('../config/passport-jwt-strategy');

const checkAuth = require('../middleware/check-auth');
const fileExt = require('../middleware/file-extract');
const postCtrl = require('../controllers/post');


router.post("",passport.authenticate('jwt',{session:false}) ,fileExt, postCtrl.creatPost);

router.get('' ,postCtrl.fetchPosts);

router.get('/:id' ,postCtrl.fetchPost);

router.put('/:id' , passport.authenticate('jwt',{session:false}), fileExt, postCtrl.updatePost);

router.delete('/:id', passport.authenticate('jwt',{session:false}), postCtrl.deletePost);

module.exports = router;
