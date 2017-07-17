const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
Activity = require('./models/activity');
Stat = require('./models/stat');

app.use(bodyParser.json());

//Connect to mongoose
mongoose.connect("mongodb://localhost/stattracker");
var db = mongoose.connection;

app.get("/", function(req, res) {
  res.send("Home page... ");
});

//get all activities
app.get("/api/activities", function  (req, res) {
	Activity.getActivities(function(err, activities){
		if(err){
			console.log(err);
		};
		res.send(activities)
	})
});

//get activity by id
app.get("/api/activities/:id", function  (req, res) {
	Activity.getActivityById(req.params.id, function(err, activity){
		if(err){
			console.log(err);
		};
		res.send(activity)
	})
});

//add activity
app.post("/api/activities", function  (req, res) {
	var activity = req.body;
	Activity.addActivity(activity, function(err, activity){
		if(err){
			console.log(err);
		};
		res.send(activity)
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

//delete activity
app.delete("/api/activities/:id", function  (req, res) {
	var id = req.params.id
	Activity.deleteActivity(id, function(err, activity){
		if(err){
			console.log(err);
		};
		res.send(activity)
	})
});

//add stats to activity ///IN PROGRESS
app.post("/api/activities/:id/stats", function  (req, res) {
	var iD = req.params.id;
	var amount = req.body.amount;
	console.log(iD)
	var newstat = {"activity": iD,
		"amount": req.body.amount}
	console.log("newstat amount="+newstat.amount);
		console.log("newstat id="+newstat.activity);
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
