import { useEffect, useState } from "react";
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime.js";

dayjs.extend(relativeTime);

function EventItemDates({
  event,
}: Readonly<{
  event: {
    start_date: string;
    end_date: string;
  };
}>) {
  const [isPending, setIsPending] = useState(true);
  const [isOver, setIsOver] = useState(false);
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());

  useEffect(() => {
    setIsPending(dayjs().isBefore(dayjs(event.start_date)));
    setIsOver(dayjs().isAfter(dayjs(event.end_date)));
    setStartDate(dayjs(event.start_date));
    setEndDate(dayjs(event.end_date));
  }, []);
  if (isPending) {
    return <span>Will start {dayjs(startDate).fromNow()}</span>;
  }
  if (!isPending && !isOver) {
    return <div>Running now</div>;
  }
  return <div>Finished {dayjs(endDate).fromNow()}</div>;
}

export default EventItemDates;
