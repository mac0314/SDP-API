
var modelLog = "ChatRoom";
var errorModel = require('./error.model');

var queryModel = require('./query.model');

var config = require('config.json')('./config/config.json');

var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : config.rds.host,
  user     : config.rds.user,
  password : config.rds.password,
  database : config.rds.database
});


conn.connect();

exports.addWebtoondata = function(webtoonDataObject, callback){
  console.log("addWebtoondata");

  var sql = "INSERT INTO webtoon (writer_sn, title_sn, thumbnail_path_ln, link_path_ln) VALUES ?";
  var sqlParams = [];

  for(var i = 0; i < webtoonDataObject.dataList.length; i++){
    for(var j = 0; j < webtoonDataObject.dataList[i].webtoonList.length; j++){
      var list = [];

      list.push(webtoonDataObject.dataList[i].name);
      list.push(webtoonDataObject.dataList[i].webtoonList[j].title);
      list.push(webtoonDataObject.dataList[i].webtoonList[j].thumbnail);
      list.push(webtoonDataObject.dataList[i].webtoonList[j].link);

      sqlParams.push(list);
    }
  }

  conn.query(sql, [sqlParams], function(error, resultObject){
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
