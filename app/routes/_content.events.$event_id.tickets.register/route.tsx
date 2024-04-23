import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import createDBClient from "~/utils/supabase/server";
import { setAuthorization } from "~/utils/session";
import { commitSession, destroySession } from "~/sessions";
import { Database } from "../../../database.types";

export async function action({ request, params }: ActionFunctionArgs) {
  const dbClient = createDBClient({ request });
  const authorization = await setAuthorization(request, dbClient);

  if (
    authorization.error ||
    Object.keys(authorization.session.data).length === 0
  ) {
    return redirect("/login", {
      headers: { "Set-Cookie": await destroySession(authorization.session) },
      status: 401,
    });
  }

  const formData = await request.formData();
  const payload: Database["public"]["Tables"]["tickets"]["Insert"][] = Array(
    Number(formData.get("tickets_count") as string)
  ).fill({
    event_id: params.event_id ?? "",
    user_id: authorization.session.data.user_id,
  });

  const { error, status } = await dbClient.from("tickets").insert(payload);

  return json(
    { error },
    {
      headers: { "Set-Cookie": await commitSession(authorization.session) },
      status,
    }
  );
}
