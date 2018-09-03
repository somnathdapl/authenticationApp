const auth = require(global.appRoot + '/routes/auth')


module.exports = function (app) {
  console.log('Initializing the routes. ooh, YEAH!!!');

  app.use('/auth', auth);

};
