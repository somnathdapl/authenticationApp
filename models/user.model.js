const Schema = global.mongoose.Schema
  , ObjectId = Schema.ObjectId
  , constants = require('../config/constants');

let UserSchema = new Schema({
  uid:{type:String, index:true},
  name:{type:String},
  password:{type:String},
}, {
  versionKey: false,
  timestamps: false
});

UserSchema.pre('find', function (next) {
  console.log("user pre hook find");
  next();
});

UserSchema.pre('findOne', (next) => {
  console.log("user pre hook findOne");
  next();
});

UserSchema.pre('save', function (next) {
  this.wasNew = this.isNew;

  next();
});

UserSchema.methods.getResponseData = function (callback) {
  return new Promise((resolve,reject)=>{
    let userData = {
      _id: this.id,
      uid: this.uid,
      name: this.name,
    };

    resolve(userData);
  })
};

const User = global.mongoose.model(constants.schemaName.USER, UserSchema);

module.exports = User;