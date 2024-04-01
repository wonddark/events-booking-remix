import { createClient } from "@supabase/supabase-js";
import { Database } from "../../../database.types";

function createDBClient() {
  return createClient<Database>(
    process.env.DATABASE_URL!,
    process.env.DATABASE_ADMIN_KEY!
  );
}

export default createDBClient;
