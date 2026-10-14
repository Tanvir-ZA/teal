export interface IProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number; // Total combined stock
  sizes_stock?: Record<string, number>; // e.g. { "S": 3, "M": 4, "L": 0, "XL": 2 }
  images: string[];
  description?: string;
  is_active: boolean;
  created_at?: string;
}

export interface ICartItem extends IProduct {
  quantity: number;
  selectedSize?: string;
}