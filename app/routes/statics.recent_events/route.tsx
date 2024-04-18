import { LoaderFunctionArgs } from "@remix-run/node";
import createDBClient from "~/utils/supabase/server";
import dayjs from "dayjs";

export function loader({ request }: LoaderFunctionArgs) {
  const dbClient = createDBClient({ request });

  return dbClient
    .from("events")
    .select("count")
    .gt(
      "published_at",
      dayjs().subtract(72, "hours").format("YYYY-MM-DD HH:mm:ss.sss")
    );
}
