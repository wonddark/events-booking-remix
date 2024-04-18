import { Outlet, useLoaderData } from "@remix-run/react";
import Header from "~/routes/_content/Header/Header";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import * as process from "node:process";
import { getSessionFromCookie } from "~/utils/session";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSessionFromCookie(request);
  const url = new URL(request.url);
  const query = url.searchParams.get("query");

  return json({
    user_id: session.get("user_id"),
    query,
    db_url: process.env.DATABASE_URL,
    db_key: process.env.DATABASE_ANON_KEY,
  });
};

function ContentLayout() {
  const { query, user_id } = useLoaderData<typeof loader>();

  return (
    <>
      <Header query={query} userId={user_id} />
      <div className="w-full mt-5" />
      <div className="max-w-screen-2xl mx-auto px-2.5 lg:px-5 pb-5">
        <Outlet />
      </div>
    </>
  );
}

export default ContentLayout;
