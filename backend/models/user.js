const mongoose = require('mongoose');
const uniqValidator = require('mongoose-unique-validator');

const googleSch = mongoose.Schema({
  username:{
      type:String
  },
  fname: {
    type:String
  },
  lname: {
    type:String
  },
  email:{
      type:String,
      required:true,
      max:50,
  },
  profilePicture:{
      type:String,
      default:'',
  }});





const userSch = mongoose.Schema({
  local: {
    username:{
        type:String
    },
    fname: {
      type:String
    },
    lname: {
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
    }},

  google: googleSch,
  followers:{
      type:Array,
      default:[],
  },
  following: {
    type:Array,
    default:[],
},
  isAdmin:{
      type:Boolean,
      default:false,
  },
  provider:{
    type:String,
    enum:['local','google'],
    default:'local'
  },
  bio:{
    type:String,
},
  dob:{
    type:Date,
    default:null
  }
,
gender:{type:Boolean},
},
{timestamps:true});

userSch.plugin(uniqValidator);

module.exports =  mongoose.model('User',userSch);
