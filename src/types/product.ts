export interface IProduct {
  id: number;
  created_at?: string;

  name: string;
  price: number;
  category: string;
  description: string;

  images: string[];

  stock: number;
  is_active: boolean;
}