const AWS = require('aws-sdk');

module.exports.handler = async (event) => {

    const stepfunctions = new AWS.StepFunctions();
    if (event.additionalParam == true) {
        var paramsForSendSuccessTask = {
            output: '1',
            taskToken: event.token /* required */
        };

        stepfunctions.sendTaskSuccess(paramsForSendSuccessTask, function (err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else {
                console.log(data);
            };
        });
    }


};

