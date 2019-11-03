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

app.intent('addFood', (conv, {food, expdate}) => {
  var newFood = {name:food, date:expdate}
  refrigerator.push(newFood);
  conv.ask(newFood.name);
  conv.ask('You have this in your fridge: ' + refrigerator);
});

app.intent('removeFood', (conv, {food}) =>{
  if(refrigerator.indexOf(food) > -1){
    refrigerator.splice(refrigerator.indexOf(food), 1);
  }
  conv.ask('you have this in your fridge: ' + refrigerator);
});

app.intent('inMyFridge', (conv, {food}) =>{
  if(refrigerator.indexOf(food) > -1){
      conv.ask('Yes, you do have ' + food + ' in your fridge.');
  }else{
    conv.ask('No, you do not have ' + food + ' in your fridge');
  }
})

// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent('Default Welcome Intent', (conv) => {
    conv.ask(new Suggestion('Add Food', 'Remove Food', 'List Close to Expired food', 'Ask if you have food'));
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
