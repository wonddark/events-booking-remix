import { createCookie, createCookieSessionStorage } from "@remix-run/node";

type SessionData = {
  user_id: string;
  access_token: string;
  refresh_token: string;
};

type SessionFlashData = {
  error: string;
  success: string;
  message: string;
  warning: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: createCookie("__session", {
      secrets: ["234abc*"],
      maxAge: 2592000,
    }),
  });

export { getSession, commitSession, destroySession };
