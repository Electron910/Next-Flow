import Link from "next/link";

export default function EnterprisePage() {
  const companies = [
    "Samsung", "Nike", "Microsoft", "Shopify", "Lego",
    "Adobe", "Spotify", "Netflix", "Apple", "Google",
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-24 text-center">
        <p className="text-sm text-gray-400 mb-2">Enterprise</p>
        <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 max-w-3xl mx-auto leading-tight">
          NextFlow for Enterprise
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto mb-10">
          Powerful AI workflow tools built for teams at the world&apos;s most
          ambitious companies. Secure, scalable, and customizable.
        </p>

        <div className="flex items-center justify-center gap-4 mb-16">
          <Link
            href="/sign-up"
            className="px-8 py-3.5 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
          >
            Sign up for free
          </Link>
          <button className="px-8 py-3.5 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors">
            Browse job listings
          </button>
        </div>

        <h2 className="text-2xl font-bold text-black mb-2">
          A tool suite for pros and beginners alike
        </h2>
        <p className="text-gray-500 mb-8">
          NextFlow powers millions of creatives, enterprises, and everyday
          people.
        </p>

        <div className="flex items-center justify-center flex-wrap gap-10 mb-16">
          {companies.map((company) => (
            <span
              key={company}
              className="text-gray-300 text-xl font-bold tracking-wide hover:text-gray-500 transition-colors"
            >
              {company}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/sign-up"
            className="text-gray-700 font-medium hover:text-black transition-colors"
          >
            Sign up for free
          </Link>
          <button className="px-6 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors">
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
}