var express = require('express');
var router = express.Router();
var fs = require('fs');
router.use(express.json());
router.use(express.urlencoded({extended:false}));
const data = (JSON.parse(fs.readFileSync(__dirname+'/grid-data.json')));
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'uploads')
  },
  filename: function(req, file, cb){
    cb(null, file.originalname)
  }
});
const upload = multer({storage: storage});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json(data);
});

router.post('/', upload.single('image'), function(req, res) {
  const dati= ({
    id: req.body.id,
    icon: req.body.icon,
    title: req.body.title,
    position: req.body.position,
    post: req.body.post,
    image: req.file
  });

  data.push(dati);
  console.log(data);
  res.status(201).send(dati);
  fs.writeFileSync(__dirname+'/grid-data.json', JSON.stringify(data,null,2));
});

module.exports = router;  