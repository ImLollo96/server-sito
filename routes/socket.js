const express = require('express');
var router = express.Router();
var fs = require('fs');
const cors = require('cors');
const app = express();
const http = require('http');
router.use(express.json());
const file = (JSON.parse(fs.readFileSync(__dirname + '/chat.json')));
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

	/** Emit log dei messaggi */
	setInterval(() => {
		let app = JSON.stringify(file);
		app = JSON.parse(app);
		socket.emit('message-history', app);
	}, 1000);

	/** Delete dei messaggi */
	socket.on('delete', (id) => {
		const index = file.findIndex((res) => res.id === id);
		console.log('INDEX: ', index);
		file.splice(index, 1);
		fs.writeFileSync(__dirname + '/chat.json', JSON.stringify(file, null, 2));
	});

	/** Edit dei messaggi */
	socket.on('edit', (id, data) => {
		const arr = file.find((res) => res.id === id);
		const dt = arr;
		dt.id = data.id;
		dt.user = data.user;
		dt.message = data.message;
		dt.when = data.when;
		fs.writeFileSync(__dirname + '/chat.json', JSON.stringify(file, null, 2));
	});

	/** Salvataggio e broadcast dei messaggi */
	socket.on('message', (data) => {
		console.log(data);
		file.push(data);
		fs.writeFileSync(__dirname + '/chat.json', JSON.stringify(file, null, 2));
		socket.volatile.broadcast.emit('message-broadcast', { id: data.id, user: data.user, message: data.message, when: data.when });
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


