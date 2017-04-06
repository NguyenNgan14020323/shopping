var express= require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var path = require('path');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var MongoStore = require('connect-mongo')(session);
// var logout = require('express-passport-logout');
// var cookieParser = require('cookie-parser');
var configDB = require('./models/database');
mongoose.connect(configDB.url);

var port = process.env.PORT||5000;

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(session({
  secret:'secret',
  saveUninitialized:false,
  resave:false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: {maxAge:180*60*1000}
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// app.use(cookieParser);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(__dirname + '/public'));

app.use(function(req,res,next){
	res.locals.login = req.isAuthenticated();
	res.locals.session = req.session;
	next();
})


var index = require('./controllers/index');
var signup = require('./controllers/signup');
var upload = require('./controllers/upload');

app.use('/user',index);
app.use('/signup',signup);
app.use('/upload',upload);

app.listen(port);
console.log('Server running port ' +port);
