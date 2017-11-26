
var request = require('request');
var cheerio = require('cheerio');

exports.requestDataByGenre = function (genreName, callback){
  console.log("requestDataByGenre");
  var resultObject = new Object({});

  var url = "http://comic.naver.com/webtoon/genre.nhn" + "?genre=" + genreName;

  resultObject.url = url;

  request(url, function (error, response, html) {
      var $ = cheerio.load(html);

      const titles = [];

      $('ul.img_list').children().each(function(i, elem){
        titles[i] = $(this).children('dl').children().find("a").attr("title");

      });

      resultObject.titles = titles;
      console.log(titles.join(', '));

      callback(null, resultObject);
  });
};
