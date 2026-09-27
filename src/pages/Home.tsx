import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { supabase } from "../lib/supabase";
import type { IProduct } from "../types/product";

const Home = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(4);

      if (error) {
        console.log(
          "FEATURED PRODUCTS ERROR:",
          error
        );

        setLoading(false);
        return;
      }

      setProducts(data || []);
      setLoading(false);
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="flex min-h-[80vh] items-center bg-gray-100">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest">
            Welcome to Teal
          </p>

          <h1 className="text-5xl font-bold md:text-7xl">
            Style That Speaks
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-gray-600">
            Discover comfortable and stylish clothing made for your
            everyday look.
          </p>

          <Link
            to="/shop"
            className="mt-8 inline-block rounded-lg bg-black px-6 py-3 font-semibold text-white"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Our Collection
          </p>

          <h2 className="mt-2 text-3xl font-bold md:text-4xl">
            Featured Products
          </h2>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <p className="text-gray-500">
              Loading products...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center">
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
      </section>
    </main>
  );
};

export default Home;