
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


// Bot Response message
var buttonMsgArray = ["넌 누구니?", "넌 어떻게 도와줄 수 있지?", "너에 대해 더 알고 싶어"];
var infoMsgArray = ["전 웹툰에 대한 정보를 드릴 수 있어요~ (작가, 제목, 장르, 요일별, 자음별, 종결 작품)", "웹툰에 대해 물어보세요~ (작가, 제목, 장르, 요일별, 자음별, 종결 작품)", "웹툰의 어떤 것이 궁금하신가요? (작가, 제목, 장르, 요일별, 자음별, 종결 작품)"];
var titleMsgArray = ["알고 싶은 작품 제목을 말씀해주세요!", "어떤 작품이 궁금하세요?", "보고 싶은 작품 이름을 알려주세요!"];
var writerMsgArray = ["작품을 추천받을 작가 이름을 말씀해주세요!", "어떤 작가의 작품이 궁금하세요?", "어떤 작가의 작품을 보고 싶으세요?"];
var noTitleMsgArray = ["해당 작품은 리스트에 없네요..ㅎㅎ", "그 작품을 찾을 수 없어요..", "작품 이름을 다시 확인해주세요..ㅠ"];
var noWriterMsgArray = ["해당 작가는 리스트에 없네요..ㅎㅎ", "그 작가를 찾을 수 없어요..", "작가 이름을 다시 확인해주세요..ㅠ"];


exports.loadKeyborad = function(callback){
	var resultObject = new Object({});

	//resultObject.type = "text";

	resultObject.type = "buttons";

	var buttonArray = [];

	for(var i = 0; i < buttonMsgArray.length; i++){
		buttonArray.push(buttonMsgArray[i]);
	}

	resultObject.buttons = buttonArray;

  callback(null, resultObject);
};

exports.dialogize = function(userKey, type, content, callback){
	console.log("dialogize");
	var textObject = new Object({});
	textObject.text = content;

	var watsonData = "";

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
				//console.log("watsonFlag : ", watsonFlag);
				if(watsonFlag == "true"){
					messageModel.loadDialogContext(userKey, function(error, context){
						convController.getConversationResponse(userKey, textObject, context, function(error, data){
							watsonData = data.output.text[0];

							makeResponse(userKey, content, watsonData, function(error, resultObject){
								callback(null, resultObject);
							});
						});
					});
				}else{
					messageModel.getDialogType(userKey, function(error, dialogType){
						//console.log("dialogType : ", dialogType);

						if(dialogType == "writers"){
							watsonData = "webtoons/writers/" + content;
						}else if(dialogType == "titles"){
							watsonData = "webtoons/titles/" + content;
						}

						makeResponse(userKey, content, watsonData, function(error, resultObject){
							callback(null, resultObject);
						});
					});

					//watsonData = "webtoons/writers/" + content;


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

	if(text === undefined){
		var idx = Math.floor(Math.random() * infoMsgArray.length);

		messageObject.text = infoMsgArray[idx];

		keyboardObject.type = "text";

		resultObject.message = messageObject;
		resultObject.keyboard = keyboardObject;

		callback(null, resultObject);
	}else{
		if(text.indexOf("webtoons/") !== -1){
			var textArray = text.split("/");
			var typeName = textArray[1];
			var queryName = textArray[2].trim();

			//console.log(textArray);

			if(typeName == "titles"){
				messageModel.setWatsonFlag(userKey, false);

				messageModel.getDialogType(userKey, function(error, dialogType){
					//console.log("dialogType :", dialogType);
					if(dialogType == "titles"){
						messageModel.setWatsonFlag(userKey, true);
						webtoonModel.loadWebtoonByTitle(queryName, function(error, webtoonObject){
							//console.log(webtoonObject);
							if(isEmpty.isEmpty(webtoonObject)){
								var idx = Math.floor(Math.random() * noTitleMsgArray.length);

								messageObject.text = noTitleMsgArray[idx];

								var buttonObject = new Object({});

								buttonObject.label = "작품 목록 링크";
								buttonObject.url = "http://comic.naver.com/webtoon/creation.nhn";

								messageObject.message_button = buttonObject;

								keyboardObject.type = "text";

								resultObject.message = messageObject;
								resultObject.keyboard = keyboardObject;

								callback(null, resultObject);
							}else{
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
							}
						});
					}else{
						var idx = Math.floor(Math.random() * titleMsgArray.length);

						messageObject.text = titleMsgArray[idx];
						keyboardObject.type = "text";

						resultObject.message = messageObject;
						resultObject.keyboard = keyboardObject;

						messageModel.setDialogType(userKey, "titles");
						messageModel.setWatsonFlag(userKey, false);

						callback(null, resultObject);
					}
				});
			}else if(typeName == "writers"){
				messageModel.getDialogType(userKey, function(error, dialogType){
					if(dialogType == "writers"){
						webtoonModel.loadWebtoonByWriter(queryName, function(error, webtoonObject){
							//console.log(webtoonObject);
							//console.log(isEmpty.isEmpty(webtoonObject));
							if(isEmpty.isEmpty(webtoonObject)){
								var idx = Math.floor(Math.random() * noWriterMsgArray.length);

								messageObject.text = noWriterMsgArray[idx];

								var buttonObject = new Object({});

								buttonObject.label = "작가 목록 링크";
								buttonObject.url = "http://comic.naver.com/webtoon/artist.nhn";

								messageObject.message_button = buttonObject;

								messageModel.setWatsonFlag(userKey, true);
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

								messageModel.setWatsonFlag(userKey, true);
							}

							keyboardObject.type = "text";

							resultObject.message = messageObject;
							resultObject.keyboard = keyboardObject;

							callback(null, resultObject);
						});
					}else{
						var idx = Math.floor(Math.random() * writerMsgArray.length);

						messageObject.text = writerMsgArray[idx];
						keyboardObject.type = "text";

						resultObject.message = messageObject;
						resultObject.keyboard = keyboardObject;

						messageModel.setDialogType(userKey, "writers");
						messageModel.setWatsonFlag(userKey, false);

						callback(null, resultObject);
					}
				});
			}else{
				messageModel.setWatsonFlag(userKey, true);
				messageModel.setDialogType(userKey, "answers");

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
			messageModel.setWatsonFlag(userKey, true);
			messageModel.setDialogType(userKey, "answers");


			messageObject.text = text;

			keyboardObject.type = "text";

			resultObject.message = messageObject;
			resultObject.keyboard = keyboardObject;

			callback(null, resultObject);
		}
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
	messageModel.setDialogType(userKey, "answers");

	return true;
};
