var express = require('express');
var router = express.Router();

/* GET home page. */
router.param('name',function(req,res,next,name){
  console.log(name);
  req.name=name;
  next();
});
router.get('/:name', function(req, res, next) {
  res.render('index', { title: req.name});
});
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
