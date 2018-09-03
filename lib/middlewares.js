// const jwt = require('jsonwebtoken')
//   , ms = require('ms')
//   , Q = require('q')
//   , shortid = require('shortid')
//   , crypto = require('crypto')
//   , fs = require('fs')
//   , mkdirp = require('mkdirp')
//   , _ = require('lodash')
//   , nodemailer = require('nodemailer')
//   , path = require('path')
//   , moment = require('moment')
//   , omitDeep = require('omit-deep')
//   , uuid = require('uuid')
//   , multer = require('multer')
//   , validator = require('validator')
//   , interceptor = require('express-interceptor')
//   , EmailTemplate = require('email-templates').EmailTemplate
//   , redisClient = require(global.appRoot + '/lib/redisClient');

// //load model
// let AccessToken = require(global.appRoot + '/models/accessToken.model');

// module.exports.jwtAuthProtected = (req, res, next) => {
//   global.commonFunction.customLog("jwtAuthProtected called");
//   // check header or url parameters or post parameters for token
//   var accessToken = req.headers.authorization || req.headers['x-access-token'] ||
//     req.headers['X-Access-Token'] || req.body['access-token'];

//   // decode token
//   if (accessToken) {
//     // verifies secret and checks exp
//     jwt.verify(accessToken, global.constant.jwt.secret, global.constant.jwt.options, function (err, decoded) {
//       if (err) {
//         AccessToken.findOne({accessToken: accessToken})
//           //.populate("item")
//           .then((tokenDoc) => {
//             global.commonFunction.customLog("jwtAuthProtected tokenDoc", tokenDoc);
//             if (tokenDoc == null) {
//               global.isTokenExpire = 1;
//               return res.status(200).json({status: 0, message: 'Invalid access token'});
//             }
//             if (tokenDoc.lastAccess > 0) {
//               global.isTokenExpire = 2;

//               /*tokenDoc.lastAccess = 1;
//                tokenDoc.save();*/

//               return res.status(200).json({status: 0, message: 'Invalid access token.verify'});
//             } else {
//               global.isTokenExpire = 1;
//               tokenDoc.lastAccess = 1;

//               var condition = {};

//               if (tokenDoc.kind == global.constant.schemaName.USER) {
//                 condition = {_id: tokenDoc.item};
//               } else {
//                 condition = {profile: tokenDoc.item};
//               }

//               global.mongoose.model(global.constant.schemaName.USER)
//                 .findOne(condition)
//                 .then((userDoc) => {
//                   global.currentUser = req.currentUser = userDoc;
//                   global.currentType = req.currentType = global.constant.schemaName.USER;
//                   global.commonFunction.customLog("jwtAuthProtected currentUser", userDoc);
//                   next();
//                 })
//                 .catch((err) => {
//                   console.log("jwtAuthProtected err", err);
//                   global.isTokenExpire = 1;
//                   return res.status(200).send({status: 0, message: 'Invalid token provided.'});
//                 });

//               tokenDoc.save()
//                 .then((savedTokenDoc) => {
//                   global.commonFunction.customLog("savedTokenDoc", savedTokenDoc);
//                 })
//                 .catch((err) => {
//                   global.commonFunction.customLog("err", err);
//                 });
//             }
//           })
//           .catch((err) => {
//             console.log("jwtAuthProtected err", err);
//             global.isTokenExpire = 2;
//             return res.status(200).send({status: 0, message: 'No token provided.'});
//           });
//       } else {
//         // if everything is good, save to request for use in other routes
//         /*req.currentUser = decoded;
//          next();*/
//         /*User.findOne({accessToken: accessToken})
//          .then((user) => {
//          if (user) {
//          req.currentUser = decoded;
//          global.currentUser = decoded;
//          next();
//          } else {
//          return res.status(200).json({success: 0, message: 'Invalid access token.User'});
//          }
//          })
//          .catch((err) => {
//          console.log("err", err);
//          return res.status(200).json({success: 0, message: 'Invalid access token.err'});
//          });*/
//         global.isTokenExpire = 0;
//         global.commonFunction.customLog("jwtAuthProtected currentUser", decoded);

//         var condition = {};

//         if (decoded.kind == global.constant.schemaName.USER) {
//           condition = {_id: decoded._id};
//         } else {
//           condition = {profile: decoded._id};
//         }

