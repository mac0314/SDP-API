

var modelLog = "User";
var errorModel = require('./error.model');

var queryModel = require('./query.model');

exports.addUser = function(userKey, callback){
  console.log("addUser");

  var sql = "INSERT user (kakao_key_sn) VALUE (?)";

  var sqlParams = [userKey];

  queryModel.request("insert", modelLog, sql, sqlParams, function(error, resultObject){
    callback(error, resultObject);
  });
};

exports.updateUserState = function(userKey, userState, callback){
  console.log("updateUser");

  var sql = "UPDATE user SET state_sn = ? WHERE kakao_key_sn = ?";

  var sqlParams = [userState, userKey];

  queryModel.request("update", modelLog, sql, sqlParams, function(error, resultObject){
    callback(error, resultObject);
  });
};
