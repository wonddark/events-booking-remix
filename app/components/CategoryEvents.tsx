import { useFetcher } from "@remix-run/react";
import { loader } from "~/routes/_content.events._index/route";
import { useEffect } from "react";
import EventsGrid from "~/components/EventsGrid";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function CategoryEvents({ categoryId }: Readonly<{ categoryId: string }>) {
  const events = useFetcher<typeof loader>();

  useEffect(() => {
    events.load(`/events?index&category_id=${categoryId}`);
  }, [categoryId]);

  return (
    <>
      {events.data && (
        <EventsGrid events={events.data.events} userId={events.data.userId} />
      )}
      {events.state !== "loading" && (
        <div className="w-screen h-screen flex items-center justify-center">
          <FontAwesomeIcon
            icon={faSpinner}
            spinPulse
            className="max-w-xs w-7/12 h-auto ms-auto me-auto"
          />
        </div>
      )}
    </>
  );
}

export default CategoryEvents;
