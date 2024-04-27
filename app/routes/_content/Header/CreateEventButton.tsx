import { useNavigate } from "@remix-run/react";
import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";

function CreateEventButton() {
  //
  const navigate = useNavigate();
  const createEvent = () => {
    navigate("/events/create");
  };
  //
  return (
    <Button
      htmlType="button"
      type="primary"
      onClick={createEvent}
      icon={<FontAwesomeIcon icon={faCirclePlus} />}
    >
      Create event
    </Button>
  );
}

export default CreateEventButton;
