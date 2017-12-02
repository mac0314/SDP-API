var express = require('express');
var router = express.Router();

var PFController = require('../../../controllers/plusfriend.ctrl');

/******************************
 *          route             *
 ******************************/

// https://github.com/plusfriend/auto_reply#51-home-keyboard-api
// Home Keyboard API
router.get('/keyboard', function(req, res, next){
	PFController.loadKeyborad(function(error, resultObject){
		res.json(resultObject);
	});
});

// 메시지 수신 및 자동응답 API
router.post('/message', function(req, res, next){
	var userKey = req.body.user_key;
	var type = req.body.type;
	var content = req.body.content;

	//console.log("userKey : " + userKey);
	//console.log("type : " + type);
	//console.log("content : " + content);

	PFController.dialogize(userKey, type, content, function(error, resultObject){
		res.json(resultObject);
	});
});


// 친구 추가 알림 API
router.post('/friend', function(req, res, next){
	var userKey = req.body.user_key;

	PFController.initializeUser(userKey);

  console.log("userKey : " + userKey);

	PFController.addFriend(userKey, function(error, resultObject){
		res.send("SUCCESS");
	});

});

// 친구 차단 알림 API
router.delete('/friend/:user_key', function(req, res, next){
	var userKey = req.params.user_key;

  console.log("userKey : " + userKey);

	PFController.changeFriendState(userKey, "block", function(error, resultObject){
		res.send("SUCCESS");
	});
});


// 채팅방 나가기
router.delete('/chat_room/:user_key', function(req, res, next){
	var userKey = req.params.user_key;

  console.log("userKey : " + userKey);

	PFController.leaveChatRoom(userKey, function(error, resultObject){
		res.send("SUCCESS");
	});
});



module.exports = router;
