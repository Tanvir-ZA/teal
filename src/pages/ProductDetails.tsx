import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";
import type { IProduct } from "../types/product";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentImage, setCurrentImage] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const viewTracked = useRef(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", Number(id))
        .eq("is_active", true)
        .single();

      if (error) {
        console.log("PRODUCT DETAILS ERROR:", error);
        setProduct(null);
      } else {
        setProduct(data);
      }

      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  // Product View Tracking
  useEffect(() => {
    if (!id || viewTracked.current) {
      return;
    }

    viewTracked.current = true;

    const trackProductView = async () => {
      const { error } = await supabase.rpc(
        "increment_product_view",
        {
          product_id_input: Number(id),
        }
      );

      if (error) {
        console.log("PRODUCT VIEW TRACKING ERROR:", error);
      }
    };

    trackProductView();
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Loading product...</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Product Not Found
          </h1>

          <Link
            to="/shop"
            className="mt-5 inline-block rounded-lg bg-black px-5 py-3 text-white"
          >
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock === 1;

  const nextImage = () => {
    setCurrentImage((current) =>
      current === product.images.length - 1 ? 0 : current + 1
    );
  };

  const previousImage = () => {
    setCurrentImage((current) =>
      current === 0 ? product.images.length - 1 : current - 1
    );
  };

  const handleTouchStart = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    setTouchStart(event.touches[0].clientX);
  };

  const handleTouchEnd = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    if (touchStart === null) return;

    const touchEnd = event.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;

    if (Math.abs(distance) > 50) {
      if (distance > 0) {
        nextImage();
      } else {
        previousImage();
      }
    }

    setTouchStart(null);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-16">
      <div className="grid gap-10 md:grid-cols-2">
        {/* Product Images */}
        <div>
          <div
            className="relative overflow-hidden rounded-xl"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={product.images[currentImage]}
              alt={product.name}
              className="h-[500px] w-full object-cover"
            />

            {product.images.length > 1 && (
              <button
                onClick={previousImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-4 py-2 text-xl shadow"
              >
                ←
              </button>
            )}

            {product.images.length > 1 && (
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-4 py-2 text-xl shadow"
              >
                →
              </button>
            )}
          </div>

          {/* Image Thumbnails */}
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setCurrentImage(index)}
                  className={`shrink-0 overflow-hidden rounded-lg border-2 ${
                    currentImage === index
                      ? "border-black"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="h-20 w-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            {product.category}
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            {product.name}
          </h1>

          <p className="mt-5 text-2xl font-bold">
            ৳{product.price}
          </p>

          <p className="mt-6 leading-7 text-gray-600">
            {product.description}
          </p>

          {/* Stock Status */}
          <div className="mt-6">
            {isOutOfStock ? (
              <p className="font-semibold text-red-600">
                Out of Stock
              </p>
            ) : isLowStock ? (
              <p className="font-semibold text-orange-600">
                Only 1 left
              </p>
            ) : (
              <p className="font-medium text-green-600">
                {product.stock} left in stock
              </p>
            )}
          </div>

          {/* Add To Cart */}
          <button
            onClick={() => addToCart(product)}
            disabled={isOutOfStock}
            className={`mt-8 rounded-lg px-6 py-3 font-semibold text-white transition ${
              isOutOfStock
                ? "cursor-not-allowed bg-gray-300"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;