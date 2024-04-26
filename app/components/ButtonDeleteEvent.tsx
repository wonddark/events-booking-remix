import { useFetcher, useNavigate } from "@remix-run/react";
import { action } from "~/routes/_content.events.$event_id.delete/route";
import { useEffect } from "react";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

function ButtonDeleteEvent({ eventId }: Readonly<{ eventId: string }>) {
  const deleteFetcher = useFetcher<typeof action>();
  const navigate = useNavigate();

  const submitDelete = () => {
    deleteFetcher.submit(null, {
      method: "post",
      action: `/events/${eventId}/delete`,
    });
  };

  useEffect(() => {
    if (deleteFetcher.data && "status" in deleteFetcher.data)
      if (deleteFetcher.data.status === 204) {
        navigate("/events");
      } else if (deleteFetcher.data.status === 403) {
        // TODO: Rise an alert message telling the user about access denied
      } else if (deleteFetcher.data.status === 404) {
        // TODO: Rise an alert message telling the user about the resource missing
      }
  }, [deleteFetcher.data]);

  return (
    <Button
      htmlType="button"
      type="primary"
      danger
      className="text-sm !py-1 !px-2"
      icon={<DeleteOutlined />}
      onClick={submitDelete}
      loading={deleteFetcher.state === "loading"}
    >
      Delete
    </Button>
  );
}

export default ButtonDeleteEvent;
