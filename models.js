function make(mongoose, models) {
	   /******************************
		*			users 			 * 	
		******************************/

		var usersSchema = mongoose.Schema({
		    userName: String,
		    password: String,
		    type:String,
		    created: { type: Date, default: Date.now }
		})

		usersSchema.methods.getNombre = function () {
		  var nombreUsuario = this.name
		    ? "User[Name = " + this.name +"]"
		    : "No Tiene Nombre"
		  console.log(nombreUsuario);
		}
		var User = mongoose.model('User', usersSchema)

		models["User"] = User;
}

module.exports.make = make;



