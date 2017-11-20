
var async = require('async');

var messageController = require('./watson/conversation.ctrl');

var userModel = require('../models/user.model');
var chatRoomModel = require('../models/chat_room.model');
var messageModel = require('../models/message.model');

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
	var textObject = new Object({});
	textObject.text = content;

	var watsonData = "";

	async.parallel({
		requestDB: function(callback){
			messageModel.addRequestMessage(userKey, type, content, function(error, data){
				callback(null, data);
			});
		},
		response: function(callback){
			messageController.getConversationResponse(textObject, null, function(error, data){
				watsonData = data.output.text[0];

				makeResponse(content, watsonData, function(error, resultObject){
					callback(null, resultObject);
				});
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

function makeResponse(content, text, callback){
	var resultObject = new Object({});

	var messageObject = new Object({});
	var keyboardObject = new Object({});

	var response = text;

	if(content == "사만다, 넌 누구니?"){
		text = "안녕하세요. 저는 대화의 문맥을 기억하는 봇입니다.";
	}else if(content == "사만다, 넌 어떻게 도와줄 수 있지?"){
		text = "당신의 관심사에 대한 정보를 알려줄 수 있습니다.";
	}else if(content == "사만다, 너에 대해 더 알고 싶어"){
		text = "영광이에요!";

		var buttonObject = new Object({});
		buttonObject.label = "공식 홈페이지 링크";
		buttonObject.url = "http://13.124.56.85:12000";

		messageObject.message_button = buttonObject;
	}

	messageObject.text = text;

	keyboardObject.type = "text";

	resultObject.message = messageObject;
	resultObject.keyboard = keyboardObject;

	callback(null, resultObject);
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
