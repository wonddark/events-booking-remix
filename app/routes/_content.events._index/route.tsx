import { json, LoaderFunctionArgs } from "@remix-run/node";
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
  const userId = searchParams.get("user_id");
  const sortBy = searchParams.get("sort_by");
  const sortOrder = searchParams.get("sort_order");
  const eventStatus = searchParams.get("status");
  const referenceDate = searchParams.get("reference_date");

  const dbClient = createDBClient({ request });
  const authorization = await setAuthorization(request, dbClient);

  const dbInstance = dbClient
    .from("events")
    .select(
      `id, img_url, name, tickets_count, max_attendees, start_date, end_date, categories(id, name),
        published_at, updated_at, profiles(user_id, avatar, display_name)`
    )
    .order(sortBy ?? "published_at", { ascending: sortOrder === "DESC" })
    .range((page - 1) * page_size, page * page_size - 1);

  if (query) {
    dbInstance.textSearch("name_description", `${query}`);
  }

  if (categoryId) {
    dbInstance.eq("category_id", categoryId);
  }

  if (userId) {
    dbInstance.eq("user_id", userId);
  }

  switch (eventStatus) {
    case "ended":
      dbInstance.lt("end_date", referenceDate);
      break;
    case "running":
      dbInstance.lt("start_date", referenceDate).gt("end_date", referenceDate);
      break;
    case "pending":
      dbInstance.gt("start_date", referenceDate);
      break;
    default:
      break;
  }

  const { data: events, error, status } = await dbInstance;

  return json(
    { events: events ?? [], userId: authorization.session.data.user_id, error },
    {
      status,
      headers: { "Set-Cookie": await commitSession(authorization.session) },
    }
  );
}

export default function Events() {
  return <EventsGrid />;
}
