import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { supabase } from "../lib/supabase";
import type { IProduct } from "../types/product";

const Shop = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.log("PRODUCT FETCH ERROR:", error);
        setLoading(false);
        return;
      }

      console.log("PRODUCTS FROM SUPABASE:", data);

      setProducts(data || []);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Loading products...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
          Teal Collection
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Shop All Products
        </h1>

        <p className="mt-3 text-gray-600">
          Find your favorite style from our collection.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-gray-500">
            No products available.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default Shop;