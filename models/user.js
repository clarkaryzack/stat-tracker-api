const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// schema

var userSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	password:{
		type: String,
		required: true
	},
});

userSchema.pre("save", function(next) {
	var hash = bcrypt.hashSync(this.password, 8);
	this.password = hash;
	next();
});

var User = mongoose.model('User', userSchema);

module.exports = User
