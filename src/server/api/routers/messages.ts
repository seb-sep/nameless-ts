import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

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
      .mutation(({ ctx, input }) => {
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
        return msg;
    }),
});
