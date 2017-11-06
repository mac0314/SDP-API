var express = require('express');
var router = express.Router();

var messageController = require('../../../controllers/api/message');

/******************************
 *          route             *
 ******************************/

// https://github.com/plusfriend/auto_reply#51-home-keyboard-api
// Home Keyboard API
router.get('/keyboard', function(req, res, next){
	var resultObject = new Object({});

	//resultObject.type = "text";

	resultObject.type = "buttons";

	var buttonArray = new Array();

	buttonArray.push("사만다, 넌 누구니?");
	buttonArray.push("사만다, 넌 어떻게 도와줄 수 있지?");
	buttonArray.push("사만다, 너에 대해 더 알고 싶어");

	resultObject.buttons = buttonArray;

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

	var resultObject = new Object({});

	var textObject = new Object({});
	textObject.text = content;

	messageController.getConversationResponse(textObject, null, function(error, data){
		var messageObject = new Object({});
		var keyboardObject = new Object({});

		var text = "";
		if(error){
			text = "잘 모르겠어요..";
		}else{
			text = data.output.text[0];
		}

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
