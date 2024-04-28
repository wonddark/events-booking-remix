import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import createDBClient from "~/utils/supabase/server";
import * as process from "node:process";
import { setAuthorization } from "~/utils/session";
import { commitSession } from "~/sessions";
import EventsGrid from "~/components/EventsGrid";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const query = searchParams.get("query");
  const categoryId = searchParams.get("category_id");
  const page = Number(searchParams.get("page") ?? 1);
  const page_size = Number(
    searchParams.get("page_size") ?? process.env.DEFAULT_PAGE_SIZE
  );

  const dbClient = createDBClient({ request });
  const authorization = await setAuthorization(request, dbClient);

  const dbInstance = dbClient
    .from("events")
    .select(
      `id, img_url, name, tickets_count, max_attendees, start_date, end_date, categories(id, name),
        profiles(user_id, avatar, display_name)`
    )
    .order("published_at", { ascending: false })
    .range((page - 1) * page_size, page * page_size - 1);

  if (query) {
    dbInstance.textSearch("name_description", `${query}`);
  }

  if (categoryId) {
    dbInstance.eq("category_id", categoryId);
  }

  const { data: events, error, count } = await dbInstance;
  if (error) {
    return json(
      {
        events: [],
        count: 0,
        userId: authorization.session.data.user_id,
      },
      {
        status: 500,
        headers: { "Set-Cookie": await commitSession(authorization.session) },
      }
    );
  }
  return json(
    { events, count, userId: authorization.session.data.user_id },
    { headers: { "Set-Cookie": await commitSession(authorization.session) } }
  );
}

export default function Events() {
  const { events, userId } = useLoaderData<typeof loader>();

  return <EventsGrid events={events} userId={userId} />;
}
