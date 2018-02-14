var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

var app = express();
var secureRoutes = express.Router();

var dataController = require('./server/controllers/dataController');
var authenticateController = require('./server/controllers/authenticateController');
process.env.SECRET_KEY = "myKey";

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/secureApi', secureRoutes);

var config = require('./server/config/config.js');
config.setConfig();

mongoose.connect(process.env.MONGOOSE_CONNECT);

app.get('/api/authenticate', authenticateController.authenticate);
app.get('/api/getData', dataController.getData);

secureRoutes.use(function(req,res,next){
	var token = req.body.token || req.headers['token'];

	if(token){
		jwt.verify(token,process.env.SECRET_KEY, function(err,decode){
			if(err){
				res.status(500).send("Invalid Token");
			} else {
				next();
			}
		})
	} else {
		res.send("please send a token");
	}
});

secureRoutes.post('/api/postData', dataController.postData);

app.listen(1000, function(){
	console.log("server is up");
})

