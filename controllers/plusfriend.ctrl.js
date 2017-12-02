
var async = require('async');

var config = require('config.json')('./config/config.json');

var redis = require("redis");
var redisClient = redis.createClient(config.redis.port, config.redis.host);
//redisClient.auth(config.redis.password);
var isEmpty = require('../js/is_empty');

var convController = require('./watson/conversation.ctrl');
var WTController = require('./scraping/webtoons.ctrl');

var userModel = require('../models/user.model');
var chatRoomModel = require('../models/chat_room.model');
var messageModel = require('../models/message.model');
var webtoonModel = require('../models/webtoons.model');

exports.loadKeyborad = function(callback){
	var resultObject = new Object({});

	//resultObject.type = "text";

	resultObject.type = "buttons";

	var buttonArray = new Array();

	buttonArray.push("사만다, 넌 누구니?");
	buttonArray.push("사만다, 넌 어떻게 도와줄 수 있지?");
	buttonArray.push("사만다, 너에 대해 더 알고 싶어");

	resultObject.buttons = buttonArray;

  callback(null, resultObject);
};

exports.dialogize = function(userKey, type, content, callback){
	console.log("dialogize");
	var textObject = new Object({});
	textObject.text = content;

	async.parallel({
		requestDB: function(callback){
			messageModel.addRequestMessage(userKey, type, content, function(error, data){
				//console.log("addRequestMessage");
				callback(null, data);
			});
		},
		response: function(callback){
			console.log("response");
			messageModel.getWatsonFlag(userKey, function(error, watsonFlag){
				if(watsonFlag){
					messageModel.loadDialogContext(userKey, function(error, context){
						convController.getConversationResponse(userKey, textObject, context, function(error, data){
							watsonData = data.output.text[0];

							makeResponse(userKey, content, watsonData, function(error, resultObject){
								callback(null, resultObject);
							});
						});
					});
				}else{
					messageModel.setWatsonFlag(userKey, true);

					//watsonData = "webtoons/writers/" + content;

					makeResponse(userKey, content, watsonData, function(error, resultObject){
						callback(null, resultObject);
					});
				}
			});
		}
	}, function(error, results){
		var requestId = results.requestDB.insertId;
		var response = results.response.message.text;

		messageModel.addResponse(requestId, watsonData, response, function(error, resultObject){
			callback(null, results.response);
		});
	});
};

function makeResponse(userKey, content, text, callback){
	console.log("makeResponse");
	var resultObject = new Object({});

	var messageObject = new Object({});
	var keyboardObject = new Object({});

	console.log(content, text);

	if(text.indexOf("webtoons/") !== -1){
		var textArray = text.split("/");
		var typeName = textArray[1];
		var queryName = textArray[2];

		if(typeName == "titles"){
			messageModel.setWatsonFlag(userKey, false);

			webtoonModel.loadWebtoonByWriter(queryName, function(error, webtoonObject){
				var photoObject = new Object({});

				photoObject.url = webtoonObject.thumbnail;
				photoObject.width = 320;
				photoObject.height = 240;

				var buttonObject = new Object({});

				buttonObject.label = "링크";
				buttonObject.url = webtoonObject.link;


				messageObject.text = webtoonObject.title + " 작품의 정보입니다!";
				messageObject.photo = photoObject;
				messageObject.message_button = buttonObject;

				keyboardObject.type = "text";

				resultObject.message = messageObject;
				resultObject.keyboard = keyboardObject;

				callback(null, resultObject);
			});
		}else if(typeName == "writers"){
			
			webtoonModel.loadWebtoonByWriter(queryName, function(error, webtoonObject){
				console.log(webtoonObject);
				console.log(isEmpty.isEmpty(webtoonObject));
				if(isEmpty.isEmpty(webtoonObject)){
					messageObject.text = "해당 작가는 리스트에 없네요..ㅎㅎ"
				}else{
					var photoObject = new Object({});

					photoObject.url = webtoonObject.thumbnail;
					photoObject.width = 320;
					photoObject.height = 240;

					var buttonObject = new Object({});

					buttonObject.label = "링크";
					buttonObject.url = webtoonObject.link;


					messageObject.text = webtoonObject.writer + " 작가님의 작품 '" + webtoonObject.title + "'를 추천해요!";
					messageObject.photo = photoObject;
					messageObject.message_button = buttonObject;
				}

				keyboardObject.type = "text";

				resultObject.message = messageObject;
				resultObject.keyboard = keyboardObject;


				messageModel.setWatsonFlag(userKey, false);

				callback(null, resultObject);
			});
		}else{
			messageModel.setWatsonFlag(userKey, true);

			WTController.requestData(typeName, queryName, function(error, webtoonObject){
				var photoObject = new Object({});

				photoObject.url = webtoonObject.thumbnail;
				photoObject.width = 320;
				photoObject.height = 240;

				var buttonObject = new Object({});

				buttonObject.label = "링크";
				buttonObject.url = webtoonObject.link;


				messageObject.photo = photoObject;
				messageObject.message_button = buttonObject;

				messageObject.text = "관련 작품에는 " + webtoonObject.title + "이 있어요!";

				keyboardObject.type = "text";

				resultObject.message = messageObject;
				resultObject.keyboard = keyboardObject;

				callback(null, resultObject);
			});
		}



	}else{
		messageObject.text = text;

		keyboardObject.type = "text";

		resultObject.message = messageObject;
		resultObject.keyboard = keyboardObject;

		callback(null, resultObject);
	}
}

exports.addFriend = function(userKey, callback){
  userModel.addUser(userKey, function(error, resultObject){
    callback(error, resultObject);
  });
};

// userState = "normal", "block"
exports.changeFriendState = function(userKey, userState, callback){
	userModel.updateUserState(userKey, userState, function(error, resultObject){
    callback(error, resultObject);
  });
};

exports.enterChatRoom = function(userKey, callback){
	chatRoomModel.addChatRoom(userKey, function(error, resultObject){
		callback(error, resultObject);
	});
};

exports.leaveChatRoom = function(userKey, callback){
	chatRoomModel.removeChatRoom(userKey, function(error, resultObject){
		callback(error, resultObject);
	});
};

exports.initializeUser = function(userKey){
	messageModel.setWatsonFlag(userKey, true);

	return true;
}
