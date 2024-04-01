import { EventsResponse } from "~/types/events";

export type CategoryResponse = EventsResponse & {
  category: {
    id: number;
    name: string;
  };
};
