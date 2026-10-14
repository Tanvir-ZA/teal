import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import { supabase } from "../lib/supabase";
import type { IProduct } from "../types/product";

const DEFAULT_SIZES = ["S", "M", "L", "XL", "XXL"];

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [sizeError, setSizeError] = useState(false);

  const viewTracked = useRef(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", Number(id))
        .eq("is_active", true)
        .single();

      if (error || !data) {
        setProduct(null);
        setLoading(false);
        return;
      }

      setProduct(data);
      setCurrentImage(0);

      // Auto-select first size with stock > 0
      const sizeStockMap: Record<string, number> = data.sizes_stock || {};
      const firstAvailableSize = DEFAULT_SIZES.find(
        (size) => (sizeStockMap[size] ?? 1) > 0
      );

      if (firstAvailableSize) {
        setSelectedSize(firstAvailableSize);
      }

      const { data: relatedData } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .eq("category", data.category)
        .neq("id", data.id)
        .limit(4);

      setRelatedProducts(relatedData || []);
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!id || viewTracked.current) return;
    viewTracked.current = true;

    const trackProductView = async () => {
      await supabase.rpc("increment_product_view", {
        product_id_input: Number(id),
      });
    };

    trackProductView();
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#F4F2F2]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#215E61] border-t-transparent" />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#F4F2F2] px-4">
        <div className="rounded-3xl border-2 border-[#1D2128]/10 bg-white p-10 text-center shadow-lg">
          <h1 className="text-3xl font-black text-[#1D2128]">Product Not Found</h1>
          <Link
            to="/shop"
            className="mt-6 inline-block rounded-xl bg-[#215E61] px-6 py-3 font-extrabold text-white transition hover:bg-[#FF9E20] hover:text-[#1D2128]"
          >
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const sizesStockMap: Record<string, number> = product.sizes_stock || {};
  const isTotalOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    if (isTotalOutOfStock) return;

    if (!selectedSize) {
      setSizeError(true);
      return;
    }

    const currentSizeQty = sizesStockMap[selectedSize] ?? 1;
    if (currentSizeQty === 0) {
      alert(`Size ${selectedSize} is out of stock!`);
      return;
    }

    setSizeError(false);
    
    const productWithSize = { ...product, selectedSize };
    addToCart(productWithSize);
  };

  return (
    <main className="min-h-screen bg-[#F4F2F2] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        <div className="grid gap-10 rounded-3xl border-2 border-[#1D2128]/10 bg-white p-6 shadow-xl md:grid-cols-2 lg:p-10">
          
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#F4F2F2]">
              <img
                src={product.images[currentImage] || "https://via.placeholder.com/600x600"}
                alt={product.name}
                className="h-full w-full object-cover transition-all duration-300"
              />
            </div>

            {product.images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={image}
                    onClick={() => setCurrentImage(index)}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                      currentImage === index
                        ? "border-[#FF9E20] ring-2 ring-[#FF9E20]/50"
                        : "border-gray-200 hover:border-[#215E61]"
                    }`}
                  >
                    <img src={image} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details & Size Selector */}
          <div className="flex flex-col justify-between py-2">
            <div>
              <span className="inline-block rounded-full bg-[#1D2128] px-3.5 py-1 text-xs font-black uppercase tracking-widest text-[#FF9E20]">
                {product.category}
              </span>

              <h1 className="mt-4 text-3xl font-black text-[#1D2128] sm:text-4xl">
                {product.name}
              </h1>

              <p className="mt-4 text-3xl font-black text-[#FF9E20]">
                ৳{product.price}
              </p>

              {/* Size Buttons with Red Out of Stock Indicator */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#1D2128]">
                    Select Size *
                  </h3>
                  {selectedSize && (
                    <span className="text-xs font-black text-[#215E61]">
                      Selected: <span className="text-[#FF9E20]">{selectedSize}</span>
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2.5">
                  {DEFAULT_SIZES.map((size) => {
                    const sizeQty = sizesStockMap[size] !== undefined ? sizesStockMap[size] : 1;
                    const isSizeOutOfStock = sizeQty === 0;

                    return (
                      <button
                        key={size}
                        type="button"
                        disabled={isSizeOutOfStock}
                        onClick={() => {
                          setSelectedSize(size);
                          setSizeError(false);
                        }}
                        className={`relative min-w-[56px] rounded-xl border-2 px-4 py-2.5 text-sm font-black transition ${
                          isSizeOutOfStock
                            ? "border-red-300 bg-red-50 text-red-500 line-through opacity-80 cursor-not-allowed shadow-inner"
                            : selectedSize === size
                            ? "border-[#215E61] bg-[#215E61] text-white shadow-md scale-105"
                            : "border-gray-200 bg-white text-[#1D2128] hover:border-[#215E61]"
                        }`}
                      >
                        {size}
                        {isSizeOutOfStock && (
                          <span className="block text-[9px] font-black text-red-600 no-underline">
                            Out
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {sizeError && (
                  <p className="mt-2 text-xs font-bold text-red-600">
                    ⚠️ Please select an available size.
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#1D2128]">
                  Description
                </h3>
                <p className="mt-2 leading-relaxed text-gray-600 text-sm">
                  {product.description || "No detailed description provided for this item."}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <button
                onClick={handleAddToCart}
                disabled={isTotalOutOfStock || (selectedSize ? sizesStockMap[selectedSize] === 0 : false)}
                className={`w-full rounded-2xl py-4 text-base font-black transition shadow-lg ${
                  isTotalOutOfStock
                    ? "cursor-not-allowed bg-gray-200 text-gray-400"
                    : "bg-[#215E61] text-white hover:bg-[#FF9E20] hover:text-[#1D2128]"
                }`}
              >
                {isTotalOutOfStock
                  ? "Out of Stock"
                  : `Add to Cart (${selectedSize || "Select Size"})`}
              </button>
            </div>
          </div>

        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-[#1D2128]">You May Also Like</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
};

export default ProductDetails;