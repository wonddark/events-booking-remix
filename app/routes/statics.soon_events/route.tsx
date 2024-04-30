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
    .gt("start_date", dayjs(referenceDate).format("YYYY-MM-DD HH:mm:ss.sss"))
    .single();

  return json({ data, error }, { status });
}
