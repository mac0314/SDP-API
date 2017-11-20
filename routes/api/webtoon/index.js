var express = require('express');
var router = express.Router();

var WTController = require('../../../controllers/scraping/webtoon.ctrl');

/******************************
 *          route             *
 ******************************/

router.get('/', function(req, res, next){
  var genreName = req.query.genre;

  console.log(genreName);

	WTController.requestDataByGenre(genreName, function(error, resultObject){
		res.json(resultObject);
	});
});




module.exports = router;
