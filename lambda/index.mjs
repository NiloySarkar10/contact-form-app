import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({ region: "ap-south-1" });

export const handler = async (event) => {
  console.log("Event:", JSON.stringify(event));

  for (const record of event.Records) {
    const body = JSON.parse(record.body);
    const { name, message } = body;

    await ses.send(
      new SendEmailCommand({
        Source: "YOUR_VERIFIED_EMAIL@gmail.com",
        Destination: {
          ToAddresses: ["YOUR_VERIFIED_EMAIL@gmail.com"],
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