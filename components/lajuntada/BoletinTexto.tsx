// What the La Juntada boletín is. Shared by /lajuntada/boletin and the section
// on /lajuntada so the promise is worded once.

export default function BoletinTexto() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="mb-4 text-2xl font-semibold">El boletín de La Juntada</h2>
      <p className="leading-relaxed opacity-90">
        Una vez por fecha te escribo: el tema de la próxima juntada, cuándo se abren las reservas y,
        cuando hay, algo para compartir en casa, una canción, un juego o una receta. Son quince
        lugares por fecha, así que el boletín es la forma de enterarte a tiempo.
      </p>
    </div>
  )
}
