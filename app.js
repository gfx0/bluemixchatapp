var express = require('express');
var app = express();  
var server = require('http').Server(app);  
var io = require('socket.io')(server);

console.log("Starting a new server instance...");


// NOTE: MEGACRITICAL THAT THIS IS HERE FIRST!
server.listen(process.env.PORT || 8080); // NOTE: MEGACRITICAL THAT THIS IS HERE FIRST!
// NOTE: MEGACRITICAL THAT THIS IS HERE FIRST!



app.get('/', function(req, res) {  
    res.sendFile(__dirname + '/public/index.html');
});

var numClients = 0;
var clients = [];

io.on('connection', function(socket) {  
	
	numClients++;
	
	clients.push( socket );

	console.log('A new connection was detected: socket: ' + socket);
	//Server to client
    socket.emit('newconnection', { message: '<b>Server:</b> Connection accepted, welcome to the chat, total clients in chat: ' + numClients });
	
	/*
	for(var i in clients)
	{
		//Don't send to the client who is connecting.
		if ( i != socket )
		{
			i.emit('announcements', { message: 'A new user has joined!' });
		}
	}
	*/
	
	//Client to server.
	socket.on('event', function(data) {
		
		var disregardSending = true;
		if ( data.message.indexOf('<') != -1 && data.message.indexOf('>' != -1 ) )
		{
			console.log("String contains html, disregard it.\n");
			return;
		}

        console.log('A client sent this, send it to others: ', data.message);
		for(var i = 0; i < clients.length; i++ )
			
			//TODO: Make this self broadcast happen only in clientside code to relive stress from server.
			if ( clients[i] == socket )
				clients[i].emit('chatmessage', {message: '<b>You:</b> ' + data.message } );
			else
				clients[i].emit('chatmessage', {message: '<b>Someone:</b> ' + data.message } );
    });
	
	socket.on('disconnect', function() {
        console.log('A client has disconnected...');
		numClients--;
    });
	
});

console.log("\nStartup finished hopefully successfully...\n");