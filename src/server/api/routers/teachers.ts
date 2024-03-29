import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const teachersRouter = createTRPCRouter({
  searchTeacher: protectedProcedure
    .input(
        z.object({
            content: z.string(),
        })
    )
    .query(({ ctx, input }) => {
    const teachers = ctx.prisma.teacher.findMany({
        where: {
            name: {
                search: input.content
            }
        }
    });
    return teachers;
  }),


});
