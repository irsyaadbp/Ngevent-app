import {ResponseType} from '@ngevent/types/propTypes';
import server from './server';

export type OrderInput = {
  event_id: number;
  qty: number;
  total_price: number;
};

export type OrderData = {
  event_id: number;
  qty: number;
  total_price: number;
  order_number: string;
  user_id: number;
  event_date: string;
  attended_date: string | null;
  id: number;
  status: string;
  created_at: string;
  updated_at: string;
};

type ResponseCreateOrder = ResponseType<OrderData>;
export async function sendCreateOrder(
  dataInput: OrderInput,
): Promise<ResponseCreateOrder> {
  const {data} = await server.post<ResponseCreateOrder>(
    'orders/create',
    dataInput,
  );

  if (data.success) {
    return data;
  }
  throw new Error(data.message || 'Some error occured');
}
