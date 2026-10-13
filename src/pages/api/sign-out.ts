// Signs a member out of the deals page by ending their Clerk session.
import type { APIRoute } from "astro";
import { clerkClient } from "@clerk/astro/server";
import { clerkReady } from "../../lib/clerk";

export const prerender = false;

export const POST: APIRoute = async (context) => {
  if (clerkReady() && context.locals.auth) {
    const { sessionId } = context.locals.auth();
    if (sessionId) {
      try {
        await clerkClient(context).sessions.revokeSession(sessionId);
      } catch (err) {
        console.error("sign-out: revoke failed", err instanceof Error ? err.message : err);
      }
    }
  }
  return Response.redirect(new URL("/deals?signed_out=1", context.request.url), 303);
};

export const ALL: APIRoute = ({ request }) => Response.redirect(new URL("/deals", request.url), 303);
