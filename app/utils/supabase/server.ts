import { createServerClient, parse, serialize } from "@supabase/ssr";
import { Database } from "../../../database.types";

function createDBClient({ request }: { request: Request }) {
  const cookies = parse(request.headers.get("Cookie") ?? "");
  const headers = new Headers();

  return createServerClient<Database>(
    process.env.DATABASE_URL!,
    process.env.DATABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
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
    }
  );
}

export default createDBClient;
