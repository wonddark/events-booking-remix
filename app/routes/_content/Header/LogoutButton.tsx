import { useFetcher } from "@remix-run/react";
import { action } from "~/routes/_auth.logout/route";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function LogoutButton() {
  const logout = useFetcher<typeof action>();
  return (
    <logout.Form method="post" action="/logout">
      <button
        type="submit"
        className="flex items-center justify-start gap-2 h-8"
      >
        <FontAwesomeIcon icon={faArrowRightFromBracket} />
        <span>Logout</span>
      </button>
    </logout.Form>
  );
}

export default LogoutButton;
