
var modelLog = "ChatRoom";
var errorModel = require('./error.model');

var queryModel = require('./query.model');

exports.addChatRoom = function(userKey, callback){
  console.log("addUser");

  var sql = "INSERT chat_room (user_id, state_sn, create_dtm) VALUE ((SELECT user_id FROM user WHERE kakao_key_sn = ?), 'normal', now())";

  var sqlParams = [userKey];

  queryModel.request("insert", modelLog, sql, sqlParams, function(error, resultObject){
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
