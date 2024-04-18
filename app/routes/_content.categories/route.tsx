import { ActionFunctionArgs } from "@remix-run/node";
import createDBClient from "~/utils/supabase/server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const query = formData.get("category_name") ?? "";
  const dbClient = await createDBClient({ request });

  return dbClient.from("categories").select().ilike("name", `%${query}%`);
}
