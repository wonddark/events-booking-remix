import { Dropdown, MenuProps } from "antd";
import { faBars, faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LogoutButton from "~/routes/_content/Header/LogoutButton";
import { Link } from "@remix-run/react";

function MenuButton({
  userId,
  displayName,
}: Readonly<{ userId: string | undefined; displayName: string | undefined }>) {
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          1st menu item
        </a>
      ),
    },
    ...(displayName
      ? [
          {
            key: "profile",
            label: (
              <Link
                to={`/profiles/${displayName}`}
                className="flex items-center justify-start gap-2"
              >
                <FontAwesomeIcon icon={faCircleUser} />
                <span>Profile</span>
              </Link>
            ),
          },
        ]
      : []),
    ...(userId
      ? [
          {
            type: "divider",
          },
          {
            key: "logout",
            label: <LogoutButton />,
          },
        ]
      : []),
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
