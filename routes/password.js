var express = require('express');
var router = express.Router();
var fs = require('fs');
router.use(express.json());
router.use(express.urlencoded({ extended: false }));
const data = (JSON.parse(fs.readFileSync(__dirname + '/password.json')));


/* GET users listing */
router.get('/', function(req, res) {
  res.json(data);
});

/* PUT users */
	router.put('/:id', function(req, res) {
		const id = req.params.id;
		const u = req.body.user;
		const p = req.body.pass;
		const n = req.body.name;
		const c = req.body.lastName;
		const e = req.body.emailAddress;
		console.log('id:', id);
		const arr = data.find((res) => res.id === id);
		console.log('arr: ', arr);
		const dt = arr;
		dt.user = u;
		dt.pass = p;
		dt.name = n;
		dt.lastName = c;
		dt.emailAddress = e;
		res.status(201).send(data);
		console.log('data: ', data);
		fs.writeFileSync(__dirname + '/password.json', JSON.stringify(data, null, 2));
	});

module.exports = router;
