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

	let app = JSON.stringify(file);
	app = JSON.parse(app);

	/** Servizio che genera un numero randomico e lo passa al FE con una certa cadenza */
	setInterval(() => {
		socket.volatile.emit('random', Math.floor((Math.random() * 100) + 1));
	}, 1000);

	/** Servizio che genera 8 valori e li passa al FE con una certa cadenza */
	setInterval(() => {
		socket.volatile.emit('chart', Array.from({ length: 1 }, () => Math.floor(Math.random() * 100) + 1));
	}, 3000);


	socket.emit('message-history', app);

	socket.on('message', (data) => {
		console.log(data);

		file.push(data);
		fs.writeFileSync(__dirname + '/chat.json', JSON.stringify(file, null, 2));
		socket.volatile.broadcast.emit('message-broadcast', { user: data.user, message: data.message, when: data.when });
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


