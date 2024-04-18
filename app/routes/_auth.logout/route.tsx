import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import createDBClient from "~/utils/supabase/server";
import { commitSession, destroySession } from "~/sessions";
import { getSessionFromCookie } from "~/utils/session";

export async function action({ request }: LoaderFunctionArgs) {
  const session = await getSessionFromCookie(request);
  const dbClient = await createDBClient({ request });

  const { error } = await dbClient.auth.signOut();

  if (error) {
    session.flash("error", "Internal Server Error");
    return json(
      { error },
      { headers: { "Set-Cookie": await commitSession(session) } }
    );
  }

  return redirect("/events", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
