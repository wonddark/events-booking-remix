import { ActionFunctionArgs, redirect } from "@remix-run/node";
import createDBClient from "~/utils/supabase/server";
import { getSessionFromCookie } from "~/utils/session";

export async function action({ request, params }: ActionFunctionArgs) {
  const session = await getSessionFromCookie(request);

  if (!session.has("user_id")) {
    return redirect("/login");
  }

  const dbClient = await createDBClient({ request });

  const { data } = await dbClient
    .from("events")
    .select("user_id")
    .eq("id", `${params.event_id}`);

  if (!data) {
    return new Response("Event not found", { status: 404 });
  } else if (data[0].user_id !== session.get("user_id")) {
    return new Response("Not authorized to remove this object", {
      status: 403,
    });
  }

  return dbClient.from("events").delete().eq("id", `${params.event_id}`);
}
