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
  let userDisplayImage: string | undefined | null = undefined;
  if (
    !authorization.error &&
    Object.keys(authorization.session.data).length > 0
  ) {
    const { data } = await dbClient.auth.getUser();
    if (data.user) {
      const { data: profile } = await dbClient
        .from("profiles")
        .select()
        .eq("user_id", data.user.id)
        .single();
      userId = data.user.id;
      userDisplayImage = profile?.display_name;
    }
  }
  const url = new URL(request.url);
  const query = url.searchParams.get("query");

  return json({
    userId,
    query,
    userDisplayImage,
  });
};

function ContentLayout() {
  const { query, userId, userDisplayImage } = useLoaderData<typeof loader>();
  const matches = useMatches();
  const { pathname } = useLocation();

  return (
    <>
      <Header
        query={query}
        userId={userId}
        userDisplayName={userDisplayImage}
      />
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
