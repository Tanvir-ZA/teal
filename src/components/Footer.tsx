import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-[#0F172A] text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0D9488] text-white font-black text-lg">
                T
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                TEAL<span className="text-[#F59E0B]">.</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Modern clothing brand offering premium, comfortable, and trendy fashion for your everyday lifestyle in Bangladesh.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="transition hover:text-[#0D9488]">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="transition hover:text-[#0D9488]">
                  Shop All Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="transition hover:text-[#0D9488]">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/shop?category=T-Shirts" className="transition hover:text-[#0D9488]">
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Shirts" className="transition hover:text-[#0D9488]">
                  Shirts
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Pants" className="transition hover:text-[#0D9488]">
                  Pants
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Hoodies" className="transition hover:text-[#0D9488]">
                  Hoodies & Jackets
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Connect */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Need Support?</h4>
            <p className="text-sm text-slate-400">
              Contact us directly via WhatsApp or Facebook for instant assistance.
            </p>
            <div className="flex gap-3">
              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#0D9488]"
              >
                <svg className="h-4 w-4 fill-current text-emerald-400" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                </svg>
                WhatsApp
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#0D9488]"
              >
                <svg className="h-4 w-4 fill-current text-blue-400" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </a>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-slate-800/80 pt-6 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TEAL Clothing. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;