import { Link, useLoaderData } from "@remix-run/react";
import EventSVG from "~/assets/EventSVG";
import createDBClient from "~/utils/supabase/server";
import dayjs from "dayjs";
import ArrowRight from "~/assets/ArrowRight";
import Button from "../components/Button";
import { useEffect, useState } from "react";
import { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const dbClient = createDBClient({ request });
  const today = dayjs().format("YYYY-MM-DD HH:mm:ss.sss");
  const { data: recent } = await dbClient
    .from("events")
    .select("count")
    .gt(
      "published_at",
      dayjs().subtract(72, "hours").format("YYYY-MM-DD HH:mm:ss.sss")
    );
  const { data: current } = await dbClient
    .from("events")
    .select("count")
    .lt("start_date", today)
    .gt("end_date", today);
  const { data: soon } = await dbClient
    .from("events")
    .select("count")
    .gt("start_date", today);

  return {
    recent: (recent?.[0] as unknown as { count: number }).count,
    current: (current?.[0] as unknown as { count: number }).count,
    soon: (soon?.[0] as unknown as { count: number }).count,
  };
}

export default function Index() {
  const { recent, current, soon } = useLoaderData<typeof loader>();
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    const isLoggedIn = Boolean(localStorage.getItem("session"));
    setLoggedIn(isLoggedIn);
  }, []);
  return (
    <>
      <header className="bg-gradient-to-br from-[#c47b05ff] to-[#ffb933ff]">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex justify-between items-center py-2 px-2.5 lg:px-5">
            <Link to="/" className="text-white font-bold">
              EB
            </Link>
            <nav>
              <ul className="flex items-center gap-3">
                {!loggedIn && (
                  <li>
                    <Link
                      to="/login"
                      className="rounded flex justify-center items-center px-4 py-2 text-white font-bold hover:brightness-95"
                    >
                      Login
                    </Link>
                  </li>
                )}
                <li>
                  <Link
                    to={loggedIn ? "/events/create" : "/login"}
                    className="rounded flex justify-center items-center px-4 py-2 bg-white text-primary-800 hover:brightness-95"
                  >
                    Create event
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="flex flex-col md:flex-row justify-start md:justify-between items-start md:items-center gap-7 pt-11 pb-5 md:py-11 px-2.5 lg:px-5 max-h-min">
            <div className="md:max-w-[50%] order-last md:order-first">
              <h1 className="text-2xl lg:text-6xl text-white leading-[1.2] tracking-tight">
                Find or create exciting events to share with your community
              </h1>
              <h2 className="text-base lg:text-2xl text-white mt-2 md:mt-5 mb-5 md:mb-10 leading-[1.2] tracking-tight">
                We have built an optimized application to let people like you
                create, share and even monetize categorized, tagged and fully
                customizable events.
              </h2>

              <form action="/events">
                <label
                  htmlFor="default-search"
                  className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                >
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="search"
                    id="default-search"
                    name="query"
                    className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Search Mockups, Logos..."
                    required
                  />
                  <Button
                    label="Search"
                    type="submit"
                    style="primary"
                    className="absolute end-2.5 bottom-2.5"
                  />
                </div>
              </form>
            </div>
            <div className="flex-1 w-full md:max-w-[45%] order-first md:order-last">
              <EventSVG className="w-full h-auto" />
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-screen-2xl mx-auto px-2.5 lg:px-5 py-5 flex flex-col md:flex-row gap-5 justify-around items-center flex-wrap">
        <div className="text-center">
          <div className="mb-3 md:mt-7">
            <span className="text-5xl md:text-8xl text-primary-800">
              {current ?? 0}
            </span>
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
            <span className="text-5xl md:text-8xl text-primary-800">
              {soon ?? 0}
            </span>
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
            <span className="text-5xl md:text-8xl text-primary-800">
              {recent ?? 0}
            </span>
          </div>
          <Link
            to="/events"
            className="text-xl md:text-3xl text-primary-800 font-light flex items-center justify-center hover:brightness-125"
          >
            Recently posted <ArrowRight />
          </Link>
        </div>
      </section>
    </>
  );
}
