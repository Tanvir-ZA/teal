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
    <main className="min-h-screen bg-[#FAFAFA] space-y-16 pb-16">
      {/* Hero Banner Carousel Section */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <BannerCarousel />
      </section>

      {/* Feature & Trust Bar with Premium SVG Icons */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm md:grid-cols-4">
          
          {/* Fast Shipping */}
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0D9488]/10 text-[#0D9488]">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-[#0F172A] text-sm">Fast Shipping</h4>
              <p className="text-xs text-slate-500">Across Bangladesh</p>
            </div>
          </div>

          {/* Easy Return */}
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0D9488]/10 text-[#0D9488]">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-[#0F172A] text-sm">Easy Return</h4>
              <p className="text-xs text-slate-500">Hassle-free policy</p>
            </div>
          </div>

          {/* 100% Quality */}
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0D9488]/10 text-[#0D9488]">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-[#0F172A] text-sm">100% Quality</h4>
              <p className="text-xs text-slate-500">Premium Materials</p>
            </div>
          </div>

          {/* 24/7 Support */}
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0D9488]/10 text-[#0D9488]">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-[#0F172A] text-sm">24/7 Support</h4>
              <p className="text-xs text-slate-500">Friendly Assistance</p>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Products Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#0D9488]">
              Curated For You
            </span>
            <h2 className="mt-1 text-2xl font-black text-[#0F172A] sm:text-3xl">
              Featured Products
            </h2>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0D9488] transition hover:text-[#0F172A]"
          >
            Explore All Products →
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-80 w-full animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-3xl border border-slate-200/80 bg-white py-16 text-center">
            <p className="text-slate-500">No products available at the moment.</p>
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
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0F172A] via-slate-900 to-[#0D9488]/80 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <div className="relative z-10 mx-auto max-w-2xl space-y-4">
            <span className="inline-block rounded-full bg-[#F59E0B] px-3.5 py-1 text-xs font-extrabold text-slate-950">
              NEW SEASON COLLECTION
            </span>
            <h3 className="text-3xl font-black sm:text-4xl">
              Upgrade Your Wardrobe Today
            </h3>
            <p className="text-slate-300 text-sm sm:text-base">
              Discover unique style, premium fabrics, and unmatched comfort with TEAL clothing.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-block rounded-xl bg-[#0D9488] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#0D9488]/30 transition hover:bg-white hover:text-[#0F172A]"
              >
                Shop Collection Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;