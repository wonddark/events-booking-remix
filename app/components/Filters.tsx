import { Select } from "antd";
import { useSearchParams } from "@remix-run/react";
import dayjs from "dayjs";

function Filters({
  categoryId,
  userId,
}: Readonly<{
  categoryId: string | undefined;
  userId: string | undefined;
}>) {
  const [searchParams, setSearchParams] = useSearchParams();
  if (categoryId) {
    searchParams.set("category_id", categoryId);
  }
  if (userId) {
    searchParams.set("user_id", userId);
  }
  return (
    <div className="flex flex-col gap-2 md:flex-row md:gap-3  mb-5">
      <Select
        defaultValue="published_at"
        options={[
          { value: "published_at", label: "Published" },
          { value: "updated_at", label: "Updated" },
          { value: "start_date", label: "Start" },
          { value: "end_date", label: "End" },
          { value: "tickets_count", label: "Registered tickets" },
        ]}
        onChange={(value) => {
          searchParams.set("sort_by", value);
          setSearchParams(searchParams);
        }}
      />
      <Select
        defaultValue="ASC"
        options={[
          { value: "ASC", label: "Ascendant" },
          { value: "DESC", label: "Descendant" },
        ]}
        onChange={(value) => {
          searchParams.set("sort_order", value);
          setSearchParams(searchParams);
        }}
      />
      <Select
        defaultValue="running"
        options={[
          { value: "ended", label: "Ended" },
          { value: "running", label: "Running" },
          { value: "pending", label: "Pending" },
        ]}
        onChange={(value) => {
          searchParams.set("status", value);
          searchParams.set(
            "reference_date",
            dayjs().format("YYYY-MM-DD HH:mm:ss.sssZZ")
          );
          setSearchParams(searchParams);
        }}
      />
    </div>
  );
}

export default Filters;
