const mongoose = require('mongoose');
const uniqValidator = require('mongoose-unique-validator');

const userSch = mongoose.Schema({
  username:{
      type:String
  },
  email:{
      type:String,
      required:true,
      max:50,
  },
  password:{
      type:String,
      required:true

  },
  profilePicture:{
      type:String,
      default:'',
  },
  followers:{
      type:Array,
      default:[],
  },
  isAdmin:{
      type:Boolean,
      default:false,
  },
  provider:{
    type:String,
    default:'local'
  }
},
{timestamps:true});

userSch.plugin(uniqValidator);

module.exports =  mongoose.model('User',userSch);
