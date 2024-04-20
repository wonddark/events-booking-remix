import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import createDBClient from "~/utils/supabase/server";
import {
  Form,
  UIMatch,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import BreadcrumbsLink from "~/components/BreadcrumbsLink";
import BreadcrumbsPlain from "~/components/BreadcrumbsPlain";
import Button from "~/components/Button";
import { Database } from "../../../database.types";
import CategorySelector from "~/components/CategorySelector";
import { useRef } from "react";
import dayjs from "dayjs";
import Floppy from "~/assets/Floppy";
import Close from "~/assets/Close";
import { commitSession, destroySession } from "~/sessions";
import { setAuthorization } from "~/utils/session";

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

  if (authorization.error) {
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
    .select("*, categories(id, name), tickets(count)")
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

  if (authorization.error) {
    return redirect("/login", {
      headers: { "Set-Cookie": await destroySession(authorization.session) },
      status: 401,
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
  const inputCategoryRef = useRef<HTMLInputElement>(null);

  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === `/events/${event?.id}/edit`;

  const navigate = useNavigate();
  if (actionData?.event && actionData.event.length > 0) {
    navigate(`/events/${event.id}`);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Form
        className="flex flex-col items-center gap-3"
        method="POST"
        id="event-edit-form"
      >
        <div className="w-full">
          <label htmlFor="event_name" className="text-primary-950">
            Name{" "}
            <input
              type="text"
              className={`rounded-lg py-1.5 px-3.5 w-full`}
              placeholder="Event name"
              id="event_name"
              name="name"
              defaultValue={event.name}
            />
          </label>
        </div>
        <div className="w-full">
          <label htmlFor="event_description" className="text-primary-950">
            Description{" "}
            <textarea
              className={`rounded-lg py-1.5 px-3.5 h-40 w-full`}
              placeholder="Write here a meaninful description for your new event..."
              id="event_description"
              name="description"
              defaultValue={event.description}
            />
          </label>
        </div>
        <div className="w-full">
          <label htmlFor="event_attendees" className="text-primary-950">
            Max attendees{" "}
            <input
              type="number"
              min={50}
              max={1_000_000}
              className={`rounded-lg py-1.5 px-3.5 w-full`}
              placeholder="50"
              id="event_attendees"
              name="max_attendees"
              defaultValue={event.max_attendees}
            />
          </label>
        </div>
        <div className="w-full">
          <label htmlFor="event_img" className="text-primary-950">
            Image url{" "}
            <input
              type="url"
              className={`rounded-lg py-1.5 px-3.5 w-full`}
              placeholder="https://someservice.com/image.jpg"
              id="event_img"
              name="img_url"
              defaultValue={event.img_url}
            />
          </label>
        </div>
        <div className="w-full">
          <label htmlFor="event_start_date" className="text-primary-950">
            Starting at{" "}
            <input
              type="datetime-local"
              className={`rounded-lg py-1.5 px-3.5 w-full`}
              id="event_start_date"
              name="start_date"
              defaultValue={dayjs(event.start_date).format("YYYY-MM-DD HH:mm")}
            />
          </label>
        </div>
        <div className="w-full">
          <label htmlFor="event_end_date" className="text-primary-950">
            Ending at{" "}
            <input
              type="datetime-local"
              className={`rounded-lg py-1.5 px-3.5 w-full`}
              id="event_end_date"
              name="end_date"
              defaultValue={dayjs(event.end_date).format("YYYY-MM-DD HH:mm")}
            />
          </label>
        </div>

        <input
          type="text"
          name="category_id"
          hidden
          ref={inputCategoryRef}
          defaultValue={event.category_id}
        />
      </Form>

      <div>
        <CategorySelector
          inputRef={inputCategoryRef}
          defaultValue={event.categories.name}
        />
        <div className="text-right mt-3">
          <Button
            label="Cancel"
            type="button"
            style="light"
            className="mr-2"
            preIcon={<Close />}
          />
          <Button
            label="Save event"
            type="submit"
            style="secondary"
            loading={isSubmitting}
            form="event-edit-form"
            preIcon={<Floppy />}
          />
        </div>
      </div>
    </div>
  );
}

export default EditEvent;
