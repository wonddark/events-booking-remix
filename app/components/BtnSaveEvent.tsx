import { useFetcher, useLocation, useParams } from "@remix-run/react";
import { Button } from "antd";
import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

function BtnSaveEvent() {
  const saveEvent = useFetcher();
  const btnRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  const params = useParams();
  const actionSave =
    pathname === "/events/create"
      ? "/events/create"
      : `/events/${params.event_id}/edit`;
  return (
    <Button
      icon={<FontAwesomeIcon icon={faCircleCheck} />}
      htmlType="submit"
      type="primary"
      form="event-form"
      loading={saveEvent.state === "loading"}
      ref={btnRef}
      onClick={(e) => {
        e.preventDefault();
        saveEvent.submit(btnRef.current!.form, { action: actionSave });
      }}
    >
      Save event
    </Button>
  );
}

export default BtnSaveEvent;
