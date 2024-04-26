import { PlusCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "@remix-run/react";
import { Button } from "antd";

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
      icon={<PlusCircleOutlined />}
    >
      Create event
    </Button>
  );
}

export default CreateEventButton;
