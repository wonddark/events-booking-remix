import { Link, useFetcher, useNavigate } from "@remix-run/react";
import {
  FormEventHandler,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button, Modal } from "antd";
import {
  faCalendarDays,
  faCircleCheck,
  faCircleXmark,
  faMagnifyingGlass,
  faTicket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EventItemDates from "~/components/EventItemDates";
import { EventElement } from "~/types/events";

type Props = Readonly<{
  item: EventElement;
  userId: string | undefined;
}>;

function EventItem({ item, userId }: Props) {
  const navigate = useNavigate();
  const viewDetails = () => {
    navigate(`/events/${item.id}`);
  };

  const [showTicketsForm, setShowTicketsForm] = useState(false);
  const toggleTicketsForm = () => {
    setShowTicketsForm((prev) => !prev);
  };
  const registerTicket = useFetcher();
  const sendRequest: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    registerTicket.submit(event.currentTarget);
  };
  const cancelOp: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.currentTarget.form?.reset();
    toggleTicketsForm();
  };
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (registerTicket.data && registerTicket.state === "idle") {
      formRef.current?.reset();
      toggleTicketsForm();
    }
  }, [registerTicket.data, registerTicket.state]);

  const imgRef = useRef<HTMLImageElement>(null);
  const avatarRef = useRef<HTMLImageElement>(null);

  return (
    <>
      <div className="flex flex-col border border-gray-300 rounded-lg shadow-md hover:shadow p-3 w-full md:w-[280px] bg-primary-50 hover:brightness-105">
        <div className="-m-3 mb-0">
          <Link to={`/events/${item.id}`}>
            <img
              src={
                item.img_url
                  ? item.img_url
                  : "/images/event_image_placeholder.jpg"
              }
              onError={() =>
                (imgRef.current!.src = "/images/event_image_placeholder.jpg")
              }
              alt="event_img"
              className="w-full h-[240px] rounded-lg rounded-b-[0] object-cover"
              loading="lazy"
              ref={imgRef}
            />
          </Link>
        </div>
        <Link to={`/events/${item.id}`} className="font-bold mt-3">
          {item.name}
        </Link>
        {item.event_owner && (
          <Link
            to={`/profiles/${item.event_owner.display_name}`}
            className="flex items-center justify-start gap-1 mt-3"
          >
            <img
              src={
                item.event_owner.avatar
                  ? item.event_owner.avatar
                  : "/images/user_avatar_placeholder.jpeg"
              }
              onError={() =>
                (avatarRef.current!.src =
                  "/images/user_avatar_placeholder.jpeg")
              }
              ref={avatarRef}
              alt={`${item.event_owner.display_name} avatar`}
              className="rounded-full w-5 h-5 object-cover"
            />
            {item.event_owner.display_name}
          </Link>
        )}
        <div className="flex gap-2 items-center">
          <FontAwesomeIcon icon={faCalendarDays} />
          <EventItemDates event={item} />
        </div>
        <div className="flex gap-2 items-center font-bold py-1.5">
          <FontAwesomeIcon icon={faTicket} />
          {item.tickets_count !== item.max_attendees ? (
            <span className="text-green-800">
              {item.max_attendees - item.tickets_count} tickets available
            </span>
          ) : (
            <span className="text-red-900">No tickets available</span>
          )}
        </div>
        <div className="mt-7 flex-1 flex justify-start items-end">
          <Button
            icon={<FontAwesomeIcon icon={faMagnifyingGlass} size="xs" />}
            onClick={viewDetails}
            htmlType="button"
            type="default"
            className="w-3/5 mr-0.5"
          >
            Details
          </Button>
          <Button
            htmlType="button"
            type="primary"
            className="w-2/5 ml-0.5"
            onClick={toggleTicketsForm}
            disabled={
              !userId ||
              item.event_owner?.user_id === userId ||
              item.tickets_count === item.max_attendees
            }
          >
            Book a sit
          </Button>
        </div>
      </div>
      <Modal
        open={showTicketsForm}
        onCancel={toggleTicketsForm}
        footer={null}
        okText={null}
        cancelText={null}
        title="Register your sits"
      >
        <registerTicket.Form
          method="post"
          action={`/events/${item.id}/tickets/register`}
          onSubmit={sendRequest}
          ref={formRef}
        >
          <input
            type="number"
            min={1}
            max={item.max_attendees - item.tickets_count}
            name="tickets_count"
            className="w-full p-2 rounded-md mb-5"
          />
          <div className="flex justify-end items-center gap-2.5">
            <Button
              type="primary"
              htmlType="submit"
              loading={registerTicket.state === "submitting"}
              icon={<FontAwesomeIcon icon={faCircleCheck} />}
            >
              Submit
            </Button>
            <Button
              htmlType="button"
              onClick={cancelOp}
              icon={<FontAwesomeIcon icon={faCircleXmark} />}
            >
              Cancel
            </Button>
          </div>
        </registerTicket.Form>
      </Modal>
    </>
  );
}

export default EventItem;
