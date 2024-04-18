import { createCookie, createCookieSessionStorage } from "@remix-run/node";

type SessionData = {
  user_id: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: createCookie("__session", { secrets: ["234abc*"] }),
  });

export { getSession, commitSession, destroySession };
