
var async = require('async');

var modelLog = "Message";
var errorModel = require('./error.model');

var queryModel = require('./query.model');

exports.addRequestMessage = function(userKey, type, content, callback){
  console.log("addRequestMessage");

  var sql = "INSERT message (type_sn, content_ln) VALUE (?, ?)";

  var sqlParams = [type, content];

  queryModel.request("insert", modelLog, sql, sqlParams, function(error, insertObject){
    var messageId = insertObject.insertId;

    sql = "INSERT request (user_id, message_id, request_dtm) VALUE ((SELECT user_id FROM user WHERE kakao_key_sn = ?), ?, NOW())";

    sqlParams = [userKey, messageId];

    queryModel.request("insert", modelLog, sql, sqlParams, function(error, resultObject){
      callback(error, resultObject);
    });
  });
};

exports.addResponse = function(requestId, watsonData, response, callback){
  async.parallel({
    watsonDataDB: function(callback){
      var sql = "INSERT watson_result (request_id, content_ln) VALUE (?, ?)";

      sqlParams = [requestId, watsonData];

      queryModel.request("insert", modelLog + "WatsonData", sql, sqlParams, function(error, resultObject){
        callback(error, resultObject);
      });
    },
    responseDataDB: function(callback){
      // TODO modify state
      var state = "normal";

      var sql = "INSERT response (request_id, state_sn, content_ln, response_dtm) VALUE (?, ?, ?, NOW())";

      sqlParams = [requestId, state, response];

      queryModel.request("insert", modelLog + "Response", sql, sqlParams, function(error, resultObject){
        callback(error, resultObject);
      });
    }
  }, function(error, results){
    callback(null, true);
  });
};
