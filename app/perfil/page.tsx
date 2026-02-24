import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Sobre LinguaTash' })

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl space-y-20 px-4 font-['Noto_Sans'] text-[#081C3C] sm:px-6 lg:px-8 dark:text-[#F4EFE8]">
      <section className="space-y-6 rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-16 dark:bg-[#081C3C]">
        <h1 className="text-4xl font-semibold">Hola y bienvenida, bienvenido</h1>
        <p>Qué alegría que hayas llegado hasta aquí.</p>

        <p>
          Mi nombre es Tash. Estudié Lingüística y Ciencias de la Educación en Jena, Alemania, y
          trabajo desde hace años como especialista en adquisición de lenguas, tanto en la infancia
          como en la edad adulta.
        </p>

        <p>
          Mi trabajo se apoya en la investigación sobre adquisición del lenguaje, la teoría del
          apego y las ciencias del aprendizaje. A esto se suma una amplia experiencia práctica en la
          enseñanza de lenguas en distintos contextos y países —desde Nueva Zelanda hasta París y
          Barcelona—, así como mi propia experiencia como madre en una familia multilingüe.
        </p>

        <p>
          Mis dos hijos crecen desde el nacimiento con alemán, ruso y español, y aprenden catalán e
          inglés en la escuela. El italiano también forma parte de su entorno cotidiano, gracias a
          una persona cercana que los cuida cuando ni mi pareja ni yo podemos hacerlo.
        </p>
      </section>

      {/* IMAGE 1 */}
      <div className="my-12">
        {/* <img src="/images/about-portrait.jpg" alt="Retrato de Tash, fundadora de LinguaTash" /> */}
      </div>

      {/* QUOTE 1 */}
      <section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-[Caveat] text-3xl leading-relaxed">
            „No solo hablo de adquisición natural del lenguaje: la vivo.“
          </p>
        </div>
      </section>

      <section className="space-y-6 rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] px-6 py-16 dark:bg-[#081C3C]">
        <h2 className="text-2xl font-semibold">¿Te reconoces en alguna de estas situaciones?</h2>

        <ul className="ml-6 list-disc space-y-2">
          <li>
            ¿Te gustaría aprender alemán desde cero y sonar lo más natural posible en tu
            pronunciación?
          </li>
          <li>
            ¿Deseas, por fin, que las personas germanohablantes te entiendan sin que tu origen se
            note de inmediato en cada palabra?
          </li>
          <li>
            ¿Eres germanohablante, vives en Barcelona y deseas acompañar el desarrollo del alemán de
            tus hijos bilingües?
          </li>
          <li>
            ¿Te interesan materiales descargables o juegos multilingües basados en la fonética?
          </li>
        </ul>

        <h2 className="text-2xl font-semibold">Mi convicción</h2>

        <p>
          La enseñanza de lenguas, tanto en la escuela como en la mayoría de los cursos para
          adultos, parte casi siempre del mismo punto: la palabra escrita. Se aprende a leer, a
          memorizar estructuras y a producir frases incluso antes de haber desarrollado una base
          oral sólida.
        </p>

        <p>Mi convicción es otra.</p>

        <p>
          Cuando una docente conoce en profundidad la lengua materna de la persona que aprende,
          puede adaptar el proceso de adquisición a lo que esa persona ya trae consigo: sonidos,
          ritmos, estructuras, intuiciones lingüísticas. Desde ahí, es posible guiar con precisión
          aquello que aún no está presente y necesita ser adquirido.
        </p>

        <p>
          Este proceso puede —y debe— darse sin recurrir a la lengua escrita en una primera fase. La
          lectura y la escritura no desaparecen; simplemente llegan más tarde, cuando el idioma ya
          se ha construido en el oído y en la voz, y cuando la persona empieza a sentirlo como algo
          propio.
        </p>

        <p>
          El trabajo fonético ocupa aquí un lugar central. La pronunciación no es un detalle
          técnico, sino la base sobre la que se organiza todo lo demás.
        </p>

        <p>
          He comprobado que este enfoque no solo transforma la relación de una persona con el
          alemán, sino que también genera una conciencia lingüística más amplia: muchas personas
          empiezan a percibir con mayor claridad cómo funcionan otras lenguas que ya conocen, y cómo
          podrían adquirir una nueva de forma más consciente y respetuosa.
        </p>

        <p>
          Vivo esta convicción en todo lo que hago: en la creación de mi método Fonetikas, en las
          clases de alemán para niños bilingües en Barcelona y en mis propuestas de cuentos
          bilingües y juegos fonéticos, que permiten adquirir vocabulario y estructuras directamente
          desde el oído y la voz.
        </p>
      </section>

      {/* IMAGE 2 */}
      <div className="my-12">{/* <img src="/images/about-portrait2.jpg" alt="Foto Tash" /> */}</div>

      {/* QUOTE 2 */}
      <section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-[Caveat] text-3xl leading-relaxed">
            „Cada idioma encontró su propia manera de hacerlo, y por eso el aprendizaje no debería
            basarse primero en lo escrito.“
          </p>
        </div>
      </section>

      <section className="space-y-6 rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-16 dark:bg-[#081C3C]">
        <h2 className="text-2xl font-semibold">Funciona</h2>

        <p>
          A pesar de los muchos obstáculos personales y vitales que he atravesado en los últimos
          años, he mantenido el rumbo con mis proyectos, especialmente con Fonetikas, afinándolos y
          mejorándolos de forma constante.
        </p>

        <p>
          Hace unos nueve años probé la metodología Fonetikas con un compañero de piso argentino. En
          2025, durante un reencuentro, me dijo que todavía recuerda lo aprendido en alemán y lo
          aplica correctamente.
        </p>

        <p>
          Ese tipo de feedback me llena de orgullo. Me emociona cada vez que veo que algo que
          alguien aprendió conmigo sigue teniendo valor y utilidad en su vida.
        </p>

        <p>
          Si ya hablas alemán, puedo ayudarte a mejorar tu pronunciación y a consolidar tu base
          oral. También acompaño a familias bilingües en Barcelona: verás cómo tus hijos empiezan a
          usar más alemán en casa e incluso a escribir en alemán, mientras tú los acompañas con
          seguridad.
        </p>

        <p>
          Si te interesa, también podemos jugar con los sonidos de distintos idiomas, explorando la
          fonética y la adquisición natural del vocabulario a través del oído y la voz.
        </p>

        <p>
          En mi blog comparto los pilares de la metodología Fonetikas, y en YouTube e Instagram
          publico regularmente consejos prácticos para aprender alemán —y otras lenguas—.
        </p>
      </section>

      {/* IMAGE 3 */}
      <div className="my-12">
        {/* <img src="/images/about-life.jpg" alt="Vida cotidiana y valores detrás de LinguaTash" /> */}
      </div>

      {/* QUOTE 3 */}
      <section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-[Caveat] text-3xl leading-relaxed">
            „Te muestro cómo puedes aprender alemán desde cero, empezando por la oralidad.“
          </p>
        </div>
      </section>

      <section className="space-y-6 rounded-2xl border border-[#9A8F85]/40 bg-[#E3DED7] px-6 py-16 dark:bg-[#081C3C]">
        <h2 className="text-2xl font-semibold">Más allá de la enseñanza de idiomas</h2>

        <p>
          No todo lo que me ha formado cabe en un título académico. Estas experiencias me definen y
          han moldeado mi manera de enseñar y de acompañar el aprendizaje de lenguas.
        </p>

        <h3 className="font-semibold">Formación académica y profesional</h3>
        <ul className="ml-6 list-disc space-y-2">
          <li>Máster en Lingüística y Ciencias de la Educación, Jena (Alemania)</li>
          <li>Estudios de interpretación simultánea alemán–inglés / inglés–alemán, Londres</li>
          <li>Full Stack Development con JavaScript, Barcelona</li>
          <li>
            Creación de sitio web y app para el mundo del tango: bailo.app (actualmente en pausa)
          </li>
          <li>Especialización en Data Scientist, Universitat Oberta de Catalunya</li>
        </ul>

        <h3 className="font-semibold">Aprender desde el cuerpo y la experiencia</h3>
        <ul className="ml-6 list-disc space-y-2">
          <li>Aprendí a nadar crawl de forma autodidacta durante mi estancia en Moscú</li>
          <li>
            Aprendí a bailar tango en Cuba, durante mis estudios en La Habana, y sigo viviéndolo
            como un lenguaje
          </li>
          <li>Disfruto hacer manualidades, sola o con mi familia</li>
        </ul>

        <h3 className="font-semibold">Crianza, cuidado y coherencia vital</h3>
        <ul className="ml-6 list-disc space-y-2">
          <li>Dos partos naturales planificados en casa</li>
          <li>
            Crianza con pañales de tela y Elimination Communication (higiene infantil natural)
          </li>
          <li>Interés profundo por los procesos naturales de desarrollo</li>
          <li>Vida vegetariana/vegana como elección ética y cotidiana</li>
        </ul>
      </section>

      {/* FINAL QUOTE */}
      <section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-[Caveat] text-3xl leading-relaxed">
            „Conmigo no encontrarás solo conocimiento, sino también motivación, claridad e
            inspiración.“
          </p>
        </div>
      </section>

      <section className="space-y-6 rounded-2xl border border-[#9A8F85]/40 bg-[#F4EFE8] px-6 py-16 dark:bg-[#081C3C]">
        <h2 className="text-2xl font-semibold">Qué puedes esperar de mí</h2>

        <p>
          Conmigo no encontrarás solo conocimiento, sino también motivación, claridad e inspiración.
          Estoy profundamente convencida de que cualquier persona adulta puede aprender alemán o
          mejorar su alemán sin presión ni sufrimiento, independientemente de las experiencias
          previas que haya tenido con otras lenguas.
        </p>

        <p>En LinguaTash encontrarás propuestas para distintas necesidades:</p>

        <ul className="ml-6 list-disc space-y-2">
          <li>Cursos de alemán para adultos hispanohablantes (autoestudio o grupos)</li>
          <li>
            Escuela de alemán los sábados para niños de familias germanohablantes en Barcelona
          </li>
          <li>Material didáctico y juegos fonéticos para descargar</li>
        </ul>

        <p>
          Cuando trabajamos de forma individual, no hay recetas estándar ni soluciones “talla
          única”. Lo que ofrezco es un acompañamiento personalizado, ajustado a tu punto de partida,
          a tus objetivos y a lo que necesitas ahora mismo. Solo así el aprendizaje puede ser
          profundo y sostenible en el tiempo.
        </p>
      </section>
    </main>
  )
}
