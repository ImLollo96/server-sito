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

/** Gestisce le connessioni al BE dal FE */
io.on('connection', (socket) => {
	console.log(`UTENTE CONNESSO: ${socket.id}`);

/** Servizio che genera un numero randomico e lo passa al FE con una certa cadenza */
	setInterval(() => {
		socket.volatile.emit('random', Math.floor((Math.random() * 100) + 1));
	}, 1000);

/** Servizio che genera 8 valori e li passa al FE con una certa cadenza */
	setInterval(() => {
		socket.volatile.emit('chart', Array.from({ length: 1 }, () => Math.floor(Math.random() * 100) + 1));
	}, 3000);

	socket.on('join', (data) =>{
		socket.join(data.room);
		socket.broadcast.to(data.room).emit('new user');
	});

	socket.on('message', (data) =>{
		io.in(data.room).emit('new message', {user: data.user, message: data.message});
	});

/** Elimina il socket in utilizzo */
	socket.on('disconnect', () => {
		console.log(`SONO FUORI: ${socket.id}`);
		delete [socket.id];
	});
});

server.listen(3001, () => {
	console.log('listening on *:3001');
});

module.exports = router;


