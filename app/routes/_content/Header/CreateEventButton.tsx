import Button from "~/components/Button";
import { useNavigate } from "@remix-run/react";

function CreateEventButton() {
  //
  const navigate = useNavigate();
  const createEvent = () => {
    navigate("/events/create");
  };
  //
  return (
    <Button
      label="Create event"
      type="button"
      style="primary"
      onClick={createEvent}
    />
  );
}

export default CreateEventButton;