//         global.mongoose.model(global.constant.schemaName.USER)
//           .findOne(condition)
//           .then((userDoc) => {
//             global.currentUser = req.currentUser = userDoc;
//             global.currentType = req.currentType = global.constant.schemaName.USER;
//             global.currentCustomData = req.currentCustomData = decoded.customData;
//             global.commonFunction.customLog("jwtAuthProtected currentUser", userDoc);
//             next();
//           })
//           .catch((err) => {
//             console.log("jwtAuthProtected err", err);
//             global.isTokenExpire = 2;
//             return res.status(200).send({status: 0, message: 'Invalid token provided.'});
//           });
//       }
//     });
//   } else {
//     // if there is no token
//     // return an error
//     global.isTokenExpire = 2;
//     return res.status(200).send({status: 0, message: 'No token provided.'});
//   }

// };

// module.exports.getOptionalCurrentUserFromToken = (req, res, next) => {
//   var accessToken = req.headers.authorization || req.headers['x-access-token'] || req.body['access-token'];
//   global.commonFunction.customLog("optional accessToken", accessToken);
//   if (accessToken) {
//     jwt.verify(accessToken, global.constant.jwt.secret, (err, decoded) => {
//       /*if (err) {
//        AccessToken.findOne({accessToken: accessToken})
//        .then((tokenDoc) => {
//        console.log("findOne tokenDoc", tokenDoc);
//        if (tokenDoc == null) {
//        global.isTokenExpire = 1;
//        return res.status(200).json({isSuccess: 0, message: 'Invalid access token'});
//        }
//        if (tokenDoc.lastAccess) {
//        global.isTokenExpire = 2;
//        return res.status(200).json({isSuccess: 0, message: 'Invalid access token.verify'});
//        } else {
//        global.isTokenExpire = 1;
//        tokenDoc.lastAccess = 1;
       
//        User.findById(tokenDoc.userId)
//        .then((user) => {
//        req.currentUser = user;
//        //global.currentUser = user;
//        global.optionalUserId = user._id;
//        next();
//        tokenDoc.save();
//        })
//        .catch((err) => {
//        console.log("err", err);
//        });
//        }
//        })
//        .catch((err) => {
//        console.log("jwt err", err);
//        });
//        } else {*/
//       global.isTokenExpire = 0;
//       global.optionalCurrentUser = err ? null : decoded;
//       global.optionalCurrentType = err ? null : decoded.kind;
//       global.commonFunction.customLog("optionalCurrentUser currentUser", decoded);
//       next();
//       /*}*/
//     });
//   } else {
//     global.isTokenExpire = 0;
//     global.optionalCurrentUser = global.optionalCurrentType = null;
//     global.commonFunction.customLog("optionalCurrentUser currentUser", req.optionalCurrentUser);
//     next();
//   }
// };

// module.exports.jsonInterceptor = interceptor((req, res) => {
//   global.commonFunction.customLog("jsonInterceptor");
//   return {
//     // Only HTML responses will be intercepted 
//     isInterceptable: function () {
//       return /application\/json/.test(res.get('Content-Type'));
//     },
//     // Appends a paragraph at the end of the response body 
//     intercept: function (body, send) {
//       //var $document = cheerio.load(body);
//       //$document('body').append('<p>From interceptor!</p>');

//       //send($document.html());
//       //console.log("typeof body", typeof body);
//       //console.log("body", body);
//       //body['isTokenExpaire'] = 1;
//       let ignoreUrls = ['/api/auth/userRegistration', '/api/auth/dealerRegistration', '/api/auth/oneDayUserRegistration',
//         '/api/auth/refreshToken', '/api/auth/login', '/api/auth/uploadFiles', '/api/auth/getDetailsIfAvailableOtherwiseRegister',
//         '/api/misc/privacyPolicy', '/api/misc/statusList', '/api/misc/about'];

//       var findIndex = _.findIndex(ignoreUrls, function (o) {
//         //console.log("o", o);
//         //console.log("global.currentUrl.search(o)", global.currentUrl.search(o));
//         return global.currentUrl.search(o) > -1;
//       });

//       console.log("ignoreUrls findIndex", findIndex);

