var express = require('express');
var app = express();
var router = express.Router();
var models = require('../models/user');
var session = require('express-session');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var Product = require('../models/product');
var Cart = require('../models/cart');
var Customer = require('../models/customer');

passport.use(new LocalStrategy(
  function(username, password, done) {
    models.User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false);
      }
      if (user.password != password) {
        return done(null, false);
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  models.User.findById(id, function(err, user) {
    done(err, user);
  });
});

router.route('/home').get(function(req,res,next){
      Product.find(function(err, docs){

        var productChunks = [];
        var chunkSize = 3;

        for (var i = 0; i < docs.length; i += chunkSize){
            productChunks.push(docs.slice(i, i + chunkSize));
        }

          res.render('home',{ title: 'Shopping Cart', products: productChunks });
    });
});


router.route('/login')
.get(function(req,res){
	res.render('login');
})
.post(passport.authenticate('local', { successRedirect: '/user/home',
                                   failureRedirect: '/user/login',
                                   failureFlash: true }))

router.get('/add-to-cart/:id',function(req,res,next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(productId,function(err,product){
    if(err){
      return res.redirect('/user/home');
    }
    cart.add(product,product.id);
    req.session.cart = cart;
    console.log(req.session.cart)
    res.redirect('/user/home');
  });
});

router.get('/shopping-cart',function(req,res,next){
  if(!req.session.cart){
    return res.render('shopping-cart',{products:null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shopping-cart',{products:cart.generateArray(),totalPrice:cart.totalPrice})
});

router.get('/checkout',function(req,res,next){
  if(!req.session.cart){
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  res.render('checkout',{total: cart.totalPrice})
});
router.post('/checkout',function(req,res,next){
  var customer = new Customer({
      name : req.body.name,
    address: req.body.address,
    cardholdername: req.body.cardname,
    creditcardnumber: req.body.cardnumber,
    month: req.body.month,
    year: req.body.year,
    cvc :req.body.cardcvc
  });
  customer.save(function(error){
    if(error){
      console.log(error);
    }else{
      res.redirect('/user/home');
    }
  })
})

// router.get('/logout',function(req,res,next){
//   cookie = req.cookies;
//   for(var prop in cookie){
//     if(!cookie.hasOwnProperty(prop)){
//       continue;
//     }
//     res.cookie(prop,'', {expires: new Date(0)});
//   }
//   res.redirect('/login');
// })

module.exports = router;
