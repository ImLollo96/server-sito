var path = require('path');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', express.static(path.resolve(__dirname, '../images')));

module.exports = router;