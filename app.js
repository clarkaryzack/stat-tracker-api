const express = require("express");
const bodyParser = require("body-parser");
const passport = require('passport');
const bcrypt = require('bcryptjs');
const BasicStrategy = require('passport-http').BasicStrategy;
const mongoose = require("mongoose");
const app = express();
const mustacheExpress = require('mustache-express');
Activity = require('./models/activity');
Stat = require('./models/stat');
User = require('./models/user');

//or is it app.use(express.static('./public')) ??
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', './views');
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Connect to mongoose
mongoose.connect("mongodb://localhost/stattracker");
var db = mongoose.connection;

var user = User.findOne({name:"Zack"},
function(err, user){
	user.password = 'test';
	user.save(function(err){
		if (err) {return console.log('user not found')}
		console.log("user saved!")
	})
});

passport.use(
	new BasicStrategy(function(username, password, done) {
		User.findOne({name:username}, function(err, user){
			console.log("user check");
			if (user && bcrypt.compareSync(password, user.password)) {
				return done(null, user);
			}
			return done (null, false);
		});
	})
);

app.get("/", function(req, res) {
  res.render('index');
});

app.get('/api/auth',
    passport.authenticate('basic', {session: false}),
    function (req, res) {
        res.json({"hello": req.user})
    }
);

//get all activities
app.get("/api/activities", function  (req, res) {
	Activity.getActivities(function(err, activities){
		if(err){
			console.log(err);
		};
		res.render('activities',{activities:activities})
	})
});

//get stats for a single activity
app.get("/api/activities/:id", function  (req, res) {
	 const activity = Activity.getActivityById(req.params.id, function(err, activity){
			if(err){
				console.log(err);
			}

	res.render('activity',{activity:activity})

})

})


//add activity
app.post("/api/activities", function  (req, res) {
	console.log("newactivity="+req.body.newactivity);
	let activity = {}
	activity.name = req.body.newactivity;
	Activity.addActivity(activity, function(err, activity){
		if(err){
			console.log(err);
		};
		res.redirect("/api/activities")
	})
});

//update activity
app.put("/api/activities/:id", function(req, res) {
	var id = req.params.id;
	var activity = req.body;
	Activity.updateActivity(id, activity, {}, function(err, activity){
		if(err){
			console.log(err);
		};
		res.send(activity)
	})
});

//This is a duplicate of the delete route below, because I don't know how to delete using http (I think that it is impossible, maybe?), and it is very late.
app.post('/api/activities/:id/delete', function (req, res) {
	var id = req.params.id;
	Activity.deleteActivity(id, function(err, activity){
		if(err){
			console.log(err);
		};
		res.redirect("/api/activities")
	})
});

//delete activity
app.delete("/api/activities/:id", function  (req, res) {
	var id = req.params.id;
	Activity.deleteActivity(id, function(err, activity){
		if(err){
			console.log(err);
		};
		res.redirect("/api/activities")
	})
});

//add stats to activity
app.post("/api/activities/:id/stats", function  (req, res) {
	var id = req.params.id;
	var amount = req.body.newstat;
	var newstat = {"activity": id,
		"amount": req.body.newstat}
	Stat.addStat(newstat, function(err, stat){
		if(err){
			console.log(err);
		};
		res.redirect("/api/activities/"+req.params.id)
	})
});


//delete stat /// IN PROGRESS
app.delete("/api/stats/:id", function  (req, res) {
	var id = req.params.id
	Stat.deleteStat(id, function(err, stat){
		if(err){
			console.log(err);
		};
		res.send(stat)
	})
});

app.listen(3000	);
console.log("Listening on port 3000...");
