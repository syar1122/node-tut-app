const mongoose = require('mongoose');
const uniqValidator = require('mongoose-unique-validator');

const userSch = mongoose.Schema({
  email:{type:String , required:true, unique:true},
  password : {type:String , required:true},

});

userSch.plugin(uniqValidator);

module.exports =  mongoose.model('User',userSch);
