import { useFetcher, useNavigate } from "@remix-run/react";
import { action } from "~/routes/_content.events.$event_id.delete/route";
import TrashBin from "~/assets/TrashBin";
import Button from "~/components/Button";
import { useEffect } from "react";

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
      label="Delete"
      type="button"
      style="danger"
      className="text-sm !py-1 !px-2"
      preIcon={<TrashBin />}
      onClick={submitDelete}
      loading={deleteFetcher.state === "loading"}
    />
  );
}

export default ButtonDeleteEvent;
