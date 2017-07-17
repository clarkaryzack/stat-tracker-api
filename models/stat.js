const mongoose = require('mongoose');

// schema

var statSchema = mongoose.Schema({
	activity: {
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
	deleteStat : deleteStat
}
