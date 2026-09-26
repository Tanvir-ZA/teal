import { Link } from "react-router-dom";
import type { IProduct } from "../types/product";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
    product: IProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const { addToCart } = useCart();

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
                <p className="text-sm text-gray-500">{product.category}</p>

                <h3 className="mt-1 text-xl font-semibold">
                    {product.name}
                </h3>

                <p className="mt-2 text-lg font-bold">
                    ৳{product.price}
                </p>

                <div className="mt-4 flex gap-2">
                    <Link
                        to={`/product/${product.id}`}
                        className="flex-1 rounded-lg bg-black py-3 text-center text-sm font-semibold text-white"
                    >
                        View Product
                    </Link>

                    <button
                        onClick={() => addToCart(product)}
                        className="flex-1 rounded-lg border border-black py-3 text-sm font-semibold"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;