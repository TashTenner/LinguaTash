// What the Resuena boletín is. Shared by /resuena/boletin and the section on
// /resuena so the promise is worded once.

export default function BoletinTexto() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="mb-4 text-2xl font-semibold">El boletín de Resuena</h2>
      <p className="leading-relaxed opacity-90">
        Te escribo cuando hay algo nuevo en Resuena: un juego o un audiolibro que sale, y cómo van
        los que están en desarrollo. Pocas veces, y solo cuando hay algo que escuchar.
      </p>
    </div>
  )
}
