const { SES, SendEmailCommand } = require("@aws-sdk/client-ses");

exports.handler = async (event, context) => {
    try {
        if (event.triggerSource === "CustomMessage_SignUp") {
            console.log(event);
            const { codeParameter } = event.request;
            const { userName, region } = event;
            const { clientId } = event.callerContext;
            const { email } = event.request.userAttributes;
            const url = 'https://kt97j9inub.execute-api.us-east-1.amazonaws.com/dev/redirect';
            const link = `<a href="${url}?code=${codeParameter}&username=${userName}&clientId=${clientId}&region=${region}&email=${email}" target="_blank">Click the link to verify</a>`;
            event.response.emailSubject = "Your verification link";
            event.response.emailMessage = `Thank you for signing up. Click ${link} to verify your email.`;
            
            // Send email using SES
            await sendEmail(email, event.response.emailSubject, event.response.emailMessage);
        }
        return event;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

async function sendEmail(email, subject, message) {
    const ses = new SES({ region: 'us-east-1' }); // Change the region as needed

    const params = {
        Destination: {
            ToAddresses: [email]
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: message
                }
            },
            Subject: {
                Charset: "UTF-8",
                Data: subject
            }
        },
        Source: "siddhesh.deshmukh@synectiks.com" // Change to your verified SES email address
    };

    try {
        await ses.send(new SendEmailCommand(params));
        console.log("Email sent successfully.");
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}
