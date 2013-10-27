var usersOnLine = {} //pool de usuarios 

var io = require('socket.io').listen(80);

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var Models = {}
require('./models.js').make(mongoose,Models);

db.once('open', function callback () {
	
	io.sockets.on('connection', function (socket) {
		var userName = null
		var password = null
		socket.on('login',function(data){
			userName = data.userName
			password = data.password
			Models.User.count({userName:userName,password:password},function(err,count){
				if(err){
					socket.emit('message', "Error en la consulta: ")
					socket.emit('login', {status:"fail"})
				}
				else{
					if(count > 0){
						Models.User.findOne({ userName:userName }, function (err, user) {
							if(err)
								socket.emit('login', {status:"fail"})
							else{
								usersOnLine[userName] = {userName:userName,type:user.type,socket:socket}
								socket.emit('login', {status:"ok",type:user.type})
							}
						});
					}
					else{
						socket.emit('login', {status:"fail"})
					}
				}		
			});
		});	
	  	socket.on('message', function (msg) { 
	  		console.log(msg);
	  		socket.emit('message', "recibi: "+msg);
	  	});
		socket.on('disconnect', function () { 
		  	if(usersOnLine[userName]!=null)
		  		delete usersOnLine[userName]
		});
	});
})