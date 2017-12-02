/**
 * Copyright 2017 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var config = require('config.json')('./config/config.json');

var Conversation = require('watson-developer-cloud/conversation/v1'); // watson sdk
// Create a Service Wrapper
var conversation = new Conversation(config.conversation);

var messageModel = require('../../models/message.model');

exports.getConversationResponse = function(userKey, message, context, callback){
  console.log("getConversationResponse");
  var payload = {
    workspace_id: process.env.WORKSPACE_ID,
    context: context || {},
    input: message || {}
  };

  payload = preProcess(payload);

  console.log("payload : ", payload);

  conversation.message(payload, function(error, data) {
    if(error){
      callback(true, error);
    }else{
      callback(null, postProcess(userKey, data));
    }
  });
};

/**
* 사용자의 메세지를 Watson Conversation 서비스에 전달하기 전에 처리할 코드
* @param  {Object} user input
*/
function preProcess(payload, callback){
  console.log("preProcess");
  var inputText = payload.input.text;
  console.log("User Input : " + inputText);
  console.log("Processed Input : " + inputText);
  console.log("--------------------------------------------------");

  return payload;
}

/**
 * Watson Conversation 서비스의 응답을 사용자에게 전달하기 전에 처리할 코드
 * @param  {Object} watson response
 */

function postProcess(userKey, response){
  console.log("postProcess");
  console.log(response);
  console.log("Conversation Output : " + response.output.text);
  console.log("--------------------------------------------------");
  console.log(response.context);

  messageModel.saveDialogContext(userKey, response.context, function(error, result){

  });
  // TODO check error
  // 비동기 방식의 문제인지 위의 함수 안에 넣으면 정상적으로 실행되지 않았다.
  // response가 undefined로 반환된다.
  if(response.context && response.context.action){
    return doAction(response, response.context.action);
  }
  return response;
}

/**
 * 대화 도중 Action을 수행할 필요가 있을 때 처리되는 함수
 * @param  {Object} data : response object
 * @param  {Object} action
 */
function doAction(data, action){
  console.log("Action : " + action.command);
  switch(action.command){
    case "load-homepage":
      return data;
      break;
    case "load-conversation":
      return data;
      break;
    default: console.log("Command not supported.")
  }

  return data;
}
