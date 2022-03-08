const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
require('dotenv').config();

exports.singup = async (req, res, next) => {
  let salt = await bcrypt.genSalt(10);
  if (salt) {
    let hash = await bcrypt.hash(req.body.password, 10);

    if (hash) {
      const user = new User({
        provider: 'local',
        local: {
          email: req.body.email,
          password: hash
        }
      });
      user.save((err, result) => {
        if (result) {
          console.log("db result saved", result)
          res.status(200).json({
            msg: "user saved"
          });
        }
        if (err) {
          res.status(500).json({
            message: "user already exist !!" + err,
            err: err.error
          });
        }
      });
    }
  }
}

exports.login = (req, res, next) => {
  let user = {};
  console.log(req.body)
  User.findOne({
      'local.email': req.body.email
    }
  ).then(resuser => {
  if (!resuser) {
    return res.status(401).json({
      message: "email auth failed !!!"
    });
  }
  user = resuser;
  console.log(user);
  return bcrypt.compare(req.body.password, user.local.password);
}).then(result => {
  console.log(result)
  if (!result) {
    return res.status(401).json({
      message: "pass auth failed!!"
    });
  }
  const _id = user._id;
  const expiresIn = '1w';
  console.log(process.env.JWT_SECRET, "jwt secret")
  const token = "Bearer " + jwt.sign({
    sub: _id,
    iat: Date.now()
  }, process.env.JWT_SECRET, {
    expiresIn: expiresIn,
    algorithm: 'HS256'
  });
  res.status(200).json({
    success: true,
    user: user,
    token: token,
    expiresIn: expiresIn
  })
}).catch(err => {
  console.log(err)
  return res.status(401).json({
    message: "Invalid email or password",
    err
  });
});
}

// exports.googleLogin = (req, res) => {
//   console.log("google auth route ");

//   try {
//     console.log(req.user);
//     const user = req.user;
//     if(!user) res.status(401).json({message: "unauthorized user"});
//     const _id = user._id;
//   const expiresIn = '1d';
//   console.log(process.env.JWT_SECRET, "jwt secret")
//   const token = "Bearer " + jwt.sign({
//     sub: _id,
//     iat: Date.now()
//   }, process.env.JWT_SECRET, {
//     expiresIn: expiresIn,
//     algorithm: 'HS256'
//   });

//   res.status(200).json({
//     success: true,
//     user: user,
//     token: token,
//     expiresIn: '1d'
//   })



//   } catch (error) {
//     console.log(error)
//     res.status(501).json({message: "enternal server error"});
//   }



// }



