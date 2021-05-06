const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.singup = (req, res , next) => {
  console.log(req.body);
  bcrypt.genSalt(10).then(salt => {
    bcrypt.hash(req.body.password, 10).then((hash) => {
      const user = new User({
        email:req.body.email,
        password: hash
      });
      user.save().then(result => {
        res.status(200).json({
          message: "user created",
          result:result
        });
      }).catch(err => {

        res.status(500).json({
          message: "user already exist !!",
          err: err.error
        });
      });
    });
  });
}

exports.login = (req,res,next) => {
  let user={};
  User.findOne({email: req.body.email}).then(resuser => {
    if(!resuser){
      return res.status(401).json({message: "auth failed !!!"});
    }
    user = resuser;
    return bcrypt.compare(req.body.password,resuser.password);
  }).then(result => {
    if(!result){
      return res.status(401).json({message:"auth failed!!"});
    }
    console.log(result);
    const token = jwt.sign({email:user.email,id:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'1h'});
    res.status(200).json({message:"auth success",
    token:token, expiresIn: 3600,userId:user._id});
  }).catch(err => {
    return res.status(401).json({message:"Invalid email or password"});
  });
}
