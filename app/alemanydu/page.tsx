export default function NordkreisPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-16 px-4 font-['Noto_Sans'] text-[#081C3C] sm:px-6 lg:px-8 dark:text-[#F4EFE8]">
      {/* HERO */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-20 text-center dark:bg-[#081C3C]">
        {/* Nordkreis Logo */}
        <div className="mb-8 flex justify-center">
          <img
            src="/static/images/nordkreis-icon.png"
            alt="Nordkreis Logo"
            className="block h-24 w-auto md:h-28 dark:hidden"
          />
          <img
            src="/static/images/nordkreis-icon-dark.png"
            alt="Nordkreis Dark Logo"
            className="hidden h-24 w-auto md:h-28 dark:block"
          />
        </div>

        <h1 className="text-5xl leading-none md:text-6xl">
          <span className="font-[400]" style={{ letterSpacing: '-0.05em' }}>
            Nord
          </span>
          <span className="font-[200] opacity-95">kreis</span>
        </h1>

        <p className="mt-6 text-xl font-semibold text-[#B3475A] md:text-2xl">
          Deutsche Gemeinschaft & Samstagsschule in Barcelona
        </p>

        <p className="mt-4 text-lg text-[#081C3C]/80 md:text-xl dark:text-[#F4EFE8]/80">
          Ein Sprachraum für deutschsprachige Familien.
          <br className="hidden md:block" />
          Gemeinsam Deutsch leben, lernen und weitergeben.
        </p>

        <div className="mx-auto my-10 h-px w-20 bg-[#9A8F85]" />

        <p className="text-xl font-semibold text-[#B3475A] md:text-2xl">
          Comunidad alemana y escuela de sábado en Barcelona
        </p>

        <p className="mt-4 text-lg text-[#081C3C]/80 md:text-xl dark:text-[#F4EFE8]/80">
          Un espacio lingüístico para familias germanohablantes.
          <br className="hidden md:block" />
          Vivir, aprender y transmitir el alemán juntos.
        </p>
      </section>

      {/* ABOUT */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] px-6 py-16 dark:bg-[#081C3C]">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-2xl font-semibold">Willkommen bei Nordkreis</h2>

            <p className="text-justify leading-relaxed opacity-90">
              Nordkreis ist eine deutsche Gemeinschaft und Samstagsschule in Barcelona für
              deutschsprachige Familien und ihre Kinder.
            </p>

            <p className="mt-4 text-justify leading-relaxed opacity-90">
              Wir schaffen einen Sprachraum für Deutsch als Herkunftssprache. Einen Ort, an dem
              Kinder nicht nur mit einem Elternteil Deutsch sprechen, sondern mit anderen Kindern,
              Jugendlichen und Erwachsenen.
            </p>

            <p className="mt-4 text-justify leading-relaxed opacity-90">
              Sprache wächst durch Beziehungen. Nordkreis verbindet Gemeinschaft, kulturelle
              Identität und altersgerechte Sprachförderung.
            </p>
          </div>

          <div>
            <h2 className="mb-6 text-2xl font-semibold">Bienvenidos a Nordkreis</h2>

            <p className="text-justify leading-relaxed opacity-90">
              Nordkreis es una comunidad alemana y escuela de sábado en Barcelona para familias
              germanohablantes y sus hijos.
            </p>

            <p className="mt-4 text-justify leading-relaxed opacity-90">
              Creamos un espacio lingüístico para el alemán como lengua de herencia. Un lugar donde
              los niños no solo escuchan alemán en casa, sino que lo viven con otros niños y
              adultos.
            </p>

            <p className="mt-4 text-justify leading-relaxed opacity-90">
              La lengua crece a través de relaciones significativas. Nordkreis une comunidad,
              identidad cultural y acompañamiento lingüístico acorde a la edad.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="my-20 flex justify-center">
          <img
            src="/static/images/nordkreis-icon.png"
            alt="Nordkreis Logo"
            className="block h-8 w-auto dark:hidden"
          />
          <img
            src="/static/images/nordkreis-icon-dark.png"
            alt="Nordkreis Dark Logo"
            className="hidden h-8 w-auto dark:block"
          />
        </div>
      </section>

      {/* PEDAGOGICAL APPROACH */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-16 dark:bg-[#081C3C]">
        <div className="grid gap-12 md:grid-cols-2">
          {/* GERMAN COLUMN */}
          <div>
            <h2 className="mb-6 text-2xl font-semibold">Pädagogischer Ansatz & Gruppen</h2>

            <p className="mb-6 text-justify leading-relaxed opacity-90">
              Nordkreis ist in aufeinander aufbauende Gruppen gegliedert. Jede Stufe trägt einen
              eigenen Namen und begleitet die Kinder und Jugendlichen über mehrere Jahre hinweg. Zum
              Start im September können – bei Erreichen der Mindestteilnehmerzahl – Spielkreis,
              Entdeckerkreis und Kompasskreis beginnen. Die weiteren Gruppen sind in Planung.
            </p>

            {/* Spielkreis */}
            <h3 className="mt-4 mb-2 font-semibold">Spielkreis (0–3 Jahre), 10:00 – 13:30 Uhr</h3>
            <p className="text-justify leading-relaxed opacity-90">
              Diese Gruppe ist bewusst nicht angeleitet. Hier kommt der deutschsprachige Elternteil
              mit seinem Kind. Die Ehepartner können ebenfalls teilnehmen, solange sie mit dem
              eigenen Kind und anderen Kindern und Erwachsenen ausschließlich auf Deutsch sprechen.
              Die Gruppe dient der Sozialisation und dem Aufbau einer deutschsprachigen
              Gemeinschaft. Ab 11:30 Uhr können Kinder aus dem Entdeckerkreis dazukommen und vor
              11:30 die Kinder aus dem Kompasskreis.
            </p>

            {/* Entdeckerkreis */}
            <h3 className="mt-6 mb-2 font-semibold">
              Entdeckerkreis (3–5 Jahre, I3–I5), 10:00 – 11:30 Uhr
            </h3>
            <p className="text-justify leading-relaxed opacity-90">
              Spielerische und interaktive Einheiten mit intensivem Deutschinput.
            </p>
            <ul className="mt-4 ml-6 list-disc space-y-2 opacity-90">
              <li>Interaktives Storytelling</li>
              <li>Rollenspiel und Nachspielen von Szenen</li>
              <li>Puppen- und Figurenspiel (inkl. Puppentheater)</li>
            </ul>
            <p className="mt-4 text-justify leading-relaxed opacity-90">
              Es wird noch nicht gelesen oder geschrieben. Der Fokus liegt auf Sprachinput,
              Verstehen, Bewegung und dem Verknüpfen von Sprache mit Handlung.
            </p>

            {/* Kompasskreis */}
            <h3 className="mt-6 mb-2 font-semibold">
              Kompasskreis (1.º & 2.º Primaria, 6–8 Jahre), 11:30 – 13:00 Uhr
            </h3>
            <p className="text-justify leading-relaxed opacity-90">
              Deutsch als Herkunftssprache mit Fokus auf Erwerb der Schriftsprache. Die Kinder
              lernen Lesen und Schreiben auf Deutsch, aufbauend auf dem Wissen, das sie bereits in
              der katalanischen Schule erworben haben.
            </p>

            {/* Future Groups */}
            <h3 className="mt-8 mb-2 font-semibold">Weitere geplante Gruppen</h3>
            <ul className="ml-6 list-disc space-y-2 opacity-90">
              <li>Nordlichter (Primaria 3–4)</li>
              <li>Polarkreis (Primaria 5–6)</li>
              <li>Denkraum (ESO 1–2)</li>
              <li>Weitblick (ESO 3–4)</li>
              <li>Abschlusskreis (17–18 Jahre)</li>
            </ul>
            <p className="mt-4 text-justify leading-relaxed opacity-90">
              Diese Gruppen werden schrittweise aufgebaut und starten bei ausreichender Nachfrage
              und Verfügbarkeit qualifizierter Lehrkräfte.
            </p>
          </div>

          {/* SPANISH COLUMN */}
          <div>
            <h2 className="mb-6 text-2xl font-semibold">Enfoque pedagógico y grupos</h2>

            <p className="mb-6 text-justify leading-relaxed opacity-90">
              Nordkreis está estructurado en grupos progresivos que acompañan a niños y jóvenes
              durante varios años. En septiembre podrán comenzar – si se alcanza el número mínimo de
              alumnos – Spielkreis, Entdeckerkreis y Kompasskreis. Los demás niveles se abrirán
              progresivamente según la demanda y la disponibilidad de profesorado.
            </p>

            {/* Spielkreis */}
            <h3 className="mt-4 mb-2 font-semibold">Spielkreis (0–3 años), 10:00 – 13:30</h3>
            <p className="text-justify leading-relaxed opacity-90">
              Este grupo no está dirigido por una docente. Los padres/madres germanohablantes vienen
              con sus hijos. Los cónyuges también pueden participar, siempre que hablen
              exclusivamente alemán con sus hijos y con otros niños y adultos. Sirve para
              socialización y creación de una comunidad de habla alemana. A partir de las 11:30 los
              niños del Entdeckerkreis pueden unirse y antes de las 11:30 los niños del Kompasskreis
              también pueden coincidir.
            </p>

            {/* Entdeckerkreis */}
            <h3 className="mt-6 mb-2 font-semibold">
              Entdeckerkreis (3–5 años, I3–I5), 10:00 – 11:30
            </h3>
            <p className="text-justify leading-relaxed opacity-90">
              Sesiones lúdicas e interactivas con input lingüístico intenso en alemán.
            </p>
            <ul className="mt-4 ml-6 list-disc space-y-2 opacity-90">
              <li>Narración interactiva</li>
              <li>Representación de escenas</li>
              <li>Teatro de títeres</li>
            </ul>
            <p className="mt-4 text-justify leading-relaxed opacity-90">
              No se trabaja la lectoescritura todavía. El enfoque está en la comprensión, la acción
              y la conexión entre lenguaje y juego.
            </p>

            {/* Kompasskreis */}
            <h3 className="mt-6 mb-2 font-semibold">
              Kompasskreis (1.º & 2.º Primaria, 6–8 años), 11:30 – 13:00
            </h3>
            <p className="text-justify leading-relaxed opacity-90">
              Alemán como lengua de herencia con enfoque en lectura y escritura. Se aprende a leer y
              a escribir, construyendo sobre los conocimientos que los niños ya han adquirido en la
              escuela catalana.
            </p>

            {/* Future Groups */}
            <h3 className="mt-8 mb-2 font-semibold">Próximos grupos</h3>
            <ul className="ml-6 list-disc space-y-2 opacity-90">
              <li>Nordlichter (Primaria 3–4)</li>
              <li>Polarkreis (Primaria 5–6)</li>
              <li>Denkraum (ESO 1–2)</li>
              <li>Weitblick (ESO 3–4)</li>
              <li>Abschlusskreis (17–18 años)</li>
            </ul>
            <p className="mt-4 text-justify leading-relaxed opacity-90">
              Estos grupos se implementarán progresivamente y comenzarán según la demanda y la
              disponibilidad de profesorado cualificado.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-[Caveat] text-3xl leading-relaxed">
            „Sprache muss sich sicher anfühlen. Erst wenn sie sichtbar wertgeschätzt wird, wird sie
            Teil der eigenen Identität.“
          </p>
          <p className="mt-4 text-sm tracking-wide opacity-60">Nordkreis</p>
        </div>
      </section>

      {/* WHY */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] px-6 py-16 dark:bg-[#081C3C]">
        <div className="grid gap-12 md:grid-cols-2">
          {/* GERMAN COLUMN */}
          <div>
            <h2 className="mb-6 text-2xl font-semibold">Warum Nordkreis?</h2>

            <p className="mt-3 text-justify opacity-90">
              Ich selbst bin bilingual in Deutschland aufgewachsen. Erst als junge Erwachsene habe
              ich gespürt, wie sehr mir der kontinuierliche Kontakt zu meiner zweiten Sprache und
              Kultur gefehlt hat.
            </p>

            <p className="mt-3 text-justify opacity-90">
              In einem mehrsprachigen Umfeld werden die Umgebungssprachen immer dominant sein. Damit
              eine Herkunftssprache stark bleibt, braucht es:
            </p>

            <ul className="mt-3 ml-6 list-disc space-y-2 opacity-90">
              <li>eine Gemeinschaft</li>
              <li>mehrere Bezugspersonen</li>
              <li>gemeinsame Traditionen</li>
              <li>akademische Sprachentwicklung</li>
              <li>echte Beziehungen in dieser Sprache</li>
            </ul>

            <p className="mt-3 text-justify opacity-90">
              Nordkreis möchte genau diesen Raum schaffen: Eine deutsche Gemeinschaft in Barcelona,
              in der Erwachsene Traditionen wiederbeleben und Kinder ihre Herkunftssprache lebendig
              und selbstbewusst entwickeln können.
            </p>
          </div>

          {/* SPANISH COLUMN */}
          <div>
            <h2 className="mb-6 text-2xl font-semibold">¿Por qué Nordkreis?</h2>

            <p className="mt-3 text-justify opacity-90">
              Crecí bilingüe en Alemania y solo de adulta entendí cuánto me había faltado un
              contacto continuo con mi segunda lengua y cultura.
            </p>

            <p className="mt-3 text-justify opacity-90">
              En un entorno como Barcelona, las lenguas sociales siempre serán dominantes. Para que
              una lengua de herencia se mantenga fuerte necesita:
            </p>

            <ul className="mt-3 ml-6 list-disc space-y-2 opacity-90">
              <li>comunidad</li>
              <li>varias relaciones significativas</li>
              <li>vivencia de tradiciones</li>
              <li>desarrollo académico</li>
              <li>vínculos reales en esa lengua</li>
            </ul>

            <p className="mt-3 text-justify opacity-90">
              Nordkreis quiere ofrecer exactamente eso: una comunidad alemana donde las familias
              puedan vivir su cultura y acompañar el desarrollo lingüístico y académico de sus hijos
              en alemán.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-[Caveat] text-3xl leading-relaxed">
            „Sprache wird lebendig, wenn ich erlebe, wie viele Menschen sie sprechen. Gemeinschaft
            gibt ihr Sinn — Vielfalt erweitert meinen Wortschatz.“
          </p>
          <p className="mt-4 text-sm tracking-wide opacity-60">Nordkreis</p>
        </div>
      </section>

      {/* ANNUAL STRUCTURE */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-16 dark:bg-[#081C3C]">
        <div className="grid gap-12 md:grid-cols-2">
          {/* GERMAN COLUMN */}
          <div>
            <h2 className="mb-6 text-2xl font-semibold">Jahresstruktur</h2>

            <p className="mt-3 text-justify opacity-90">
              Nordkreis trifft sich insgesamt ca. 20 Mal pro Schuljahr. In der Regel finden die
              Treffen zwei Mal pro Monat statt. Je nach Verfügbarkeit der Schule kann es Monate mit
              einem oder drei Terminen geben – im Jahresdurchschnitt sind es etwa zwei Treffen pro
              Monat.
            </p>

            <p className="mt-3 text-justify opacity-90">
              Zusätzlich werden besondere Aktivitäten rund um wichtige deutsche Traditionen
              angeboten, zum Beispiel:
            </p>

            <ul className="mt-3 ml-6 list-disc space-y-2 opacity-90">
              <li>St. Martin</li>
              <li>Weihnachten</li>
              <li>Ostern</li>
              <li>Weitere kulturelle Feste im Jahreskreis</li>
            </ul>

            <p className="mt-3 text-justify opacity-90">
              Diese zusätzlichen Veranstaltungen stärken das Gemeinschaftsgefühl und geben den
              Kindern die Möglichkeit, deutsche Bräuche aktiv zu erleben – nicht nur sprachlich,
              sondern auch emotional und sozial.
            </p>
          </div>

          {/* SPANISH COLUMN */}
          <div>
            <h2 className="mb-6 text-2xl font-semibold">Estructura anual</h2>

            <p className="mt-3 text-justify opacity-90">
              Nordkreis se reúne aproximadamente 20 veces por curso escolar. Normalmente los
              encuentros tienen lugar dos veces al mes. Según la disponibilidad del centro, puede
              haber meses con uno o tres encuentros; el promedio anual es de dos reuniones
              mensuales.
            </p>

            <p className="mt-3 text-justify opacity-90">
              Se ofrecerán actividades especiales relacionadas con tradiciones alemanas importantes,
              por ejemplo:
            </p>

            <ul className="mt-3 ml-6 list-disc space-y-2 opacity-90">
              <li>San Martín</li>
              <li>Navidad</li>
              <li>Pascua</li>
              <li>Otras celebraciones culturales a lo largo del año</li>
            </ul>

            <p className="mt-3 text-justify opacity-90">
              Estas actividades refuerzan el sentimiento de comunidad y permiten que los niños vivan
              las tradiciones alemanas de manera activa, no solo desde la lengua, sino también desde
              la experiencia compartida.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="my-20 flex justify-center">
          <img
            src="/static/images/nordkreis-icon.png"
            alt="Nordkreis Logo"
            className="block h-8 w-auto dark:hidden"
          />
          <img
            src="/static/images/nordkreis-icon-dark.png"
            alt="Nordkreis Dark Logo"
            className="hidden h-8 w-auto dark:block"
          />
        </div>
      </section>

      {/* LOCATION & TIMES */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] px-6 py-16 text-center dark:bg-[#081C3C]">
        <h2 className="mb-6 text-2xl font-semibold">Ort / Lugar</h2>

        <p className="opacity-90">
          Escuela La Salle Gràcia
          <br />
          Plaça del Nord 14
          <br />
          08024 Barcelona
        </p>
      </section>

      {/* FEES */}
      <section className="rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-16 dark:bg-[#081C3C]">
        <div className="grid gap-12 md:grid-cols-2">
          {/* GERMAN COLUMN */}
          <div>
            <h2 className="mb-6 text-2xl font-semibold">Beiträge pro Monat</h2>
            <ul className="ml-6 list-disc space-y-2 opacity-90">
              <li>1 Kind im Spielkreis (0–3): 30 €</li>
              <li>2 Kinder im Spielkreis (0–3): 50 €</li>
              <li>1 Kind ab 3 Jahren (Entdeckerkreis oder Kompasskreis): 50 €</li>
              <li>1 Kind ab 3 + 1 Kind im Spielkreis: 70 €</li>
              <li>2 Kinder ab 3 Jahren: 90 €</li>
              <li>Einschreibegebühr (Pilotphase): 60 € einmalig</li>
            </ul>

            <p className="mt-4 text-justify opacity-90">
              Der Start erfolgt bei Erreichen der Mindestteilnehmerzahl (Spielkreis: 6–10 Kinder;
              Entdeckerkreis: 5–10 Kinder). Die Beiträge decken Raumkosten, Organisation,
              Materialien sowie die Platzreservierung.
            </p>
          </div>

          {/* SPANISH COLUMN */}
          <div>
            <h2 className="mb-6 text-2xl font-semibold">Cuotas mensuales</h2>
            <ul className="ml-6 list-disc space-y-2 opacity-90">
              <li>1 niño en Spielkreis (0–3): 30 €</li>
              <li>2 niños en Spielkreis (0–3): 50 €</li>
              <li>1 niño a partir de 3 años (Entdeckerkreis o Kompasskreis): 50 €</li>
              <li>1 niño a partir de 3 + 1 niño en Spielkreis: 70 €</li>
              <li>2 niños a partir de 3 años: 90 €</li>
              <li>Matrícula (fase piloto): 60 € pago único</li>
            </ul>

            <p className="mt-4 text-justify opacity-90">
              El proyecto comenzará al alcanzarse el número mínimo de alumnos (Spielkreis: 6–10
              niños; Entdeckerkreis: 5–10 niños). Las cuotas cubren el alquiler del espacio, la
              organización, los materiales y la reserva de plaza.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="rounded-2xl border border-[#9A8F85]/30 bg-[#081C3C] px-6 py-20 text-center text-[#F4EFE8]">
        <h2 className="mb-6 text-2xl font-semibold">Kontakt / Contacto</h2>

        <a
          href="mailto:nordkreis@linguatash.com"
          className="inline-block rounded-xl bg-[#B3475A] px-8 py-3 font-medium transition-transform duration-300 hover:scale-105"
        >
          nordkreis@linguatash.com
        </a>
      </section>
    </main>
  )
}
