import { LoaderFunctionArgs } from "@remix-run/node";
import createDBClient from "~/utils/supabase/server";
import { UIMatch, useLoaderData } from "@remix-run/react";
import SvgTag from "~/assets/SvgTag";
import BreadcrumbsLink from "~/components/BreadcrumbsLink";
import BreadcrumbsPlain from "~/components/BreadcrumbsPlain";

// noinspection JSUnusedGlobalSymbols
export const handle = {
  breadcrumbs: (match: UIMatch, currentPath: boolean) => {
    const name = (match.data as { event: { name: string } }).event.name;
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
  const dbClient = await createDBClient({ request });
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
      <div className="gap-5 md:gap-16 items-start grid grid-cols-1 md:grid-cols-2">
        <div className="font-light sm:text-lg">
          <h2 className="mb-2 text-xl lg:text-2xl tracking-tight font-bold">
            {event?.name}
          </h2>
          <span className="flex gap-1 items-center font-light rounded-lg py-1.5 px-3 bg-secondary-100 w-fit mb-4 text-sm">
            <SvgTag />
            {event?.categories?.name}
          </span>
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
