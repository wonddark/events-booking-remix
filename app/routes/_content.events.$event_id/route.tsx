import { LoaderFunctionArgs } from "@remix-run/node";
import createDBClient from "~/utils/supabase/server";
import { useLoaderData } from "@remix-run/react";

export async function loader({ params }: LoaderFunctionArgs) {
  const dbClient = createDBClient();
  const {
    data: event,
    error,
    status,
    statusText,
  } = await dbClient
    .from("events")
    .select("*, categories(id, name), tickets(id, user_id), event_owner(*)")
    .eq("id", params.event_id!);
  return { event: event?.[0], error, status, statusText };
}

function ViewEvent() {
  const { event } = useLoaderData<typeof loader>();
  return (
    <section className="">
      <div className="gap-16 items-start lg:grid lg:grid-cols-2">
        <div className="font-light sm:text-lg">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold">
            {event?.name}
          </h2>
          <p className="mb-4">{event?.description}</p>
          <p>
            We are strategists, designers and developers. Innovators and problem
            solvers. Small enough to be simple and quick.
          </p>
        </div>
        <div className="">
          <img
            className="w-full rounded-lg"
            src={event?.img_url ?? ""}
            alt={event?.name ?? "event"}
          />
        </div>
      </div>
    </section>
  );
}

export default ViewEvent;
