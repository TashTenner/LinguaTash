// What the Nordkreis Newsletter is, in both languages. Shared by the signup page
// and the section on /nordkreis so the promise is worded once.

export default function NewsletterTexto() {
  return (
    <div className="grid gap-8 text-left md:grid-cols-2">
      <div lang="de">
        <h2 className="mb-4 text-2xl font-semibold">Der Nordkreis Newsletter</h2>
        <p className="leading-relaxed opacity-90">
          Etwa einmal im Monat: was an den Samstagen passiert, die nächsten Termine und Feste, eine
          Idee für Deutsch zu Hause und Neuigkeiten zur Anmeldung. Für Familien, die schon dabei
          sind, und für alle, die Nordkreis erst kennenlernen.
        </p>
      </div>
      <div lang="es">
        <h2 className="mb-4 text-2xl font-semibold">El boletín de Nordkreis</h2>
        <p className="leading-relaxed opacity-90">
          Más o menos una vez al mes, en alemán: lo que pasa los sábados, las próximas fechas y
          fiestas, una idea para el alemán en casa y novedades sobre la inscripción. Para las
          familias que ya participan y para quienes quieren conocer Nordkreis.
        </p>
      </div>
    </div>
  )
}
