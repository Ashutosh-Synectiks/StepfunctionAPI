'use strict';
var AWS = require('aws-sdk');
AWS.config.setPromisesDependency(require('bluebird'));
var CognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({
    apiVersion: '2019-11-07',
    region: process.env.REGION
});
exports.handler = (event, context, callback) => {
console.log("logchetan",event);
    const confirmationCode = event.code;
    const username = event.username;
    const clientId = event.clientId;
let params = {
        ClientId: clientId,
        ConfirmationCode: confirmationCode,
        Username: username
    };
//Validating the user
let confirmSignUp = CognitoIdentityServiceProvider.confirmSignUp(params).promise();
//Returning the redirect url
confirmSignUp.then(
        (data) => {
            context.succeed({
                location: process.env.POST_REGISTRATION_VERIFICATION_REDIRECT_URL
            });
        }
    ).catch(
        (error) => {
            callback(error.message)
        }
    )
};