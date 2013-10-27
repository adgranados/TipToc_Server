var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  

	//var usuario1 = new User({ name: 'adgranados' })
	//usuario1.getNombre() // 'adgranados'


	/*usuario1.save(function (err, usuario1) {
	  if (err) // TODO handle the error
		console.log("fallo guardando el usuario")
	  usuario1.getNombre();
	});*/


	User.find(function (err, users) {
	  if (err) // TODO handle err
	  	console.log("no se pudieron cargar los Usuarios")
	  console.log(users)
	});

	User.find({ name: /^adgr/, other1:/\w+aasdsad/ }, function(err, users ){
		if(err)
			console.log(err)
		console.log(users)
	})


});


var usersSchema = mongoose.Schema({
    name: String
})

usersSchema.methods.getNombre = function () {
  var nombreUsuario = this.name
    ? "User[Name = " + this.name +"]"
    : "No Tiene Nombre"
  console.log(nombreUsuario);
}

var User = mongoose.model('User', usersSchema)
