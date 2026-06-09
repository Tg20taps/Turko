export function AboutSection() {
  return (
    <section className="border-y border-flame/14 bg-[linear-gradient(135deg,#0b0f14_0%,#171316_50%,#25131f_100%)] text-cream">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[.95fr_1.05fr] lg:px-8">
        <div className="relative min-h-[260px] overflow-hidden rounded-lg border border-flame/25 bg-black">
          <img
            src="/images/rikki-hero.jpg"
            alt="Comida preparada para retiro"
            className="h-full min-h-[260px] w-full object-cover opacity-[.82]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-ember/10" />
          <div className="absolute bottom-5 left-5 right-5">
            <p className="text-sm font-black uppercase text-flame">Sobre nosotros</p>
            <h2 className="mt-2 text-3xl font-black leading-tight sm:text-4xl">Clásicos sabrosos, bien armados y sin vueltas.</h2>
          </div>
        </div>
        <div className="grid content-center text-lg leading-8 text-cream/72">
          <p>
            Rikki-Tikki es una carta de comida rápida pensada para resolver el antojo con preparaciones contundentes,
            pan fresco, sabores conocidos y porciones generosas.
          </p>
          <p className="mt-4">
            La propuesta es simple: ver la carta, elegir sin perder tiempo y retirar en local. Comida directa,
            cercana y con carácter, lista para acompañar cualquier hambre seria.
          </p>
        </div>
      </div>
    </section>
  );
}
