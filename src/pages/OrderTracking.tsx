import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface IOrderItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  selectedSize?: string;
}

interface IOrder {
  id: number;
  created_at: string;
  customer_name: string;
  phone: string;
  address: string;
  note?: string;
  items: IOrderItem[];
  total_price: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
}

const OrderTracking = () => {
  const [phoneInput, setPhoneInput] = useState("");
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanPhone = phoneInput.trim();
    if (!cleanPhone) {
      alert("Please enter a valid phone number.");
      return;
    }

    setLoading(true);
    setSearched(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .ilike("phone", `%${cleanPhone}%`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("ORDER TRACKING SEARCH ERROR:", error);
      setOrders([]);
    } else {
      setOrders(data || []);
    }

    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F2F2] py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="text-center space-y-2">
          <span className="inline-block rounded-full bg-[#1D2128] px-3.5 py-1 text-xs font-black uppercase tracking-widest text-[#FF9E20]">
            Live Order Status
          </span>
          <h1 className="text-3xl font-black text-[#1D2128] sm:text-4xl">
            Track Your Order
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Enter your mobile phone number to check the status of your recent orders.
          </p>
        </div>

        {/* Search Input Box */}
        <form
          onSubmit={handleSearch}
          className="rounded-3xl border-2 border-[#1D2128]/10 bg-white p-6 shadow-xl sm:p-8 space-y-4"
        >
          <label className="block text-xs font-black uppercase tracking-wider text-[#1D2128]">
            Mobile Phone Number *
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="tel"
              required
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="e.g. 017XXXXXXXX"
              className="flex-1 rounded-2xl border-2 border-gray-200 p-4 text-base font-bold text-[#1D2128] outline-none transition focus:border-[#215E61]"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-[#215E61] px-8 py-4 text-base font-black text-white shadow-lg transition hover:bg-[#FF9E20] hover:text-[#1D2128] disabled:opacity-50"
            >
              {loading ? "Searching..." : "Track Orders"}
            </button>
          </div>
        </form>

        {/* Search Results Display */}
        {searched && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="rounded-3xl border-2 border-[#1D2128]/10 bg-white p-12 text-center shadow-md space-y-3">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  🔍
                </div>
                <h3 className="text-xl font-black text-[#1D2128]">
                  No Orders Found
                </h3>
                <p className="text-sm text-slate-500">
                  We couldn't find any orders linked with phone number:{" "}
                  <span className="font-bold text-[#1D2128]">{phoneInput}</span>
                </p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-3xl border-2 border-[#1D2128]/10 bg-white p-6 shadow-xl space-y-5"
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
                    <div>
                      <span className="text-xs font-bold text-slate-400">Order ID</span>
                      <h3 className="text-lg font-black text-[#1D2128]">#{order.id}</h3>
                      <p className="text-xs text-slate-500">
                        Placed on: {new Date(order.created_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-block rounded-full border px-4 py-1.5 text-xs font-black uppercase tracking-wider ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                      <p className="mt-1 text-base font-black text-[#FF9E20]">
                        ৳{order.total_price}
                      </p>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="rounded-2xl bg-[#F4F2F2] p-4 text-xs font-bold text-slate-700 space-y-1">
                    <p><span className="text-slate-400">Name:</span> {order.customer_name}</p>
                    <p><span className="text-slate-400">Phone:</span> {order.phone}</p>
                    <p><span className="text-slate-400">Address:</span> {order.address}</p>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                      Order Items
                    </h4>
                    <div className="divide-y divide-gray-100 border-t border-b border-gray-100 py-2 space-y-2">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm pt-2">
                          <div>
                            <span className="font-bold text-[#1D2128]">{item.name}</span>
                            {item.selectedSize && (
                              <span className="ml-2 inline-block rounded bg-[#215E61] px-2 py-0.5 text-[10px] font-black text-white">
                                Size: {item.selectedSize}
                              </span>
                            )}
                            <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-black text-[#1D2128]">
                            ৳{item.price * item.quantity}
                          </span>