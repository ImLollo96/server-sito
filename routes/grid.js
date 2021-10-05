var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

// Già presente in app.js
// router.use(express.json());
// router.use(express.urlencoded({extended:false}));

const data = (JSON.parse(fs.readFileSync(__dirname + '/grid-data.json')));
const uploadDir = path.join(__dirname, './images/');

// Percorso immagini
const imagesFolder = './images';
if (!fs.existsSync(imagesFolder)) fs.mkdirSync(imagesFolder);

/* GET users listing. */
router.get('/', function(req, res) {
	res.json(data);
});

// V1, salva immagine nel .json
router.post('/', function(req, res) {
	const dati = ({
		id: req.body.id,
		icon: req.body.icon,
		title: req.body.title,
		position: req.body.position,
		post: req.body.post,
		image: req.body.image
	});

	data.push(dati);
	console.log(data);
	res.status(201).send(dati);
	fs.writeFileSync(__dirname + '/grid-data.json', JSON.stringify(data, null, 2));
});

// V2, salva immagine come file e link nel json
router.post('/v2', function(req, res) {
	const gridData = {
		id: req.body.id,
		icon: req.body.icon,
		title: req.body.title,
		position: req.body.position,
		post: req.body.post
	};

	const image = req.body.image;
	console.log(!!image);

	try {
		if (image) {
			// data:image/jpeg;base64,
			const type = image.slice(image.indexOf('/') + 1, image.indexOf(';'));
			console.log('type', type);
			const data = image.slice(image.indexOf(';') + 8);
			const fileName = `${gridData.id}.${type}`;
			console.log('fileName', fileName);
			const url = `/api/images/${fileName}`;
			console.log('url', url);
			gridData.image = url;
			fs.writeFileSync(path.resolve(imagesFolder, fileName), Buffer.from(data, 'base64'));
		}
	} catch (err) {
		console.error(err);
		res.status(500).send('Error!');
	}

	data.push(gridData);
	// console.log(data);
	res.status(201).send(gridData);
	fs.writeFileSync(__dirname + '/grid-data.json', JSON.stringify(data, null, 2));
});

// UPDATE
router.put('/:id', function(req, res) {
	const gridData = {
		id: req.body.id,
		icon: req.body.icon,
		title: req.body.title,
		position: req.body.position,
		post: req.body.post
	};

	console.log('id:', gridData.id);
	const arr = data.find ((res) => res.id === gridData.id);
	console.log('arr: ', arr);
	const dt = arr;

	const image = req.body.image;
	console.log(!!image);
	const oldFileName = (dt.image.substr(12));
	console.log('controllo nome: ', oldFileName);
	console.log('controllo directory: ', uploadDir);

	try {
		if (image) {
			if (image.startsWith('/')) {
				gridData.image = image;
			} else {
				fs.unlink(uploadDir + oldFileName, (err) => {
					console.log(err);
				});
				// data:image/jpeg;base64,
				const type = image.slice(image.indexOf('/') + 1, image.indexOf(';'));
				console.log('type', type);
				const data = image.slice(image.indexOf(';') + 8);
				const fileName = `${gridData.id}.${type}`;
				console.log('fileName', fileName);
				const url = `/api/images/${fileName}`;
				console.log('url', url);
				gridData.image = url;
				fs.writeFileSync(path.resolve(imagesFolder, fileName), Buffer.from(data, 'base64'));
			}
		}

		dt.icon = gridData.icon;
		dt.title = gridData.title;
		dt.position = gridData.position;
		dt.post = gridData.post;
		dt.image = gridData.image;
		res.status(201).send(gridData);
		fs.writeFileSync(__dirname + '/grid-data.json', JSON.stringify(data, null, 2));
	} catch (err) {
		console.error(err);
		return res.status(500).send('Error!');
	}
});

module.exports = router;
