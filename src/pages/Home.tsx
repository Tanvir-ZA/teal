import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BannerCarousel from "../components/BannerCarousel";
import ProductCard from "../components/ProductCard";
import { supabase } from "../lib/supabase";
import type { IProduct } from "../types/product";
import coverBanner from "../assets/banner.png";

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
    <main className="min-h-screen bg-[#F4F2F2] space-y-16 pb-20">
      {/* Hero Banner Section */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <BannerCarousel />
      </section>

      {/* High Contrast Feature Bar */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 rounded-3xl border-2 border-[#215E61]/20 bg-[#1D2128] p-6 shadow-xl md:grid-cols-4">
          
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#215E61] text-[#FF9E20] shadow-md">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm">Fast Shipping</h4>
              <p className="text-xs text-[#F4F2F2]/70">Across Bangladesh</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#215E61] text-[#FF9E20] shadow-md">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm">Easy Return</h4>
              <p className="text-xs text-[#F4F2F2]/70">Hassle-free policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#215E61] text-[#FF9E20] shadow-md">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm">100% Quality</h4>
              <p className="text-xs text-[#F4F2F2]/70">Premium Fabric</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#215E61] text-[#FF9E20] shadow-md">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm">24/7 Support</h4>
              <p className="text-xs text-[#F4F2F2]/70">Friendly Care</p>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Products Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#FF9E20] bg-[#1D2128] px-3 py-1 rounded-full">
              Handpicked Selection
            </span>
            <h2 className="mt-3 text-3xl font-black text-[#1D2128] sm:text-4xl">
              Featured Products
            </h2>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-xl bg-[#215E61] px-5 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#FF9E20] hover:text-[#1D2128] shadow-md"
          >
            Explore All Collection →
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-80 w-full animate-pulse rounded-3xl bg-[#1D2128]/10"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-3xl border-2 border-[#1D2128]/10 bg-white py-16 text-center">
            <p className="text-[#1D2128]/70 font-bold">No products available at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Cover Banner Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border-2 border-[#215E61] shadow-2xl">
          <div className="relative h-[300px] w-full sm:h-[400px] md:h-[480px]">
            <img
              src={coverBanner}
              alt="TEAL Collection Cover"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1D2128]/60 p-6 text-center text-white backdrop-blur-[2px]">
              <span className="inline-block rounded-full bg-[#FF9E20] px-5 py-1.5 text-xs font-black text-[#1D2128] shadow-lg">
                SPECIAL PROMOTION
              </span>
              <h3 className="mt-4 text-3xl font-black sm:text-5xl text-white drop-shadow-lg">
                Elevate Your Daily Style
              </h3>
              <p className="mt-2 max-w-lg text-[#F4F2F2] text-sm sm:text-base font-medium">
                Modern clothing crafted with extreme detail and high-end fabric.
              </p>
              <div className="mt-6">
                <Link
                  to="/shop"
                  className="inline-block rounded-2xl bg-[#215E61] px-9 py-4 text-base font-black text-white shadow-xl transition hover:bg-[#FF9E20] hover:text-[#1D2128] hover:scale-105"
                >
                  Shop Collection Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;