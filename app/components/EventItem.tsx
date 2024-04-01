import Button from "~/components/Button";
import SearchOutlined from "~/assets/SearchOutlined";
import { Database } from "../../database.types";

function EventItem({
  item,
}: {
  item: Database["public"]["Tables"]["events"]["Row"] & {
    tickets: { count: number }[];
    categories: { id: number; name: string };
    users: { id: number; name: string };
  };
}) {
  return (
    <div className="flex flex-col border border-gray-300 rounded-lg shadow-md hover:shadow p-3">
      <div className="-m-3 mb-0">
        <img
          src={item.img_url ?? ""}
          alt="event_img"
          className="w-full h-[300px] rounded-lg rounded-b-[0] object-cover hover:brightness-105"
        />
      </div>
      <h3 className="text-lg font-bold mt-3">{item.name}</h3>
      <div className="mt-7 flex-1 grid grid-cols-1 items-end">
        <Button
          label="Details"
          type="button"
          style="secondary"
          postIcon={<SearchOutlined style={{ marginLeft: "7px" }} />}
          className="w-[80%] mx-auto"
        />
      </div>
    </div>
  );
}

export default EventItem;
