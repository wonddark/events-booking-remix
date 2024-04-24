import { json, LoaderFunctionArgs } from "@remix-run/node";
import createDBClient from "~/utils/supabase/server";
import { setAuthorization } from "~/utils/session";
import { commitSession, destroySession } from "~/sessions";
import { useLoaderData } from "@remix-run/react";

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
  const { data, error } = useLoaderData<typeof loader>();
  return (
    <>
      {data ? (
        <>
          <img src={data.avatar ?? ""} alt={`${data.display_name} avatar`} />
          <h1>
            {data.first_name} {data.last_name}
          </h1>
        </>
      ) : (
        <h1>The requested user doesn't seems to exist</h1>
      )}
    </>
  );
}

export default UserProfiles;
