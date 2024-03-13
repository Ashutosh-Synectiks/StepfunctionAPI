const { EventBridgeClient, PutRuleCommand, PutTargetsCommand } = require("@aws-sdk/client-eventbridge");

const eventBridgeClient = new EventBridgeClient({ region: "us-east-1" });

exports.handler = async (event) => {
  try {
    // Define the input for your Lambda function
    const lambdaInput = {
      pathParameters: {
        employeeId: event.pathParameters.id
      }
    };
    
    // Define the target for your EventBridge rule
    const lambdaTarget = {
      Arn: "arn:aws:lambda:us-east-1:657907747545:function:send-email",
      Id: "TargetLambda",
      Input: lambdaInput
    };

    // Define the rule details
    const ruleDetails = {
      Name: "OneTimeLambdaExecutionRule",
      Description: "Rule to trigger Lambda function for one-time execution",
      ScheduleExpression: "cron(14 16 11 3 ? 2024)" // Execute on March 11, 2024, at 2:45 AM UTC. Adjust for your time zone if needed.
    };

    // Create the EventBridge rule
    const putRuleCommand = new PutRuleCommand({
      Name: ruleDetails.Name,
      Description: ruleDetails.Description,
      ScheduleExpression: ruleDetails.ScheduleExpression
    });
    await eventBridgeClient.send(putRuleCommand);

    // Define the target for the rule
    const putTargetsCommand = new PutTargetsCommand({
      Rule: ruleDetails.Name,
      Targets: [lambdaTarget]
    });
    await eventBridgeClient.send(putTargetsCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "EventBridge rule and target created successfully" })
    };
  } catch (error) {
    console.error("Error creating EventBridge rule and target:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to create EventBridge rule and target" })
    };
  }
};
