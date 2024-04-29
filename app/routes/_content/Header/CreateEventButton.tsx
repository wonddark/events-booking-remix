import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "@remix-run/react";

function CreateEventButton() {
  return (
    <Link
      to="/events/create"
      className="ant-btn ant-btn-primary css-dev-only-do-not-override-1bux6qn"
      role="button"
    >
      <FontAwesomeIcon icon={faCirclePlus} className="ant-btn-icon" />
      <span>Create event</span>
    </Link>
  );
}

export default CreateEventButton;
