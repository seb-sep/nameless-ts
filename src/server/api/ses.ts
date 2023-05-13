import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import type { SendEmailCommandInput } from "@aws-sdk/client-ses";
import { TRPCError } from "@trpc/server";

/**
 * Send an email to a teacher through AWS SES with the given content.
 * @param recipient the email of the teacher to send to
 * @param content the content of the email
 */
export const sendEmail = async (recipient: string, content: string) => {
  if (!process.env.EMAIL_FROM || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_KEY_ID) {
    return {"Error": "Environment variables not set."};
  }
  const client = new SESClient({
    region: process.env.AWS_SERVER_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_KEY_ID
    }
  });

  const params: SendEmailCommandInput = {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [recipient], 
    },
    Message: {
      Subject: {
        Data: "Student Feedback from Nameless NEU",
      },
      Body: {
        Text: {
          Data: content,
        },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    const result = client.send(command);
    return result;
  } catch (error) {
    throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "The email failed to send."
    })
  }
};


