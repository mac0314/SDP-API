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

var Conversation = require('watson-developer-cloud/conversation/v1'); // watson sdk
var config = require('config.json')('./config/config.json');

// Create a Service Wrapper
var conversation = new Conversation(config.conversation);


exports.getConversationResponse = function(message, context, callback){
  var payload = {
    workspace_id: process.env.WORKSPACE_ID,
    context: context || {},
    input: message || {}
  };

  payload = preProcess(payload);

  conversation.message(payload, function(error, data) {
    if(error){
      callback(true, error);
    }else{
      callback(null, postProcess(data));
    }
  });
};

/**
* 사용자의 메세지를 Watson Conversation 서비스에 전달하기 전에 처리할 코드
* @param  {Object} user input
*/
function preProcess(payload, callback){
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

function postProcess(response){
  console.log("Conversation Output : " + response.output.text);
  console.log("--------------------------------------------------");
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
    case "check-availability":
      return checkAvailability(data, action);
      break;
    case "confirm-reservation":
      return confirmReservation(data, action);
      break;
    default: console.log("Command not supported.")
  }

  return data;
}
