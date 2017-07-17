const mongoose = require('mongoose');

// schema

var activitySchema = mongoose.Schema({
	name:{
		type: String,
		required: true
	},
	create_date:{
		type: Date,
		default: Date.now,
	}
});

var Activity = mongoose.model('Activity', activitySchema);
// get  all activities

const getActivities = function(callback, limit){
	Activity.find(callback).limit(limit);
}

// get activity by id
const getActivityById = function(id, callback){
	Activity.findById(id, callback);
}

//add activity
const addActivity = function(activity, callback){
	Activity.create(activity, callback);
}

//update activity
const updateActivity = function(id, activity, options, callback){
	var query = {_id:id}
	var update = {
		name: activity.name
	};
	Activity.findOneAndUpdate(query, update, options, callback)
}

//delete activity
const deleteActivity = function(id, callback){
	var query = {_id:id}
	Activity.remove(query, callback)
}

module.exports = {
	Activity: Activity,
	getActivities: getActivities,
	getActivityById : getActivityById,
	addActivity : addActivity,
	updateActivity : updateActivity,
	deleteActivity : deleteActivity
}
