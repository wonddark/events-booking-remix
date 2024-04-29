import { Dropdown, MenuProps } from "antd";
import {
  faBars,
  faCirclePlus,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LogoutButton from "~/routes/_content/Header/LogoutButton";
import { Link, useLocation } from "@remix-run/react";
import LoginButton from "~/routes/_content/Header/LoginButton";

type Props = Readonly<{
  userId: string | undefined;
  displayName: string | undefined;
}>;

function MenuButton({ userId, displayName }: Props) {
  const { pathname } = useLocation();
  const createOrEditPath =
    pathname === "/events/create" ||
    pathname.match(/\/events\/[0-9a-z-]*\/edit/g);
  const profileItem: MenuProps["items"] = displayName
    ? [
        {
          key: "profile",
          label: (
            <Link
              to={`/profiles/${displayName}`}
              className="flex items-center justify-start gap-2 h-8"
            >
              <FontAwesomeIcon icon={faCircleUser} />
              <span>Profile</span>
            </Link>
          ),
        },
      ]
    : [];
  const logoutItem: MenuProps["items"] = userId
    ? [
        {
          type: "divider",
        },
        {
          key: "logout",
          label: <LogoutButton />,
        },
      ]
    : [];
  const createEventItem = createOrEditPath
    ? [
        {
          key: "create_event",
          label: (
            <Link
              to="/events/create"
              className="flex items-center justify-start gap-2 h-8"
            >
              <FontAwesomeIcon icon={faCirclePlus} />
              <span>Create event</span>
            </Link>
          ),
        },
      ]
    : [];
  const eventsItem = createOrEditPath
    ? [
        {
          key: "events",
          label: (
            <Link to="/events" className="h-8">
              <span></span>
              <span>Events</span>
            </Link>
          ),
        },
      ]
    : [];
  const loginItem = userId ? [] : [{ key: "login", label: <LoginButton /> }];
  const items: MenuProps["items"] = [
    ...eventsItem,
    ...createEventItem,
    ...profileItem,
    ...logoutItem,
    ...loginItem,
  ];
  return (
    <Dropdown menu={{ items }}>
      <button
        type="button"
        className="h-8 w-8 text-white flex justify-center items-center"
      >
        <FontAwesomeIcon icon={faBars} />
      </button>
    </Dropdown>
  );
}

export default MenuButton;
