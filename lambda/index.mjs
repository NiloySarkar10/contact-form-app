import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({ region: "ap-south-1" });

export const handler = async (event) => {
  console.log("Event:", JSON.stringify(event));

  for (const record of event.Records) {
    const body = JSON.parse(record.body);
    const { name, message } = body;

    const sesVerifiedEmail = process.env.SES_VERIFIED_EMAIL;

    await ses.send(
      new SendEmailCommand({
        Source: sesVerifiedEmail,
        Destination: {
          ToAddresses: [sesVerifiedEmail],
        },
        Message: {
          Subject: { Data: "Thanks for contacting us!" },
          Body: {
            Text: {
              Data: `Hi ${name}, we received your message: ${message}`,
            },
          },
        },
      })
    );
  }
};