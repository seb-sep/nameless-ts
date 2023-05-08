import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import type { SendEmailCommandInput } from "@aws-sdk/client-ses";



const sendEmail = async (recipient: string, content: string) => {
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
    console.log("Sending email");
    const command = new SendEmailCommand(params);
    const result = client.send(command);
    console.log("Sent email");
    return result;
  } catch (error) {
    console.error(error);
    return {"Error": error};
  }
};


export const messagesRouter = createTRPCRouter({
  getStudentMessages: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.message.findMany({
      where: {
        studentId: ctx.session.user.id
      }
    });
  }),
  
  //TODO: sendMessage currently ONLY adds the message to the database, add content filtering and SendGrid later
  sendMessage: protectedProcedure
      .input(
          z.object({
              teacherId: z.string().cuid(),
              content: z.string(),
          })
      )
      .mutation(async ({ ctx, input }) => {
        //store the message in the database
        const msg = ctx.prisma.message.create({
          data: {
            student: {
              connect: {id: ctx.session.user.id}
            },
            teacher: {
              connect: {id: input.teacherId}
            },
            content: input.content
          }
        });
        //Fetch the email address of the teacher
        const email = await ctx.prisma.teacher.findUnique({
          where: {
            id: input.teacherId
          },
          select: {
            email: true,
          },
        });
        if (!email) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Email for teacher ID not found",
          });
        }
        await sendEmail(email.email, input.content);
        return msg;
    }),
});
