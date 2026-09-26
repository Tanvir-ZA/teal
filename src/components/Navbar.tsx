import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">

        <Link to="/" className="text-2xl font-bold">
          Teal
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/">Home</Link>

          <Link to="/shop">Shop</Link>

          <a href="#">About</a>

          <a href="#">Contact</a>

          <Link
            to="/cart"
            className="rounded-lg bg-black px-4 py-2 text-white"
          >
            Cart
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;