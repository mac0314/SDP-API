
var request = require('request');
var cheerio = require('cheerio');

var urlencode = require('urlencode');


exports.requestData = function (typeName, queryName, callback){
  console.log("requestData");
  var resultObject = new Object({});

  var query = "";

  if(typeName === "genre"){
    query = "genre.nhn?genre=" + queryName;
  }else if(typeName === "weekday"){
    query = "weekdayList.nhn?week=" + queryName;
  }else if(typeName === "creationList"){
    query = "creationList.nhn?prefix=" + urlencode(queryName);
  }else if(typeName === "period"){
    query = "period.nhn?period=" + queryName;
  }else if(typeName === "finish"){
    query = "finish.nhn";
  }


  var url = "http://comic.naver.com/webtoon/" + query;

  console.log(url);

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
