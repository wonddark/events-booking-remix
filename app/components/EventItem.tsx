import Button from "~/components/Button";
import SearchOutlined from "~/assets/SearchOutlined";
import { Database } from "../../database.types";
import { Link, useFetcher, useNavigate } from "@remix-run/react";
import CheckPlus from "~/assets/CheckPlus";
import {
  FormEventHandler,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";

type Props = Readonly<{
  item: Pick<
    Database["public"]["Tables"]["events"]["Row"],
    "id" | "img_url" | "name" | "tickets_count" | "max_attendees"
  > & {
    categories: Database["public"]["Tables"]["categories"]["Row"] | null;
    event_owner: Pick<
      Database["public"]["Views"]["event_owner"]["Row"],
      "user_id" | "avatar" | "display_name"
    > | null;
  };
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
  const avaterRef = useRef<HTMLImageElement>(null);

  return (
    <div className="flex flex-col border border-gray-300 rounded-lg shadow-md hover:shadow p-3 w-full md:w-[280px]">
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
            className="w-full h-[240px] rounded-lg rounded-b-[0] object-cover hover:brightness-105"
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
              (avaterRef.current!.src = "/images/user_avatar_placeholder.jpeg")
            }
            ref={avaterRef}
            alt={`${item.event_owner.display_name} avatar`}
            className="rounded-full w-5 h-5 object-cover"
          />
          {item.event_owner.display_name}
        </Link>
      )}
      <div className="mt-7 flex-1 flex justify-start items-end">
        <Button
          label="Details"
          type="button"
          style="secondary"
          postIcon={<SearchOutlined />}
          onClick={viewDetails}
          className="w-3/5 mr-0.5"
        />
        {userId && item.event_owner?.user_id !== userId && (
          <Button
            label="Book a sit"
            type="button"
            style="primary"
            postIcon={<CheckPlus />}
            className="w-2/5 ml-0.5"
            onClick={toggleTicketsForm}
          />
        )}
        {userId && item.event_owner?.user_id === userId && (
          <span className="w-2/5 ml-0.5 py-1.5 px-3.5 border border-transparent text-right">
            {item.tickets_count}
          </span>
        )}
      </div>
      {showTicketsForm && (
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
          />
          <Button
            label="Ok"
            type="submit"
            loading={registerTicket.state === "submitting"}
          />
          <Button label="Cancel" type="button" onClick={cancelOp} />
        </registerTicket.Form>
      )}
    </div>
  );
}

export default EventItem;
