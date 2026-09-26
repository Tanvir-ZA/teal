import type { IProduct } from "./product";

export interface IOrderItem {
  product: IProduct;
  quantity: number;
}

export interface IOrder {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  note: string;
  items: IOrderItem[];
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}