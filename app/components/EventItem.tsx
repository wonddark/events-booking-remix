import Button from "~/components/Button";
import SearchOutlined from "~/assets/SearchOutlined";
import { Database } from "../../database.types";
import { Link, useFetcher, useNavigate } from "@remix-run/react";
import CheckPlus from "~/assets/CheckPlus";
import { FormEventHandler, MouseEventHandler, useState } from "react";

type Props = Readonly<{
  item: Database["public"]["Tables"]["events"]["Row"] & {
    tickets: { count: number }[];
    categories: { id: number; name: string };
    users: { id: number; name: string };
  };
  auth: boolean;
}>;

function EventItem({ item, auth }: Props) {
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

  return (
    <div className="flex flex-col border border-gray-300 rounded-lg shadow-md hover:shadow p-3 w-full md:w-[280px]">
      <div className="-m-3 mb-0">
        <Link to={`/events/${item.id}`}>
          <img
            src={item.img_url ?? ""}
            alt="event_img"
            className="w-full h-[240px] rounded-lg rounded-b-[0] object-cover hover:brightness-105"
          />
        </Link>
      </div>
      <Link to={`/events/${item.id}`} className="font-bold mt-3">
        {item.name}
      </Link>
      <div className="mt-7 flex-1 flex justify-end items-end">
        {auth && (
          <Button
            label="Book a sit"
            type="button"
            style="primary"
            postIcon={<CheckPlus />}
            className="w-2/5 mr-0.5"
            onClick={toggleTicketsForm}
          />
        )}
        <Button
          label="Details"
          type="button"
          style="secondary"
          postIcon={<SearchOutlined />}
          onClick={viewDetails}
          className="w-3/5 ml-0.5"
        />
      </div>
      {showTicketsForm && (
        <registerTicket.Form
          method="post"
          action={`/events/${item.id}/tickets/register`}
          onSubmit={sendRequest}
        >
          <input
            type="number"
            min={1}
            max={item.max_attendees - item.tickets[0].count}
            name="tickets_count"
          />
          <Button label="Ok" type="submit" />
          <Button label="Cancel" type="button" onClick={cancelOp} />
        </registerTicket.Form>
      )}
    </div>
  );
}

export default EventItem;
