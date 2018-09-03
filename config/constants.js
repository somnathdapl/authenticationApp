module.exports = {
  jwt: {
    secret: "l)NnOxNyX&}7DD_'JdXQOP5.RT%a3-",
    options: {
      algorithm: 'HS512',
      expiresIn: 60 * 60 * 5, //[in seconds] expires in 5 hour
      //expiresIn: '1h' // expires in 1 hour
      //expiresIn: '1y' // expires in 1 year
      //expiresIn: '10 days' // expires in 10 days
      //expiresIn: 1440 // expires in 24 hours
      audience: "authApp",
      issuer: "authApp"
    },
  },
  SESSION_SECRET: 'IMjR4l48D26B8JsPabR410T877m0cj09',
  db: {
    connectionUri: "mongodb+srv://ui5test:Test4ui5usr@cluster0-4mw60.mongodb.net/bk-data?retryWrites=true"
    //connectionUri: "mongodb://Somnath:5umm3r2005@cluster0-4mw60.mongodb.net:27017/bk-data?retryWrites=true&authSource=admin",
  },
  schemaName: {
    USER: "Users",
  },
  string: {
    NULLSTRING: "",
    NULLOBJECT: {},
    NULL: null,
    NULLARRAY: [],
  },
  allowMimeType: ["image/jpeg", "image/png"],
  staticAssetsLocation: global.appRoot + "/public/",
  emailTemplatesDir: global.appRoot + "/emailTemplates/",
};
