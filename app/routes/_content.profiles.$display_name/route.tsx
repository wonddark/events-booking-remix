import { json, LoaderFunctionArgs } from "@remix-run/node";
import createDBClient from "~/utils/supabase/server";
import { setAuthorization } from "~/utils/session";
import { commitSession, destroySession } from "~/sessions";
import { UIMatch, useLoaderData } from "@remix-run/react";
import { Image, Tabs } from "antd";
import BreadcrumbsPlain from "~/components/BreadcrumbsPlain";
import BreadcrumbsLink from "~/components/BreadcrumbsLink";
import EventsGrid from "~/components/EventsGrid";

// noinspection JSUnusedGlobalSymbols
export const handle = {
  breadcrumbs: (match: UIMatch, currentPath: boolean) => {
    const name = (match.data as { data: { display_name: string } })?.data
      ?.display_name;
    if (currentPath) {
      return <BreadcrumbsPlain key={match.id} name={name} />;
    } else {
      return (
        <BreadcrumbsLink key={match.id} name={name} uri={match.pathname} />
      );
    }
  },
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  const dbClient = createDBClient({ request });
  const authorization = await setAuthorization(request, dbClient);

  let headers =
    authorization.error || Object.keys(authorization.session.data).length === 0
      ? { "Set-Cookie": await destroySession(authorization.session) }
      : { "Set-Cookie": await commitSession(authorization.session) };

  const { data, error, status } = await dbClient
    .from("profiles")
    .select()
    .eq("display_name", params.display_name ?? "")
    .limit(1)
    .maybeSingle();

  return json(
    {
      data,
      error,
    },
    { status, headers }
  );
}

function UserProfiles() {
  const { data } = useLoaderData<typeof loader>();
  return (
    <>
      {data ? (
        <>
          <Image
            src={data.avatar ?? undefined}
            alt={`${data.display_name} avatar`}
            fallback="/images/user_avatar_placeholder.jpeg"
            width="6rem"
            height="6rem"
            className="object-cover rounded-full"
          />
          <h1>
            {data.first_name} {data.last_name}
          </h1>
          <Tabs
            items={[
              {
                label: "Events",
                key: "events",
                children: <EventsGrid userId={data.user_id} />,
              },
            ]}
          />
        </>
      ) : (
        <h1>The requested user doesn't seems to exist</h1>
      )}
    </>
  );
}

export default UserProfiles;
