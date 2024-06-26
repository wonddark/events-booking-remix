import { json, LoaderFunctionArgs } from "@remix-run/node";
import createDBClient from "~/utils/supabase/server";
import dayjs from "dayjs";

export async function loader({ request }: LoaderFunctionArgs) {
  const dbClient = createDBClient({ request });
  const url = new URL(request.url);
  const referenceDate = url.searchParams.get("reference_date");

  const { data, error, status } = await dbClient
    .from("events")
    .select("count")
    .gt(
      "published_at",
      dayjs(referenceDate).subtract(72, "hours").format("YYYY-MM-DD HH:mm:ss")
    )
    .single();

  return json(
    { data, error },
    {
      status,
    }
  );
}
