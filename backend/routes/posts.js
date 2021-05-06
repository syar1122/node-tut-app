const express = require('express');


const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const fileExt = require('../middleware/file-extract');
const postCtrl = require('../controllers/post');


router.post("",checkAuth ,fileExt, postCtrl.creatPost);

router.get('' ,postCtrl.fetchPosts);

router.get('/:id' ,postCtrl.fetchPost);

router.put('/:id' , checkAuth, fileExt, postCtrl.updatePost);

router.delete('/:id', checkAuth, postCtrl.deletePost);

module.exports = router;
