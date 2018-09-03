
const jwt = require('jsonwebtoken')
  , constants = require('../config/constants');

module.exports.createJWTToken = function (obj) {
    return new Promise((resolve,reject)=>{
      // create a JWT token
      jwt.sign(obj, constants.jwt.secret, global.constants.jwt.options, function (err, token) {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      });
    });
  };