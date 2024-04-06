import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import createDBClient from "~/utils/supabase/server";
import EventItem from "~/components/EventItem";

export async function loader(args: LoaderFunctionArgs) {
  const dbClient = createDBClient();

  const {
    data: events,
    error,
    count,
  } = await dbClient
    .from("events")
    .select("*, categories(id, name), users(id, name), tickets(count)");
  return json({ events, error, count });
}

export default function Events() {
  const { events, count, error } = useLoaderData<typeof loader>();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-screen-xl mx-auto">
      {events?.map((item) => (
        // @ts-expect-error Insufficient type covered by supabase client
        <EventItem item={item} key={item.id} />
      ))}
    </div>
  );
}
