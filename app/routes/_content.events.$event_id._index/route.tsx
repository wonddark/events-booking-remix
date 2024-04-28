import { json, LoaderFunctionArgs } from "@remix-run/node";
import createDBClient from "~/utils/supabase/server";
import { Link, UIMatch, useLoaderData } from "@remix-run/react";
import BreadcrumbsLink from "~/components/BreadcrumbsLink";
import BreadcrumbsPlain from "~/components/BreadcrumbsPlain";
import { setAuthorization } from "~/utils/session";
import ButtonDeleteEvent from "~/components/ButtonDeleteEvent";
import { commitSession } from "~/sessions";
import { useRef } from "react";
import { Button } from "antd";
import dayjs from "dayjs";
import {
  faCircleUser,
  faComments,
  faFolderTree,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NotFoundError from "~/components/NotFoundError";

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
  const dbClient = createDBClient({ request });
  const authorization = await setAuthorization(request, dbClient);

  const {
    data: event,
    error,
    status,
    statusText,
  } = await dbClient
    .from("events")
    .select(
      `id, name, description, img_url, start_date, end_date, max_attendees, tickets_count,
        categories(id, name), profiles(user_id, avatar, display_name, first_name, last_name)`
    )
    .eq("id", params.event_id!)
    .maybeSingle();

  return json(
    {
      event,
      error,
      status,
      statusText,
      owner: authorization.session.get("user_id") === event?.profiles?.user_id,
    },
    { headers: { "Set-Cookie": await commitSession(authorization.session) } }
  );
}

function ViewEvent() {
  const { event, owner } = useLoaderData<typeof loader>();
  const imgRef = useRef<HTMLImageElement>(null);
  const avatarRef = useRef<HTMLImageElement>(null);
  return (
    <section>
      {event ? (
        <>
          <div className="w-full h-36 lg:h-64 relative">
            <img
              className="w-full h-full object-cover rounded-lg"
              src={
                event?.img_url
                  ? event.img_url
                  : "/images/event_image_placeholder.jpg"
              }
              onError={() =>
                (imgRef.current!.src = "/images/event_image_placeholder.jpg")
              }
              ref={imgRef}
              alt={event?.name ?? "event"}
            />
            {owner && (
              <div className="flex gap-1.5 absolute top-0 right-0 z-10 mt-2 mr-2">
                <Button
                  htmlType="button"
                  icon={<FontAwesomeIcon icon={faPenToSquare} />}
                  href={`/events/${event?.id}/edit`}
                  size="small"
                >
                  Edit
                </Button>
                <ButtonDeleteEvent eventId={`${event?.id}`} />
              </div>
            )}
          </div>
          <div
            className="mt-3 items-start grid grid-cols-1 md:grid-cols-[1fr_30%] md:grid-rows-2
           lg:grid-rows-none lg:grid-cols-[1fr_20%_20%] gap-5 md:gap-0"
          >
            <div className="font-light sm:text-lg md:row-span-2 lg:row-span-1">
              <h2 className="mb-2 text-xl lg:text-2xl tracking-tight font-bold">
                {event?.name}
              </h2>
              <Link
                to={`/categories/${event.categories?.id}`}
                className="inline-block mb-4 h-6 py-0 px-[7px] rounded outline-none whitespace-nowrap text-center
                 border border-[#d9d9d9] text-[rgba(0, 0, 0, 0.88)] shadow-[0_2px_0_rgba(0,0,0,0.02)] font-normal
                  leading-[1.5714285714285714] text-[0.875rem] bg-white transition-all duration-[0.2s]
                   ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:text-[#28a193] hover:border-[#28a193]"
              >
                <FontAwesomeIcon
                  icon={faFolderTree}
                  className="h-[1em] align-[-0.125em] inline-block box-content me-2 leading-[0]"
                />
                <span>{event.categories?.name}</span>
              </Link>
              <p className="mb-4">{event?.description}</p>
            </div>
            <div className="md:pl-3 lg:px-7">
              <dl className="bg-primary-100 py-9 text-center rounded-xl border shadow-sm">
                <dt className="text-primary-800 text-lg">Start</dt>
                <dd>{dayjs(event.start_date).format("YYYY-MM-DD HH:mm:ss")}</dd>
                <dt className="text-primary-800 text-lg mt-1.5">End</dt>
                <dd>{dayjs(event.end_date).format("YYYY-MM-DD HH:mm:ss")}</dd>
                <dt className="text-primary-800 mt-9">Available tickets</dt>
                <dd className="font-bold text-teal-700 text-xl">
                  {event.tickets_count}/{event.max_attendees}
                </dd>
              </dl>
            </div>
            <div className="md:mt-3 lg:mt-0">
              {event.profiles?.avatar ? (
                <img
                  src={event.profiles.avatar}
                  alt={`${event.name}_owner_avatar`}
                  ref={avatarRef}
                  className="w-24 h-24 mx-auto object-cover rounded-full"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faCircleUser}
                  className="w-24 h-24 mx-auto block"
                />
              )}
              <h5 className="text-center mt-3 text-primary-700 font-bold text-lg">
                {`${event.profiles?.first_name} ${event.profiles?.last_name}`}
              </h5>
              <Button
                className="mx-auto block mt-2"
                icon={<FontAwesomeIcon icon={faComments} />}
              >
                Contact the host
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div>
          <NotFoundError />
        </div>
      )}
    </section>
  );
}

export default ViewEvent;
