import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import createDBClient from "~/utils/supabase/server";
import {
  UIMatch,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import BreadcrumbsLink from "~/components/BreadcrumbsLink";
import BreadcrumbsPlain from "~/components/BreadcrumbsPlain";
import { Database } from "../../../database.types";
import { useEffect } from "react";
import dayjs from "dayjs";
import { commitSession, destroySession } from "~/sessions";
import { setAuthorization } from "~/utils/session";
import EventForm from "~/components/EventForm";

// noinspection JSUnusedGlobalSymbols
export const handle = {
  breadcrumbs: (match: UIMatch, currentPath: boolean) => {
    const name = (match.data as { event: { name: string } }).event?.name;
    if (currentPath) {
      return <BreadcrumbsPlain key={match.id} name={name} />;
    } else {
      return (
        <BreadcrumbsLink key={match.id} name={name} uri={match.pathname} />
      );
    }
  },
};

export async function loader({ params, request }: LoaderFunctionArgs) {
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

  const {
    data: event,
    error,
    status,
    statusText,
  } = await dbClient
    .from("events")
    .select("*, categories(id, name)")
    .eq("id", params.event_id!);

  if (authorization.session.get("user_id") !== event?.[0].user_id) {
    return new Response(null, {
      status: 403,
      headers: { "Set-Cookie": await commitSession(authorization.session) },
    });
  }

  return json(
    { event: event?.[0], error, status, statusText },
    { headers: { "Set-Cookie": await commitSession(authorization.session) } }
  );
}

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

  const payload: Database["public"]["Tables"]["events"]["Insert"] = {
    user_id: "",
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
    status,
  } = await dbClient
    .from("events")
    .update(payload)
    .eq("id", `${params.event_id}`)
    .select("id");

  return json(
    { event, error },
    {
      headers: { "Set-Cookie": await commitSession(authorization.session) },
      status,
    }
  );
}

function EditEvent() {
  const { event } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const navigate = useNavigate();

  useEffect(() => {
    if (actionData?.event && actionData.event.length > 0) {
      navigate(`/events/${event.id}`);
    }
  }, [actionData]);

  return <EventForm event={event} />;
}

export default EditEvent;
