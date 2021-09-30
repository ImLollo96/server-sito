var express = require('express');
var router = express.Router();
var fs = require('fs');
const data = require('./password.json');



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json(data);
});

module.exports = router;