var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	total: Number,
    name : String,
    address: String,
    cardholdername: String,
    creditcardnumber: String,
    month: String,
    year: String,
    cvc :String
});

module.exports = mongoose.model('Customer', schema);