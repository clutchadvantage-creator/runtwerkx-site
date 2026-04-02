import ContactSignalLock from './ContactSignalLock'

export default function ContactSection() {
  return (
    <section id="contact" className="mx-auto max-w-7xl px-6 pb-24">
      <div className="relative overflow-hidden bg-transparent">
        <div className="relative px-0 pt-8 md:px-0 md:pt-12">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-400">⇼ Contact Us ⇼</p>
          <h2 className="mt-3 text-3xl font-bold md:text-5xl">
            ⇼ Industrial Software & Workflow Consulting for Manufacturing ⇼
          </h2>
          <div className="mt-4 h-px w-32 bg-gradient-to-r from-green-500 via-green-300/60 to-transparent" />

          <p className="mt-5 max-w-2xl text-white/75">Prototype ⇼ Design ⇼ Build ⇼ Test ⇼ Ship</p>
        </div>

        <div className="px-0 pb-6 pt-12 md:px-0 md:pb-10 md:pt-14">
          <ContactSignalLock />
        </div>
      </div>
    </section>
  )
}