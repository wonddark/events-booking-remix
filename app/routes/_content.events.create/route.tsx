import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  Form,
  UIMatch,
  useActionData,
  useFetcher,
  useNavigation,
} from "@remix-run/react";
import createDBClient from "~/utils/supabase/server";
import { Database } from "../../../database.types";
import Button from "~/components/Button";
import { action as categoriesAction } from "../_content.categories/route";
import { useRef } from "react";
import { getSessionFromCookie } from "~/utils/session";
import BreadcrumbsPlain from "~/components/BreadcrumbsPlain";

// noinspection JSUnusedGlobalSymbols
export const handle = {
  breadcrumbs: (match: UIMatch) => (
    <BreadcrumbsPlain key={match.id} name="Create new" />
  ),
};

// noinspection JSUnusedGlobalSymbols
export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSessionFromCookie(request);
  const userId = session.get("user_id");

  if (userId) {
    return json({ userId });
  }
  return redirect("/login?redirect_uri=/events/create");
}

export async function action({ request }: ActionFunctionArgs) {
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

  const dbClient = await createDBClient({ request });

  const { data: event, error } = await dbClient
    .from("events")
    .insert([payload])
    .select("id");

  if (error) {
    return json({ error });
  }

  return redirect(`/events/${event?.[0].id}`);
}

function CreateEvent() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === "/events/create";

  const inputCategoryRef = useRef<HTMLInputElement>(null);
  const selectCategoryRef = useRef<HTMLInputElement>(null);

  const categories = useFetcher<typeof categoriesAction>();

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

      <categories.Form action="/categories" method="POST">
        <div className="w-full">
          <label htmlFor="event_category" className="text-primary-950">
            Category{" "}
            <input
              type="text"
              name="category_name"
              id="event_category"
              placeholder="Category name"
              required={false}
              className={`rounded-lg py-1.5 px-3.5 w-full`}
              ref={selectCategoryRef}
              onChange={(event) => categories.submit(event.target.form)}
            />
          </label>
          <div className="mt-1 rounded-lg border shadow-md z-10 w-full">
            <ul className="flex flex-col p-0 m-0">
              {categories.data?.data && categories.data.data.length > 0 ? (
                <>
                  {categories.data?.data?.map((category) => (
                    <li
                      key={category.id}
                      className="rounded-lg py-1.5 px-3.5 w-full hover:bg-gray-50"
                    >
                      <button
                        type="button"
                        className="w-full text-left"
                        onClick={() => {
                          selectCategoryRef.current &&
                            (selectCategoryRef.current.value = category.name);
                          inputCategoryRef.current &&
                            (inputCategoryRef.current.value = category.id);
                        }}
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </>
              ) : (
                <li className="rounded-lg py-1.5 px-3.5 w-full hover:bg-gray-50 cursor-pointer">
                  <span>Nothing found</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </categories.Form>
    </div>
  );
}

export default CreateEvent;
