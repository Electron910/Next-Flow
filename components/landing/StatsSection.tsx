export function StatsSection() {
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight mb-6">
          The industry&apos;s best Video models.
          <br />
          In one subscription.
        </h2>

        <div className="flex items-center gap-8 overflow-x-auto pb-4 mb-12 scrollbar-hide">
          {["Luma", "Flux", "Gemini", "Krea 1", "Veo 3.1", "Ideogram", "Kling"].map(
            (model) => (
              <div
                key={model}
                className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors whitespace-nowrap"
              >
                <div className="w-5 h-5 bg-gray-300 rounded-sm" />
                <span className="text-base font-medium">{model}</span>
              </div>
            )
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className="rounded-2xl overflow-hidden relative min-h-[200px] col-span-1"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-xl font-bold">Industry-leading</p>
              <p className="text-xl font-bold">inference speed</p>
            </div>
          </div>

          <div className="rounded-2xl bg-gray-100 p-8 flex flex-col justify-end">
            <p className="text-6xl font-bold text-gray-800">22K</p>
            <p className="text-gray-500 mt-1">Pixels upscaling</p>
          </div>

          <div className="rounded-2xl bg-gray-100 p-8 flex flex-col justify-end">
            <p className="text-6xl font-bold text-gray-800">Train</p>
            <p className="text-gray-500 mt-1">Fine-tune models with your own data</p>
          </div>
        </div>
      </div>
    </section>
  );
}