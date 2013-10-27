
var mongoconnect_state = false
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');



var db = mongoose.connection;
db.once('open', function callback () {
	mongoconnect_state = true

	//truncate User
	User.remove({},function(err){
		if(err)
			console.log(err)
		else
			console.log("Users deleted")
	})

	//create Users
	var usuario1 = new User({ userName: 'adgranados',password:'Ad5530',type:"comprador" })
	var usuario2 = new User({ userName: 'lucerovivas',password:'lucerovivas',type:"comprador" })
	var usuario3 = new User({ userName: 'totto',password:'totto',type:"vendedor" })
	var usuario4 = new User({ userName: 'drcarvajalme',password:'Axon2010',type:"comprador" })
	var usuario5 = new User({ userName: 'inkanta',password:'inkanta',type:"vendedor" })
	var usuario6 = new User({ userName: 'ishop',password:'ishop',type:"vendedor" })

	//save users
	usuario1.save();
	usuario2.save();
	usuario3.save();
	usuario4.save();
	usuario5.save();
	usuario6.save();


});
/*****************************
*			users 			 * 	
******************************/

var usersSchema = mongoose.Schema({
    userName: String,
    password: String,
    type:String,
    created: { type: Date, default: Date.now },
    tags:[{name:String,value:String}],
    categories:[{name:String}]

})

usersSchema.methods.getNombre = function () {
  var nombreUsuario = this.name
    ? "User[userName = " + this.name +"]"
    : "No Tiene Nombre"
  console.log(nombreUsuario);
}
var User = mongoose.model('User', usersSchema)