import EventItem from "~/components/EventItem";
import { EventElement } from "~/types/events";
import NoResults from "~/components/NoResults";

function EventsGrid({
  events,
  userId,
}: Readonly<{
  events: EventElement[];
  userId: string | undefined;
}>) {
  return (
    <>
      {events.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 justify-items-center">
          {events?.map((item) => (
            <EventItem event={item} key={item.id} userId={userId} />
          ))}
        </div>
      ) : (
        <NoResults />
      )}
    </>
  );
}

export default EventsGrid;
