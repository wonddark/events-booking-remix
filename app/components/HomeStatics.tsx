import { Link, useFetcher } from "@remix-run/react";
import ArrowRight from "~/assets/ArrowRight";
import { loader as loaderRecentEvents } from "~/routes/statics.recent_events/route";
import { loader as loaderSoonEvents } from "~/routes/statics.soon_events/route";
import { loader as loaderCurrentEvents } from "~/routes/statics.current_events/route";
import { useEffect } from "react";

function HomeStatics() {
  const recentEvents = useFetcher<typeof loaderRecentEvents>();
  const soonEvents = useFetcher<typeof loaderSoonEvents>();
  const currentEvents = useFetcher<typeof loaderCurrentEvents>();

  useEffect(() => {
    recentEvents.load("/statics/recent_events");
    soonEvents.load("/statics/soon_events");
    currentEvents.load("/statics/current_events");
  }, []);

  return (
    <section className="max-w-screen-2xl mx-auto px-2.5 lg:px-5 py-5 flex flex-col md:flex-row gap-5 justify-around items-center flex-wrap">
      <div className="text-center">
        <div className="mb-3 md:mt-7">
          {currentEvents.state === "idle" ? (
            <span className="text-5xl md:text-8xl text-primary-800">
              {(currentEvents.data && currentEvents.data.data?.count) ?? 0}
            </span>
          ) : (
            <span>Loading...</span>
          )}
        </div>
        <Link
          to="/events"
          className="text-xl md:text-3xl text-primary-800 font-light flex items-center justify-center hover:brightness-125"
        >
          Running now <ArrowRight />
        </Link>
      </div>
      <div className="text-center">
        <div className="mb-3 md:mt-7">
          {soonEvents.state === "idle" ? (
            <span className="text-5xl md:text-8xl text-primary-800">
              {(soonEvents.data && soonEvents.data.data?.count) ?? 0}
            </span>
          ) : (
            <span>Loading...</span>
          )}
        </div>
        <Link
          to="/events"
          className="text-xl md:text-3xl text-primary-800 font-light flex items-center justify-center hover:brightness-125"
        >
          Starting soon <ArrowRight />
        </Link>
      </div>
      <div className="text-center">
        <div className="mb-3 md:mt-7">
          {recentEvents.state === "idle" ? (
            <span className="text-5xl md:text-8xl text-primary-800">
              {(recentEvents.data && recentEvents.data.data?.count) ?? 0}
            </span>
          ) : (
            <span>Loading...</span>
          )}
        </div>
        <Link
          to="/events"
          className="text-xl md:text-3xl text-primary-800 font-light flex items-center justify-center hover:brightness-125"
        >
          Recently posted <ArrowRight />
        </Link>
      </div>
    </section>
  );
}

export default HomeStatics;
