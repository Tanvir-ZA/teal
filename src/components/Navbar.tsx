import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import logoImg from "../assets/logo.png";

const Navbar = () => {
  const { cart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b-2 border-[#FF9E20] bg-[#1D2128] text-white shadow-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Prominent Larger Logo */}
        <Link to="/" className="flex items-center gap-3 group py-1">
          <img
            src={logoImg}
            alt="TEAL Logo"
            className="h-12 w-auto max-w-[160px] object-contain transition-transform duration-300 group-hover:scale-105 sm:h-14 md:h-16"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-base font-bold tracking-wide transition-all duration-200 ${
                  isActive
                    ? "text-[#FF9E20] border-b-2 border-[#FF9E20] pb-1"
                    : "text-[#F4F2F2] hover:text-[#FF9E20]"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-4">
          
          {/* Cart Button with High Contrast Orange Badge */}
          <Link
            to="/cart"
            className="relative flex items-center gap-2 rounded-xl bg-[#215E61] px-5 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#FF9E20] hover:text-[#1D2128] shadow-md"
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
                strokeWidth="2.2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span>Cart</span>

            {totalCartItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#FF9E20] text-xs font-black text-[#1D2128] shadow-lg border-2 border-[#1D2128]">
                {totalCartItems}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-xl border border-[#215E61] bg-[#1D2128] p-2.5 text-[#F4F2F2] hover:bg-[#215E61] md:hidden"
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

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="border-t border-[#215E61] bg-[#1D2128] px-4 py-4 md:hidden space-y-3">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block rounded-xl px-4 py-3 text-base font-bold transition ${
                  isActive
                    ? "bg-[#215E61] text-[#FF9E20]"
                    : "text-[#F4F2F2] hover:bg-[#215E61]/50"
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