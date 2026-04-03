import { railImages } from '../../data/homeContent'

export default function ImageScrollRail() {
  const images = [...railImages, ...railImages]

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-6 text-center">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-400">
              ― Industry Driven ―
            </p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Knowledge & Tools</h2>
            <div className="mx-auto mt-4 h-px w-32 bg-gradient-to-r from-green-500 via-green-300/60 to-transparent" />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-full border border-white/15 bg-white px-6 py-6 shadow-[0_0_30px_rgba(255,255,255,0.08)] md:px-8">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white via-white/90 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white via-white/90 to-transparent" />

          <div className="image-scroll-track flex w-max items-center gap-14 md:gap-20">
            {images.map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="flex h-16 w-[120px] flex-shrink-0 items-center justify-center md:h-20 md:w-[160px]"
              >
                <img
                  src={src}
                  alt={`RuntWerkx logo ${index + 1}`}
                  className="max-h-full max-w-full object-contain opacity-90 transition duration-300 hover:scale-[1.05] hover:opacity-100"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .image-scroll-track {
          animation: imageRailScroll 34s linear infinite;
        }

        .image-scroll-track:hover {
          animation-play-state: paused;
        }

        @keyframes imageRailScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 40px));
          }
        }
      `}</style>
    </>
  )
}