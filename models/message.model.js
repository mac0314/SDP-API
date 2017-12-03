
var async = require('async');

var modelLog = "Message";
var errorModel = require('./error.model');

var queryModel = require('./query.model');

var config = require('config.json')('./config/config.json');

var redis = require("redis");
var redisClient = redis.createClient(config.redis.port, config.redis.host);
//redisClient.auth(config.redis.password);

exports.addRequestMessage = function(userKey, type, content, callback){
  console.log("addRequestMessage");

  var sql = "INSERT message (type_sn, content_ln) VALUE (?, ?)";

  var sqlParams = [type, content];

  queryModel.request("insert", modelLog, sql, sqlParams, function(error, insertObject){
    var messageId = insertObject.insertId;

    sql = "INSERT request (user_id, message_id, request_dtm) VALUE ((SELECT user_id FROM user WHERE kakao_key_sn = ? GROUP BY user_id), ?, NOW())";

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

exports.saveDialogContext = function(userKey, contextObject, callback){
  console.log("saveDialogContext");
  var key = userKey + "/watson/context";
  var value = JSON.stringify(contextObject);

  redisClient.set(key, value, function(error, result){
    callback(null, true);
  });
};

exports.loadDialogContext = function(userKey, callback){
  console.log("loadDialogContext");
  var key = userKey + "/watson/context";

  redisClient.get(key, function(error, value){
    var contextObject = JSON.parse(value);

    callback(error, contextObject);
  });
};

exports.setWatsonFlag = function(userKey, flag){
  console.log("setWatsonFlag");
  var key = userKey + "/watson/flag";
  var value = flag;

  redisClient.set(key, value, function(error, result){
    return ;
  });
};

exports.getWatsonFlag = function(userKey, callback){
  console.log("getWatsonFlag");
  var key = userKey + "/watson/flag";

  redisClient.get(key, function(error, value){
    callback(error, value);
  });
};

// writer, title, answer
exports.setDialogType = function(userKey, type){
  console.log("setDialogType");
  var key = userKey + "/watson/type";
  var value = type;

  redisClient.set(key, value, function(error, result){
    return ;
  });
};

// writers, titles, answers
exports.getDialogType = function(userKey, callback){
  console.log("getDialogType");
  var key = userKey + "/watson/type";

  redisClient.get(key, function(error, value){
    callback(error, value);
  });
};
