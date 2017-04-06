var express = require('express');
var router = express.Router();
var models = require('../models/user');

router.route('/')
.get(function(req,res){
	res.render('signup');
})
.post(function(req,res){
	var newUser = new models.User({
		username: req.body.username,
		email: req.body.email,
		password: req.body.password
	});
	newUser.save(function(error){
		if(error){
			console.log(error);
		}else{
			res.redirect('/user/login');
		}
	})
})
module.exports = router;
