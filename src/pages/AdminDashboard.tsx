import { supabase } from "../lib/supabase";

const AdminDashboard = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();

    window.location.href = "/admin-login";
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-16">
      <div className="mx-auto max-w-7xl">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Admin Dashboard
            </h1>

            <p className="mt-3 text-gray-600">
              Welcome to Teal Admin Panel
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-black px-5 py-3 font-semibold text-white"
          >
            Logout
          </button>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-gray-500">Total Orders</p>
            <h2 className="mt-2 text-3xl font-bold">0</h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-gray-500">Pending Orders</p>
            <h2 className="mt-2 text-3xl font-bold">0</h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-gray-500">Products</p>
            <h2 className="mt-2 text-3xl font-bold">0</h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-gray-500">Visitors</p>
            <h2 className="mt-2 text-3xl font-bold">0</h2>
          </div>

        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;