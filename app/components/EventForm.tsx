import { Form } from "@remix-run/react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import CategorySelector from "~/components/CategorySelector";
import { Database } from "../../database.types";
import { useRef } from "react";

type Props = Readonly<{
  event:
    | (Database["public"]["Tables"]["events"]["Row"] & {
        categories: Database["public"]["Tables"]["categories"]["Row"];
      })
    | null;
}>;

function EventForm({ event }: Props) {
  const inputCategoryRef = useRef<HTMLInputElement>(null);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Form
        className="flex flex-col items-center gap-3"
        method="POST"
        id="event-form"
      >
        <div className="w-full">
          <label htmlFor="event_name" className="text-primary-950">
            Name{" "}
            <input
              type="text"
              className="rounded-lg py-1.5 px-3.5 w-full"
              placeholder="Event name"
              id="event_name"
              name="name"
              defaultValue={event?.name}
            />
          </label>
        </div>
        <div className="w-full">
          <label htmlFor="event_description" className="text-primary-950">
            Description{" "}
            <textarea
              className="rounded-lg py-1.5 px-3.5 h-40 w-full"
              placeholder="Write here a meaninful description for your new event..."
              id="event_description"
              name="description"
              defaultValue={event?.description}
            />
          </label>
        </div>
        <div className="w-full">
          <label htmlFor="event_attendees" className="text-primary-950">
            Max attendees{" "}
            <input
              type="number"
              min={50}
              max={1_000_000}
              className="rounded-lg py-1.5 px-3.5 w-full"
              placeholder="50"
              id="event_attendees"
              name="max_attendees"
              defaultValue={event?.max_attendees}
            />
          </label>
        </div>
        <div className="w-full">
          <label htmlFor="event_start_date" className="text-primary-950">
            Starting at{" "}
            <DatePicker
              format="YYYY-MM-DD HH:mm:ss"
              showTime={{ defaultValue: dayjs("09:00:00", "HH:mm:ss") }}
              name="start_date"
              className="rounded-lg py-1.5 px-3.5 w-full"
              defaultValue={dayjs(event?.start_date)}
            />
          </label>
        </div>
        <div className="w-full">
          <label htmlFor="event_end_date" className="text-primary-950">
            Ending at{" "}
            <DatePicker
              format="YYYY-MM-DD HH:mm:ss"
              // disabledDate={disabledDate}
              // disabledTime={disabledDateTime}
              showTime={{ defaultValue: dayjs("10:00:00", "HH:mm:ss") }}
              name="end_date"
              className="rounded-lg py-1.5 px-3.5 w-full"
              defaultValue={dayjs(event?.end_date)}
            />
          </label>
        </div>
        <input type="text" hidden name="category_id" ref={inputCategoryRef} />
      </Form>

      <div className="flex flex-col items-center gap-3">
        <div className="w-full">
          <label className="text-primary-950" htmlFor="category_selector">
            Category{" "}
            <CategorySelector
              inputRef={inputCategoryRef}
              id="category_selector"
            />
          </label>
        </div>

        <div className="w-full">
          <label htmlFor="event_img" className="text-primary-950">
            Image url{" "}
            <input
              type="url"
              className="rounded-lg py-1.5 px-3.5 w-full"
              placeholder="https://someservice.com/image.jpg"
              id="event_img"
              name="img_url"
              form="event-form"
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export default EventForm;
