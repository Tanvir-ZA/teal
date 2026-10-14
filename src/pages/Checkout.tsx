import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";

const Checkout = () => {
  const { cart } = useCart();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState<"inside" | "outside">("inside");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate Subtotal & Delivery Charge
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const deliveryCharge = deliveryLocation === "inside" ? 80 : 150;
  const grandTotal = subtotal + deliveryCharge;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert("Please fill in all required fields!");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = cart.map((item) => ({
        product_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const fullNote = `[Delivery: ${
        deliveryLocation === "inside" ? "Inside Dhaka (৳80)" : "Outside Dhaka (৳150)"
      }] ${note ? `- Note: ${note}` : ""}`;

      const { error } = await supabase.from("orders").insert({
        customer_name: name,
        phone: phone,
        address: address,
        note: fullNote,
        items: orderItems,
        total_price: grandTotal,
        status: "pending",
      });

      if (error) {
        console.log("ORDER SUBMIT ERROR:", error);
        alert("Failed to place order. Please try again!");
        setIsSubmitting(false);
        return;
      }

      // Successful order redirect
      window.location.href = "/order-success";
    } catch (err) {
      console.log("CHECKOUT ERROR:", err);
      alert("Something went wrong!");
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#F4F2F2] px-4">
        <div className="rounded-3xl border-2 border-[#1D2128]/10 bg-white p-10 text-center shadow-xl">
          <h1 className="text-2xl font-black text-[#1D2128]">No Items in Cart</h1>
          <p className="mt-2 text-sm text-gray-500">Please add products to your cart before proceeding to checkout.</p>
          <Link
            to="/shop"
            className="mt-6 inline-block rounded-2xl bg-[#215E61] px-6 py-3 font-black text-white transition hover:bg-[#FF9E20] hover:text-[#1D2128]"
          >
            Return to Shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F2F2] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 space-y-2">
          <span className="rounded-full bg-[#1D2128] px-3 py-1 text-xs font-black uppercase tracking-widest text-[#FF9E20]">
            Express Checkout
          </span>
          <h1 className="text-3xl font-black text-[#1D2128] sm:text-4xl">
            Complete Your Order
          </h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Customer Details Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmitOrder} className="rounded-3xl border-2 border-[#1D2128]/10 bg-white p-6 sm:p-8 shadow-xl space-y-6">
              <h2 className="text-xl font-black text-[#1D2128] border-b border-gray-100 pb-4">
                Shipping Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#1D2128] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahim Ahmed"
                    className="w-full rounded-2xl border-2 border-gray-200 p-3.5 text-sm text-[#1D2128] outline-none focus:border-[#215E61]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#1D2128] mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full rounded-2xl border-2 border-gray-200 p-3.5 text-sm text-[#1D2128] outline-none focus:border-[#215E61]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#1D2128] mb-1">
                    Delivery Area *
                  </label>
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    <button
                      type="button"
                      onClick={() => setDeliveryLocation("inside")}
                      className={`rounded-2xl border-2 p-3.5 text-left transition ${
                        deliveryLocation === "inside"
                          ? "border-[#215E61] bg-[#215E61]/10 text-[#215E61] font-black"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 font-bold"
                      }`}
                    >
                      <p className="text-sm">Inside Dhaka</p>
                      <p className="text-xs text-[#FF9E20] font-black mt-0.5">৳80 Charge</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryLocation("outside")}
                      className={`rounded-2xl border-2 p-3.5 text-left transition ${
                        deliveryLocation === "outside"
                          ? "border-[#215E61] bg-[#215E61]/10 text-[#215E61] font-black"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 font-bold"
                      }`}
                    >
                      <p className="text-sm">Outside Dhaka</p>
                      <p className="text-xs text-[#FF9E20] font-black mt-0.5">৳150 Charge</p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#1D2128] mb-1">
                    Full Address *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House no, Road no, Area, City"
                    className="w-full rounded-2xl border-2 border-gray-200 p-3.5 text-sm text-[#1D2128] outline-none focus:border-[#215E61]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#1D2128] mb-1">
                    Order Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Special instructions for delivery"
                    className="w-full rounded-2xl border-2 border-gray-200 p-3.5 text-sm text-[#1D2128] outline-none focus:border-[#215E61]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-[#215E61] py-4 text-base font-black text-white shadow-xl transition hover:bg-[#FF9E20] hover:text-[#1D2128] disabled:opacity-50"
              >
                {isSubmitting ? "Submitting Order..." : "Confirm & Place Order"}
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="h-fit rounded-3xl border-2 border-[#1D2128]/10 bg-white p-6 shadow-xl space-y-6">
            <h2 className="text-xl font-black text-[#1D2128] border-b border-gray-100 pb-4">
              Order Items ({cart.length})
            </h2>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.images[0] || "https://via.placeholder.com/100"}
                    alt={item.name}
                    className="h-14 w-14 rounded-xl object-cover border border-gray-100"
                  />
                  <div className="flex-1">
                    <h4 className="text-xs font-extrabold text-[#1D2128] line-clamp-1">{item.name}</h4>
                    <p className="text-xs font-bold text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-xs font-black text-[#1D2128]">৳{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-gray-100 pt-4 text-sm font-bold text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#1D2128]">৳{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="text-[#215E61]">৳{deliveryCharge}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between text-lg font-black text-[#1D2128]">
                <span>Total Amount</span>
                <span className="text-[#FF9E20]">৳{grandTotal}</span>
              </div>
            </div>

            <div className="rounded-2xl bg-[#F4F2F2] p-4 text-xs font-bold text-slate-600 border border-gray-200">
              💵 <span className="font-extrabold">Cash on Delivery</span> option available for all orders across Bangladesh.
            </div>
          </div>

        </div>

      </div>
    </main>
  );
};

export default Checkout;