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


});
