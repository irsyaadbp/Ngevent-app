import {ResponsePaginationType, ResponseType} from '@ngevent/types/propTypes';
import {CategoryData} from './category';
import server from './server';

export type EventData = {
  id: number;
  event_name: string;
  poster: string;
  location: string;
  description: string;
  event_date: string;
  category_id: number;
  ticket_price: number;
  created_at: string;
  updated_at: number;
  total_ticket: number;
  sold_ticket: number;
  category: CategoryData;
};

export type ResponseEvents = ResponsePaginationType<EventData[]>;
export type ParamQuery = {
  page?: number;
  perPage?: number;
  search?: string;
  orderBy?: 'asc' | 'desc';
  sortBy?: string;
  filter?: string;
  startDate?: string;
  endDate?: string;
};

export async function getAllEvents({
  page = 1,
  ...params
}: ParamQuery): Promise<ResponseEvents> {
  const {data} = await server.get<ResponseEvents>('events', {
    params: {page, ...params},
  });

  if (data.success) {
    return data;
  }
  throw new Error(data.message || 'Some error occured');
}

export type DetailEventData = {
  id: number;
  event_name: string;
  poster: string;
  location: string;
  description: string;
  event_date: string;
  category_id: number;
  total_ticket: number;
  sold_ticket: number;
  ticket_price: number;
  created_at: string;
  updated_at: string;
  category: CategoryData;
};

export type ResponseDetailEvent = ResponseType<DetailEventData>;

export async function getDetailEventById(
  id: string,
): Promise<ResponseDetailEvent> {
  const {data} = await server.get<ResponseDetailEvent>(`events/${id}`);

  if (data.success) {
    return data;
  }
  throw new Error(data.message || 'Some error occured');
}
