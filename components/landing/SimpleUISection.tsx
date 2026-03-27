"use client";

import Link from "next/link";

export function SimpleUISection() {
  return (
    <section className="bg-[#f5f5f5] py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="flex">
                <div className="w-16 bg-[#ECECEC] min-h-[400px] flex flex-col items-center pt-3 gap-2">
                  <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center text-white text-sm font-bold">
                    +
                  </div>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="w-10 h-10 bg-gray-300 rounded-lg" />
                  ))}
                </div>
                <div className="flex-1 p-6 flex flex-col items-center justify-center">
                  <div className="text-center mb-8">
                    <p className="text-gray-400 text-sm">
                      Describe any visual you want to create
                    </p>
                  </div>
                  <div className="w-full bg-gray-100 rounded-2xl p-4">
                    <textarea
                      className="w-full bg-transparent text-sm text-gray-500 resize-none outline-none"
                      placeholder="Describe any visual you want to create. NextFlow will generate an image for free. You can write in any language."
                      rows={3}
                      readOnly
                    />
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        {["3:4", "Style", "1K", "Image prompt"].map((tag) => (
                          <span
                            key={tag}
                            className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border border-gray-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <button className="flex items-center gap-1.5 bg-black text-white text-xs font-medium px-3 py-2 rounded-xl hover:bg-gray-800 transition-colors">
                        <span>✦</span> Generate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Dead simple UI.
              <br />
              No tutorials needed.
            </h2>
            <p className="text-gray-500 text-base leading-relaxed max-w-lg">
              NextFlow offers the simplest interfaces. Skip dry tutorials and
              get right into your creative flow with minimal distraction, even
              if you or your team has never worked with AI tools before.
            </p>
            <Link
              href="/sign-up"
              className="mt-6 inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
            >
              Get Started →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}