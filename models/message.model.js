
var modelLog = "Message";
var errorModel = require('./error.model');

var queryModel = require('./query.model');

exports.addRequestMessage = function(type, content, callback){
  console.log("addRequestMessage");

  var sql = "INSERT message (type_sn, content_ln) VALUE (?, ?)";

  var sqlParams = [type, content];

  queryModel.request("insert", modelLog, sql, sqlParams, function(error, resultObject){
    console.log(resultObject);

    callback(error, resultObject);
  });
};
