import { Button, Dropdown, MenuProps } from "antd";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LogoutButton from "~/routes/_content/Header/LogoutButton";

function MenuButton({ userId }: Readonly<{ userId: string | undefined }>) {
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
      <Button icon={<FontAwesomeIcon icon={faBars} />} />
    </Dropdown>
  );
}

export default MenuButton;
