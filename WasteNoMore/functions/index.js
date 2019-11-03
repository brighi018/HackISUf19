// Copyright 2018, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// Import the Dialogflow module and response creation dependencies from the
// Actions on Google client library.
const {
  dialogflow,
  Suggestions,
  BasicCard,
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

var refrigerator = [];

app.intent('addFood', (conv, {food, date, quantity}) => {
  var newFood = {name:food, expiration:date, qty:quantity};
  // console.log(expdate);
  // console.log();
  refrigerator.push(newFood);
  // conv.ask(newFood.name);
   //conv.ask(newFood.expiration);
   //conv.ask(newFood.qty);
//  console.log('bailey sucks\n');
var line = [];
for(var i in refrigerator){
  line.push(refrigerator[i].name);
}

conv.ask('You have this in your fridge: ' + line);


});

app.intent('removeFood', (conv, {food}) =>{
  var index =-1;
  for(var i = 0; i < refrigerator.length; i++){
    if(refrigerator[i].name == (food)){
      index = i;
      break;
    }
  }
  if(index > -1){
    refrigerator.splice(index, 1);
  }
  var line = [];
  for(var i in refrigerator){
    line.push(refrigerator[i].name);
  }

  conv.ask('You have this in your fridge: ' + line);;
});


app.intent('inMyFridge', (conv, {food}) =>{
  var index =-1;
  for(var i = 0; i < refrigerator.length; i++){
    if(refrigerator[i].name == (food)){
      index = i;
      break;
    }
  }
  if(index > -1){
      conv.ask('Yes, you do have ' + food + ' in your fridge.');
  }else{
    conv.ask('No, you do not have ' + food + ' in your fridge');
  }
});

app.intent('listExpiring', (conv) => {
  var list = [];
  for (var item in refrigerator) {
    if (item['expdate'] <= new Date() + 7) {
      list.push(item);
    }
  }
  conv.ask('Here are items expiring soon: ' + list);
});

// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent('Default Welcome Intent', (conv) => {
    conv.ask(new Suggestion('Add Eggs', 'Remove Eggs', 'List close to expired food', 'Do I have eggs?'));
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
