const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

//Models
const UserModel = require('../models/User');
const { route } = require('./director.routes');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a User');
});

router.post('/register',(req,res,next)=>{
  const {username, password} = req.body;
  // const newUser = new UserModel(req.body);
  bcrypt.hash(password, 10).then(function(hash) {
    // Store hash in your password DB.
    const newUser = new UserModel({username, password: hash});
    newUser.save()
     .then((data)=>{res.json(data)})
     .catch((err)=>{res.json(err)})
});
  
});

router.post('/authenticate',(req,res)=>{
  const { username, password } = req.body;
  UserModel.findOne({username})
              .then((resultUser)=>{
                if (!resultUser) {res.end("The user was not found.")}
                else{
                  bcrypt.compare(password, resultUser.password).then(function(result) {
                    // result == true
                    if (!result) {
                      res.json("Authentication failed, wrong password.")
                    }
                    else{
                      const payload = {username};
                      var token = jwt.sign(payload , req.app.get('api_secret_key'), { expiresIn: 7200 /*it means when token expires as second, 7200 second equals one hour */});
                      res.json({status: true, token})
                    }
                });
                }
                
              })
              .catch((err)=>{res.json(err)})
})

module.exports = router;