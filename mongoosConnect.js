
var mongoconnect_state = false
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');



var db = mongoose.connection;
db.once('open', function callback () {
	mongoconnect_state = true
});