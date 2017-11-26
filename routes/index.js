var express = require('express');
var router = express.Router();

/*
  GET

  index data
*/
router.get('/', function(req, res, next) {
  var resultObject = new Object({});

  res.render('index');
});


module.exports = router;
