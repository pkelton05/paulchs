// Runs only for on-demand routes (the members page and the API endpoints).
// Prerendered pages skip it, so the static site never touches Clerk.
import { defineMiddleware } from "astro:middleware";
import { clerkMiddleware } from "@clerk/astro/server";
import { clerkReady } from "./lib/clerk";

let clerk: ReturnType<typeof clerkMiddleware> | null = null;

export const onRequest = defineMiddleware((context, next) => {
  if (context.isPrerendered || !clerkReady()) return next();
  clerk ??= clerkMiddleware();
  return clerk(context, next);
});
