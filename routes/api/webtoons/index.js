var express = require('express');
var router = express.Router();

var WTController = require('../../../controllers/scraping/webtoons.ctrl');
var WTModel = require('../../../models/webtoons.model');

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

router.get('/consonant', function(req, res, next){
  var prefix = req.query.prefix;

  console.log(prefix);

  WTController.requestData("consonant", prefix, function(error, resultObject){
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

router.get('/end', function(req, res, next){
  var end = req.query.end;

  console.log(end);

  WTController.requestData("end", end, function(error, resultObject){
		res.json(resultObject);
	});
});

router.get('/crawling', function(req, res, next){
  WTController.crawlingWebtoonData(function(error, resultObject){
    res.json(resultObject);
	});
});

router.get('/writers/:writerName', function(req, res, next){
  var writerName = req.params.writerName;

  WTModel.loadWebtoonByWriter(writerName, function(error, resultObject){
    res.json(resultObject);
	});
});

router.get('/titles/:titleName', function(req, res, next){
  var titleName = req.params.titleName;

  WTModel.loadWebtoonByTitle(titleName, function(error, resultObject){
    res.json(resultObject);
	});
});

module.exports = router;
