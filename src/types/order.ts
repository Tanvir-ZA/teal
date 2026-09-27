export interface IOrderItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder {
  id: number;
  created_at: string;
  customer_name: string;
  phone: string;
  address: string;
  note: string;
  items: IOrderItem[];
  total_price: number;
  status: "pending" | "confirmed" | "cancelled";
}