const mongoose = require('mongoose');

const postSch = mongoose.Schema({
  title:{type:String , required:true},
  content : {type:String , required:true},
  imagePath : {type:String, required:false},
  creator : {type: mongoose.Types.ObjectId, ref:"User", require:true}
});

module.exports =  mongoose.model('Post',postSch);

