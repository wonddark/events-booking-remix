import { Link } from "@remix-run/react";
import EventSVG from "~/assets/EventSVG";
import Button from "../components/Button";
import HomeStatics from "~/components/HomeStatics";
import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getSessionFromCookie } from "~/utils/session";

// noinspection JSUnusedGlobalSymbols
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSessionFromCookie(request);

  if (session.get("user_id")) {
    return redirect("/events");
  }
  return json({});
};

export default function Index() {
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
                <li>
                  <Link
                    to="/login"
                    className="rounded flex justify-center items-center px-4 py-2 text-white font-bold hover:brightness-95"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/events/create"
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

      <HomeStatics />
    </>
  );
}
