import {
  Outlet,
  UIMatch,
  useLoaderData,
  useLocation,
  useMatches,
} from "@remix-run/react";
import Header from "~/routes/_content/Header/Header";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { getSessionFromCookie } from "~/utils/session";
import { ReactNode } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSessionFromCookie(request);
  const url = new URL(request.url);
  const query = url.searchParams.get("query");

  return json({
    user_id: session.get("user_id"),
    query,
  });
};

function ContentLayout() {
  const { query, user_id } = useLoaderData<typeof loader>();
  const matches = useMatches();
  const { pathname } = useLocation();

  return (
    <>
      <Header query={query} userId={user_id} />
      <div className="max-w-screen-2xl mx-auto px-2.5 lg:px-5 w-full my-2.5 text-xs font-light">
        {matches
          .filter((item) => item.handle)
          .map((item) =>
            (
              item.handle as {
                breadcrumbs: (
                  match: UIMatch,
                  currentPath: boolean
                ) => ReactNode;
              }
            ).breadcrumbs(item, item.pathname === pathname)
          )}
      </div>
      <div className="max-w-screen-2xl mx-auto px-2.5 lg:px-5 pb-5">
        <Outlet />
      </div>
    </>
  );
}

export default ContentLayout;
