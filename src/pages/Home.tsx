import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BannerCarousel from "../components/BannerCarousel";
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
        console.log("FEATURED PRODUCTS ERROR:", error);
        setLoading(false);
        return;
      }

      setProducts(data || []);
      setLoading(false);
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <main className="bg-[#FFF4E1]/40 min-h-screen space-y-16 py-8">
      {/* Hero Banner Carousel Section */}
      <section className="mx-auto max-w-7xl px-4">
        <BannerCarousel />
      </section>

      {/* Feature / Trust Bar */}
      <section className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-4 rounded-2xl border border-[#428475]/10 bg-white p-6 shadow-sm md:grid-cols-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#89D7B7]/20 text-[#1A312C]">
              🚀
            </div>
            <div>
              <h4 className="font-bold text-[#1A312C] text-sm md:text-base">Fast Delivery</h4>
              <p className="text-xs text-gray-500">All over Bangladesh</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#89D7B7]/20 text-[#1A312C]">
              🔄
            </div>
            <div>
              <h4 className="font-bold text-[#1A312C] text-sm md:text-base">Easy Exchange</h4>
              <p className="text-xs text-gray-500">Hassle-free policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#89D7B7]/20 text-[#1A312C]">
              ✨
            </div>
            <div>
              <h4 className="font-bold text-[#1A312C] text-sm md:text-base">Quality First</h4>
              <p className="text-xs text-gray-500">100% Premium Fabric</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#89D7B7]/20 text-[#1A312C]">
              🎧
            </div>
            <div>
              <h4 className="font-bold text-[#1A312C] text-sm md:text-base">Support</h4>
              <p className="text-xs text-gray-500">Friendly customer care</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#428475]">
              Handpicked Selection
            </p>
            <h2 className="mt-1 text-3xl font-extrabold text-[#1A312C] md:text-4xl">
              Featured Products
            </h2>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 font-bold text-[#428475] transition hover:text-[#1A312C]"
          >
            View All Collection →
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-80 w-full animate-pulse rounded-2xl bg-gray-200"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-[#1A312C]/10 bg-white py-16 text-center">
            <p className="text-gray-500">No products available at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Promotional Banner Section */}
      <section className="mx-auto max-w-7xl px-4 pb-12">
        <div className="relative overflow-hidden rounded-3xl bg-[#1A312C] px-6 py-12 text-center text-white md:px-12 md:py-16">
          <div className="relative z-10 mx-auto max-w-2xl space-y-4">
            <span className="rounded-full bg-[#89D7B7] px-4 py-1.5 text-xs font-bold text-[#1A312C]">
              NEW SEASON
            </span>
            <h3 className="text-3xl font-extrabold md:text-5xl">
              Elevate Your Everyday Style
            </h3>
            <p className="text-[#89D7B7]/90 text-sm md:text-base">
              Explore our latest collection designed for comfort, durability, and contemporary fashion.
            </p>
            <div className="pt-4">
              <Link
                to="/shop"
                className="inline-block rounded-xl bg-[#428475] px-8 py-3.5 font-bold text-white shadow-lg transition hover:bg-[#89D7B7] hover:text-[#1A312C]"
              >
                Explore Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;