let mongoose = require('mongoose')
  , constant = require('../config/constants');
mongoose.set('debug', process.env.NODE_ENV == "development");

mongoose.set('useCreateIndex', true);
mongoose.connect(constant.db.connectionUri, { useNewUrlParser: true });

mongoose.Promise = require('bluebird');

let db = mongoose.connection;

db.on('error', function (err) {
  console.log('Connection Error : ', err);
  process.exit(0);
});

db.once('open', function () {
  console.log('Mongodb Connection ok!');
});

db.on('disconnected', function () {
  console.log('Connection disconnected ok!');
});

process.on('SIGINT', function () {
  console.log('PROCESS PID ' + process.pid + ' Force to close the MongoDB conection');
  mongoose.connection.close(function () {
    process.exit(0);
  });
});

process.on('SIGTERM', function (next) {
  console.log('PROCESS PID ' + process.pid + ' Force to close the MongoDB conection');
  mongoose.connection.close(function () {
    process.exit(0);
  });
});

module.exports = mongoose;
