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
								socket.join(user.type);
								usersOnLine[userName] = {userName:userName,type:user.type,socket:socket}
								socket.emit('login', {status:"ok",type:user.type,userName:userName})
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
	  	socket.on('question',function(question){
	  		//{q:"lo que la persona escribe", location:null}
	  		q = []
	  		if(question.q != undefined)
	  			q = question.q.split(' ');
	  		location = question.location
	  		//...
	  		categories = ["Hogar","Familia","Varios"]
	  		socket.emit("categories",{q_split:q,categories:categories})
	  	})
	  	socket.on('question_categories',function(data){
	  		//{q:"lo que la persona escribe", location:null}

	  		q_split =data.q_split;
	  		categories_selected = data.categories_selected
	  		console.log(categories_selected);
	  		user_type_vendedor = "vendedor"
	  		var now = new Date();
	  		socket.broadcast.to(user_type_vendedor).emit("new_pulling_question",{q:q_split.join(" "),username:userName,date:now});
	  		//socket.broadcast.emit("new_pulling_question",{q:q_split.join(" "),username:userName,date:now});
	  	});
	  	socket.on('response_to_client',function(data){
	  		console.log(data);
	  		if(data.comprador_username==undefined || data.vendedor_username ==undefined || data.msgvendedor == undefined){
	  			console.log("Data Incompleta");
	  		}else{

	  			console.log(usersOnLine)

	  			Sockect_User_comprador = usersOnLine[data.comprador_username].socket
	  			Sockect_User_vendedor  = usersOnLine[data.vendedor_username].socket
	  			msgvendedor 		= data.msgvendedor
	  	

	  		
	  			
	  			Sockect_User_comprador.emit("send_response",{vendedor_username:data.vendedor_username,msgvendedor:msgvendedor})

	  		}
	  		
	  	})

		socket.on('disconnect', function () { 
		  	if(usersOnLine[userName]!=null) 
		  		delete usersOnLine[userName]
		});
	});
})