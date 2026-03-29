import { NextResponse } from "next/server";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqs = new SQSClient({
    region: process.env.AWS_REGION,
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, message } = body;

        // Validation
        if (!name || name.trim() === "") {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        if (!email || !email.includes("@")) {
            return NextResponse.json({ error: "Valid email required" }, { status: 400 });
        }

        if (!message || message.trim() === "") {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        if (message.length > 500) {
            return NextResponse.json({ error: "Message too long" }, { status: 400 });
        }

        // TEMP: simulate queue
        console.log("Sending to SQS:");

        try {
            await sqs.send(
                new SendMessageCommand({
                    QueueUrl: process.env.SQS_URL!,
                    MessageBody: JSON.stringify({ name, email, message }),
                })
            );

            console.log("SQS SUCCESS");
        } catch (err) {
            console.error("SQS ERROR:", err);
        }

        return NextResponse.json({ status: "queued" }, { status: 202 });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}