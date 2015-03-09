var mongoose = require('mongoose');

mongoose.connect('mongodb://kitten:cat@ds033087.mongolab.com:33087/flights');

module.exports = mongoose.connection;