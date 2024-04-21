import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, UIMatch, useActionData, useNavigation } from "@remix-run/react";
import createDBClient from "~/utils/supabase/server";
import { Database } from "../../../database.types";
import Button from "~/components/Button";
import { useRef } from "react";
import { setAuthorization } from "~/utils/session";
import BreadcrumbsPlain from "~/components/BreadcrumbsPlain";
import CategorySelector from "~/components/CategorySelector";
import { commitSession, destroySession } from "~/sessions";

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
    end_date: formData.get("end_date") as string,
    max_attendees: Number(formData.get("max_attendees")),
    start_date: formData.get("start_date") as string,
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
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === "/events/create";
  const inputCategoryRef = useRef<HTMLInputElement>(null);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Form className="flex flex-col items-center gap-3" method="POST">
        <div className="w-full">
          <label htmlFor="event_name" className="text-primary-950">
            Name{" "}
            <input
              type="text"
              className={`rounded-lg py-1.5 px-3.5 w-full`}
              placeholder="Event name"
              id="event_name"
              name="name"
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
            />
          </label>
        </div>

        <input type="text" name="category_id" hidden ref={inputCategoryRef} />

        <Button
          label="Save event"
          type="submit"
          style="primary"
          loading={isSubmitting}
        />
      </Form>

      <CategorySelector inputRef={inputCategoryRef} />
    </div>
  );
}

export default CreateEvent;
