import { createServerClient, parse, serialize } from "@supabase/ssr";
import { Database } from "../../../database.types";
import { getSessionFromCookie } from "~/utils/session";

async function createDBClient({ request }: { request: Request }) {
  const cookies = parse(request.headers.get("Cookie") ?? "");
  const session = await getSessionFromCookie(request);
  const headers = new Headers();

  const access_token = session.get("access_token");
  access_token && headers.set("Authorization", `Bearer ${access_token}`);

  return createServerClient<Database>(
    process.env.DATABASE_URL!,
    process.env.DATABASE_ANON_KEY!,
    {
      cookies: {
        get(key) {
          return cookies[key];
        },
        set(key, value, options) {
          headers.append("Set-Cookie", serialize(key, value, options));
        },
        remove(key, options) {
          headers.append("Set-Cookie", serialize(key, "", options));
        },
      },
      global: {
        headers: Object.fromEntries(headers),
      },
    }
  );
}

export default createDBClient;
