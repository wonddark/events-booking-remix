import EventItem from "~/components/EventItem";
import { EventElement } from "~/types/events";
import NoResults from "~/components/NoResults";
import { useEffect, useState } from "react";
import { useFetcher, useLoaderData, useSearchParams } from "@remix-run/react";
import { loader } from "~/routes/_content.events._index/route";
import InfiniteScroller from "~/components/InfiniteScroller";
import Filters from "~/components/Filters";

interface EventsGridProps {
  categoryId?: string;
  userId?: string;
}

function EventsGrid({ categoryId, userId }: Readonly<EventsGridProps>) {
  const { events, userId: loggedUser } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof loader>();
  const [items, setItems] = useState<EventElement[]>([]);
  const [page, setPage] = useState(0);
  const [thereAreMore, setThereAreMore] = useState<boolean>(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setItems(events);
    setPage(1);
  }, [events]);

  useEffect(() => {
    if (!fetcher.data || fetcher.state === "loading") {
      return;
    }

    if (fetcher.data) {
      const newItems = fetcher.data.events;
      setItems((prevAssets) => [...prevAssets, ...newItems]);
      setPage(page + 1);
      if (fetcher.data.events.length === 0) {
        setThereAreMore(false);
      }
    }
  }, [fetcher.data]);

  return (
    <>
      <Filters categoryId={categoryId} userId={userId} />
      <InfiniteScroller
        loadNext={() => {
          if (fetcher.state !== "loading" && thereAreMore) {
            const query = `/events?index&page=${page + 1}&${searchParams}`;
            fetcher.load(query);
          }
        }}
        loading={fetcher.state === "loading"}
      >
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 justify-items-center">
          {items.map((item) => (
            <EventItem event={item} key={item.id} userId={loggedUser} />
          ))}
        </div>
      </InfiniteScroller>
      {fetcher.state === "idle" && items.length === 0 && <NoResults />}
    </>
  );
}

export default EventsGrid;
