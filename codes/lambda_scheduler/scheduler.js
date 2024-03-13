const AWS = require('aws-sdk');
const uuid = require('uuid');
require("dotenv").config();
const scheduler = new AWS.Scheduler();
 
exports.handler = async (event, context) => {

	const requestBody = JSON.parse(event.body);
    console.log(requestBody);
    console.log("timestamp",requestBody.timestamp);

    // let d = new Date(requestBody.timestamp);
    // console.log("d",d)
    // let isoTimestamp = d.toISOString(); // Convert date to ISO 8601 format
    // console.log("isoTimestamp", isoTimestamp);
    // console.log(`ScheduleExpression: at(${requestBody.timestamp})`)
    try {
        const response = await scheduler.createSchedule({
            // ActionAfterCompletion: 'DELETE',
            FlexibleTimeWindow: {
                Mode: 'OFF' // OFF | FLEXIBLE
            },
            ScheduleExpression: `at(${requestBody.timestamp})`, // at(iso), rate(unit), cron(expression)
            ScheduleExpressionTimezone: 'UTC+05:30',
            Target: {
                Arn: `arn:aws:lambda:us-east-1:${process.env.ACC_NO}:function:hrms-dev-inviteUser`|| process.env.TARGET_LAMBDA_ARN,
                Input: JSON.stringify(requestBody),
                RoleArn: `arn:aws:iam::${process.env.ACC_NO}:role/service-role/Amazon_EventBridge_Scheduler_LAMBDA_5d666aa429`|| process.env.SCHEDULE_ROLE_ARN
            },
            Name: uuid.v4()
        }).promise();
       
        console.log(response);
       
        return response;

    } catch (error) {
        console.error(error);
        throw error;
    }
};