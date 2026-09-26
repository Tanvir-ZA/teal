import { useState } from "react";
import { supabase } from "../lib/supabase";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Login failed!");
      console.log(error);
      return;
    }

    window.location.href = "/admin";
  };

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">
          Admin Login
        </h1>

        <p className="mt-2 text-gray-500">
          Login to access the Teal admin panel.
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block font-medium">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
              placeholder="Enter admin email"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-black px-6 py-3 font-semibold text-white"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
};

export default AdminLogin;
