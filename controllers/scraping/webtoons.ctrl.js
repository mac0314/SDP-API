
var request = require('request');
var cheerio = require('cheerio');

var urlencode = require('urlencode');

var WTModel = require('../../models/scraping.model');


exports.requestData = function (typeName, queryName, callback){
  console.log("requestData");
  var resultObject = new Object({});

  var query = "";

  if(typeName === "genre"){
    query = "genre.nhn?genre=" + queryName;
  }else if(typeName === "weekday"){
    query = "weekdayList.nhn?week=" + queryName;
  }else if(typeName === "consonant"){
    query = "creationList.nhn?prefix=" + urlencode(queryName);
  }else if(typeName === "period"){
    query = "period.nhn?period=" + queryName;
  }else if(typeName === "end"){
    query = "finish.nhn";
  }


  var url = "http://comic.naver.com/webtoon/" + query;

  //console.log(url);

  request(url, function (error, response, html) {
      var $ = cheerio.load(html);

      const titles = [];
      const links = [];
      const thumbnails = [];

      $('ul.img_list').children().each(function(i, elem){
        titles[i] = $(this).children('dl').children().find("a").attr("title");
        thumbnails[i] = $(this).children('div').children().find("img").attr("src");
        links[i] = "http://comic.naver.com" + $(this).children('dl').children().find("a").attr("href");
      });

      var idx = Math.floor(Math.random() * titles.length);

      resultObject.title = titles[idx];
      resultObject.thumbnail = thumbnails[idx];
      resultObject.link = links[idx];

      callback(null, resultObject);
  });
};

exports.crawlingWebtoonData = function(callback){
  var resultObject = new Object({});
  var url = "http://comic.naver.com/webtoon/artist.nhn";

  request(url, function (error, response, html) {
      var $ = cheerio.load(html);

      // Object list
      var dataList = [];

      $('div.work_list').children('h5').each(function(i, elem){
        var writerObject = new Object({});

        var writerName = $(this).text();
        var webtoonList = [];

        $(this).next().children('li').each(function(i, elem){
          var webtoonObject = new Object({});

          webtoonObject.title = $(this).children('div').children('a').children('img').attr('alt');
          webtoonObject.thumbnail = $(this).children('div').children('a').children('img').attr('src');
          webtoonObject.link = "http://comic.naver.com" + $(this).children('div').children('a').attr('href');

          webtoonList.push(webtoonObject);
        });

        writerObject.name = writerName;
        writerObject.webtoonList = webtoonList;

        dataList.push(writerObject);
      });

      resultObject.dataList = dataList;

      WTModel.addWebtoondata(resultObject, function(error, resultObject){
        callback(null, resultObject);
      });

  });
};
