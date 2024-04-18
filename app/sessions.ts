import { createCookie, createCookieSessionStorage } from "@remix-run/node";

type SessionData = {
  user_id: string;
  access_token: string;
  refresh_token: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: createCookie("__session", { secrets: ["234abc*"] }),
  });

export { getSession, commitSession, destroySession };
