var express = require('express');
var router = express.Router();

var WTController = require('../../../controllers/scraping/webtoons.ctrl');

/******************************
 *          route             *
 ******************************/

router.get('/genre', function(req, res, next){
  var genreName = req.query.genre;

  console.log(genreName);

	WTController.requestData("genre", genreName, function(error, resultObject){
		res.json(resultObject);
	});
});


router.get('/weekday', function(req, res, next){
  var weekdayName = req.query.week;

  console.log(weekdayName);

	WTController.requestData("weekday", weekdayName, function(error, resultObject){
		res.json(resultObject);
	});
});

router.get('/creationList', function(req, res, next){
  var prefix = req.query.prefix;

  console.log(prefix);

  WTController.requestData("creationList", prefix, function(error, resultObject){
		res.json(resultObject);
	});
});

router.get('/period', function(req, res, next){
  var period = req.query.period;

  console.log(period);

  WTController.requestData("period", period, function(error, resultObject){
		res.json(resultObject);
	});
});

router.get('/finish', function(req, res, next){
  var finish = req.query.finish;

  console.log(finish);

  WTController.requestData("finish", finish, function(error, resultObject){
		res.json(resultObject);
	});
});

module.exports = router;
