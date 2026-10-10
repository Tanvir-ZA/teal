import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { cart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Cart-e total koyti item ache ta calculate kora
  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#428475]/20 bg-[#1A312C] text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="rounded-lg bg-[#89D7B7] px-2.5 py-1 text-2xl font-black tracking-wider text-[#1A312C]">
            TEAL
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors duration-200 ${
                  isActive
                    ? "text-[#89D7B7] underline underline-offset-8"
                    : "text-gray-200 hover:text-[#89D7B7]"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Right Section: Cart Icon & Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          
          {/* Cart Button */}
          <Link
            to="/cart"
            className="group relative flex items-center gap-2 rounded-xl bg-[#428475] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#89D7B7] hover:text-[#1A312C]"
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span>Cart</span>

            {/* Cart Count Badge */}
            {totalCartItems > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFF4E1] text-xs font-extrabold text-[#1A312C] shadow">
                {totalCartItems}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg p-2 text-gray-300 hover:bg-[#428475] hover:text-white md:hidden"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-[#428475]/30 bg-[#1A312C] px-4 py-4 md:hidden space-y-3">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-base font-medium transition ${
                  isActive
                    ? "bg-[#428475] text-white"
                    : "text-gray-200 hover:bg-[#428475]/50"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;