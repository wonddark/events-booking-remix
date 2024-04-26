import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { UIMatch } from "@remix-run/react";
import createDBClient from "~/utils/supabase/server";
import { Database } from "../../../database.types";
import { setAuthorization } from "~/utils/session";
import BreadcrumbsPlain from "~/components/BreadcrumbsPlain";
import { commitSession, destroySession } from "~/sessions";
import EventForm from "~/components/EventForm";
import dayjs from "dayjs";

// noinspection JSUnusedGlobalSymbols
export const handle = {
  breadcrumbs: (match: UIMatch) => (
    <BreadcrumbsPlain key={match.id} name="Create new" />
  ),
};

// noinspection JSUnusedGlobalSymbols
export async function loader({ request }: LoaderFunctionArgs) {
  const dbClient = createDBClient({ request });
  const authorization = await setAuthorization(request, dbClient);

  if (authorization.session.get("user_id")) {
    return json(
      { userId: authorization.session.get("user_id") },
      { headers: { "Set-Cookie": await commitSession(authorization.session) } }
    );
  }

  return redirect("/login?redirect_uri=/events/create", {
    headers: { "Set-Cookie": await destroySession(authorization.session) },
  });
}

export async function action({ request }: ActionFunctionArgs) {
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

  const formData = await request.formData();

  const payload: Database["public"]["Tables"]["events"]["Insert"] = {
    category_id: formData.get("category_id") as string,
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    img_url: formData.get("img_url") as string,
    end_date: dayjs(formData.get("end_date") as string).format(
      "YYYY-MM-DD HH:mm:ss.sss"
    ),
    max_attendees: Number(formData.get("max_attendees")),
    start_date: dayjs(formData.get("start_date") as string).format(
      "YYYY-MM-DD HH:mm:ss.sss"
    ),
  };

  const {
    data: event,
    error,
    statusText,
  } = await dbClient.from("events").insert([payload]).select("id");

  if (error) {
    authorization.session.flash("error", statusText);
    return json(
      { error },
      { headers: { "Set-Cookie": await commitSession(authorization.session) } }
    );
  }

  authorization.session.flash("success", "201");

  return redirect(`/events/${event?.[0].id}`, {
    headers: { "Set-Cookie": await commitSession(authorization.session) },
  });
}

function CreateEvent() {
  return <EventForm event={null} />;
}

export default CreateEvent;
