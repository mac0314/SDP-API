
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

exports.crawlingWebtoonData = function(callback){
  var resultObject = new Object({});
  var url = "http://comic.naver.com/webtoon/artist.nhn";

  request(url, function (error, response, html) {
      var $ = cheerio.load(html);

      // Object list
      var artistList = [];

      $('div.work_list').children('h5').each(function(i, elem){
        var artistObject = new Object({});

        var artistName = $(this).text();
        var webtoonList = [];

        $(this).next().children('li').each(function(i, elem){
          var webtoonObject = new Object({});

          webtoonObject.title = $(this).children('div').children('a').children('img').attr('alt');
          webtoonObject.thumbnail = $(this).children('div').children('a').children('img').attr('src');

          webtoonList.push(webtoonObject);
        });

        artistObject.name = artistName;
        artistObject.webtoonList = webtoonList;

        artistList.push(artistObject);
      });

      resultObject.artistList = artistList;

/*
      // List style
      const namesList = [];
      const titlesList = [];
      const thumbnailsList = [];

      // artist name list
      $('div.work_list').children('h5').each(function(i, elem){
        namesList[i] = $(this).text();

        var webtoonObject = new Object({});

        titles = [];
        thumbnails = [];

        $(this).next().children('li').each(function(i, elem){
          titles.push($(this).children('div').children('a').children('img').attr('alt'));
          thumbnails.push($(this).children('div').children('a').children('img').attr('src'));
        });
        titlesList.push(titles);
        thumbnailsList.push(thumbnails);
      });

      resultObject.namesList = namesList;
      resultObject.titlesList = titlesList;
      resultObject.thumbnailsList = thumbnailsList;
*/
      callback(null, resultObject);
  });
};
