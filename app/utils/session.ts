import { getSession } from "~/sessions";

function getSessionFromCookie(request: Request) {
  return getSession(request.headers.get("Cookie"));
}

export { getSessionFromCookie };
