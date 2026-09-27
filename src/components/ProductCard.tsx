import { Link } from "react-router-dom";
import type { IProduct } from "../types/product";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
    product: IProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const { addToCart } = useCart();

    const isOutOfStock = product.stock === 0;
    const isLowStock = product.stock === 1;

    return (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <Link to={`/product/${product.id}`}>
                <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-72 w-full cursor-pointer object-cover transition duration-300 hover:scale-105"
                />
            </Link>

            <div className="p-5">
                <p className="text-sm text-gray-500">
                    {product.category}
                </p>

                <h3 className="mt-1 text-xl font-semibold">
                    {product.name}
                </h3>

                <p className="mt-2 text-lg font-bold">
                    ৳{product.price}
                </p>

                {/* Stock Status */}
                <div className="mt-2">
                    {isOutOfStock ? (
                        <p className="text-sm font-semibold text-red-600">
                            Out of Stock
                        </p>
                    ) : isLowStock ? (
                        <p className="text-sm font-semibold text-orange-600">
                            Only 1 left
                        </p>
                    ) : (
                        <p className="text-sm font-medium text-green-600">
                            {product.stock} left
                        </p>
                    )}
                </div>

                <div className="mt-4 flex gap-2">
                    <Link
                        to={`/product/${product.id}`}
                        className="flex-1 rounded-lg bg-black py-3 text-center text-sm font-semibold text-white"
                    >
                        View Product
                    </Link>

                    <button
                        onClick={() => addToCart(product)}
                        disabled={isOutOfStock}
                        className={`flex-1 rounded-lg py-3 text-sm font-semibold transition ${
                            isOutOfStock
                                ? "cursor-not-allowed bg-gray-200 text-gray-400"
                                : "border border-black hover:bg-black hover:text-white"
                        }`}
                    >
                        {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;