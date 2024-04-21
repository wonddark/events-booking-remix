import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import createDBClient from "~/utils/supabase/server";
import { setAuthorization } from "~/utils/session";
import { commitSession, destroySession } from "~/sessions";

export async function action({ request, params }: ActionFunctionArgs) {
  const dbClient = createDBClient({ request });
  const authorization = await setAuthorization(request, dbClient);

  if (
    authorization.error ||
    Object.keys(authorization.session.data).length === 0
  ) {
    return redirect("/login", {
      headers: { "Set-Cookie": await destroySession(authorization.session) },
    });
  }

  const { data } = await dbClient
    .from("events")
    .select("user_id")
    .eq("id", `${params.event_id}`);

  if (!data) {
    return new Response("Event not found", {
      status: 404,
      headers: { "Set-Cookie": await commitSession(authorization.session) },
    });
  } else if (data[0].user_id !== authorization.session.get("user_id")) {
    return new Response("Not authorized to remove this object", {
      status: 403,
      headers: { "Set-Cookie": await commitSession(authorization.session) },
    });
  }

  const { error, status } = await dbClient
    .from("events")
    .delete()
    .eq("id", `${params.event_id}`);

  return json(
    { error, status },
    { headers: { "Set-Cookie": await commitSession(authorization.session) } }
  );
}
