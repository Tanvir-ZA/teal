import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { cart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-[#0F172A]/95 backdrop-blur-md text-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0D9488] to-[#0F172A] p-2 text-white shadow-md shadow-[#0D9488]/20 transition group-hover:scale-105">
            <span className="text-xl font-black tracking-tighter">T</span>
          </div>
          <span className="text-2xl font-black tracking-tight text-white">
            TEAL<span className="text-[#F59E0B]">.</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-semibold tracking-wide transition-all duration-200 ${
                  isActive
                    ? "text-[#0D9488] font-bold"
                    : "text-slate-300 hover:text-white"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Right Action Icons: Cart & Mobile Toggle */}
        <div className="flex items-center gap-3">
          
          {/* Cart Icon Button */}
          <Link
            to="/cart"
            className="relative flex items-center justify-center rounded-xl bg-slate-800/80 p-2.5 text-slate-200 transition hover:bg-[#0D9488] hover:text-white hover:shadow-lg hover:shadow-[#0D9488]/20"
            aria-label="View Cart"
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

            {/* Floating Cart Count Badge */}
            {totalCartItems > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#F59E0B] text-[11px] font-extrabold text-slate-950 shadow-md">
                {totalCartItems}
              </span>
            )}
          </Link>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-xl bg-slate-800/80 p-2.5 text-slate-300 hover:bg-slate-700 hover:text-white md:hidden"
            aria-label="Toggle Navigation"
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

      {/* Mobile Slide Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-slate-800 bg-[#0F172A] px-4 py-4 md:hidden space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block rounded-xl px-4 py-2.5 text-base font-semibold transition ${
                  isActive
                    ? "bg-[#0D9488] text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
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