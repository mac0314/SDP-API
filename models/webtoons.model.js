
var modelLog = "Webtoons";
var errorModel = require('./error.model');

var queryModel = require('./query.model');


var config = require('config.json')('./config/config.json');


var redis = require("redis");
var redisClient = redis.createClient(config.redis.port, config.redis.host);
//redisClient.auth(config.redis.password);


exports.loadWebtoonByWriter = function(writerName, callback){
  console.log("loadWritersWebtoon");

  var sql = "SELECT writer_sn AS writer, title_sn AS title, thumbnail_path_ln AS thumbnail, link_path_ln AS link FROM webtoon WHERE DATE(crawling_dtm) = CURDATE() AND writer_sn = ?";

  var sqlParams = [writerName];

  queryModel.request("select", modelLog, sql, sqlParams, function(error, webtoonObject){
    var idx = Math.floor(Math.random() * webtoonObject.data.length);

    var resultObject = new Object({});

    if(webtoonObject.data.length > 0){
      resultObject = webtoonObject.data[idx];
    }

    //console.log(idx, resultObject);

    callback(error, resultObject);
  });
};

exports.loadWebtoonByTitle = function(titleName, callback){
  console.log("loadWebtoonByTitle");

  var sql = "SELECT writer_sn AS writer, title_sn AS title, thumbnail_path_ln AS thumbnail, link_path_ln AS link FROM webtoon WHERE DATE(crawling_dtm) = CURDATE() AND title_sn = ?";

  var sqlParams = [titleName];

  queryModel.request("select", modelLog, sql, sqlParams, function(error, webtoonObject){
    var resultObject = webtoonObject.data[0];

    callback(error, resultObject);
  });
};

exports.removeChatRoom = function(userKey, callback){
  console.log("removeUser");

  var sql = "DELETE FROM chat_room WHERE user_id = (SELECT user_id FROM user WHERE kakao_key_sn = ?)";

  var sqlParams = [userKey];

  queryModel.request("delete", modelLog, sql, sqlParams, function(error, resultObject){
    callback(error, resultObject);
  });
};

// writer, title, answer
exports.setWebtoonQueryData = function(typeName, queryName, webtoonObject){
  console.log("setWebtoonQueryData");
  var today = getTodayDate();

  var key = today + "/webtoon/" + typeName + "/" + queryName;
  var value = JSON.stringify(webtoonObject);

  redisClient.set(key, value, function(error, result){
    return ;
  });
};

// writer, title, answer
exports.getWebtoonQueryData = function(typeName, queryName, callback){
  console.log("getWebtoonQueryData");
  var today = getTodayDate();

  var key = today + "/webtoon/" + typeName + "/" + queryName;

  redisClient.get(key, function(error, result){
    callback(null, JSON.parse(result));
  });
};

function getTodayDate() {
  var today = new Date();

  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();

  if(dd < 10) {
      dd = '0' + dd;
  }

  if(mm < 10) {
      mm = '0' + mm;
  }

  today = yyyy + '-' + mm + '-' + dd;

  return today;
}
