var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
  username: String,
  email: String,
  password:  String ,
  created_at: Date,
  updated_at: Date
});
userSchema.pre('save',function(next){
  var currentDate = new Date().toISOString()
  this.updated_at = currentDate;
  if(!this.created_at){
    this.created_at = currentDate;
    next();
  }
})

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = {
  User     : User
}
