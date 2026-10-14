import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { supabase } from "../lib/supabase";
import type { IProduct } from "../types/product";

const categories = ["All", "T-Shirts", "Shirts", "Pants", "Hoodies", "Others"];

const Shop = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category") || "All";
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.log("PRODUCT FETCH ERROR:", error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // Filter Logic: Category & Search Name
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" ||
      product.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleCategoryChange = (category: string) => {
    if (category === "All") {
      searchParams.delete("category");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category });
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-8 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0D9488]">
            TEAL Collection
          </span>
          <h1 className="text-3xl font-black text-[#0F172A] sm:text-4xl">
            Shop All Products
          </h1>
          <p className="text-sm text-slate-500">
            Find your favorite styles from our premium fashion line.
          </p>
        </div>

        {/* Filter Controls: Search Box & Category Buttons */}
        <div className="mb-10 space-y-6">
          
          {/* Search Input */}
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search products by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200/80 bg-white py-3 pl-11 pr-4 text-sm text-[#0F172A] outline-none shadow-sm transition focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]"
            />
            <svg
              className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2.5">
            {categories.map((category) => {
              const isActive =
                (category === "All" && selectedCategory === "All") ||
                category.toLowerCase() === selectedCategory.toLowerCase();

              return (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-sm ${
                    isActive
                      ? "bg-[#0D9488] text-white shadow-md shadow-[#0D9488]/20"
                      : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100 hover:text-[#0F172A]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="h-80 w-full animate-pulse rounded-3xl bg-slate-200"
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-slate-200/80 bg-white py-20 text-center shadow-sm">
            <p className="text-base font-semibold text-slate-600">
              No products found matching your search.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                handleCategoryChange("All");
              }}
              className="mt-4 rounded-xl bg-[#0D9488] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#0F172A]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </main>
  );
};

export default Shop;