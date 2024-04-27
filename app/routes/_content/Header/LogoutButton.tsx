import { useFetcher } from "@remix-run/react";
import { action } from "~/routes/_auth.logout/route";
import { Button } from "antd";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function LogoutButton() {
  //
  const logout = useFetcher<typeof action>();
  //
  return (
    <logout.Form method="post" action="/logout">
      <Button
        htmlType="submit"
        icon={<FontAwesomeIcon icon={faArrowRightFromBracket} />}
      >
        Logout
      </Button>
    </logout.Form>
  );
}

export default LogoutButton;
