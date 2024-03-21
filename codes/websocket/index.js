const AWS = require('aws-sdk')

const ENDPOINT = 'o6dpmowqve.execute-api.us-east-1.amazonaws.com/production/'
const client = new AWS.ApiGatewayManagementApi({ endpoint: ENDPOINT })

const names = {};

const sendToOne = async (id, body) => {
  try{
    await client.postToConnection({
      'ConnectionId' : id,
      'Data': Buffer.from(JSON.stringify(body))
      }).promise();
  }
  catch(err){
    console.log(err);
    return err;
  }
};

const sendToAll = async (ids, body) => {
  const all = ids.map(i => sendToOne (i, body));
  return Promise.all(all);
};

exports.handler = async (event) => {
  console.log("event", event);

  if(event.requestContext){
    
    const connectionId = event.requestContext.connectionId;
    const routeKey = event.requestContext.routeKey;
    let body = {}
    try {
      if(event.body){
        body = JSON.parse(event.body)
      }
    } catch (error) {
      console.log(error)
    }
    
    switch (routeKey) {
    case '$connect':
      
      break;
    case '$disconnect':
      await sendToAll(Object.keys(names), {systemMessage: `${names[connectionId]} has left the chat`})
      delete names[connectionId];
      await sendToAll(Object.keys(names), {members: Object.values(names)})

      break;
    case '$default':
      
      break;
    case 'setName':
      names[connectionId] = body.name;
      await sendToAll(Object.keys(names), {members: Object.values(names)})
      await sendToAll(Object.keys(names), {systemMessage: `${names[connectionId]} has joined the chat`})
      break;
    case'sendPublic':
      await sendToAll(Object.keys(names), {publicMessage: `${names[connectionId]} : ${body.message}`})
      break;
    case 'sendPrivate':
      const to = Object.keys(names).find(key => names[key] === body.to);
      await sendToOne(to, {privateMessage : `${names[connectionId]}: ${body.message}`} );
      break;
    default:
    
    }
  }
  return{"statusCode": 200}
};