import {
  Outlet,
  UIMatch,
  useLoaderData,
  useLocation,
  useMatches,
} from "@remix-run/react";
import Header from "~/routes/_content/Header/Header";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { setAuthorization } from "~/utils/session";
import { ReactNode } from "react";
import createDBClient from "~/utils/supabase/server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const dbClient = createDBClient({ request });
  const authorization = await setAuthorization(request, dbClient);

  let userId: string | undefined = undefined;
  if (
    !authorization.error &&
    Object.keys(authorization.session.data).length > 0
  ) {
    const { data } = await dbClient.auth.getUser();
    if (data.user) {
      userId = data.user.id;
    }
  }
  const url = new URL(request.url);
  const query = url.searchParams.get("query");

  return json({
    user_id: userId,
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
