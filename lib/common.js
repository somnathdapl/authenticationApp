
const jwt = require('jsonwebtoken')
  , constants = require('../config/constants');

module.exports.createJWTToken = function (obj) {
  return new Promise((resolve,reject)=>{
    // create a JWT token
    jwt.sign(obj, constants.jwt.secret, constants.jwt.options, function (err, token) {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

module.exports.verifyJWTToken = (JWTToken) => {
  return new Promise((resolve,reject) => {
    jwt.verify(JWTToken, constants.jwt.secret, constants.jwt.options, function (err, decoded) {
      if(err) reject(err);
      resolve(decoded);
    });
  });
};