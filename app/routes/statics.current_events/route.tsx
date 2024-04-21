import { json, LoaderFunctionArgs } from "@remix-run/node";
import createDBClient from "~/utils/supabase/server";
import dayjs from "dayjs";

export async function loader({ request }: LoaderFunctionArgs) {
  const dbClient = createDBClient({ request });

  const today = dayjs().format("YYYY-MM-DD HH:mm:ss.sss");

  const { data, error, status } = await dbClient
    .from("events")
    .select("count")
    .lt("start_date", today)
    .gt("end_date", today);

  return json(
    { data, error },
    {
      status,
    }
  );
}
