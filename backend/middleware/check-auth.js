const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
  try{
    console.log(req.headers.authorization)
  const token = req.headers.authorization.split(' ')[1];
  if(token){
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userData = {email:decodedToken.email ,userId:decodedToken.id};
    next();
  }}
  catch(err){
    res.status(401).json({message:"not authenticated !!!"});
  }


};
