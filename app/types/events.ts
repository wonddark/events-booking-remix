import { Database } from "../../database.types";

export type Event = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  category: { id: number; name: string };
  availableAttendeesCount: number;
  reservedTickets: number;
  img?: string;
};

export type EventsResponse = {
  events: Event[];
  total: number;
};

export type EventElement = Pick<
  Database["public"]["Tables"]["events"]["Row"],
  | "id"
  | "img_url"
  | "name"
  | "tickets_count"
  | "max_attendees"
  | "start_date"
  | "end_date"
> & {
  categories: Database["public"]["Tables"]["categories"]["Row"] | null;
  event_owner: Pick<
    Database["public"]["Views"]["event_owner"]["Row"],
    "user_id" | "avatar" | "display_name"
  > | null;
};
