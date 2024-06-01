import HomeStatics from "~/components/HomeStatics";
import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import createDBClient from "~/utils/supabase/server";
import { setAuthorization } from "~/utils/session";
import { commitSession, destroySession } from "~/sessions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

// noinspection JSUnusedGlobalSymbols
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const dBClient = createDBClient({ request });
  const authorization = await setAuthorization(request, dBClient);

  if (
    !authorization.error &&
    Object.keys(authorization.session.data).length > 0
  ) {
    return redirect("/events", {
      headers: { "Set-Cookie": await commitSession(authorization.session) },
    });
  }

  return json(
    {},
    { headers: { "Set-Cookie": await destroySession(authorization.session) } }
  );
};

export default function Index() {
  return (
    <>
      <div className="memorable-header min-h-screen bg-cover bg-no-repeat bg-center flex flex-col justify-between px-6 md:px-14">
        <header className="flex justify-between items-center gap-3 py-4 md:py-6 w-full max-w-screen-2xl mx-auto">
          <span className="bg-gradient-to-r from-amber-700 to-amber-300 bg-clip-text text-transparent text-2xl md:text-3xl font-semibold">
            EventsBooking
          </span>
          <nav className="flex-1 hidden md:flex justify-end">
            <ul className="flex items-center gap-1.5 uppercase font-medium tracking-wide">
              <li>
                <a
                  href="/login"
                  className="text-white border border-white rounded bg-transparent hover:border-amber-400 hover:bg-amber-500 hover:text-gray-800 hover:rounded-md py-1 px-2.5"
                >
                  Login
                </a>
              </li>
              <li>
                <a
                  href="/register"
                  className="text-white border border-white rounded bg-transparent hover:border-amber-400 hover:bg-amber-500 hover:text-gray-800 hover:rounded-md py-1 px-2.5"
                >
                  Register
                </a>
              </li>
            </ul>
          </nav>
          <button className="text-white md:hidden w-fit text-xl p-1">
            <FontAwesomeIcon icon={faBars} />
          </button>
        </header>
        <div className="flex flex-col gap-8 md:gap-12 mb-[30%] md:mb-[10%] xl:mb-[5%] w-full max-w-screen-2xl mx-auto">
          <div className="w-full max-w-[870px]">
            <p className="text-3xl md:text-4xl xl:text-6xl font-semibold text-white leading-[1.25]">
              When shared with friends every moment is a{" "}
              <span className="text-amber-500">memorable adventure</span>
            </p>
            <p className="text-xl md:text-2xl font-medium leading-[1.15] tracking-wide text-white mt-2">
              We can help you keep your most precious memories alive
            </p>
          </div>
          <a
            href="/events/create"
            className="text-lg py-1.5 px-3 bg-amber-500 w-fit font-semibold text-gray-800 rounded hover:brightness-110 hover:rounded-md"
          >
            Create an event
          </a>
        </div>
      </div>
      <HomeStatics />
    </>
  );
}
