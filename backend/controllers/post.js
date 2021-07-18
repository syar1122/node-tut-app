const Post = require('../models/post');

exports.creatPost = (req, res) => {
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title:req.body.title,
    content:req.body.content,
    imagePath:url + "/images/" + req.file.filename,
    creator: req.user._id
  });

  console.log("Post userData",req.userData);

  post.save().then(result => {
    res.status(201).json({
      postId:result._id,
      ...result
    });
  }).catch(err => {
    res.status(500).json({message: "Creating failed !!!"})
  });
}

exports.fetchPosts = (req, res) => {
  const pageSize = +req.query.pageSize;
  const page = +req.query.page;
  let postQ = Post.find();
  let posts;
  if(pageSize && page){
    postQ.skip(pageSize * (page - 1)).limit(pageSize);
  }

  postQ.then((doc) => {
    posts = doc;
    return Post.count();
  }).then((count) => {
    res.status(201).json({
      posts:posts,
      postsCount:count
    });
  }).catch(err => {
    res.status(500).json({message: "Fetching failed !!!"})
  });;
}

exports.fetchPost = (req,res) => {
  Post.findById(req.params.id).then(post => {
    if(post){
      res.status(200).json(post);
    }else{
      res.status(404).json({message: 'post not found!'});
    }
  }).catch(err => {
    res.status(500).json({message: "Fetching failed !!!"})
  });;
}


exports.updatePost = (req,res) => {
  console.log(req.params.id)
  let imagePath = req.body.image;
  if(req.file){
    const url = req.protocol + '://' + req.get("host");
    imagePath=url + "/images/" + req.file.filename;
  }

  console.log("imagePath",imagePath);
  const post =new  Post({
    _id:req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath:imagePath,
    creator: req.user._id
  });
  console.log("updatedpost", post);
  Post.updateOne({_id: req.params.id, creator:req.user._id}, post).then((result) => {
    console.log(result);
    if(result.n > 0){
      res.status(200).json(result);
    }else{
      res.status(401).json({message: "Not Authorized"});
    }

  }).catch(err => {
    res.status(500).json({message: "Updating failed !!!"})
  });
}

exports.deletePost = (req, res) => {
  console.log(req.userData);
  console.log("express js delete", req.params.id);
    Post.deleteOne({_id: req.params.id, creator:req.user._id}).then((result) => {
      if(result.n > 0){
        res.status(200).json({message: "deleted"});
      }else{
        res.status(401).json({message: "Not Authorized"});
      }
    }).catch(err => {
      res.status(500).json({message: "Deleting failed !!!"});
    });;

}
