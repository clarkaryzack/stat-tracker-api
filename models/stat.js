const mongoose = require('mongoose');

// schema

var statSchema = mongoose.Schema({
	activityId: {
		type: String,
		required: true
	},
	amount:{
		type: Number,
		required: true
	},
	create_date:{
		type: Date,
		default: Date.now,
		unique: true
	}
});

var Stat = mongoose.model('Stat', statSchema);

//get stats by activity id?
const getStatByActId = function(id, callback){
	Stat.findOne({'activityId':id}, callback);
}

//add stats
const addStat = function(newstat, callback){
	Stat.create(newstat, callback);
}

//delete stats
const deleteStat = function(id, callback){
	var query = {_id:id}
	Stat.remove(query, callback)
}

module.exports = {
	Stat: Stat,
	addStat: addStat,
	deleteStat : deleteStat,
	getStatByActId : getStatByActId
}
