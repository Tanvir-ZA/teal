import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

const Home = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="flex min-h-[80vh] items-center bg-gray-100">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest">
            Welcome to Teal
          </p>

          <h1 className="text-5xl font-bold md:text-7xl">
            Style That Speaks
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-gray-600">
            Discover comfortable and stylish clothing made for your everyday
            look.
          </p>

          <button className="mt-8 rounded-lg bg-black px-6 py-3 font-semibold text-white">
            Shop Now
          </button>
        </div>
      </section>

      {/* Products Section */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Our Collection
          </p>

          <h2 className="mt-2 text-3xl font-bold md:text-4xl">
            Featured Products
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;