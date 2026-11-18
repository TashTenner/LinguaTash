// What the 1P2L newsletter is, in English and Spanish like the 1P2L page. The
// newsletter itself is written in English, and the Spanish column says so.

export default function NewsletterTexto() {
  return (
    <div className="grid gap-8 text-left md:grid-cols-2">
      <div lang="en">
        <h2 className="mb-4 text-2xl font-semibold">The 1P2L newsletter</h2>
        <p className="leading-relaxed opacity-90">
          News about the monthly meeting and ideas for passing two languages on to your children
          when you are the one person holding both. Written in English, sent only when there is
          something worth sharing.
        </p>
      </div>
      <div lang="es">
        <h2 className="mb-4 text-2xl font-semibold">El boletín de 1P2L</h2>
        <p className="leading-relaxed opacity-90">
          Novedades del encuentro mensual e ideas para transmitir dos lenguas a los hijos cuando una
          sola persona sostiene las dos. Se escribe en inglés y llega solo cuando hay algo que
          contar.
        </p>
      </div>
    </div>
  )
}
