const express = require('express');
var router = express.Router();
const cors = require('cors');
const app = express();
const http = require('http');
require('events').EventEmitter.defaultMaxListeners = 1000;
const server = http.createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });


app.get('/', function(req, res) {
	res.send('HELLO');
});


io.on('connection', (socket) => {
	console.log(`UTENTE CONNESSO: ${socket.id}`);
	setInterval(() => {
		socket.volatile.emit('random', Math.floor((Math.random() * 100) + 1));
	}, 1000);

	socket.on('disconnect', () => {
		console.log(`SONO FUORI: ${socket.id}`);
		delete [socket.id];
	});

	setInterval(() => {
		socket.volatile.emit('chart', Array.from({ length: 8 }, () => Math.floor(Math.random() * 590) + 10));
	}, 5000);
});


server.listen(3001, () => {
	console.log('listening on *:3001');
});

module.exports = router;


