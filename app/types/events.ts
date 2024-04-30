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
  | "published_at"
  | "updated_at"
> & {
  categories: Database["public"]["Tables"]["categories"]["Row"] | null;
  profiles: Pick<
    Database["public"]["Tables"]["profiles"]["Row"],
    "user_id" | "avatar" | "display_name"
  > | null;
};
