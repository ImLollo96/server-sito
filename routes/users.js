var express = require('express');
var router = express.Router();
var fs = require('fs');
router.use(express.json());
router.use(express.urlencoded({extended:false}));
const data = (JSON.parse(fs.readFileSync(__dirname+'/data-for-table.json')));


/* GET users listing. */
router.get('/', function(req, res) {
  res.json(data);
});

router.post('/', function(req, res) {
  const dati=req.body;
  data.push(dati);
  console.log(data);
  res.status(201).send(dati);
  fs.writeFileSync(__dirname+'/data-for-table.json', JSON.stringify(data,null,2));
});


router.delete('/:id', function(req, res){
  let id = req.params.id;
  console.log('id:',id);
  let index= data.findIndex(res=> res.userId === id);
  console.log('index: ', index);
    data.splice(index, 1);
    res.status(201).send(data);
    fs.writeFileSync(__dirname+'/data-for-table.json', JSON.stringify(data,null,2));
});


router.put('/:id', function(req, res){
  let id = req.params.id;
  let n = req.body.firstName;
  let c = req.body.lastName;
  let t = req.body.phoneNumber;
  let e = req.body.emailAddress;
  console.log('id:',id);
  let arr = data.find(res=> res.userId === id);
  console.log('arr: ', arr);
  let dt = arr;
  dt.firstName = n;
  dt.lastName = c;
  dt.phoneNumber = t;
  dt.emailAddress = e;
  res.status(201).send(data);
  console.log('data: ', data);
  fs.writeFileSync(__dirname+'/data-for-table.json', JSON.stringify(data,null,2));
});

module.exports = router; 
