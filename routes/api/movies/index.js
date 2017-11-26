var express = require('express');
var router = express.Router();

var MVController = require('../../../controllers/scraping/movies.ctrl');

/******************************
 *          route             *
 ******************************/

router.get('/', function(req, res, next){
  var genreName = req.query.genre;

  console.log(genreName);

});




module.exports = router;
