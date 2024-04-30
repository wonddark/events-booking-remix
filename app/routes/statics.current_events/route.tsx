import { json, LoaderFunctionArgs } from "@remix-run/node";
import createDBClient from "~/utils/supabase/server";
import dayjs from "dayjs";

export async function loader({ request }: LoaderFunctionArgs) {
  const dbClient = createDBClient({ request });
  const url = new URL(request.url);
  const referenceDate = url.searchParams.get("reference_date");

  const today = dayjs(referenceDate).format("YYYY-MM-DD HH:mm:ss.sss");

  const { data, error, status } = await dbClient
    .from("events")
    .select("count")
    .lt("start_date", today)
    .gt("end_date", today)
    .single();

  return json(
    { data, error },
    {
      status,
    }
  );
}
