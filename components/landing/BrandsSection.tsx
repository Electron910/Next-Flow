export function BrandsSection() {
  const brands = ["Samsung", "Nike", "Microsoft", "Shopify", "Lego", "Samsung"];

  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm text-gray-400 mb-2">A tool suite for pros and beginners alike</p>
        <h2 className="text-3xl font-bold text-black mb-12">
          NextFlow powers millions of creatives, enterprises, and everyday
          people.
        </h2>

        <div className="flex items-center justify-between flex-wrap gap-8 mb-16">
          {brands.map((brand, index) => (
            <div
              key={`${brand}-${index}`}
              className="text-gray-300 text-2xl font-bold tracking-wide hover:text-gray-500 transition-colors"
            >
              {brand}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4">
          <button className="px-6 py-3 text-sm font-medium text-gray-700 hover:text-black transition-colors">
            Sign up for free
          </button>
          <button className="px-6 py-3 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors">
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );
}