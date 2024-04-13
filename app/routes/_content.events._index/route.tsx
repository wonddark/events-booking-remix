import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import createDBClient from "~/utils/supabase/server";
import EventItem from "~/components/EventItem";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const query = searchParams.get("query");

  const dbClient = createDBClient();
  const dbInstance = dbClient
    .from("events")
    .select("*, categories(id, name), users(id, name), tickets(count)");

  if (query) {
    dbInstance.textSearch("name_description", `${query}`);
  }

  const { data: events, error, count } = await dbInstance;
  return json({ events, error, count });
}

export default function Events() {
  const { events, count, error } = useLoaderData<typeof loader>();
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 justify-items-center">
      {events?.map((item) => (
        // @ts-expect-error Insufficient type covered by supabase client
        <EventItem item={item} key={item.id} />
      ))}
    </div>
  );
}
