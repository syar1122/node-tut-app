const express = require('express');
const session = require('cookie-session');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');



const postRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const passport = require('passport');
dotenv.config();

const app = express();
mongoose.connect("mongodb+srv://Syar:"+ "H88Y8Q5KN3PAgVW" +"@cluster0.u9k2w.mongodb.net/dbTest?retryWrites=true&w=majority",{ useUnifiedTopology: true,
useNewUrlParser: true}).then(() => {
  console.log('connection success');
}).catch(() => {
  console.log("failed to connect");
});

app.use(cors());
app.use(session({ secret: "cats" }));

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use("/images", express.static(path.join('backend/images')));

app.use(morgan('dev'));

app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers","Origin , X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
});

app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);
app.use("/api/posts",postRoutes);





//mongo db database user
// User:Syar
//Pass: H88Y8Q5KN3PAgVW





module.exports = app;
