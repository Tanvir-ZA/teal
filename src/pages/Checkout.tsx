import { useState } from "react";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";

const Checkout = () => {
  const { cart } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const orderItems = cart.map((item) => ({
      product_id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const { error } = await supabase.from("orders").insert({
      customer_name: name,
      phone: phone,
      address: address,
      note: note,
      items: orderItems,
      total_price: totalPrice,
      status: "pending",
    });

    if (error) {
      console.log(error);
      alert("Order submit failed!");
      return;
    }

    window.location.href = "/order-success";
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="mb-10 text-4xl font-bold">
        Place Your Order
      </h1>

      <div className="grid gap-10 md:grid-cols-2">

        {/* Customer Information */}
        <div>
          <h2 className="mb-6 text-2xl font-semibold">
            Customer Information
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label className="mb-2 block font-medium">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Enter your name"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block font-medium">
                Phone Number
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
                placeholder="01XXXXXXXXX"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="mb-2 block font-medium">
                Delivery Address
              </label>

              <textarea
                value={address}
                onChange={(event) =>
                  setAddress(event.target.value)
                }
                placeholder="Enter your full delivery address"
                rows={4}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                required
              />
            </div>

            {/* Note */}
            <div>
              <label className="mb-2 block font-medium">
                Additional Note
              </label>

              <textarea
                value={note}
                onChange={(event) =>
                  setNote(event.target.value)
                }
                placeholder="Any special instructions? (Optional)"
                rows={3}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-lg bg-black px-6 py-3 font-semibold text-white"
            >
              Submit Order
            </button>

          </form>
        </div>

        {/* Order Summary */}
        <div>
          <h2 className="mb-6 text-2xl font-semibold">
            Order Summary
          </h2>

          <div className="space-y-4 rounded-xl border p-5">

            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-semibold">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    ৳{item.price} × {item.quantity}
                  </p>
                </div>

                <p className="font-semibold">
                  ৳{item.price * item.quantity}
                </p>
              </div>
            ))}

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>

                <span>
                  ৳{totalPrice}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
};

export default Checkout;