import { json, LoaderFunctionArgs } from "@remix-run/node";
import createDBClient from "~/utils/supabase/server";
import { setAuthorization } from "~/utils/session";
import { commitSession } from "~/sessions";
import process from "node:process";
import { Link, useLoaderData } from "@remix-run/react";
import { Badge } from "antd";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const page = Number(searchParams.get("page") ?? 1);
  const page_size = Number(
    searchParams.get("page_size") ?? process.env.DEFAULT_PAGE_SIZE
  );
  const dbClient = createDBClient({ request });
  const authorization = await setAuthorization(request, dbClient);

  const {
    data: categories,
    error,
    status,
  } = await dbClient
    .from("categories")
    .select("id, name, events(count)")
    .range((page - 1) * page_size, page * page_size - 1);

  return json(
    {
      categories: categories ?? [],
      userId: authorization.session.data.user_id,
      error,
    },
    {
      status,
      headers: { "Set-Cookie": await commitSession(authorization.session) },
    }
  );
}

function CategoriesPage() {
  const { categories } = useLoaderData<typeof loader>();
  return (
    <section>
      <h2 className="text-xl font-bold mb-5">Categories</h2>
      {categories && categories.length > 0 && (
        <div className="flex flex-col gap-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="w-full py-5 px-2.5 hover:brightness-90 bg-primary-50"
            >
              <Link to={`/categories/${category.id}`} className="text-lg">
                <span>{category.name}</span>
                <Badge
                  count={category.events[0].count}
                  overflowCount={1000}
                  color="#0d9488"
                  className="ml-2"
                />
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default CategoriesPage;
