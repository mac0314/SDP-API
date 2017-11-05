var express = require('express');
var router = express.Router();

/******************************
 *          route             *
 ******************************/

// https://github.com/plusfriend/auto_reply#51-home-keyboard-api
// Home Keyboard API
router.get('/keyboard', function(req, res, next){
	var resultObject = new Object();

	resultObject.type = "buttons";

	//var buttonArray = ["1", "2", "3"];
	var buttonArray = new Array();

	buttonArray.push("안녕~");
	buttonArray.push("자세히 알려줘");
	buttonArray.push("뭘 도와주는데?");

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

	var resultObject = new Object();
	var messageObject = new Object();
	var text = "";
	var isTherePhoto = false;
	var isThereLink = false;
	var isThereNextMessage = false;

	if(content == "안녕~"){
		text = "안녕하세요. ‘사만다’입니다. 저는 문맥을 기억하는 봇입니다.";
	}else if(content == "뭘 도와주는데?"){
		text = "당신의 관심사에 대한 정보를 알려줄 수 있습니다.";
	}else if(content == "자세히 알려줘"){
		text = "http://13.124.56.85:12000";
	}

	messageObject.text = text;

	if(isTherePhoto){
		var photoObject = new Object();

		var url = "https://photo.src";
		var width = 640;
		var height = 480;

		photoObject.url = url;
		photoObject.width = width;
		photoObject.height = height;
		messageObject.photo =  photoObject;
	}

	resultObject.message = messageObject;

	if(isThereNextMessage){
		var keyboardObject = new Object();

		keyboardObject.type = "buttons";

		var buttonArray = new Array();

  	buttonArray.push("안녕~");
  	buttonArray.push("자세히 알려줘");
  	buttonArray.push("뭘 도와주는데?");

		keyboardObject.buttons = buttonArray;

		resultObject.keyboard = keyboardObject;
	}

	res.json(resultObject);
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
