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
