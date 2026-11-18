import Link from './Link'

// The page Kit redirects to after someone confirms a boletín. One component so
// the newer projects do not each carry a copy of the same card.

export default function BoletinConfirmado({
  titulo,
  texto,
  volverA,
  volverTexto,
}: {
  titulo: string
  texto: string[]
  volverA: string
  volverTexto: string
}) {
  return (
    <main className="mx-auto max-w-2xl px-4 py-20 font-['Noto_Sans'] text-[#081C3C] sm:px-6 dark:text-[#F4EFE8]">
      <div className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-16 text-center dark:bg-[#081C3C]">
        <h1 className="text-4xl" style={{ letterSpacing: '-0.04em' }}>
          {titulo}
        </h1>
        {texto.map((parrafo) => (
          <p key={parrafo} className="mt-6 leading-relaxed opacity-90">
            {parrafo}
          </p>
        ))}
        <Link
          href={volverA}
          className="mt-8 inline-flex min-h-11 items-center rounded-xl bg-[#B3475A] px-6 py-2.5 font-medium text-white transition-transform duration-200 hover:scale-105"
        >
          {volverTexto}
        </Link>
      </div>
    </main>
  )
}
