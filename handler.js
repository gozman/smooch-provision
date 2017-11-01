'use strict';

const SmoochCore = require('smooch-core');
const jwt = require('jsonwebtoken');

//Initialize smooch-core
var smooch = new SmoochCore({
    keyId: process.env.accountPublicKey,
    secret: process.env.accountSecretKey,
    scope: 'account',
});

function validateAuth(key) {
    if(key == process.env.authCode) {
      return true;
    } else {
      return false;
    }
  }

module.exports.createApp = (event, context, callback) => {
  var response = {
    statusCode: 200,
  };

  if(event.queryStringParameters.name == undefined && event.queryStringParameters.name.length == 0 ) {
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Error - No name was provided in the input"
    });

    callback(null, response);
  } else if(validateAuth(event.queryStringParameters.authCode)) {
    smooch.apps.create({
      name: event.queryStringParameters.name,
      settings: {
        maskCreditCardNumbers: true
      }
    }).then((data) => {
      response.body = {'appId': data.app._id};
      smooch.apps.keys.create(data.app._id, 'Smooch Provisionned').then((authData) => {
        var token = jwt.sign({scope: 'app'}, authData.key.secret, {header: {kid: authData.key._id}});

        response.body.keyId = authData.key._id;
        response.body.secret = authData.key.secret;
        response.body.jwt = token;

        response.body = JSON.stringify(response.body);

        callback(null, response);
      }).catch((reason) => {
        console.log("Key Creation Failed");
        response.statusCode = 500;
        response.body.message = reason;
        response.body = JSON.stringify(response.body);

        callback(null, response);
      });
    }).catch((reason) => {
      console.log("App Creation Failed");
      response.statusCode = 500;
      response.body.message = reason;
      response.body = JSON.stringify(response.body);

      callback(null, response);
    });
  } else {
    response.statusCode = 401;
    response.body = JSON.stringify({
      message: "Please supply a valid authCode"
    });

    callback(null, response);
  }
}
