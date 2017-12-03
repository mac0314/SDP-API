
var modelLog = "Webtoons";
var errorModel = require('./error.model');

var queryModel = require('./query.model');

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
