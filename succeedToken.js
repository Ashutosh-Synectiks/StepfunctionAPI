const AWS = require('aws-sdk');
const { Client } = require('pg');
module.exports.handler = async (event) => {
    const executionarn = event.queryStringParameters.executionarn;
    const id = event.queryStringParameters.id;

    const client = new Client({
        host: "",
        user: "",
        port: 5431,
        password: "",
        database: ""
    });
    AWS.config.update({
        accessKeyId: process.env.aws_access_key_id,
        secretAccessKey: process.env.aws_secret_access_key,
        region: 'us-east-1',
    });

    await client.connect();

    const query = await client.query(`SELECT tasktoken FROM token WHERE executionarn = $1 AND id = $2`, [executionarn, id])

    const token = query.rows;
    console.log(token);

    const stepfunctions = new AWS.StepFunctions();


    const paramsForSendSuccessTask = {
        output: '1',
        taskToken: token[0].tasktoken // Extract the tasktoken from the array
    };

    stepfunctions.sendTaskSuccess(paramsForSendSuccessTask, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            console.log(data);
        };
    });

};


