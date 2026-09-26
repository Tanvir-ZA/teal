import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Your Cart is Empty
          </h1>

          <Link
            to="/shop"
            className="mt-5 inline-block rounded-lg bg-black px-6 py-3 text-white"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="mb-10 text-4xl font-bold">
        Your Cart
      </h1>

      <div className="space-y-5">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-5 rounded-xl border bg-white p-5 sm:flex-row sm:items-center"
          >
            <img
              src={item.images[0]}
              alt={item.name}
              className="h-28 w-28 rounded-lg object-cover"
            />

            <div className="flex-1">
              <h2 className="text-xl font-semibold">
                {item.name}
              </h2>

              <p className="mt-1">
                ৳{item.price}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => decreaseQuantity(item.id)}
                className="h-9 w-9 rounded border"
              >
                -
              </button>

              <span>{item.quantity}</span>

              <button
                onClick={() => increaseQuantity(item.id)}
                className="h-9 w-9 rounded border"
              >
                +
              </button>
            </div>

            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10 border-t pt-6 text-right">
        <h2 className="text-2xl font-bold">
          Total: ৳{totalPrice}
        </h2>

        <Link
          to="/checkout"
          className="mt-5 inline-block rounded-lg bg-black px-6 py-3 font-semibold text-white"
        >
          Proceed to Order
        </Link>
      </div>
    </main>
  );
};

export default Cart;