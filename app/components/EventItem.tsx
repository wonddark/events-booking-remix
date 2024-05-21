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
  faFolderTree,
  faMagnifyingGlass,
  faTicket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EventItemDates from "~/components/EventItemDates";
import { EventElement } from "~/types/events";

type Props = Readonly<{
  event: EventElement;
  userId: string | undefined;
}>;

function EventItem({ event, userId }: Props) {
  const navigate = useNavigate();
  const viewDetails = () => {
    navigate(`/events/${event.id}`);
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
        <div className="-m-3 mb-0 overflow-hidden">
          <Link to={`/events/${event.id}`}>
            <img
              src={
                event.img_url
                  ? event.img_url
                  : "/images/event_image_placeholder.jpg"
              }
              onError={() =>
                (imgRef.current!.src = "/images/event_image_placeholder.jpg")
              }
              alt="event_img"
              className="w-full h-[240px] rounded-lg rounded-b-[0] object-cover hover:scale-105"
              loading="lazy"
              ref={imgRef}
            />
          </Link>
        </div>
        <Link to={`/events/${event.id}`} className="font-bold mt-3">
          {event.name}
        </Link>
        <Link
          to={`/categories/${event.categories?.id}`}
          className="inline-block mt-2 mb-4 h-6 py-0 px-[7px] rounded outline-none whitespace-nowrap text-center
                 border border-[#d9d9d9] text-[rgba(0, 0, 0, 0.88)] shadow-[0_2px_0_rgba(0,0,0,0.02)] font-normal
                  leading-[1.5714285714285714] text-[0.875rem] bg-white transition-all duration-[0.2s]
                   ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:text-[#28a193] hover:border-[#28a193] w-fit"
          preventScrollReset={false}
        >
          <FontAwesomeIcon
            icon={faFolderTree}
            className="h-[1em] align-[-0.125em] inline-block box-content me-2 leading-[0]"
          />
          <span>{event.categories?.name}</span>
        </Link>
        {event.profiles && (
          <Link
            to={`/profiles/${event.profiles.display_name}`}
            className="flex items-center justify-start gap-1 mt-3"
          >
            <img
              src={
                event.profiles.avatar
                  ? event.profiles.avatar
                  : "/images/user_avatar_placeholder.jpeg"
              }
              onError={() =>
                (avatarRef.current!.src =
                  "/images/user_avatar_placeholder.jpeg")
              }
              ref={avatarRef}
              alt={`${event.profiles.display_name} avatar`}
              className="rounded-full w-5 h-5 object-cover"
            />
            {event.profiles.display_name}
          </Link>
        )}
        <div className="flex gap-2 items-center">
          <FontAwesomeIcon icon={faCalendarDays} />
          <EventItemDates event={event} />
        </div>
        <div className="flex gap-2 items-center font-bold py-1.5">
          <FontAwesomeIcon icon={faTicket} />
          {event.tickets_count !== event.max_attendees ? (
            <span className="text-green-800">
              {event.max_attendees - event.tickets_count} tickets available
            </span>
          ) : (
            <span className="text-red-900">No tickets available</span>
          )}
        </div>
        <div className="mt-7 flex-1 flex flex-col justify-end items-center gap-2">
          <Button
            htmlType="button"
            type="primary"
            className="w-full ml-0.5"
            onClick={toggleTicketsForm}
            disabled={
              !userId ||
              event.profiles?.user_id === userId ||
              event.tickets_count === event.max_attendees
            }
          >
            Book a sit
          </Button>
          <Button
            icon={<FontAwesomeIcon icon={faMagnifyingGlass} size="xs" />}
            onClick={viewDetails}
            htmlType="button"
            type="default"
            className="w-full mr-0.5"
          >
            Details
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
          action={`/events/${event.id}/tickets/register`}
          onSubmit={sendRequest}
          ref={formRef}
        >
          <input
            type="number"
            min={1}
            max={event.max_attendees - event.tickets_count}
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
