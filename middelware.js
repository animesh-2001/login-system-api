const jwt = require("jsonwebtoken");
require("dotenv").config();

function auth(req,res,next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if(token == null) return res.sendStatus('401');
  jwt.verify(token,process.env.SECRET_TOKEN,(err,user) => {
      if(err) { return res.sendStatus('403')}
      else {
          req.user = user;
          next();
      }      
  })
}

module.exports = auth;