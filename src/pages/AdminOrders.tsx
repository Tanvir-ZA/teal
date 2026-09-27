import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { IOrder } from "../types/order";

const AdminOrders = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(
    null
  );

  const fetchOrders = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("ORDERS FETCH ERROR:", error);

      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }

      return;
    }

    setOrders(data || []);

    if (isRefresh) {
      setRefreshing(false);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (
    orderId: number,
    status: "pending" | "confirmed" | "cancelled"
  ) => {
    setUpdatingOrderId(orderId);

    const { error } = await supabase
      .from("orders")
      .update({
        status,
      })
      .eq("id", orderId);

    if (error) {
      console.log("ORDER STATUS UPDATE ERROR:", error);
      setUpdatingOrderId(null);
      return;
    }

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
            }
          : order
      )
    );

    setUpdatingOrderId(null);
  };

  const getStatusStyle = (status: IOrder["status"]) => {
    if (status === "confirmed") {
      return "bg-green-50 text-green-700";
    }

    if (status === "cancelled") {
      return "bg-red-50 text-red-700";
    }

    return "bg-amber-50 text-amber-700";
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-500">
          Loading orders...
        </p>
      </div>
    );
  }

  return (
    <section>
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-600">
            Store Management
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Orders
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage customer orders.
          </p>
        </div>

        <button
          onClick={() => fetchOrders(true)}
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

          {refreshing ? "Refreshing..." : "Refresh Orders"}
        </button>
      </div>

      {/* Orders */}
      {orders.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <h2 className="text-xl font-semibold text-slate-800">
            No orders yet
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Customer orders will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              {/* Order Header */}
              <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Order #{order.id}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {new Date(
                      order.created_at
                    ).toLocaleString()}
                  </p>
                </div>

                {/* Status */}
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>

                  <select
                    value={order.status}
                    onChange={(event) =>
                      updateOrderStatus(
                        order.id,
                        event.target.value as
                          | "pending"
                          | "confirmed"
                          | "cancelled"
                      )
                    }
                    disabled={updatingOrderId === order.id}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="pending">
                      Pending
                    </option>

                    <option value="confirmed">
                      Confirmed
                    </option>

                    <option value="cancelled">
                      Cancelled
                    </option>
                  </select>
                </div>
              </div>

              {/* Order Content */}
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {/* Customer Information */}
                <div>
                  <h3 className="font-semibold text-slate-800">
                    Customer
                  </h3>

                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p>
                      <span className="font-medium">
                        Name:
                      </span>{" "}
                      {order.customer_name}
                    </p>

                    <p>
                      <span className="font-medium">
                        Phone:
                      </span>{" "}
                      {order.phone}
                    </p>

                    <p>
                      <span className="font-medium">
                        Address:
                      </span>{" "}
                      {order.address}
                    </p>

                    {order.note && (
                      <p>
                        <span className="font-medium">
                          Note:
                        </span>{" "}
                        {order.note}
                      </p>
                    )}
                  </div>
                </div>

                {/* Products */}
                <div>
                  <h3 className="font-semibold text-slate-800">
                    Products
                  </h3>

                  <div className="mt-4 space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.product_id}
                        className="flex items-center justify-between rounded-xl bg-slate-50 p-3"
                      >
                        <div>
                          <p className="font-medium text-slate-800">
                            {item.name}
                          </p>

                          <p className="text-sm text-slate-500">
                            ৳{item.price} × {item.quantity}
                          </p>
                        </div>

                        <p className="font-semibold text-slate-800">
                          ৳{item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="mt-4 flex items-center justify-between rounded-xl bg-teal-50 p-4">
                    <span className="font-semibold text-teal-800">
                      Total
                    </span>

                    <span className="text-xl font-bold text-teal-900">
                      ৳{order.total_price}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AdminOrders;