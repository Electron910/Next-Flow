import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#f5f5f5] border-t border-gray-200 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-semibold text-black mb-4">NextFlow</h4>
            <ul className="space-y-3">
              {["Log In", "Pricing", "Enterprise", "Gallery"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(" ", "-")}`}
                    className="text-gray-400 text-sm hover:text-black transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-black mb-4">Products</h4>
            <ul className="space-y-3">
              {[
                { label: "Image Generator", href: "/image-generator" },
                { label: "Video Generator", href: "/video-generator" },
                { label: "Enhancer", href: "/upscale" },
                { label: "Realtime", href: "/" },
                { label: "Edit", href: "/" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-gray-400 text-sm hover:text-black transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-black mb-4">Resources</h4>
            <ul className="space-y-3">
              {[
                { label: "Pricing", href: "/pricing" },
                { label: "Careers", href: "/" },
                { label: "Terms of Service", href: "/" },
                { label: "Privacy Policy", href: "/" },
                { label: "API", href: "/api-page" },
                { label: "Documentation", href: "/" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-gray-400 text-sm hover:text-black transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-black mb-4">About</h4>
            <ul className="space-y-3">
              {[
                { label: "Blog", href: "/" },
                { label: "Discord", href: "/" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-gray-400 text-sm hover:text-black transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between pt-8 border-t border-gray-200">
          <p className="text-gray-400 text-sm">© 2026 NextFlow</p>
          <div className="flex items-center gap-4">
            {["■", "✕", "in", "◎"].map((icon, i) => (
              <button
                key={i}
                className="text-gray-400 hover:text-black transition-colors text-lg"
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}