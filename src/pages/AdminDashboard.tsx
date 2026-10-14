import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  activeProducts: number;
  totalViews: number;
  totalAddToCart: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    activeProducts: 0,
    totalViews: 0,
    totalAddToCart: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    setLoading(true);

    try {
      // 1. Fetch Orders Stats
      const { data: orders } = await supabase.from("orders").select("id, status");
      const totalOrders = orders?.length || 0;
      const pendingOrders = orders?.filter((o) => o.status === "pending").length || 0;

      // 2. Fetch Products Stats
      const { data: products } = await supabase.from("products").select("id, is_active");
      const totalProducts = products?.length || 0;
      const activeProducts = products?.filter((p) => p.is_active).length || 0;

      // 3. Fetch Analytics Stats
      const { data: analytics } = await supabase
        .from("product_analytics")
        .select("views, add_to_cart");

      const totalViews = analytics?.reduce((sum, item) => sum + (item.views || 0), 0) || 0;
      const totalAddToCart =
        analytics?.reduce((sum, item) => sum + (item.add_to_cart || 0), 0) || 0;

      setStats({
        totalOrders,
        pendingOrders,
        totalProducts,
        activeProducts,
        totalViews,
        totalAddToCart,
      });
    } catch (err) {
      console.log("DASHBOARD FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-black text-[#1D2128]">Admin Overview</h1>
          <p className="mt-1 text-sm text-slate-500">
            Welcome back! Here is a live summary of your store activities.
          </p>
        </div>

        <button
          onClick={fetchDashboardStats}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-[#215E61] px-5 py-2.5 text-xs font-black text-white shadow-md transition hover:bg-[#FF9E20] hover:text-[#1D2128] disabled:opacity-50"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Stats
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        
        {/* Total Orders Card */}
        <div className="rounded-3xl border-2 border-[#1D2128]/10 bg-white p-6 shadow-md space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Orders Summary
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-black text-[#1D2128]">
              {loading ? "..." : stats.totalOrders}
            </p>
            <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              {stats.pendingOrders} Pending
            </span>
          </div>
          <Link
            to="/admin/orders"
            className="block text-xs font-bold text-[#215E61] hover:underline pt-2 border-t border-gray-100"
          >
            Manage Orders →
          </Link>
        </div>

        {/* Products Card */}
        <div className="rounded-3xl border-2 border-[#1D2128]/10 bg-white p-6 shadow-md space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Products Inventory
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-black text-[#1D2128]">
              {loading ? "..." : stats.totalProducts}
            </p>
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {stats.activeProducts} Active
            </span>
          </div>
          <Link
            to="/admin/products"
            className="block text-xs font-bold text-[#215E61] hover:underline pt-2 border-t border-gray-100"
          >
            Manage Products →
          </Link>
        </div>

        {/* Traffic & Analytics Card */}
        <div className="rounded-3xl border-2 border-[#1D2128]/10 bg-white p-6 shadow-md space-y-3 sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Views & Cart Additions
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-2xl font-black text-[#1D2128]">
                {loading ? "..." : stats.totalViews}
              </p>
              <p className="text-xs text-slate-500 font-bold">Total Views</p>
            </div>
            <div>
              <p className="text-2xl font-black text-[#FF9E20]">
                {loading ? "..." : stats.totalAddToCart}
              </p>
              <p className="text-xs text-slate-500 font-bold">Cart Additions</p>
            </div>
          </div>
          <Link
            to="/admin/analytics"
            className="block text-xs font-bold text-[#215E61] hover:underline pt-2 border-t border-gray-100"
          >
            View Analytics Details →
          </Link>
        </div>

      </div>

      {/* Quick Actions Panel */}
      <div className="rounded-3xl border-2 border-[#1D2128]/10 bg-white p-6 shadow-md space-y-4">
        <h2 className="text-lg font-black text-[#1D2128]">Quick Store Management</h2>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          
          <Link
            to="/admin/banners"
            className="flex items-center gap-3.5 rounded-2xl border border-gray-200 p-4 transition hover:border-[#215E61] hover:bg-[#215E61]/5"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#215E61]/10 text-[#215E61]">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h4 className="font-extrabold text-[#1D2128] text-sm">Banner Carousel</h4>
              <p className="text-xs text-slate-500">Upload & order banners</p>
            </div>
          </Link>

          <Link
            to="/admin/products"
            className="flex items-center gap-3.5 rounded-2xl border border-gray-200 p-4 transition hover:border-[#215E61] hover:bg-[#215E61]/5"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#215E61]/10 text-[#215E61]">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h4 className="font-extrabold text-[#1D2128] text-sm">Add New Product</h4>
              <p className="text-xs text-slate-500">Upload images & set stock</p>
            </div>
          </Link>

          <Link
            to="/admin/orders"
            className="flex items-center gap-3.5 rounded-2xl border border-gray-200 p-4 transition hover:border-[#215E61] hover:bg-[#215E61]/5"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#215E61]/10 text-[#215E61]">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h4 className="font-extrabold text-[#1D2128] text-sm">Update Orders</h4>
              <p className="text-xs text-slate-500">Confirm or cancel orders</p>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;