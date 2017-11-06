var express = require('express');
var router = express.Router();

var messageController = require('../../../controllers/api/message');

/******************************
 *          route             *
 ******************************/

// https://github.com/plusfriend/auto_reply#51-home-keyboard-api
// Home Keyboard API
router.get('/keyboard', function(req, res, next){
	var resultObject = new Object();

	/*
	resultObject.type = "buttons";

	//var buttonArray = ["1", "2", "3"];
	var buttonArray = new Array();

	buttonArray.push("안녕~");
	buttonArray.push("자세히 알려줘");
	buttonArray.push("뭘 도와주는데?");

	resultObject.buttons = buttonArray;
	*/

	res.json(resultObject);
});

// 메시지 수신 및 자동응답 API
router.post('/message', function(req, res, next){
	var user_key = req.body.user_key;
	var type = req.body.type;
	var content = req.body.content;

	//console.log("user_key : " + user_key);
	//console.log("type : " + type);
	//console.log("content : " + content);

	var resultObject = new Object();

	var textObject = new Object({});
	textObject.text = content;

	messageController.getConversationResponse(textObject, null, function(error, data){
		var messageObject = new Object();

		messageObject.text = data.output.text;

		resultObject.message = messageObject;

		res.json(resultObject);
	});
});


// 친구 추가 알림 API
router.post('/friend', function(req, res, next){
	var user_key = req.body.user_key;

  console.log("user_key : " + user_key);

	res.send("SUCCESS");
});

// 친구 차단 알림 API
router.delete('/friend/:user_key', function(req, res, next){
	var user_key = req.params.user_key;

  console.log("user_key : " + user_key);

	res.send("SUCCESS");
});


// 채팅방 나가기
router.delete('/chat_room/:user_key', function(req, res, next){
	var user_key = req.params.user_key;

  console.log("user_key : " + user_key);

	res.send("SUCCESS");
});



module.exports = router;
