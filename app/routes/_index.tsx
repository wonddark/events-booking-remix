import { Link } from "@remix-run/react";
import EventSVG from "~/assets/EventSVG";

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
                    className="rounded flex justify-center items-center h-7 px-5 text-white font-bold hover:brightness-95"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="rounded flex justify-center items-center h-7 px-5 bg-white text-primary-800 hover:brightness-95"
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
              <input
                type="search"
                className="h-[37px] w-full rounded-2xl border-primary-200"
              />
            </div>
            <div className="flex-1 w-full md:max-w-[45%] order-first md:order-last">
              <EventSVG className="w-full h-auto" />
            </div>
          </div>
        </div>
      </header>
      <section className="max-w-screen-2xl mx-auto px-2.5 lg:px-5 pt-5">
        <h1>Welcome to EventsBooking</h1>
      </section>
    </>
  );
}
