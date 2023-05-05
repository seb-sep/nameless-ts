import { createTRPCRouter } from "~/server/api/trpc";
import { messagesRouter } from "~/server/api/routers/messages";
import { teachersRouter } from "./routers/teachers";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  messages: messagesRouter,
  teachers: teachersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
