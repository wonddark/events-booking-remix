import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "@remix-run/react";
import { Button } from "antd";

function CreateEventButton() {
  return (
    <Link to="/events/create">
      <Button type="primary" icon={<FontAwesomeIcon icon={faCirclePlus} />}>
        Create event
      </Button>
    </Link>
  );
}

export default CreateEventButton;
