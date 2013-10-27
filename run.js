var io = require('socket.io').listen(80);

var users = {
	"1":{"login":"lvivas","cc":"1010188564"},
	"2":{"login":"agrados","cc":"1018408050"},
	"3":{"login":"drcarvajalme","cc":"45789455"},
	"4":{"login":"adgranados","cc":"1018408052"},
}


io.sockets.on('connection', function (socket) {

	socket.on('login',function(data){
		id = data.id
		if(users[id] != undefined)
			socket.emit('message', "Login ok: "+users[id].login)
		else
			socket.emit('message', "Login fail id no existe")
	})	
  socket.on('message', function (msg) { 
  		console.log(msg);
  		socket.emit('message', "recibi: "+msg);
  });
  socket.on('disconnect', function () { });
});