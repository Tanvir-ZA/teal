import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { IOrder } from "../types/order";
import type { IProduct } from "../types/product";

interface IProductAnalytics {
  product_id: number;
  views: number;
  add_to_cart: number;
}

const AdminDashboard = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [analytics, setAnalytics] = useState<IProductAnalytics[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async (
    isRefresh = false
  ) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    const [
      ordersResponse,
      productsResponse,
      analyticsResponse,
    ] = await Promise.all([
      supabase
        .from("orders")
        .select("*")
        .order("created_at", {
          ascending: false,
        }),

      supabase
        .from("products")
        .select("*")
        .order("created_at", {
          ascending: false,
        }),

      supabase
        .from("product_analytics")
        .select(
          "product_id, views, add_to_cart"
        ),
    ]);

    if (ordersResponse.error) {
      console.log(
        "DASHBOARD ORDERS ERROR:",
        ordersResponse.error
      );
    }

    if (productsResponse.error) {
      console.log(
        "DASHBOARD PRODUCTS ERROR:",
        productsResponse.error
      );
    }

    if (analyticsResponse.error) {
      console.log(
        "DASHBOARD ANALYTICS ERROR:",
        analyticsResponse.error
      );
    }

    setOrders(ordersResponse.data || []);
    setProducts(productsResponse.data || []);
    setAnalytics(analyticsResponse.data || []);

    if (isRefresh) {
      setRefreshing(false);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalOrders = orders.length;

  const totalProducts = products.length;

  const activeProducts = products.filter(
    (product) => product.is_active
  ).length;

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const totalViews = analytics.reduce(
    (total, item) => total + item.views,
    0
  );

  const totalAddToCart = analytics.reduce(
    (total, item) => total + item.add_to_cart,
    0
  );

  const getProductAnalytics = (
    productId: number
  ) => {
    return (
      analytics.find(
        (item) => item.product_id === productId
      ) || {
        product_id: productId,
        views: 0,
        add_to_cart: 0,
      }
    );
  };

  const topProducts = [...products]
    .map((product) => ({
      product,
      analytics: getProductAnalytics(
        product.id
      ),
    }))
    .sort(
      (a, b) =>
        b.analytics.views -
        a.analytics.views
    )
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-500">
          Loading dashboard...
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
            Teal Admin
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Overview of your store activity.
          </p>
        </div>

        <button
          onClick={() =>
            fetchDashboardData(true)
          }
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

          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Orders */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Orders
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                {totalOrders}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 3h12v18H6z"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 8h6M9 12h6M9 16h3"
                />
              </svg>
            </div>
          </div>

          <Link
            to="/admin/orders"
            className="mt-5 inline-block text-sm font-semibold text-teal-700 hover:text-teal-800"
          >
            View orders →
          </Link>
        </div>

        {/* Products */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Products
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                {totalProducts}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 3h12v18H6z"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 7h6M9 11h6M9 15h4"
                />
              </svg>
            </div>
          </div>

          <Link
            to="/admin/products"
            className="mt-5 inline-block text-sm font-semibold text-teal-700 hover:text-teal-800"
          >
            Manage products →
          </Link>
        </div>

        {/* Views */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Product Views
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                {totalViews}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                />

                <circle
                  cx="12"
                  cy="12"
                  r="2.5"
                />
              </svg>
            </div>
          </div>

          <Link
            to="/admin/analytics"
            className="mt-5 inline-block text-sm font-semibold text-teal-700 hover:text-teal-800"
          >
            View analytics →
          </Link>
        </div>

        {/* Add to Cart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Add to Cart
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                {totalAddToCart}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 8H6"
                />

                <circle
                  cx="10"
                  cy="20"
                  r="1"
                />

                <circle
                  cx="18"
                  cy="20"
                  r="1"
                />
              </svg>
            </div>
          </div>

          <Link
            to="/admin/analytics"
            className="mt-5 inline-block text-sm font-semibold text-teal-700 hover:text-teal-800"
          >
            View analytics →
          </Link>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Active Products
          </p>

          <div className="mt-3 flex items-end gap-3">
            <h2 className="text-3xl font-bold text-slate-900">
              {activeProducts}
            </h2>

            <span className="mb-1 text-sm text-slate-500">
              of {totalProducts} total
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Pending Orders
          </p>

          <div className="mt-3 flex items-end gap-3">
            <h2 className="text-3xl font-bold text-amber-600">
              {pendingOrders}
            </h2>

            <Link
              to="/admin/orders"
              className="mb-1 text-sm font-semibold text-teal-700 hover:text-teal-800"
            >
              Review orders →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders + Top Products */}
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        {/* Recent Orders */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="font-bold text-slate-900">
                Recent Orders
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest customer orders
              </p>
            </div>

            <Link
              to="/admin/orders"
              className="text-sm font-semibold text-teal-700 hover:text-teal-800"
            >
              View all
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-slate-500">
                No orders yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {orders
                .slice(0, 5)
                .map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between gap-4 px-6 py-4"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800">
                        {order.customer_name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Order #{order.id}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-slate-800">
                        ৳{order.total_price}
                      </p>

                      <span
                        className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                          order.status ===
                          "confirmed"
                            ? "bg-green-50 text-green-700"
                            : order.status ===
                              "cancelled"
                            ? "bg-red-50 text-red-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="font-bold text-slate-900">
                Product Performance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Most viewed products
              </p>
            </div>

            <Link
              to="/admin/analytics"
              className="text-sm font-semibold text-teal-700 hover:text-teal-800"
            >
              View all
            </Link>
          </div>

          {topProducts.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-slate-500">
                No products yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {topProducts.map(
                ({
                  product,
                  analytics: productAnalytics,
                }) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 px-6 py-4"
                  >
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-12 w-12 shrink-0 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-400">
                        No image
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-slate-800">
                        {product.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {product.category}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-slate-800">
                        {productAnalytics.views}
                      </p>

                      <p className="text-xs text-slate-500">
                        views
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-bold text-slate-900">
          Quick Actions
        </h2>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Link
            to="/admin/products"
            className="rounded-xl border border-slate-200 px-5 py-4 transition hover:border-teal-300 hover:bg-teal-50"
          >
            <p className="font-semibold text-slate-800">
              Manage Products
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Add, edit or remove products.
            </p>
          </Link>

          <Link
            to="/admin/orders"
            className="rounded-xl border border-slate-200 px-5 py-4 transition hover:border-teal-300 hover:bg-teal-50"
          >
            <p className="font-semibold text-slate-800">
              Manage Orders
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Review and update customer orders.
            </p>
          </Link>

          <Link
            to="/admin/analytics"
            className="rounded-xl border border-slate-200 px-5 py-4 transition hover:border-teal-300 hover:bg-teal-50"
          >
            <p className="font-semibold text-slate-800">
              View Analytics
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Track product performance.
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;