var express = require('express');
var router = express.Router();
var fs = require('fs');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './upload/')
  },
  filename: function(req, file, cb){
    cb(null, file.originalname)
  }
});
const upload = multer({storage: storage});


/* GET users listing. */
router.get('/', function(req, res, next) {
  
});



router.post('/', upload.single('image'), function(req, res, next) {
  const dati=req.body;
  data.push(dati);
  
});

module.exports = router;