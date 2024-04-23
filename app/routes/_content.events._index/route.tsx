import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import createDBClient from "~/utils/supabase/server";
import EventItem from "~/components/EventItem";
import * as process from "node:process";
import { setAuthorization } from "~/utils/session";
import { commitSession } from "~/sessions";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const query = searchParams.get("query");
  const page = Number(searchParams.get("page") ?? 1);
  const page_size = Number(
    searchParams.get("page_size") ?? process.env.DEFAULT_PAGE_SIZE
  );

  const dbClient = createDBClient({ request });
  const authorization = await setAuthorization(request, dbClient);

  const dbInstance = dbClient
    .from("events")
    .select("*, categories(id, name), tickets(count), event_owner(*)")
    .order("published_at", { ascending: false })
    .range((page - 1) * page_size, page * page_size - 1);

  if (query) {
    dbInstance.textSearch("name_description", `${query}`);
  }

  const { data: events, error, count } = await dbInstance;
  if (error) {
    console.log(error);
    return json(
      {
        events: [],
        count: 0,
        authUser: Boolean(authorization.session.data.user_id),
      },
      {
        status: 500,
        headers: { "Set-Cookie": await commitSession(authorization.session) },
      }
    );
  }
  return json(
    { events, count, authUser: Boolean(authorization.session.data.user_id) },
    { headers: { "Set-Cookie": await commitSession(authorization.session) } }
  );
}

export default function Events() {
  const { events, authUser } = useLoaderData<typeof loader>();

  return (
    <>
      {events.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 justify-items-center">
          {events?.map((item) => (
            // @ts-expect-error Insufficient type covered by supabase client
            <EventItem item={item} key={item.id} auth={authUser} />
          ))}
        </div>
      ) : null}
    </>
  );
}
