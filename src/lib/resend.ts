// Thin Resend client (plain fetch, no SDK). The API key and sending domain
// come from the Resend Vercel integration (RESEND_API_KEY, RESEND_EMAIL_DOMAIN).
import { site } from "./site";

const API = "https://api.resend.com";
export const SEGMENT_NAME = "Charleston deals";

export const resendReady = () => Boolean(process.env.RESEND_API_KEY && process.env.RESEND_EMAIL_DOMAIN);

/** "Paul Kelton <deals@paulchs.com>" – whatever domain the integration verified. */
export const fromAddress = () => `${site.name} <deals@${process.env.RESEND_EMAIL_DOMAIN}>`;

export class ResendError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function call<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new ResendError(res.status, data?.message || `Resend ${method} ${path} → ${res.status}`);
  return data as T;
}

type Listed<T> = { data: T[] };

let segmentId: string | null = process.env.RESEND_SEGMENT_ID || null;

/** The list's segment: RESEND_SEGMENT_ID if set, otherwise found (or created) by name. */
export async function getSegmentId(): Promise<string> {
  if (segmentId) return segmentId;
  const { data } = await call<Listed<{ id: string; name: string }>>("GET", "/segments");
  const found = data.find((s) => s.name === SEGMENT_NAME);
  segmentId = found ? found.id : (await call<{ id: string }>("POST", "/segments", { name: SEGMENT_NAME })).id;
  return segmentId;
}

/** Adds (or re-adds) someone to the list. They asked, so a past unsubscribe is cleared. */
export async function subscribe(email: string, firstName?: string): Promise<void> {
  const segment = await getSegmentId();
  try {
    await call("POST", "/contacts", {
      email,
      ...(firstName ? { first_name: firstName } : {}),
      unsubscribed: false,
      segments: [{ id: segment }],
    });
  } catch (err) {
    // Already a contact: make sure they're subscribed and in the segment.
    if (!(err instanceof ResendError) || ![400, 409, 422].includes(err.status)) throw err;
    const who = encodeURIComponent(email);
    await call("PATCH", `/contacts/${who}`, { unsubscribed: false, ...(firstName ? { first_name: firstName } : {}) });
    await call("POST", `/contacts/${who}/segments/${segment}`).catch((e) => {
      if (!(e instanceof ResendError) || e.status !== 409) throw e;
    });
  }
}

export async function sendEmail(msg: { to: string; subject: string; html: string; text: string; replyTo?: string }) {
  return call<{ id: string }>("POST", "/emails", {
    from: fromAddress(),
    to: [msg.to],
    subject: msg.subject,
    html: msg.html,
    text: msg.text,
    reply_to: msg.replyTo ?? site.email,
  });
}

type Broadcast = { id: string; name: string | null; status: string };

export async function findBroadcast(name: string): Promise<Broadcast | null> {
  const { data } = await call<Listed<Broadcast>>("GET", "/broadcasts");
  return data.find((b) => b.name === name && b.status !== "draft") ?? null;
}

/** Creates the broadcast and sends it to everyone subscribed in the segment. */
export async function sendBroadcast(msg: { name: string; subject: string; html: string; text: string }) {
  return call<{ id: string }>("POST", "/broadcasts", {
    segment_id: await getSegmentId(),
    from: fromAddress(),
    reply_to: site.email,
    name: msg.name,
    subject: msg.subject,
    html: msg.html,
    text: msg.text,
    send: true,
  });
}
