import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { sendEmail } from "../ses";
import { analyzeText } from "../perspective";

export const messagesRouter = createTRPCRouter({
  getStudentMessages: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.message.findMany({
      where: {
        studentId: ctx.session.user.id
      },
      include: {
        teacher: true
      },
    });
  }),
  
  sendMessage: protectedProcedure
      .input(
          z.object({
              teacherId: z.string().cuid(),
              content: z.string(),
          })
      )
      .mutation(async ({ ctx, input }) => {
        //validate the content for appropriateness
        const isInappropriate = await analyzeText(input.content);
        //store the message in the database
        const msg = ctx.prisma.message.create({
          data: {
            student: {
              connect: {id: ctx.session.user.id}
            },
            teacher: {
              connect: {id: input.teacherId}
            },
            content: input.content,
            flagged: isInappropriate
          }
        });
        //If message is appropriate, fetch the email address of the teacher and send
        if (!isInappropriate) {
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
              code: "NOT_FOUND",
              message: "Email for teacher ID not found",
            });
          }
          await sendEmail(email.email, input.content);
        } else {
          //TODO: increment account strike
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "The content of this message is inappropriate."
          })
        }
        return msg;
    }),
});
