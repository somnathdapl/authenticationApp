const express = require('express')
  , router = express.Router()
  , commonMethods = require('../lib/common')
  , { check, validationResult } = require('express-validator/check');

let UserModel = require('../models/user.model');

router.post('/login',
  global.middlewares.logBodyAndUploadedFile,
  [
    check('uid').exists().withMessage("uid field is required"),
    check('password').exists().withMessage("password field is required"),
  ],
  (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      var dataErr = [];
      errors.array().map((field)=> {
        console.log(field);
        dataErr.push({
          field: field.param,
          message: field.msg,
        });
      });

      return res.status(200).json({
        status: 0,
        message: "VALIDATION_ERROR",
        data: dataErr,
      });
    }

    UserModel.findOne({uid:req.body.uid, password:req.body.password})
      .then((userDoc) => {

      console.log("login findOne userDoc", userDoc);
      if(userDoc){
        commonMethods.createJWTToken({_id:userDoc._id})
         .then((JWTToken) => {
          return res.status(200).json({
            status: 1,
            message: "Authorized",
            data :{
              name:userDoc.name,
              accessToken: JWTToken,
            }
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(200).json({
            status: 0,
            message: "Some error has occoured. Please try after sometime",
            data: null,
          });
        });
      }else{
        return res.status(200).json({
          status: 0,
          message: "Invalid uid or password",
          data: null,
        });
      }      
      })
      .catch((err) => {
        console.log(err);
        res.status(200).json({
          status: 0,
          message: "Some error has occoured. Please try after sometime",
          data: null,
        });
      });
});

router.post('/verifyToken',
  global.middlewares.logBodyAndUploadedFile,
  [
      check('token').exists().withMessage("Token field is required")
  ],
  (req,res,next)=> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      var dataErr = [];
      errors.array().map((field)=> {
        console.log(field);
        dataErr.push({
          field: field.param,
          message: field.msg,
        });
      });

      return res.status(200).json({
        status: 0,
        message: "VALIDATION_ERROR",
        data: dataErr,
      });
    }

    commonMethods.verifyJWTToken(req.body.token)
    .then((decodedResult)=>{
      res.status(200).json({
        status: 1,
        message: "Token is valid",
      });
    })
    .catch((err)=>{
      res.status(200).json({
        status: 0,
        message: "Invalid token or token has been expired",
      });
    });
});

//exports this module
module.exports = router;