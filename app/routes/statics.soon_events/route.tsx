import { LoaderFunctionArgs } from "@remix-run/node";
import createDBClient from "~/utils/supabase/server";
import dayjs from "dayjs";

export async function loader({ request }: LoaderFunctionArgs) {
  const dbClient = await createDBClient({ request });

  const today = dayjs().format("YYYY-MM-DD HH:mm:ss.sss");

  return dbClient.from("events").select("count").gt("start_date", today);
}