//       req.session = null;
//       //req.session.destroy;
//       //if (!ignoreUrls.includes(global.currentUrl)) {
//       if (findIndex < 0) {
//         var newBody = JSON.parse(body);
//         newBody.isTokenExpire = global.isTokenExpire;
//         //console.log("typeof body", typeof newBody);
//         //console.log("newBody", newBody);
//         send(JSON.stringify(newBody));
//         global.commonFunction.customLog("currentUrl", global.currentUrl, "response body stringify", JSON.stringify(newBody));
//       } else {
//         send(body);
//         global.commonFunction.customLog("currentUrl", global.currentUrl, "response body", body);
//       }
//     }
//   };
// });

// module.exports.uploadFiles = (fields, destination, mimeType = global.constant.allowMimeType, maxSize = 20000000) => {
//   //console.log(fields, destination, mimeType);
//   return multer({
//     storage: multer.diskStorage({
//       destination: destination, //global.constant.uploads.landingAdPicture,
//       filename: function (req, file, cb) {
//         cb(null, uuid.v4() + path.extname(file.originalname));
//       }
//     }),
//     limits: {
//       //fileSize: maxSize,
//       fieldSize: '10MB',
//     },
//     fileFilter: (req, file, cb) => {
//       if (_.includes(mimeType, file.mimetype) || mimeType.length === 0) {
//         //console.log("fileFilter true file", file);
//         cb(null, true);
//       } else {
//         //console.log("fileFilter false file", file);
//         cb(null, false);
//       }
//       // The function should call `cb` with a boolean 
//       // to indicate if the file should be accepted 

//       // To reject this file pass `false`, like so: 
//       //cb(null, false)

//       // To accept the file pass `true`, like so: 
//       //cb(null, true)

//       // You can always pass an error if something goes wrong: 
//       //cb(new Error('I don\'t have a clue!'))

//     }
//   }).fields(fields);
// };

module.exports.logBodyAndUploadedFile = (req, res, next) => {
  console.log("logBodyAndUploadedFile called");

  try {
    console.log("req.originalUrl", req.originalUrl);

    //console.log("global.currentType", global.currentType);
    //console.log("global.currentUser", global.currentUser);

    console.log('\x1b[95mBody:\x1b[0m');
    console.log(JSON.stringify(req.body, null, '\t').split('\n').forEach(line => console.log('\x1b[97m' + line + '\x1b[0m'))); // needed for multi-line coloring

    console.log('\x1b[95mFiles:\x1b[0m');
    console.log(req.files);

    next();

  } catch (e) {
    console.log("logBodyAndUploadedFile", e);
    next();
  }

};

// module.exports.bodyInterceptor = interceptor((req, res) => {
//   global.commonFunction.customLog("bodyInterceptor");
//   return {
//     // Only HTML responses will be intercepted 
//     isInterceptable: function () {
//       global.commonFunction.customLog("bodyInterceptor isInterceptable");
//       if (!(/application\/json/.test(res.get('Content-Type')))) {
//         let data = {
//           headers: req.headers,
//           url: req.originalUrl,
//           domain: global.baseUrl,
//           body: [],
//           response: [],
//           method: req.method,
//           ip: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress
//         };
//         global.eventEmitter.emit('accessLog', data);
//         return false;
//       } else {
//         return true;
//       }
//     },
//     intercept: function (body, send) {
//       global.commonFunction.customLog("bodyInterceptor intercept");
//       send(body);
//       let data = {
//         headers: req.headers,
//         url: req.originalUrl,
//         domain: global.baseUrl,
//         body: req.body,
//         response: [],
//         method: req.method,
//         ip: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress
//       };
//       if (global.currentUrl.indexOf('/api') >= 0) {
//         data['response'] = JSON.parse(body);
//       }

//       /*global.commonFunction.customLog('bodyInterceptor res on finish', data);
//        var ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress;
//        global.commonFunction.customLog('bodyInterceptor req.ip', req.ip, ip);*/

//       global.eventEmitter.emit('accessLog', data);
//     },
//     afterSend: function (oldBody, newBody) {
//       global.commonFunction.customLog("bodyInterceptor afterSend");
//       //global.commonFunction.customLog('bodyInterceptor afterSend', oldBody, newBody);
//     }
//   };
// });

