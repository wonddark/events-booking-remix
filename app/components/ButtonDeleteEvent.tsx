import { useFetcher, useNavigate } from "@remix-run/react";
import { action } from "~/routes/_content.events.$event_id.delete/route";
import { useEffect } from "react";
import { Button } from "antd";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
      danger
      icon={<FontAwesomeIcon icon={faTrashCan} />}
      onClick={submitDelete}
      loading={deleteFetcher.state === "loading"}
      size="small"
    >
      Delete
    </Button>
  );
}

export default ButtonDeleteEvent;
