import { destroySession, getSession } from "~/sessions";
import { SupabaseClient } from "@supabase/supabase-js";

function getSessionFromCookie(request: Request) {
  return getSession(request.headers.get("Cookie"));
}

async function setAuthorization(request: Request, dbClient: SupabaseClient) {
  const session = await getSessionFromCookie(request);

  let error = null;

  if (session.get("access_token") && session.get("refresh_token")) {
    const { data, error: sessionError } = await dbClient.auth.setSession({
      access_token: session.get("access_token")!,
      refresh_token: session.get("refresh_token")!,
    });

    error = sessionError;

    if (data.session) {
      dbClient.functions.setAuth(data.session?.access_token);
      session.set("user_id", data.session.user.id);
      session.set("access_token", data.session.access_token);
      session.set("refresh_token", data.session.refresh_token);
    }
  } else {
    await destroySession(session);
  }

  return { session, error };
}

export { getSessionFromCookie, setAuthorization };
