import { Link, useLocation } from "@remix-run/react";
import LoginButton from "~/routes/_content/Header/LoginButton";
import CreateEventButton from "~/routes/_content/Header/CreateEventButton";
import BtnSaveEvent from "~/components/BtnSaveEvent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { Button } from "antd";
import MenuButton from "~/components/MenuButton";

type Props = Readonly<{
  query: string | null;
  userId: string | undefined;
  userDisplayName: string | undefined | null;
}>;

function Header({ query, userId, userDisplayName }: Props) {
  const { pathname } = useLocation();
  const pathCreateOrEdit =
    pathname === "/events/create" ||
    pathname.match(/\/events\/[0-9a-z-]*\/edit/g);
  return (
    <header className="border-b border-b-primary-600 sticky top-0 z-50 bg-primary-500 shadow-lg">
      <div className="max-w-screen-2xl mx-auto px-2.5 lg:px-5 py-3 flex items-center flex-wrap md:flex-nowrap justify-between md:justify-start">
        <Link to={userId ? "/events" : "/"} className="grow-0 order-1">
          EB
        </Link>
        <div className="grow md:pl-5 md:pr-20 order-last md:order-2 w-full mt-3 md:mt-0">
          <form action="/events">
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
                className="w-full h-8 p-4 ps-10 rounded-3xl text-xs bg-gray-100 focus:bg-gray-50 border-gray-200 focus:border-gray-50 focus:ring-gray-300"
                placeholder="Search exciting events"
                defaultValue={query ?? ""}
                name="query"
              />
            </div>
          </form>
        </div>
        <div className="flex items-center gap-x-2 grow-0 order-2 md:order-last">
          <Link
            to="/events"
            className="h-8 py-1 px-3.5 text-teal-500 hover:brightness-125 font-bold hidden md:inline-block"
          >
            Events
          </Link>
          {!userId && <LoginButton />}
          {!pathCreateOrEdit && <CreateEventButton />}
          {pathCreateOrEdit && <BtnSaveEvent />}
          {userDisplayName && (
            <Button
              href={`/profiles/${userDisplayName}`}
              icon={<FontAwesomeIcon icon={faCircleUser} />}
              shape="circle"
            />
          )}
          <MenuButton userId={userId} />
        </div>
      </div>
    </header>
  );
}

export default Header;
