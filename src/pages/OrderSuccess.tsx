import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#F4F2F2] px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border-2 border-[#1D2128]/10 bg-white p-8 text-center shadow-2xl sm:p-12">
        
        {/* Success Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#215E61]/10 text-[#215E61] ring-8 ring-[#215E61]/5">
          <svg
            className="h-10 w-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Text Details */}
        <span className="mt-6 inline-block rounded-full bg-[#1D2128] px-3.5 py-1 text-xs font-black uppercase tracking-widest text-[#FF9E20]">
          Order Confirmed
        </span>

        <h1 className="mt-3 text-3xl font-black text-[#1D2128] sm:text-4xl">
          Thank You For Your Order!
        </h1>

        <p className="mt-3 text-sm font-medium text-gray-600 leading-relaxed">
          আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। ডেলিভারি নিশ্চিত করতে আমাদের প্রতিনিধি খুব শীঘ্রই আপনার মোবাইল নম্বরে কল করবেন।
        </p>

        {/* Informational Card */}
        <div className="mt-6 rounded-2xl bg-[#F4F2F2] p-4 text-xs font-bold text-[#1D2128] border border-gray-200/80">
          📞 অনুগ্রহ করে কল রিসিভ করার জন্য আপনার ফোনটি সচল রাখুন।
        </div>

        {/* Action Button */}
        <div className="mt-8">
          <Link
            to="/shop"
            className="inline-block w-full rounded-2xl bg-[#215E61] py-4 text-base font-black text-white shadow-xl transition hover:bg-[#FF9E20] hover:text-[#1D2128]"
          >
            Continue Shopping
          </Link>
        </div>

      </div>
    </main>
  );
};

export default OrderSuccess;