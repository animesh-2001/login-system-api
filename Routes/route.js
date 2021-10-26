const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const privateKey = process.env.SECRET_TOKEN;
const Db = process.env.MONGODB;
const auth = require("../middelware");
const mongoose = require("mongoose");
const { response } = require("express");

mongoose.connect(Db,{useNewUrlParser:true,useUnifiedTopology:true}).then(() => {
    console.log("connection successfull")
}).catch(err => {
    console.log(err)
})

const mysmodel = new mongoose.Schema({
    name:String,
    email:String,
    password:String
})
const model = new mongoose.model("user",mysmodel);

router.post("/register", async (req,res) => {
    try{
    const name =req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const user = {
        name,
        email,
        password
    }
    const token = jwt.sign(user,privateKey);
    const data = new model(user);
    const result = await data.save();
    res.status("200").send({result,token});
    }
    catch(err) {
        res.status("404").send(err);
    }
})

router.post("/login",async (req,res) => {
    try{
    const useremail = req.body.email;
    const userpassword = req.body.password;
    const result = await model.findOne({email:useremail})
    if(result) {
        if(result.password === userpassword) {
            req.session.user=result;
            console.log(req.session.user);
            const user = {
                name:result.name,
                email:result.email,
                password:result.password
            }
            const token = jwt.sign(user,privateKey);
            res.status('200').send({result,token});
        }
        else {
            res.json({mess:"incorrect password"});
        }
    }
    else{
        res.json({mess:"incorrect username"});
    }
    }
    catch(err) {
        res.status("404").send(err);
    }
    
})

router.get("/login",(req,res) => {
    try{
    if(req.session.user) {
        res.send({logedIn:true,user:req.session.user});
    }
    else{
        res.send({logedIn:false});
    }
}
catch(err) {
    res.status("404").send(err);
}
})


router.get("/posts",auth,async (req,res) => {
  try{ 
    const result = await model.find();
    res.status('200').send(result);
  }
  catch(err) {
    res.status("404").send(err);
  }
})



module.exports = router;