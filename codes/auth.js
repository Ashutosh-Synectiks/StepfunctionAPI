const { CognitoIdentityProvider } = require('@aws-sdk/client-cognito-identity-provider');
 
exports.handler = async (event, context, callback) => {
    try {
 
        const cognito = new CognitoIdentityProvider({ region: 'us-east-1' });
 
        const token = event.headers.Authorization.split(' ')[1];
       
        const decodedToken = await cognito.getUser({ AccessToken: token });
 
        const username = decodedToken.Username;
        const userAttributes = decodedToken.UserAttributes.reduce((attributes, attr) => {
            attributes[attr.Name] = attr.Value;
            return attributes;
        }, {});
 
        // Perform authorization logic based on user details
        // For example, you can check user roles or permissions
        if (userAttributes['custom:role'] === 'admin') {
            // Authorized access for admin
            return {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({ message: 'Authorized access for admin', userId: username }),
            };
        } else {
            // Unauthorized access for non-admin
            return {
                statusCode: 403,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({ message: 'Unauthorized access' }),
            };
        }
    } catch (error) {
        // If verification fails or any other error occurs, return an error response
        console.error('Authorization failed:', error);
        return {
            statusCode: 401,
            headers: {
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ message: 'Authorization failed' }),
        };
    }
};
 
// module.exports = {
//     customAuthorizer
// }