import { Link } from "react-router-dom";
import type { IProduct } from "../types/product";

interface ProductCardProps {
  product: IProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const isOutOfStock = product.stock === 0;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-[#1D2128]/10 bg-white p-4 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#215E61] hover:shadow-xl">
      <Link to={`/product/${product.id}`} className="block flex-1">
        <div>
          {/* Product Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#F4F2F2]">
            <img
              src={product.images[0] || "https://via.placeholder.com/300x300"}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#1D2128]/70 backdrop-blur-[2px]">
                <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white shadow-md uppercase tracking-wider">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="mt-4 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#215E61]">
              {product.category}
            </span>
            <h3 className="text-base font-black text-[#1D2128] line-clamp-1 group-hover:text-[#215E61] transition-colors">
              {product.name}
            </h3>
            <p className="text-lg font-black text-[#FF9E20]">
              ৳{product.price}
            </p>
          </div>
        </div>
      </Link>

      {/* Button */}
      <div className="mt-4">
        <Link
          to={`/product/${product.id}`}
          className="block w-full rounded-xl bg-[#1D2128] py-2.5 text-center text-xs font-black text-white transition hover:bg-[#215E61]"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;