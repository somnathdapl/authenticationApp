const express = require('express')
  , router = express.Router()
  , commonMethods = require('../lib/common');

let UserModel = require('../models/user.model');

  router.post('/login',
  global.middlewares.logBodyAndUploadedFile,
  (req, res, next) => {

    UserModel.findOne({uid:req.body.uid,password:req.body.password})
      .then((userDoc) => {

      console.log("login findOne userDoc", userDoc);
      if(userDoc){
        commonMethods.createJWTToken({_id:userDoc._id})
         .then((JWTToken) => {
          return res.status(200).json({
            status: 1,
            message: "Accepted your credentials",
            data :{
              name:userDoc.name,
              accessToken: JWTToken,
            }
          });
        })
        .catch((err) => {
          res.status(200).json({
            status: 0,
            message: "Some error has occoured. Please try after sometime",
            data: global.constant.string.NULL,
          });
        });
      }else{
        return res.status(200).json({
          status: 0,
          message: "Invalid uid or password",
          data: global.constant.string.NULL,
        });
      }      
  })
  .catch((err) => {
    res.status(200).json({
      status: 0,
      message: "Some error has occoured. Please try after sometime",
      data: global.constant.string.NULL,
    });
  });
});

//exports this module
module.exports = router;