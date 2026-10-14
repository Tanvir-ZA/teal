import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } =
    useCart();

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-[#F4F2F2] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <span className="rounded-full bg-[#1D2128] px-3 py-1 text-xs font-black uppercase tracking-widest text-[#FF9E20]">
            Your Selection
          </span>
          <h1 className="text-3xl font-black text-[#1D2128] sm:text-4xl">
            Shopping Cart
          </h1>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart State */
          <div className="rounded-3xl border-2 border-[#1D2128]/10 bg-white p-12 text-center shadow-xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#215E61]/10 text-[#215E61]">
              <svg
                className="h-10 w-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h2 className="mt-4 text-2xl font-black text-[#1D2128]">
              Your Cart is Empty
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-block rounded-2xl bg-[#215E61] px-8 py-3.5 text-sm font-black text-white shadow-lg transition hover:bg-[#FF9E20] hover:text-[#1D2128]"
            >
              Start Shopping Now
            </Link>
          </div>
        ) : (
          /* Cart Content Grid */
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-3xl border-2 border-[#1D2128]/10 bg-white p-5 shadow-md sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        item.images[0] || "https://via.placeholder.com/150"
                      }
                      alt={item.name}
                      className="h-24 w-24 rounded-2xl bg-[#F4F2F2] object-cover border border-gray-200"
                    />
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#215E61]">
                        {item.category}
                      </span>
                      <h3 className="text-base font-black text-[#1D2128]">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm font-black text-[#FF9E20]">
                        ৳{item.price}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controls & Actions */}
                  <div className="flex items-center justify-between gap-6 border-t border-gray-100 pt-3 sm:border-t-0 sm:pt-0">
                    <div className="flex items-center gap-2 rounded-xl border-2 border-[#1D2128]/20 bg-[#F4F2F2] p-1">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-base font-black text-[#1D2128] transition hover:bg-[#FF9E20]"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-black text-[#1D2128]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        disabled={item.quantity >= item.stock}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-base font-black text-[#1D2128] transition hover:bg-[#215E61] hover:text-white disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>

                    <p className="text-base font-black text-[#1D2128] min-w-[70px] text-right">
                      ৳{item.price * item.quantity}
                    </p>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="rounded-xl p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                      title="Remove item"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Sidebar */}
            <div className="h-fit rounded-3xl border-2 border-[#1D2128]/10 bg-white p-6 shadow-xl space-y-6">
              <h2 className="text-xl font-black text-[#1D2128] border-b border-gray-100 pb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between font-bold text-gray-600">
                  <span>Subtotal</span>
                  <span className="text-[#1D2128]">৳{subtotal}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="text-xs font-black text-[#215E61]">
                    Calculated at Checkout
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between text-lg font-black text-[#1D2128]">
                  <span>Estimated Total</span>
                  <span className="text-[#FF9E20]">৳{subtotal}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block w-full rounded-2xl bg-[#215E61] py-4 text-center text-sm font-black text-white shadow-lg transition hover:bg-[#FF9E20] hover:text-[#1D2128]"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/shop"
                className="block text-center text-xs font-bold text-[#215E61] hover:underline"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;