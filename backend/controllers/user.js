exports.findUser = async (req,res,next) => {
  try {
    let user;
    console.log("User  userData",req.user);
    const userId = req.user._id;
    if(userId){
        user = await User.findById(userId).catch(err => {
        res.status(404).json({message : "user not found"});
        next(err)
      })
    }
    if(user){

      res.status(200).json({user:user});
    }

  } catch (error) {
    res.status(501).json({message : "internal server error" + error});
    next(error)
  }
}
