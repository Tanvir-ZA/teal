import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { IProduct } from "../types/product";

interface IAnalytics {
  id: number;
  product_id: number;
  views: number;
  add_to_cart: number;
  created_at: string;
}

interface IProductAnalytics extends IAnalytics {
  product: IProduct;
}

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<IProductAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    const { data: analyticsData, error: analyticsError } =
      await supabase
        .from("product_analytics")
        .select("*")
        .order("views", { ascending: false });

    if (analyticsError) {
      console.log(
        "ANALYTICS FETCH ERROR:",
        analyticsError
      );

      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }

      return;
    }

    const { data: productsData, error: productsError } =
      await supabase
        .from("products")
        .select("*");

    if (productsError) {
      console.log(
        "PRODUCTS FETCH ERROR:",
        productsError
      );

      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }

      return;
    }

    const combinedData: IProductAnalytics[] = (
      analyticsData || []
    )
      .map((item) => {
        const product = (productsData || []).find(
          (product) => product.id === item.product_id
        );

        if (!product) {
          return null;
        }

        return {
          ...item,
          product,
        };
      })
      .filter(
        (
          item
        ): item is IProductAnalytics => item !== null
      );

    setAnalytics(combinedData);

    if (isRefresh) {
      setRefreshing(false);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const totalViews = analytics.reduce(
    (total, item) => total + item.views,
    0
  );

  const totalAddToCart = analytics.reduce(
    (total, item) => total + item.add_to_cart,
    0
  );

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-500">
          Loading analytics...
        </p>
      </div>
    );
  }

  return (
    <section>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-600">
            Store Insights
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Analytics
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Track product views and customer interest.
          </p>
        </div>

        <button
          onClick={() => fetchAnalytics(true)}
          disabled={refreshing}
          className="flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg
            className={`h-4 w-4 ${
              refreshing ? "animate-spin" : ""
            }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 11a8.1 8.1 0 0 0-14.7-4.7L4 8"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v4h4"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 13a8.1 8.1 0 0 0 14.7 4.7L20 16"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 20v-4h-4"
            />
          </svg>

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Products */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Products Tracked
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            {analytics.length}
          </h2>
        </div>

        {/* Views */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Product Views
          </p>

          <h2 className="mt-3 text-3xl font-bold text-teal-700">
            {totalViews}
          </h2>
        </div>

        {/* Add to Cart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Add to Cart
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            {totalAddToCart}
          </h2>
        </div>
      </div>

      {/* Product Analytics */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-bold text-slate-900">
            Product Performance
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            See how customers interact with each product.
          </p>
        </div>

        {analytics.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="text-lg font-semibold text-slate-800">
              No analytics data yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Product views and add-to-cart activity will
              appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {analytics.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-5 p-6 transition hover:bg-slate-50 md:flex-row md:items-center md:justify-between"
              >
                {/* Product */}
                <div className="flex min-w-0 items-center gap-4">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="h-16 w-16 shrink-0 rounded-xl object-cover"
                  />

                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-slate-900">
                      {item.product.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {item.product.category}
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      ৳{item.product.price}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
                  <div className="min-w-28 rounded-xl bg-slate-50 px-5 py-3 text-center">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Views
                    </p>

                    <p className="mt-1 text-xl font-bold text-slate-900">
                      {item.views}
                    </p>
                  </div>

                  <div className="min-w-28 rounded-xl bg-teal-50 px-5 py-3 text-center">
                    <p className="text-xs font-medium uppercase tracking-wide text-teal-600">
                      Add to Cart
                    </p>

                    <p className="mt-1 text-xl font-bold text-teal-800">
                      {item.add_to_cart}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminAnalytics;