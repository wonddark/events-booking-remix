import { LoaderFunctionArgs } from "@remix-run/node";
import createDBClient from "~/utils/supabase/server";
import { useLoaderData } from "@remix-run/react";
import NotFoundError from "~/components/NotFoundError";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const dbClient = createDBClient({ request });

  return dbClient
    .from("categories")
    .select()
    .eq("id", `${params.category_id}`)
    .maybeSingle();
}

function CategoryPage() {
  const { data } = useLoaderData<typeof loader>();
  return (
    <section>
      {data ? (
        <h2>{data.name}</h2>
      ) : (
        <div>
          <NotFoundError />
        </div>
      )}
    </section>
  );
}

export default CategoryPage;
