import type { IProduct } from "../types/product";

export const products: IProduct[] = [
  {
    id: 1,
    name: "Classic Black T-Shirt",
    price: 650,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
      "https://images.unsplash.com/photo-1583743814966-8936f37f4e5a",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27",
    ],
    category: "T-Shirt",
    description:
      "A comfortable classic black t-shirt for everyday wear.",
  },

  {
    id: 2,
    name: "Premium White T-Shirt",
    price: 750,
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f37f4e5a",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27",
    ],
    category: "T-Shirt",
    description:
      "Simple and premium white t-shirt with a clean look.",
  },

  {
    id: 3,
    name: "Casual Denim Shirt",
    price: 950,
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273",
      "https://images.unsplash.com/photo-1608063615781-e2ef8c73d114",
    ],
    category: "Shirt",
    description:
      "A stylish denim shirt for casual everyday outfits.",
  },

  {
    id: 4,
    name: "Oversized Hoodie",
    price: 1200,
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
      "https://images.unsplash.com/photo-1509942774463-acf339cf87d5",
      "https://images.unsplash.com/photo-1578681994506-b8f463449011",
    ],
    category: "Hoodie",
    description:
      "Comfortable oversized hoodie with a modern fit.",
  },
];