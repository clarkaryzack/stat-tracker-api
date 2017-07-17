const express = require("express");
const bodyParser = require("body-parser");
const passport = require('passport');
const bcryptjs = require('bcryptjs');
const BasicStrategy = require('passport-http').BasicStrategy;
const mongoose = require("mongoose");
const app = express();
const mustacheExpress = require('mustache-express');
Activity = require('./models/activity');
Stat = require('./models/stat');

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

const users = {
    'zack': 'test'
};

passport.use(new BasicStrategy(
  function(username, password, done) {
      const userPassword = users[username];
      if (!userPassword) { return done(null, false); }
      if (userPassword !== password) { return done(null, false); }
      return done(null, username);
  }
));

app.get("/", function(req, res) {
  res.render('index');
});

app.get('/api/hello',
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

//get activity by id
// app.get("/api/activities/:id", function  (req, res) {
// 	Activity.getActivityById(req.params.id, function(err, activity){
// 		if(err){
// 			console.log(err);
// 		};
// 		res.render('activity',{activity:activity})
// 	})
// });

app.get("/api/activities/:id", function  (req, res) {
	// let activityname = Activity.getActivityById(req.params.id, function(err, activity){
	// 	if(err){
	// 		console.log(err);
	// 	}
	// });
	Stat.getStatByActId(req.params.id,
	function(err, stat){
		if(err){
			console.log(err);
		};
	res.render('activity',
	// {activity:activityname},
	{stat:stat})
	});

});



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

app.post('/api/activities/{{id}}/delete', function (req, res) {
	res.redirect()
}

//delete activity
xhttp.delete("/api/activities/:id", function  (req, res) {
	var id = req.params.id
	Activity.deleteActivity(id, function(err, activity){
		if(err){
			console.log(err);
		};
		res.redirect("/api/activities")
	})
});

//add stats to activity ///IN PROGRESS
app.post("/api/activities/:id/stats", function  (req, res) {
	var id = req.params.id;
	var amount = req.body.amount;
	var newstat = {"activity": id,
		"amount": req.body.amount}
	Stat.addStat(newstat, function(err, stat){
		if(err){
			console.log(err);
		};
		res.send(newstat)
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
