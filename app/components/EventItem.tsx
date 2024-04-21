import Button from "~/components/Button";
import SearchOutlined from "~/assets/SearchOutlined";
import { Database } from "../../database.types";
import { Link, useNavigate } from "@remix-run/react";
import CheckPlus from "~/assets/CheckPlus";

function EventItem({
  item,
}: Readonly<{
  item: Database["public"]["Tables"]["events"]["Row"] & {
    tickets: { count: number }[];
    categories: { id: number; name: string };
    users: { id: number; name: string };
  };
}>) {
  const navigate = useNavigate();
  const viewDetails = () => {
    navigate(`/events/${item.id}`);
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
      <div className="mt-7 flex-1 grid grid-cols-[40%_50%] justify-between items-end">
        <Button
          label="Book a sit"
          type="button"
          style="primary"
          postIcon={<CheckPlus />}
        />
        <Button
          label="Details"
          type="button"
          style="secondary"
          postIcon={<SearchOutlined />}
          onClick={viewDetails}
        />
      </div>
    </div>
  );
}

export default EventItem;
