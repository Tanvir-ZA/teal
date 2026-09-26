import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border bg-white p-8 text-center shadow-sm">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          ✓
        </div>

        <h1 className="mt-6 text-3xl font-bold">
          Order Submitted!
        </h1>

        <p className="mt-3 text-gray-600">
          Thank you for your order. We have received your order request
          and will contact you soon.
        </p>

        <p className="mt-5 text-sm text-gray-500">
          Order ID: #TEAL-001
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/shop"
            className="rounded-lg border border-black px-6 py-3 font-semibold"
          >
            Continue Shopping
          </Link>

          <Link
            to="/"
            className="rounded-lg bg-black px-6 py-3 font-semibold text-white"
          >
            Back to Home
          </Link>
        </div>

      </div>
    </main>
  );
};

export default OrderSuccess;