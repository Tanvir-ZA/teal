import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

const Shop = () => {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
          Teal Collection
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Shop All Products
        </h1>

        <p className="mt-3 text-gray-600">
          Find your favorite style from our collection.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
};

export default Shop;