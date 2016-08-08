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
    socket.emit('announcements', { message: 'A new user has joined!' });
	
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
        console.log('A client sent this, send it to others: ', data.message);
		for(var i = 0; i < clients.length; i++ )
			clients[i].emit('chatmessage', {message: data.message } );
    });
	
	socket.on('disconnect', function() {
        console.log('A client has disconnected...');
    });
	
});

console.log("\nStartup finished hopefully successfully...\n");