var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

// Già presente in app.js
// router.use(express.json());
// router.use(express.urlencoded({extended:false}));

const data = (JSON.parse(fs.readFileSync(__dirname+'/grid-data.json')));

// Percorso immagini
const imagesFolder = './images';
if (!fs.existsSync(imagesFolder)) fs.mkdirSync(imagesFolder);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json(data);
});

// V1, salva immagine nel .json
router.post('/', function(req, res) {
  const dati= ({
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
  fs.writeFileSync(__dirname+'/grid-data.json', JSON.stringify(data,null,2));
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
  } catch(err) {
    console.error(err);
    res.status(500).send('Error!')
  }

  data.push(gridData);
  // console.log(data);
  res.status(201).send(gridData);
  fs.writeFileSync(__dirname+'/grid-data.json', JSON.stringify(data,null,2));
});

module.exports = router;  