const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();
mongoose.connect("mongodb+srv://Syar:"+ process.env.MONGO_DB_PASS +"@cluster0.u9k2w.mongodb.net/dbTest?retryWrites=true&w=majority",{ useUnifiedTopology: true,
useNewUrlParser: true}).then(() => {
  console.log('connection success');
}).catch(() => {
  console.log("failed to connect");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use("/images", express.static(path.join('backend/images')));

app.use((req,res,next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers","Origin , X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
});

app.use("/api/posts",postRoutes);
app.use("/api/user",userRoutes);



//mongo db database user
// User:Syar
//Pass: H88Y8Q5KN3PAgVW





module.exports = app;
