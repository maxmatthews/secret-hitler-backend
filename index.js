var app = require("express")();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
io.on("connection", function() {});

io.sockets.on("connection", function(socket) {
	socket.on("newHost", function(incomingData) {
		socket.join(incomingData.roomCode);

		// socket.on('message', function(message) {
		// 	io.sockets.to(room).emit('message', message);
		// })

		// socket.broadcast.to(room).emit("newPlayer", { incomingData.name });
	});

	socket.on("newPlayer", function(incomingData) {
		socket.join(incomingData.roomCode);

		socket.broadcast.to(incomingData.roomCode).emit("tellHostNewPlayer", {
			name: incomingData.name,
			socketID: socket.id
		});
	});

	socket.on("hostState", function(incomingData) {
		socket.broadcast
			.to(incomingData.roomCode)
			.emit("updateGameState", incomingData);
	});

	socket.on("startGame", incomingData => {
		socket.broadcast.to(incomingData.roomCode).emit("gameStarted");
	});

	socket.on("playerOrder", incomingData => {
		socket.broadcast
			.to(incomingData.roomCode)
			.emit("setPlayerOrderOnHost", { players: incomingData.playerOrder });
	});
});

// setTimeout(()=>{
// 	const room = "abc123";
// 	console.log("send");
// 	io.sockets.in(room).emit('message', 'what is going on, party people?');
// },10000)

server.listen(3000);
